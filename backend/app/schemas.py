from __future__ import annotations

from typing import Any, Dict, List, Literal

from pydantic import BaseModel, Field


class DialogueMessage(BaseModel):
    role: Literal["system", "assistant", "user"]
    content: str = Field(min_length=1, max_length=20_000)


class DialogueRequest(BaseModel):
    sessionId: str = Field(min_length=1, max_length=200)
    promptVersion: str = Field(min_length=1, max_length=20)
    messages: List[DialogueMessage] = Field(min_length=1, max_length=40)


class GeographyRequest(BaseModel):
    turn: Dict[str, Any]
    scope: Literal["city", "full"]


class TTSRequest(BaseModel):
    text: str = Field(min_length=1, max_length=2_000)


class CityVisualRequest(BaseModel):
    result: Dict[str, Any]

