"""Keep the original Beijing/Rome SSR markup aligned with its reading component."""
import html
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT / "site"
paths = list((SITE / "experience").glob("*/index.html")) + list((SITE / "city/rome/experience").glob("*/index.html"))
for path in paths:
    page = path.read_text()
    stream = "".join(json.loads(m)[1] for m in re.findall(r'self\.__next_f\.push\((\[1,.*?\])\)</script>', page))
    marker = '"scene":'
    if marker not in stream:
        raise ValueError(f"Scene missing: {path}")
    scene, _ = json.JSONDecoder().raw_decode(stream[stream.index(marker) + len(marker):])
    esc = html.escape
    sections = "".join(f'<section><span>{i+1:02d}</span><h3>{esc(p["title"])}</h3><p>{esc(p["lead"]+"。"+p["description"])}</p></section>' for i,p in enumerate(scene["points"]))
    article = '<article class="landmark-reading legacy-reading"><header><p class="eyebrow">BEYOND THE POSTCARD · 深入一景</p>' + f'<h2>{esc(scene["title"])}，慢慢看</h2><p class="reading-intro">{esc(scene["subtitle"])}</p></header><div class="reading-sections">{sections}</div><p class="reading-note">建筑艺术示意，非精确测绘。现场开放范围与参观安排请以景点官方公告为准。</p></article>'
    page = re.sub(r'<article class="landmark-reading legacy-reading">.*?</article>', "", page)
    page = page.replace("</main>", "</main>" + article, 1)
    path.write_text(page)
print(f"Aligned server-rendered reading sections on {len(paths)} existing landmark pages.")
