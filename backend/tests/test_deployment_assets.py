from pathlib import Path

from scripts.prepare_vercel import prepare_static_assets


def test_artwork_copy_keeps_binary_content_and_does_not_publish_private_files(tmp_path: Path) -> None:
    site = tmp_path / "site"
    (site / "assets" / "tokyo").mkdir(parents=True)
    artwork = b"\x89PNG\r\n\x1a\nexample-artwork"
    (site / "assets" / "tokyo" / "hero.png").write_bytes(artwork)
    (site / "city-atlas-data.json").write_text("{}")
    (tmp_path / ".env").write_text("PRIVATE=test")
    public = tmp_path / "public"
    assert prepare_static_assets(site, public) == 1
    assert (public / "assets" / "tokyo" / "hero.png").read_bytes() == artwork
    assert (site / "assets" / "tokyo" / "hero.png").read_bytes() == artwork
    assert not (public / ".env").exists()
    assert not (public / "city-atlas-data.json").exists()
    assert prepare_static_assets(site, public) == 1
