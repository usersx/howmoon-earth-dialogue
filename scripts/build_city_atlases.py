"""Build the Tokyo and Xi'an static city routes from one content catalogue."""
import html
import json
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT / "site"
DATA = json.loads((SITE / "city-atlas-data.json").read_text())
esc = html.escape


def image_path(city, landmark):
    return f"/assets/{city}/{landmark}.png"


def shell(city, body, title, detail=""):
    slug = city["slug"]
    preload = image_path(slug, detail or "hero")
    return f"""<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{esc(title)}｜何月沉浸城市体验</title>
<meta name="description" content="{esc(city['description'])}">
<meta property="og:title" content="{esc(title)}｜何月">
<meta property="og:image" content="https://howmoon-earth-dialogue.vercel.app{preload}">
<link rel="preload" as="image" href="{preload}">
<link rel="stylesheet" href="/city-atlas.css?v=1">
<script defer src="/city-atlas.js?v=1"></script></head>
<body data-city="{slug}" data-landmark="{detail}" data-view="{'detail' if detail else 'cover'}" style="--accent:{city['accent']}">
{body}
<script type="application/json" id="atlas-data">{json.dumps(city, ensure_ascii=False).replace('<', chr(92)+'u003c')}</script>
</body></html>"""


def brand():
    return '<a class="brand" href="/?return=1" aria-label="返回何月"><span class="moon" aria-hidden="true"></span><b>何 月</b></a>'


def city_page(city):
    slug = city["slug"]
    regions = {
        "tokyo": [(0,25,40),(25,35,19),(35,52,52),(52,61,26),(61,82,44),(82,100,55)],
        "xian": [(0,18,36),(18,39,26),(39,55,20),(55,62,34),(62,81,40),(81,100,48)],
    }[slug]
    with Image.open(SITE / image_path(slug, "panorama").lstrip("/")) as panorama:
        pw, ph = panorama.size
    links, items = [], []
    for index, item in enumerate(city["landmarks"]):
        image = image_path(slug, item["slug"])
        href = f"/city/{slug}/experience/{item['slug']}/"
        start, end, label_y = regions[index]
        items.append(f"""
<a href="{href}" class="landmark{' selected' if index == 0 else ''}" data-index="{index}"
   data-focus="{(start+end)/2}" style="left:{start}%;width:{end-start}%;--label-y:{label_y}%"
   aria-label="进入{item['name']}沉浸图鉴">
  <span class="landmark-label"><small>{index+1:02d}</small>{item['name']}<i>↗</i></span>
</a>""")
        links.append(f'<button class="index-button" data-index="{index}" aria-pressed="{str(index==0).lower()}">{index+1:02d} <span>{item["name"]}</span></button>')
    first = city["landmarks"][0]
    content = f"""
<section id="cover" class="cover" aria-label="{city['name']}城市名片">
  <img class="cover-image" src="{image_path(slug, 'hero')}" alt="{city['name']}暮色中的城市俯瞰艺术全景">
  <div class="cover-shade"></div>
  <header class="cover-header"><a href="/?return=1" class="round" aria-label="返回地球对话">←</a>{brand()}<span class="coordinates">{city['coordinates']}</span></header>
  <div class="cover-content"><div class="cover-title"><p class="eyebrow">CITY ARCHIVE · {city['english']} · {city['country']}</p><p class="cover-chinese">{city['name']}</p><h1>{city['english']}</h1><p class="tagline">{city['tagline']}</p></div>
    <div class="cover-actions"><button id="enter"><span>沉浸体验<small>ENTER EXPERIENCE</small></span><i>→</i></button><a href="/?return=1"><span>返回地球对话<small>BACK TO DIALOGUE</small></span><i>↗</i></a></div>
  </div>
</section>
<main id="atlas" class="atlas" hidden>
  <header class="atlas-header"><button id="back-cover" class="round" aria-label="返回城市名片">←</button>{brand()}<span class="coordinates">{city['coordinates']}</span></header>
  <section class="atlas-heading"><div><p class="eyebrow">CITY ARCHIVE · {city['english']}</p><h2>{city['name'][0]}<span>{city['name'][1:]}</span></h2></div><div><h3>{city['intro']}</h3><p>{city['description']}</p></div></section>
  <section class="panorama" aria-label="{city['name']}建筑横向探索长卷">
    <p class="scroll-hint"><span>↔</span> 左右拖动 · 点击建筑进入图鉴</p>
    <div class="panorama-window" tabindex="0" aria-label="可左右滚动的景点长卷"><div class="panorama-strip" style="--panorama-ratio:{pw}/{ph};--focus-x:12%">
      <img class="panorama-base" src="{image_path(slug, 'panorama')}" alt="{city['name']}六处代表景点的建筑拼贴长卷" draggable="false">
      <img class="panorama-colour" src="{image_path(slug, 'panorama')}" alt="" aria-hidden="true" draggable="false">
      {''.join(items)}</div></div>
    <button class="round prev" aria-label="长卷向左滚动">←</button><button class="round next" aria-label="长卷向右滚动">→</button>
    <label class="sr-only" for="panorama-position">长卷滚动位置</label><input id="panorama-position" type="range" min="0" max="1000" value="0">
  </section>
  <nav class="landmark-index" aria-label="选择景点">{''.join(links)}</nav>
  <section class="landmark-info" aria-live="polite">
    <div><p class="eyebrow" id="info-english">{first['english']}</p><h2 id="info-name">{first['name']}</h2><p id="info-era">{first['era']} / {first['area']}</p></div>
    <div class="info-description"><p id="info-description">{first['description']}</p><p class="visit" id="info-visit">{first['visit']}</p></div>
    <div class="info-actions"><a id="detail-link" class="pill primary" href="/city/{slug}/experience/{first['slug']}/">进入景点图鉴 ↗</a><a class="pill" href="https://www.trip.com/flights/?acity={city['iata'].lower()}&amp;curr=CNY" target="_blank" rel="noopener noreferrer">当前机票信息 ↗</a></div>
  </section>
  <footer class="atlas-footer"><span>建筑艺术图鉴 · 长卷为主题编排，非真实地理顺序</span><a href="/?return=1">回到地球，继续聊聊 ↗</a></footer>
</main>"""
    return shell(city, content, f"{city['name']}城市切片")


