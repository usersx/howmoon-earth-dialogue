"""Copy already-public artwork to Vercel CDN output, keeping local paths intact."""
from pathlib import Path
from shutil import copytree


def prepare_static_assets(site_dir: Path, public_dir: Path) -> int:
    source = site_dir / "assets"
    if not source.is_dir():
        raise FileNotFoundError(f"Artwork directory missing: {source}")
    copytree(source, public_dir / "assets", dirs_exist_ok=True)
    return sum(path.is_file() for path in source.rglob("*"))


if __name__ == "__main__":
    root = Path(__file__).resolve().parents[1]
    count = prepare_static_assets(root / "site", root / "public")
    print(f"Prepared {count} artwork files for Vercel CDN; originals preserved.")
