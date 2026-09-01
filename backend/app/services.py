from __future__ import annotations

import base64
import hashlib
import io
import json
import platform
import random
import shutil
import subprocess
import tempfile
import wave
from pathlib import Path
from typing import Any, Dict

import httpx
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps

from .config import Settings


class ServiceUnavailable(RuntimeError):
    pass


KNOWN_CITIES = {
    "北京": (39.9042, 116.4074),
    "北京市": (39.9042, 116.4074),
    "罗马": (41.9028, 12.4964),
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


def build_city_visual(result: Dict[str, Any]) -> Dict[str, Any]:
    destination = result.get("destination") or {}
    visual = result.get("visualBrief") or {}
    city = str(destination.get("city") or "远方")
    english = str(destination.get("cityEnglishName") or "DESTINATION")
    scene = str(visual.get("primaryScene") or "安静的城市与自然相接")
    atmosphere = str(visual.get("atmosphere") or "安静、松弛")
    identity = json.dumps(result, ensure_ascii=False, sort_keys=True, separators=(",", ":"))
    cache_key = hashlib.sha256(identity.encode("utf-8")).hexdigest()

    seed = int(cache_key[:16], 16)
    rng = random.Random(seed)
    size = 1024
    paper = Image.new("RGB", (size, size), "#f4efe3")
    noise = Image.effect_noise((size, size), 7).convert("L")
    paper_texture = ImageOps.colorize(noise, "#e6dece", "#fffdf6")
    image = Image.blend(paper, paper_texture, 0.14)
    draw = ImageDraw.Draw(image, "RGBA")

    art_box = (270, 245, 930, 760)
    top, bottom = art_box[1], art_box[3]
    for y in range(top, bottom):
        ratio = (y - top) / max(1, bottom - top)
        color = (
            int(218 - 82 * ratio),
            int(205 - 42 * ratio),
            int(181 - 9 * ratio),
            178,
        )
        draw.line((art_box[0], y, art_box[2], y), fill=color)

    sun_x = rng.randint(700, 825)
    sun_y = rng.randint(340, 420)
    draw.ellipse((sun_x - 48, sun_y - 48, sun_x + 48, sun_y + 48), fill=(236, 194, 128, 205))

    skyline_y = 585
    cursor = art_box[0] + 20
    while cursor < art_box[2] - 10:
        width = rng.randint(24, 62)
        height = rng.randint(28, 115)
        shade = rng.randint(52, 78)
        draw.rectangle(
            (cursor, skyline_y - height, cursor + width, skyline_y),
            fill=(shade, shade + 12, shade + 7, 210),
        )
        if rng.random() > 0.55:
            draw.polygon(
                [
                    (cursor - 5, skyline_y - height),
                    (cursor + width / 2, skyline_y - height - rng.randint(12, 30)),
                    (cursor + width + 5, skyline_y - height),
                ],
                fill=(shade - 5, shade + 7, shade + 2, 210),
            )
        cursor += width + rng.randint(4, 14)

    water_layer = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    water = ImageDraw.Draw(water_layer, "RGBA")
    water.polygon(
        [
            (art_box[0], skyline_y - 6),
            (art_box[2], skyline_y - 20),
            (art_box[2], art_box[3]),
            (art_box[0], art_box[3]),
        ],
        fill=(69, 112, 121, 198),
    )
    for index in range(22):
        y = skyline_y + 12 + index * 7
        start = art_box[0] + rng.randint(0, 90)
        end = art_box[2] - rng.randint(0, 80)
        water.line((start, y, end, y + rng.randint(-2, 2)), fill=(221, 213, 188, rng.randint(34, 82)), width=2)
    water_layer = water_layer.filter(ImageFilter.GaussianBlur(0.55))
    image = Image.alpha_composite(image.convert("RGBA"), water_layer)
    draw = ImageDraw.Draw(image, "RGBA")

    path_points = [(355, 758), (470, 690), (610, 666), (785, 644), (920, 626)]
    draw.line(path_points, fill=(226, 216, 190, 225), width=28, joint="curve")
    draw.line(path_points, fill=(85, 89, 79, 92), width=2, joint="curve")
    traveler_x, traveler_y = 630, 675
    draw.ellipse((traveler_x - 7, traveler_y - 44, traveler_x + 7, traveler_y - 30), fill=(42, 49, 45, 230))
    draw.line((traveler_x, traveler_y - 30, traveler_x, traveler_y), fill=(42, 49, 45, 230), width=8)
    draw.line((traveler_x, traveler_y, traveler_x - 8, traveler_y + 24), fill=(42, 49, 45, 230), width=5)
    draw.line((traveler_x, traveler_y, traveler_x + 9, traveler_y + 24), fill=(42, 49, 45, 230), width=5)

    def font(size_px: int, serif: bool = False) -> ImageFont.ImageFont:
        candidates = [
            "/System/Library/Fonts/Supplemental/Songti.ttc" if serif else "/System/Library/Fonts/PingFang.ttc",
            "/System/Library/Fonts/Supplemental/Arial Unicode.ttf",
        ]
        for candidate in candidates:
            try:
                return ImageFont.truetype(candidate, size_px)
            except OSError:
                continue
        return ImageFont.load_default()

    draw.text((96, 805), city, font=font(58, serif=True), fill=(47, 61, 55, 235))
    draw.text((98, 875), english.upper(), font=font(22), fill=(83, 98, 90, 220))
    caption = f"{scene} · {atmosphere}"
    draw.text((98, 925), caption[:56], font=font(17), fill=(101, 108, 101, 205))

    output = io.BytesIO()
    image.convert("RGB").save(output, format="PNG", optimize=True)
    encoded = base64.b64encode(output.getvalue()).decode("ascii")
    return {
        "cacheKey": cache_key,
        "image": f"data:image/png;base64,{encoded}",
        "imageVersion": "dynamic-v1",
        "sourceReference": {
            "title": "本地生成的城市视觉，无外部图片来源",
            "pageUrl": "about:blank",
        },
        "generationPromptSummary": f"{city} · {scene}",
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
