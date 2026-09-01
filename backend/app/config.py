from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path
from typing import Optional


def _truthy(value: Optional[str], default: bool = False) -> bool:
    if value is None:
        return default
    return value.strip().lower() in {"1", "true", "yes", "on"}


@dataclass(frozen=True)
class Settings:
    package_dir: Path
    site_dir: Path
    qwen_api_key: Optional[str]
    qwen_base_url: str
    qwen_model: str
    qwen_asr_model: str
    deepseek_api_key: Optional[str]
    deepseek_base_url: str
    deepseek_model: str
    deepseek_timeout_seconds: float
    allow_mock_dialogue: bool
    mock_thinking_delay_seconds: float
    min_provider_thinking_delay_seconds: float
    stt_api_key: Optional[str]
    stt_base_url: Optional[str]
    stt_model: Optional[str]

    @property
    def dialogue_provider(self) -> str:
        if self.qwen_api_key:
            return "qwen"
        if self.deepseek_api_key:
            return "deepseek"
        return "local-mock"

    @property
    def dialogue_api_key(self) -> Optional[str]:
        return self.qwen_api_key or self.deepseek_api_key

    @property
    def dialogue_base_url(self) -> str:
        return self.qwen_base_url if self.qwen_api_key else self.deepseek_base_url

    @property
    def dialogue_model(self) -> str:
        if self.qwen_api_key:
            return self.qwen_model
        if self.deepseek_api_key:
            return self.deepseek_model
        return "local-mock"

    @classmethod
    def from_env(cls) -> "Settings":
        package_dir = Path(__file__).resolve().parents[2]
        return cls(
            package_dir=package_dir,
            site_dir=Path(os.getenv("SITE_DIR", str(package_dir / "site"))).resolve(),
            qwen_api_key=os.getenv("DASHSCOPE_API_KEY") or None,
            qwen_base_url=os.getenv(
                "DASHSCOPE_BASE_URL", "https://dashscope.aliyuncs.com/compatible-mode/v1"
            ).rstrip("/"),
            qwen_model=os.getenv("QWEN_MODEL", "qwen3.7-plus"),
            qwen_asr_model=os.getenv("QWEN_ASR_MODEL", "qwen3-asr-flash"),
            deepseek_api_key=os.getenv("DEEPSEEK_API_KEY") or None,
            deepseek_base_url=os.getenv(
                "DEEPSEEK_BASE_URL", "https://api.deepseek.com"
            ).rstrip("/"),
            deepseek_model=os.getenv("DEEPSEEK_MODEL", "deepseek-v4-flash"),
            deepseek_timeout_seconds=float(os.getenv("DEEPSEEK_TIMEOUT_SECONDS", "90")),
            allow_mock_dialogue=_truthy(os.getenv("ALLOW_MOCK_DIALOGUE"), default=True),
            mock_thinking_delay_seconds=float(
                os.getenv("MOCK_THINKING_DELAY_SECONDS", "2.6")
            ),
            min_provider_thinking_delay_seconds=float(
                os.getenv("MIN_PROVIDER_THINKING_DELAY_SECONDS", "1.2")
            ),
            stt_api_key=os.getenv("STT_API_KEY") or None,
            stt_base_url=(os.getenv("STT_BASE_URL") or "").rstrip("/") or None,
            stt_model=os.getenv("STT_MODEL") or None,
        )


settings = Settings.from_env()
