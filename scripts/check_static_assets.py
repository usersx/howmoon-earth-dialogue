"""Check live city-cover HTTP responses and decoding, without credentials."""
import asyncio
from html.parser import HTMLParser
import io
import sys
from urllib.parse import urlsplit

import httpx
from PIL import Image


class CoverParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.paths = set()

    def handle_starttag(self, tag, attrs):
        src = dict(attrs).get("src", "")
        if tag == "img" and src.startswith("/assets/"):
            self.paths.add(src)


def image_error(response: httpx.Response):
    if response.status_code != 200:
        return f"HTTP {response.status_code}"
    if not response.headers.get("content-type", "").lower().startswith("image/"):
        return "response is not an image"
    try:
        with Image.open(io.BytesIO(response.content)) as image:
            image.verify()
    except (OSError, ValueError) as error:
        return f"image cannot be decoded: {type(error).__name__}"
    return None


async def check(base_url):
    base_url = base_url.rstrip("/")
    loopback = urlsplit(base_url).hostname in {"localhost", "127.0.0.1", "::1"}
    async with httpx.AsyncClient(timeout=20, trust_env=not loopback) as client:
        page = await client.get(base_url + "/cities/")
        page.raise_for_status()
        parser = CoverParser()
        parser.feed(page.text)
        if not parser.paths:
            raise ValueError("No city covers in response; this may be an error or login page")
        semaphore = asyncio.Semaphore(4)

        async def one(path):
            async with semaphore:
                try:
                    error = image_error(await client.get(base_url + path))
                except httpx.HTTPError as exc:
                    error = type(exc).__name__
                print(f"{'FAIL' if error else 'PASS'} {path} {error or '200 and decoded'}", flush=True)
                return error is None

        results = await asyncio.gather(*(one(path) for path in sorted(parser.paths)))
        print(f"{sum(results)}/{len(results)} city covers verified")
        return all(results)


if __name__ == "__main__":
    try:
        success = asyncio.run(check(sys.argv[1]))
    except (IndexError, ValueError, httpx.HTTPError) as error:
        print(f"Verification failed: {error}", file=sys.stderr)
        success = False
    sys.exit(0 if success else 1)
