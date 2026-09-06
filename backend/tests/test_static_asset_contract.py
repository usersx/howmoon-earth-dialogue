import json
from pathlib import Path
import subprocess

import httpx

from app.main import app
from scripts.check_static_assets import image_error

ROOT = Path(__file__).resolve().parents[2]


def test_images_are_tracked_public_files_before_vercel_build() -> None:
    tracked = set(subprocess.check_output(
        ["git", "ls-files", "-z", "public/assets"], cwd=ROOT,
    ).decode().split("\0"))
    required = {"public/assets/beijing-city-hero-v1.jpg", "public/assets/rome-city-hero-v1.jpg"}
    catalogue = json.loads((ROOT / "site/city-atlas-data.json").read_text())
    for slug, city in catalogue.items():
        extension = city.get("imageFormat", "png")
        names = ["hero", "panorama", *[point["slug"] for point in city["landmarks"]]]
        required.update(f"public/assets/{slug}/{name}.{extension}" for name in names)
    assert required <= tracked, f"Images must be in the deployed Git source, not generated later: {sorted(required - tracked)[:5]}"
    assert all((ROOT / path).is_file() for path in required)


def test_local_assets_mount_precedes_frontend_mount() -> None:
    paths = [getattr(route, "path", "") for route in app.routes]
    assert "/assets" in paths, "Local image serving must use the same public/assets source as Vercel"
    assert paths.index("/assets") < paths.index("")


def test_live_image_check_rejects_false_success_responses() -> None:
    assert image_error(httpx.Response(404)) == "HTTP 404"
    assert image_error(httpx.Response(200, headers={"content-type": "text/html"}, content=b"login"))
    assert image_error(httpx.Response(200, headers={"content-type": "image/png"}, content=b"broken"))
    image = (ROOT / "public/assets/beijing-city-hero-v1.jpg").read_bytes()
    assert image_error(httpx.Response(200, headers={"content-type": "image/jpeg"}, content=image)) is None
