from __future__ import annotations

import base64
import io
import json
import platform
import shutil
import subprocess
import tempfile
import wave
from pathlib import Path
from typing import Any, Dict

import httpx

from .config import Settings


class ServiceUnavailable(RuntimeError):
    pass


KNOWN_CITIES = {
    "北京": (39.9042, 116.4074),
    "北京市": (39.9042, 116.4074),
    "罗马": (41.9028, 12.4964),
    "东京": (35.6762, 139.6503),
    "西安": (34.3416, 108.9398),
    "大理": (25.6065, 100.2676),
    "福冈": (33.5904, 130.4017),
    "卢布尔雅那": (46.0569, 14.5058),
    "波尔图": (41.1579, -8.6291),
    "松江市": (35.4681, 133.0484),
}


def build_geography(turn: Dict[str, Any], scope: str) -> Dict[str, Any]:
    result = turn.get("result")
    if not isinstance(result, dict):
        raise ValueError("定位请求缺少有效的目的地结果。")
    destination = result.get("destination")
    if not isinstance(destination, dict):
        raise ValueError("定位请求缺少有效的目的地结果。")

    city = str(destination.get("city") or "").strip()
    english = str(destination.get("cityEnglishName") or city).strip()
    country = str(destination.get("country") or "").strip()
    candidate = destination.get("candidateCoordinates") or {}
    try:
        latitude = float(candidate.get("latitude"))
        longitude = float(candidate.get("longitude"))
    except (TypeError, ValueError):
        latitude, longitude = KNOWN_CITIES.get(city, (0.0, 0.0))
    if not (-90 <= latitude <= 90 and -180 <= longitude <= 180):
        latitude, longitude = KNOWN_CITIES.get(city, (0.0, 0.0))

    landmarks = []
    if scope == "full":
        for landmark in result.get("landmarks") or []:
            if isinstance(landmark, dict) and landmark.get("name"):
                landmarks.append(
                    {
                        "name": str(landmark["name"]),
                        "status": "unavailable",
                        "provider": None,
                        "placeId": None,
                        "coordinates": None,
                    }
                )

    slug = "".join(character.lower() for character in english if character.isalnum()) or "city"
    return {
        "scope": scope,
        "geography": {
            "status": "estimated",
            "provider": "model-or-local",
            "placeId": f"model:{slug}",
            "displayName": ", ".join(part for part in (city, country) if part),
            "coordinates": {"latitude": latitude, "longitude": longitude},
            "boundary": None,
            "landmarks": landmarks,
        },
    }




def synthesize_macos_pcm(text: str) -> bytes:
    if platform.system() != "Darwin" or not shutil.which("say") or not shutil.which("afconvert"):
        raise ServiceUnavailable("当前机器没有可用的本地 TTS；请使用文字模式或配置在线 TTS。")
    with tempfile.TemporaryDirectory(prefix="travel-demo-tts-") as directory:
        source = Path(directory) / "speech.aiff"
        target = Path(directory) / "speech.wav"
        try:
            subprocess.run(
                ["say", "-o", str(source), text],
                check=True,
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
                timeout=60,
            )
            subprocess.run(
                ["afconvert", str(source), "-o", str(target), "-f", "WAVE", "-d", "LEI16@16000", "-c", "1"],
                check=True,
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
                timeout=60,
            )
            with wave.open(str(target), "rb") as audio:
                if audio.getnchannels() != 1 or audio.getsampwidth() != 2:
                    raise ServiceUnavailable("本地 TTS 返回了不兼容的音频格式。")
                frames = audio.readframes(audio.getnframes())
                if not frames:
                    raise ServiceUnavailable("本地 TTS 没有生成可播放的音频。")
                return frames
        except (OSError, subprocess.SubprocessError, wave.Error) as exc:
            raise ServiceUnavailable("本地 TTS 暂时不可用。") from exc


