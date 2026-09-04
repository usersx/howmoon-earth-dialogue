from __future__ import annotations

import asyncio
import json
import time
from typing import Any, AsyncIterator, Dict, Iterable, List, Optional

import httpx

from .config import Settings
from .schemas import DialogueMessage


SYSTEM_PROMPT = """
你是“何月”的地球旅行顾问。用户不是在搜索热门榜单，而是在通过对话发现更适合当下状态的旅行目的地。

你必须只输出一个 JSON 对象，不得输出 Markdown、代码围栏、解释或思考过程。JSON 格式如下：
{
  "schemaVersion": "1.2",
  "kind": "question" 或 "result",
  "acknowledgement": 字符串或 null,
  "question": 字符串或 null,
  "result": 对象或 null
}

规则：
1. 如果历史中少于 5 条 user 消息，kind 必须为 question；先用一句话准确复述新线索，再问一个具体且不重复的问题。result 必须为 null。
2. 如果已有至少 5 条 user 消息，kind 必须为 result；acknowledgement 和 question 必须为 null。
3. result 必须包含：
   - destination: placeType, city, cityEnglishName, country, countryCode, adminRegion,
     candidateCoordinates {latitude, longitude}, confidence, confidenceMessage
   - display: revealNarrative（2 条）, predictionNote
   - evidenceAnchors（2 条，每条含 userDetail 和 relevance）
   - landmarks（3 条，每条含 name、activity、reason）
   - visualBrief: coreNeed, desiredState, atmosphere, primaryScene,
     importantElements（4 条）, avoidElements（4 条）
4. 推荐一个具体城市，不要推荐国家、景区或泛区域。坐标要合理，但文案必须说明推荐是预测，不是事实保证。
5. 使用自然、克制的简体中文。
""".strip()


class DialogueProviderError(RuntimeError):
    pass


def _as_api_messages(messages: Iterable[DialogueMessage]) -> List[Dict[str, str]]:
    return [
        {"role": "system", "content": SYSTEM_PROMPT},
        *[{"role": item.role, "content": item.content} for item in messages],
    ]


def _user_text(messages: Iterable[DialogueMessage]) -> str:
    return "\n".join(item.content for item in messages if item.role == "user")


def _mock_turn(messages: List[DialogueMessage]) -> Dict[str, Any]:
    user_messages = [item.content for item in messages if item.role == "user"]
    count = len(user_messages)
    acknowledgements = [
        "我先记下你此刻最在意的旅行感受。",
        "这意味着你在意的不是景点数量，而是一天怎样自然地展开。",
        "你已经说清了哪些体验会消耗自己。",
        "我开始看见这次出发想带回来的变化。",
    ]
    questions = [
        "如果把它变成旅行中的十分钟，你希望当时在哪里、正在做什么？",
        "有没有一种你明确不想再经历的旅行方式？",
        "这次旅行结束时，你最希望自己的状态发生什么变化？",
        "白天什么样的活动最容易让你恢复精神？",
    ]
    if count < 5:
        index = max(0, min(count - 1, len(questions) - 1))
        return {
            "schemaVersion": "1.2",
            "kind": "question",
            "acknowledgement": acknowledgements[index],
            "question": questions[index],
            "result": None,
        }

    combined = " ".join(user_messages)
    if any(word in combined for word in ("海", "湖", "水边", "坐船")):
        city = {
            "name": "松江市",
            "english": "Matsue",
            "country": "日本",
            "countryCode": "JP",
            "region": "岛根县",
            "lat": 35.4681,
            "lon": 133.0484,
            "scene": "宍道湖傍晚的湖岸步道",
        }
    else:
        city = {
            "name": "大理",
            "english": "Dali",
            "country": "中国",
            "countryCode": "CN",
            "region": "云南",
            "lat": 25.6065,
            "lon": 100.2676,
            "scene": "洱海边通向古城生活的缓慢道路",
        }

    return {
        "schemaVersion": "1.2",
        "kind": "result",
        "acknowledgement": None,
        "question": None,
        "result": {
            "destination": {
                "placeType": "city",
                "city": city["name"],
                "cityEnglishName": city["english"],
                "country": city["country"],
                "countryCode": city["countryCode"],
                "adminRegion": city["region"],
                "candidateCoordinates": {
                    "latitude": city["lat"],
                    "longitude": city["lon"],
                },
                "confidence": "medium",
                "confidenceMessage": "本地兼容模式生成，配置模型 API Key 后会使用真实推荐。",
            },
            "display": {
                "revealNarrative": [
                    f"{city['name']}把自然、水边和仍在运转的地方生活放在一起。",
                    "你可以用不赶时间的步行重新建立自己的节奏。",
                ],
                "predictionNote": "这是根据对话线索作出的预测，不代表唯一正确或保证喜欢的答案。",
            },
            "evidenceAnchors": [
                {
                    "userDetail": user_messages[-1],
                    "relevance": "这条线索决定了旅行活动的节奏和参与强度。",
                },
                {
                    "userDetail": user_messages[0],
                    "relevance": "最初的表达说明了这次旅行真正想解决的问题。",
                },
            ],
            "landmarks": [
                {"name": "城市水岸", "activity": "傍晚散步", "reason": "让自然和日常生活自然衔接。"},
                {"name": "地方市场", "activity": "慢慢观察当地生活", "reason": "避免被打卡路线支配。"},
                {"name": "小型博物馆", "activity": "选择少量展品阅读", "reason": "保留安静且有内容的停靠点。"},
            ],
            "visualBrief": {
                "coreNeed": "在有日常生活回音的地方放慢节奏",
                "desiredState": "恢复精神并愿意重新投入日常",
                "atmosphere": "安静、松弛、有人间生活但不拥挤",
                "primaryScene": city["scene"],
                "importantElements": ["开阔天空", "步行道路", "低密度城市", "柔和灯光"],
                "avoidElements": ["拥挤人群", "霓虹招牌", "主题公园", "文字和 Logo"],
            },
        },
    }


