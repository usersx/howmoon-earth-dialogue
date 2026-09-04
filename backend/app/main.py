from __future__ import annotations

import json
from typing import AsyncIterator

from fastapi import FastAPI, File, HTTPException, Request, UploadFile
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse, Response, StreamingResponse
from fastapi.staticfiles import StaticFiles

from .config import settings
from .dialogue import DialogueProviderError, parse_turn, stream_turn
from .schemas import CityVisualRequest, DialogueRequest, GeographyRequest, TTSRequest
from .services import (
    ServiceUnavailable,
    build_city_visual,
    build_geography,
    synthesize_speech,
    transcribe_audio,
)


app = FastAPI(title="何月兼容后端", version="0.2.0")


def _sse(payload: dict) -> bytes:
    body = json.dumps(payload, ensure_ascii=False, separators=(",", ":"))
    return f"data: {body}\n\n".encode("utf-8")


@app.exception_handler(RequestValidationError)
async def validation_error_handler(request: Request, _exc: RequestValidationError) -> JSONResponse:
    messages = {
        "/api/dialogue": "对话请求缺少必要字段。",
        "/api/geography": "定位请求缺少有效的目的地结果。",
        "/api/tts": "没有收到需要朗读的文字。",
        "/api/city-visual": "城市视觉请求缺少推荐结果。",
    }
    return JSONResponse(status_code=400, content={"error": messages.get(request.url.path, "请求格式不正确。")})


@app.get("/api/health")
async def health() -> dict:
    return {
        "status": "ok",
        "dialogueProvider": settings.dialogue_provider,
        "dialogueModel": settings.dialogue_model,
        "sttConfigured": bool(
            settings.qwen_api_key
            or (settings.stt_api_key and settings.stt_base_url and settings.stt_model)
        ),
        "siteDirectory": str(settings.site_dir),
    }


@app.post("/api/dialogue")
async def dialogue(body: DialogueRequest) -> StreamingResponse:
    async def events() -> AsyncIterator[bytes]:
        latest = ""
        provider = settings.dialogue_provider
        try:
            async for active_provider, partial in stream_turn(settings, body.messages):
                provider = active_provider
                latest = partial
                yield _sse({"type": "model-text", "text": partial})
            turn = parse_turn(latest, body.messages)
            yield _sse(
                {
                    "type": "final",
                    "response": {
                        "turn": turn,
                        "provider": provider,
                        "geography": None,
                    },
                }
            )
        except DialogueProviderError as exc:
            yield _sse({"type": "error", "error": str(exc)})

    return StreamingResponse(
        events(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache, no-transform"},
    )


@app.post("/api/geography")
async def geography(body: GeographyRequest) -> dict:
    try:
        return build_geography(body.turn, body.scope)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@app.post("/api/tts")
async def tts(body: TTSRequest) -> Response:
    try:
        pcm, sample_rate, provider = await synthesize_speech(settings, body.text.strip())
    except ServiceUnavailable as exc:
        return JSONResponse(status_code=503, content={"error": str(exc)})
    return Response(
        content=pcm,
        media_type="audio/L16",
        headers={
            "Cache-Control": "no-store",
            "X-Audio-Sample-Rate": str(sample_rate),
            "X-Audio-Sample-Format": "s16le",
            "X-Audio-Channels": "1",
            "X-TTS-Provider": provider,
        },
    )


@app.post("/api/transcribe")
async def transcribe(audio: UploadFile = File(...)) -> JSONResponse:
    raw = await audio.read()
    if not raw:
        return JSONResponse(status_code=400, content={"error": "语音请求格式不正确。"})
    if len(raw) > 25 * 1024 * 1024:
        return JSONResponse(status_code=413, content={"error": "语音文件过大。"})
    try:
        text = await transcribe_audio(
            settings,
            audio.filename or "audio.webm",
            audio.content_type or "application/octet-stream",
            raw,
        )
    except ServiceUnavailable as exc:
        return JSONResponse(status_code=503, content={"error": str(exc)})
    return JSONResponse(content={"text": text})


@app.post("/api/city-visual")
async def city_visual(body: CityVisualRequest) -> dict:
    if not isinstance(body.result.get("destination"), dict):
        raise HTTPException(status_code=400, detail="城市视觉请求缺少推荐结果。")
    return build_city_visual(body.result)


if settings.site_dir.is_dir():
    app.mount("/", StaticFiles(directory=settings.site_dir, html=True), name="frontend")