async def synthesize_qwen_pcm(config: Settings, text: str) -> tuple[bytes, int]:
    if not config.qwen_api_key:
        raise ServiceUnavailable("服务器没有配置跨平台语音合成，请先使用文字模式。")

    payload = {
        "model": config.qwen_tts_model,
        "input": {
            "text": text,
            "voice": config.qwen_tts_voice,
            "language_type": "Chinese",
        },
    }
    headers = {
        "Authorization": f"Bearer {config.qwen_api_key}",
        "Content-Type": "application/json",
    }
    async with httpx.AsyncClient(timeout=90, follow_redirects=True) as client:
        response = await client.post(
            config.qwen_tts_endpoint,
            headers=headers,
            json=payload,
        )
        if response.status_code >= 400:
            raise ServiceUnavailable(
                f"千问语音合成失败（HTTP {response.status_code}）。"
            )
        try:
            audio_url = str(response.json()["output"]["audio"]["url"])
        except (KeyError, TypeError, ValueError) as exc:
            raise ServiceUnavailable("千问语音合成返回格式无法读取。") from exc
        audio_response = await client.get(audio_url)
        if audio_response.status_code >= 400:
            raise ServiceUnavailable(
                f"千问语音文件下载失败（HTTP {audio_response.status_code}）。"
            )

    try:
        with wave.open(io.BytesIO(audio_response.content), "rb") as audio:
            sample_rate = audio.getframerate()
            if (
                audio.getnchannels() != 1
                or audio.getsampwidth() != 2
                or not 8_000 <= sample_rate <= 48_000
            ):
                raise ServiceUnavailable("千问语音格式与前端不兼容。")
            frames = audio.readframes(audio.getnframes())
    except (EOFError, wave.Error) as exc:
        raise ServiceUnavailable("千问语音文件无法读取。") from exc
    if not frames:
        raise ServiceUnavailable("千问语音合成没有返回音频。")
    return frames, sample_rate


async def synthesize_speech(config: Settings, text: str) -> tuple[bytes, int, str]:
    if platform.system() == "Darwin":
        try:
            return synthesize_macos_pcm(text), 16_000, "macos-say"
        except ServiceUnavailable:
            pass
    pcm, sample_rate = await synthesize_qwen_pcm(config, text)
    return pcm, sample_rate, config.qwen_tts_model


async def transcribe_audio(
    config: Settings, filename: str, content_type: str, audio: bytes
) -> str:
    if config.qwen_api_key:
        if len(audio) > 7_000_000:
            raise ServiceUnavailable("语音文件过大，请缩短回答后重试。")
        media_type = (content_type or "audio/webm").split(";", 1)[0]
        encoded = base64.b64encode(audio).decode("ascii")
        payload = {
            "model": config.qwen_asr_model,
            "messages": [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "input_audio",
                            "input_audio": {
                                "data": f"data:{media_type};base64,{encoded}"
                            },
                        }
                    ],
                }
            ],
            "stream": False,
            "asr_options": {"language": "zh", "enable_itn": True},
        }
        headers = {
            "Authorization": f"Bearer {config.qwen_api_key}",
            "Content-Type": "application/json",
        }
        async with httpx.AsyncClient(timeout=90) as client:
            response = await client.post(
                f"{config.qwen_base_url}/chat/completions",
                headers=headers,
                json=payload,
            )
        if response.status_code >= 400:
            raise ServiceUnavailable(
                f"千问语音转写失败（HTTP {response.status_code}）。"
            )
        try:
            text = str(
                response.json()["choices"][0]["message"].get("content") or ""
            ).strip()
        except (KeyError, IndexError, TypeError, ValueError) as exc:
            raise ServiceUnavailable("千问语音转写返回格式无法读取。") from exc
        if not text:
            raise ServiceUnavailable("语音中没有识别出文字。")
        return text

    if not config.stt_api_key or not config.stt_base_url or not config.stt_model:
        raise ServiceUnavailable("服务器没有配置语音转写供应商，请先使用文字模式。")
    headers = {"Authorization": f"Bearer {config.stt_api_key}"}
    files = {"file": (filename or "audio.webm", audio, content_type or "application/octet-stream")}
    data = {"model": config.stt_model, "language": "zh"}
    async with httpx.AsyncClient(timeout=90) as client:
        response = await client.post(
            f"{config.stt_base_url}/audio/transcriptions",
            headers=headers,
            files=files,
            data=data,
        )
    if response.status_code >= 400:
        raise ServiceUnavailable(f"语音转写请求失败（HTTP {response.status_code}）。")
    try:
        text = str(response.json().get("text") or "").strip()
    except (ValueError, AttributeError) as exc:
        raise ServiceUnavailable("语音转写返回格式无法读取。") from exc
    if not text:
        raise ServiceUnavailable("语音中没有识别出文字。")
    return text
