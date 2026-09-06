"""Validate versioned public artwork before deployment. Never move source files."""
import json
from pathlib import Path


def validate_static_assets(root: Path) -> int:
    public = root / "public"
    catalogue = json.loads((root / "site/city-atlas-data.json").read_text())
    required = {"assets/beijing-city-hero-v1.jpg", "assets/rome-city-hero-v1.jpg"}
    for slug, city in catalogue.items():
        extension = city.get("imageFormat", "png")
        names = ["hero", "panorama", *[point["slug"] for point in city["landmarks"]]]
        required.update(f"assets/{slug}/{name}.{extension}" for name in names)
    missing = sorted(path for path in required if not (public / path).is_file())
    if missing:
        raise FileNotFoundError(f"Versioned public artwork missing: {missing[:5]}")
    return sum(path.is_file() for path in (public / "assets").rglob("*"))


if __name__ == "__main__":
    count = validate_static_assets(Path(__file__).resolve().parents[1])
    print(f"Validated {count} versioned public artwork files; no files moved.")