def detail_page(city, landmark):
    slug = city["slug"]
    image = image_path(slug, landmark["slug"])
    with Image.open(SITE / image.lstrip("/")) as art:
        width, height = art.size
    points = "".join(
        f'<button class="hotspot" data-point="{i}" style="left:{p["x"]}%;top:{p["y"]}%" aria-label="了解{p["title"]}" aria-controls="detail-card" aria-expanded="false"><span></span></button>'
        for i, p in enumerate(landmark["points"])
    )
    index = city["landmarks"].index(landmark)
    previous = city["landmarks"][(index-1) % len(city["landmarks"])]
    following = city["landmarks"][(index+1) % len(city["landmarks"])]
    content = f"""
<header class="detail-header"><a class="round" href="/city/{slug}/?enter=1&amp;landmark={landmark['slug']}" aria-label="返回{city['name']}长卷">←</a>{brand()}<p class="eyebrow">{landmark['english']}</p></header>
<main class="detail-main"><div class="detail-heading"><h1>{landmark['name']}</h1><span>{landmark['subtitle']}</span></div>
  <div class="detail-stage"><div class="art-frame" style="--art-ratio:{width}/{height}">
    <img id="detail-art" src="{image}" width="{width}" height="{height}" alt="{landmark['name']}精细建筑艺术示意图" draggable="false">
    <div id="magnifier" hidden aria-hidden="true"></div>
    {points}
  </div>
  <aside id="detail-card" class="detail-card" hidden aria-labelledby="detail-card-title">
    <button id="close-detail" class="round" aria-label="关闭建筑说明">×</button>
    <div class="detail-crop" role="img" aria-label="建筑局部放大"></div>
    <div class="detail-card-copy"><p class="eyebrow">ARCHITECTURAL DETAIL</p><h2 id="detail-card-title"></h2><h3 id="detail-card-lead"></h3><p id="detail-card-text"></p></div>
  </aside></div>
  <div class="detail-tools"><button id="toggle-magnifier" class="pill" aria-pressed="false">⌕ 放大镜</button><span>悬停或点击光点 · 阅读建筑细节</span><button id="show-overview" class="pill">景点概览</button></div>
  <section id="overview" class="overview" hidden><h2>{landmark['name']}</h2><p>{landmark['description']}</p><p>{landmark['visit']}</p><ul>{''.join(f'<li>{esc(t)}</li>' for t in landmark['tips'])}</ul><a href="{landmark['source']}" target="_blank" rel="noopener noreferrer">查看官方介绍与参观安排 ↗</a></section>
</main>
<footer class="detail-footer"><a href="/city/{slug}/experience/{previous['slug']}/">← {previous['name']}</a><span>建筑艺术示意 · {index+1:02d} / {len(city['landmarks']):02d}</span><a href="/city/{slug}/experience/{following['slug']}/">{following['name']} →</a></footer>"""
    return shell(city, content, f"{landmark['name']}沉浸式图鉴", landmark["slug"])


for slug, city in DATA.items():
    city["slug"] = slug
    folder = SITE / "city" / slug
    folder.mkdir(parents=True, exist_ok=True)
    (folder / "index.html").write_text(city_page(city), encoding="utf-8")
    for landmark in city["landmarks"]:
        path = folder / "experience" / landmark["slug"]
        path.mkdir(parents=True, exist_ok=True)
        (path / "index.html").write_text(detail_page(city, landmark), encoding="utf-8")
print("Built 2 city archives and 12 landmark atlases.")
