"""Copy already-public artwork to Vercel CDN output, keeping local paths intact."""
from pathlib import Path
from shutil import copytree, move
import os


def prepare_static_assets(site_dir: Path, public_dir: Path, *, move_sources: bool = False) -> int:
    source = site_dir / "assets"
    if not source.is_dir():
        raise FileNotFoundError(f"Artwork directory missing: {source}")
    count = sum(path.is_file() for path in source.rglob("*"))
    target = public_dir / "assets"
    if move_sources:
        # Vercel uses an isolated checkout. Moving (not deleting) the tree keeps
        # original bytes available to the CDN without bundling them twice.
        if target.exists():
            raise FileExistsError(f"Refusing to overwrite existing CDN assets: {target}")
        public_dir.mkdir(parents=True, exist_ok=True)
        move(str(source), str(target))
    else:
        copytree(source, target, dirs_exist_ok=True)
    return count


if __name__ == "__main__":
    root = Path(__file__).resolve().parents[1]
    cloud = os.environ.get("VERCEL") == "1"
    count = prepare_static_assets(root / "site", root / "public", move_sources=cloud)
    print(f"Prepared {count} artwork files for Vercel CDN; cloud move={cloud}.")
