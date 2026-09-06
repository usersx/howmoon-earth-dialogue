import json
from pathlib import Path

import pytest

from scripts.prepare_vercel import validate_static_assets


def test_build_validation_preserves_images_and_private_files(tmp_path: Path, monkeypatch) -> None:
    (tmp_path / "site").mkdir()
    (tmp_path / "site/city-atlas-data.json").write_text(json.dumps({}))
    assets = tmp_path / "public/assets"
    assets.mkdir(parents=True)
    image = b"sample-image-bytes"
    for name in ("beijing-city-hero-v1.jpg", "rome-city-hero-v1.jpg"):
        (assets / name).write_bytes(image)
    (tmp_path / ".env").write_text("PRIVATE=test")
    monkeypatch.setenv("VERCEL", "1")
    assert validate_static_assets(tmp_path) == 2
    assert validate_static_assets(tmp_path) == 2
    assert (assets / "beijing-city-hero-v1.jpg").read_bytes() == image
    assert (tmp_path / "site/city-atlas-data.json").exists()
    assert not (tmp_path / "public/.env").exists()


def test_build_validation_rejects_missing_artwork(tmp_path: Path) -> None:
    (tmp_path / "site").mkdir()
    (tmp_path / "site/city-atlas-data.json").write_text(json.dumps({}))
    with pytest.raises(FileNotFoundError, match="Versioned public artwork missing"):
        validate_static_assets(tmp_path)