def _extract_json(text: str) -> Dict[str, Any]:
    candidate = text.strip()
    if candidate.startswith("```"):
        candidate = candidate.strip("`")
        if candidate.startswith("json"):
            candidate = candidate[4:].lstrip()
    try:
        value = json.loads(candidate)
    except json.JSONDecodeError:
        start = candidate.find("{")
        end = candidate.rfind("}")
        if start < 0 or end <= start:
            raise DialogueProviderError("模型没有返回可读取的 JSON。")
        try:
            value = json.loads(candidate[start : end + 1])
        except json.JSONDecodeError as exc:
            raise DialogueProviderError("模型返回的 JSON 不完整。") from exc
    if not isinstance(value, dict):
        raise DialogueProviderError("模型返回的结果不是对象。")
    return value


def _normalise_turn(value: Dict[str, Any]) -> Dict[str, Any]:
    kind = value.get("kind")
    if kind == "question" and isinstance(value.get("question"), str):
        return {
            "schemaVersion": "1.2",
            "kind": "question",
            "acknowledgement": str(value.get("acknowledgement") or "我记下了。"),
            "question": value["question"],
            "result": None,
        }
    if kind == "result" and isinstance(value.get("result"), dict):
        value["schemaVersion"] = "1.2"
        value["acknowledgement"] = None
        value["question"] = None
        return value
    raise DialogueProviderError("模型返回的数据结构不完整。")


async def _complete_provider(
    config: Settings,
    provider: str,
    api_key: str,
    base_url: str,
    model: str,
    messages: List[DialogueMessage],
    transport: Optional[httpx.AsyncBaseTransport],
) -> str:
    payload = {
        "model": model,
        "messages": _as_api_messages(messages),
        "response_format": {"type": "json_object"},
        "stream": True,
        "max_tokens": 3_500,
    }
    if provider == "deepseek":
        payload["thinking"] = {"type": "disabled"}
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }
    accumulated = ""
    async with httpx.AsyncClient(
        timeout=httpx.Timeout(config.deepseek_timeout_seconds),
        transport=transport,
    ) as client:
        async with client.stream(
            "POST",
            f"{base_url}/chat/completions",
            headers=headers,
            json=payload,
        ) as response:
            if response.status_code >= 400:
                await response.aread()
                raise DialogueProviderError(
                    f"{provider} 请求失败（HTTP {response.status_code}）。"
                )
            async for line in response.aiter_lines():
                if not line.startswith("data:"):
                    continue
                data = line[5:].strip()
                if not data or data == "[DONE]":
                    continue
                try:
                    chunk = json.loads(data)
                    accumulated += chunk["choices"][0]["delta"].get("content") or ""
                except (KeyError, IndexError, TypeError, json.JSONDecodeError):
                    continue
    if not accumulated:
        raise DialogueProviderError(f"{provider} 没有返回正文。")
    turn = _normalise_turn(_extract_json(accumulated))
    return json.dumps(turn, ensure_ascii=False, separators=(",", ":"))


async def stream_turn(
    config: Settings,
    messages: List[DialogueMessage],
    transport: Optional[httpx.AsyncBaseTransport] = None,
) -> AsyncIterator[tuple[str, str]]:
    if not config.dialogue_api_key:
        if not config.allow_mock_dialogue:
            raise DialogueProviderError("服务器没有配置对话模型 API Key。")
        await asyncio.sleep(max(0, config.mock_thinking_delay_seconds))
        text = json.dumps(_mock_turn(messages), ensure_ascii=False, separators=(",", ":"))
        for end in range(24, len(text), 24):
            await asyncio.sleep(0.008)
            yield "local-mock", text[:end]
        yield "local-mock", text
        return

    providers = []
    if config.qwen_api_key:
        providers.append(
            ("qwen", config.qwen_api_key, config.qwen_base_url, config.qwen_model)
        )
    if config.deepseek_api_key:
        providers.append(
            (
                "deepseek",
                config.deepseek_api_key,
                config.deepseek_base_url,
                config.deepseek_model,
            )
        )

    started = time.monotonic()
    errors = []
    for provider, api_key, base_url, model in providers:
        try:
            text = await _complete_provider(
                config,
                provider,
                api_key,
                base_url,
                model,
                messages,
                transport,
            )
        except (DialogueProviderError, httpx.HTTPError) as exc:
            errors.append(str(exc))
            continue

        remaining = config.min_provider_thinking_delay_seconds - (
            time.monotonic() - started
        )
        if remaining > 0:
            await asyncio.sleep(remaining)
        for end in range(24, len(text), 24):
            await asyncio.sleep(0.008)
            yield provider, text[:end]
        yield provider, text
        return

    if config.allow_mock_dialogue:
        text = json.dumps(_mock_turn(messages), ensure_ascii=False, separators=(",", ":"))
        yield "local-mock", text
        return
    raise DialogueProviderError("千问和 DeepSeek 均不可用。" + "；".join(errors))


def parse_turn(text: str, messages: List[DialogueMessage]) -> Dict[str, Any]:
    return _normalise_turn(_extract_json(text))
