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


def test_cloud_build_moves_only_artwork_out_of_function_source(tmp_path: Path) -> None:
    site = tmp_path / "site"
    (site / "assets").mkdir(parents=True)
    image = b"sample-image-bytes"
    (site / "assets" / "hero.jpg").write_bytes(image)
    (site / "city-atlas-data.json").write_text("{}")
    public = tmp_path / "public"
    assert prepare_static_assets(site, public, move_sources=True) == 1
    assert not (site / "assets").exists()
    assert (public / "assets" / "hero.jpg").read_bytes() == image
    assert (site / "city-atlas-data.json").exists()
