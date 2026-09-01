from __future__ import annotations

import asyncio
import base64
from dataclasses import replace
import json
import time

import httpx
import pytest
from fastapi.testclient import TestClient

from app.config import settings
from app.dialogue import parse_turn, stream_turn
from app.main import app


client = TestClient(app)


@pytest.fixture(autouse=True)
def fast_mock_dialogue(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr(
        "app.main.settings",
        replace(settings, mock_thinking_delay_seconds=0),
    )


def _messages(user_count: int) -> list:
    messages = [
        {
            "role": "assistant",
            "content": "如果现在可以回到某次旅行里的十分钟，你最想回到哪十分钟？",
        }
    ]
    for index in range(user_count):
        messages.append({"role": "user", "content": f"第 {index + 1} 条回答：喜欢湖边、小城和慢节奏。"})
        if index + 1 < user_count:
            messages.append({"role": "assistant", "content": "继续说说你期待的体验。"})
    return messages


def _dialogue_body(user_count: int) -> dict:
    return {
        "sessionId": "test-session",
        "promptVersion": "3.3",
        "messages": _messages(user_count),
    }


def _final_event(response_text: str) -> dict:
    events = []
    for block in response_text.split("\n\n"):
        if block.startswith("data: "):
            events.append(json.loads(block[6:]))
    return next(item for item in events if item.get("type") == "final")


def test_health() -> None:
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_static_frontend_is_served() -> None:
    response = client.get("/")
    assert response.status_code == 200
    assert "与地球对话" in response.text


def test_dynamic_city_chunk_is_served() -> None:
    response = client.get(
        "/_next/static/chunks/app/city/%5Bslug%5D/page-236750cf20f1491a.js"
    )
    assert response.status_code == 200
    assert b"webpackChunk_N_E" in response.content


def test_dialogue_validates_required_fields() -> None:
    response = client.post("/api/dialogue", json={})
    assert response.status_code == 400
    assert response.json()["error"] == "对话请求缺少必要字段。"


def test_dialogue_returns_question_sse() -> None:
    response = client.post("/api/dialogue", json=_dialogue_body(1))
    assert response.status_code == 200
    assert response.headers["content-type"].startswith("text/event-stream")
    final = _final_event(response.text)
    assert final["response"]["turn"]["kind"] == "question"


def test_dialogue_returns_result_after_five_answers() -> None:
    response = client.post("/api/dialogue", json=_dialogue_body(5))
    final = _final_event(response.text)
    turn = final["response"]["turn"]
    assert turn["kind"] == "result"
    assert turn["result"]["destination"]["city"] == "松江市"


def test_qwen_stream_adapter() -> None:
    completion = {
        "schemaVersion": "1.2",
        "kind": "question",
        "acknowledgement": "我记下了。",
        "question": "你希望一天怎样展开？",
        "result": None,
    }
    text = json.dumps(completion, ensure_ascii=False)
    first, second = text[: len(text) // 2], text[len(text) // 2 :]

    def handler(request: httpx.Request) -> httpx.Response:
        assert request.headers["authorization"] == "Bearer test-key"
        body = "\n\n".join(
            [
                "data: " + json.dumps({"choices": [{"delta": {"content": first}}]}),
                "data: " + json.dumps({"choices": [{"delta": {"content": second}}]}),
                "data: [DONE]",
                "",
            ]
        )
        return httpx.Response(200, text=body, headers={"content-type": "text/event-stream"})

    async def collect() -> list:
        config = replace(
            settings,
            qwen_api_key="test-key",
            qwen_base_url="https://mock.qwen.local",
            deepseek_api_key=None,
            min_provider_thinking_delay_seconds=0,
        )
        values = []
        async for value in stream_turn(
            config,
            [
                type("Message", (), {"role": "user", "content": "想慢一点。"})()
            ],
            transport=httpx.MockTransport(handler),
        ):
            values.append(value)
        return values

    partials = asyncio.run(collect())
    assert partials[-1] == text
    turn = parse_turn(partials[-1], _messages(1))
    assert turn["kind"] == "question"


def test_geography_contract() -> None:
    turn = _final_event(client.post("/api/dialogue", json=_dialogue_body(5)).text)["response"]["turn"]
    response = client.post("/api/geography", json={"turn": turn, "scope": "full"})
    assert response.status_code == 200
    payload = response.json()
    assert payload["scope"] == "full"
    assert payload["geography"]["coordinates"]["latitude"] == pytest.approx(35.4681)
    assert len(payload["geography"]["landmarks"]) == 3


def test_city_visual_contract() -> None:
    result = _final_event(client.post("/api/dialogue", json=_dialogue_body(5)).text)["response"]["turn"]["result"]
    response = client.post("/api/city-visual", json={"result": result})
    assert response.status_code == 200
    payload = response.json()
    assert payload["imageVersion"] == "dynamic-v1"
    assert payload["image"].startswith("data:image/png;base64,")
    raw = base64.b64decode(payload["image"].split(",", 1)[1])
    assert raw.startswith(b"\x89PNG\r\n\x1a\n")


def test_mock_dialogue_has_visible_thinking_delay() -> None:
    async def collect() -> None:
        config = replace(
            settings,
            qwen_api_key=None,
            deepseek_api_key=None,
            mock_thinking_delay_seconds=0.05,
        )
        async for _value in stream_turn(
            config,
            [type("Message", (), {"role": "user", "content": "想慢一点。"})()],
        ):
            pass

    started = time.perf_counter()
    asyncio.run(collect())
    assert time.perf_counter() - started >= 0.05


def test_tts_contract(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr("app.main.synthesize_macos_pcm", lambda _text: b"\x00\x00" * 1_000)
    response = client.post("/api/tts", json={"text": "你好，地球。"})
    assert response.status_code == 200
    assert response.headers["x-audio-sample-rate"] == "16000"
    assert response.headers["x-audio-sample-format"] == "s16le"
    assert len(response.content) > 1_000


def test_transcribe_reports_missing_provider() -> None:
    response = client.post(
        "/api/transcribe",
        files={"audio": ("sample.wav", b"not-empty", "audio/wav")},
    )
    assert response.status_code == 503
    assert "语音转写" in response.json()["error"]
