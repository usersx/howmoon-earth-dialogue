"""Synchronize city entry metadata into the recovered frontend bundles.

Readable bundles remain the source; marked generated blocks make rebuilding
idempotent without needing a second application framework.
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = json.loads((ROOT / "site/city-atlas-data.json").read_text())
compact = lambda value: json.dumps(value, ensure_ascii=False, separators=(",", ":"))
COUNTRY_CODES = {"中国":"CN", "日本":"JP", "新加坡":"SG", "意大利":"IT", "法国":"FR", "英国":"GB", "美国":"US", "德国":"DE"}
EXTRA_ALIASES = {"guangzhou":["廣州","Canton"], "shenzhen":["深圳市"], "singapore":["狮城"], "xiamen":["廈門","Amoy"], "florence":["佛罗伦斯","翡冷翠","Firenze"], "paris":["Paris France"], "london":["London UK"], "new-york":["纽约市","紐約","New York City","NYC"], "berlin":["Berlin Germany"]}


def aliases(slug, city):
    return list(dict.fromkeys([city["name"], city["name"]+"市", city["english"], slug, city["country"]+city["name"], *EXTRA_ALIASES.get(slug, [])]))


def inject(source, anchor, name, content):
    start, end = f"/* ATLAS_{name}_START */", f"/* ATLAS_{name}_END */"
    block = start + content + end
    if start in source:
        return re.sub(re.escape(start) + ".*?" + re.escape(end), lambda _: block, source, count=1, flags=re.S)
    assert source.count(anchor) == 1, f"Ambiguous insertion point: {anchor}"
    # Anchor may contain the first element of the original array.
    offset = anchor.index("[") + 1 if name != "QUICK" else len(anchor)
    return source.replace(anchor, anchor[:offset] + block + anchor[offset:], 1)


extras = {slug:city for slug, city in DATA.items() if slug not in ("tokyo", "xian")}
registry, routes, quick = [], [], {}
for slug, city in extras.items():
    names = aliases(slug, city)
    registry.append(dict(key=slug, aliases=names, image=f"/assets/{slug}/hero.{city.get('imageFormat','png')}", imageVersion=f"{slug}-atlas-v1", route=f"/city/{slug}/", sourceReferences=[]))
    routes.append(dict(path=f"/city/{slug}", aliases=names))
    coords = dict(latitude=city["latitude"], longitude=city["longitude"])
    quick[slug] = dict(result=dict(destination=dict(placeType="city",city=city["name"],cityEnglishName=city["english"].title(),country=city["country"],countryCode=COUNTRY_CODES[city["country"]],adminRegion=city["name"],iataCode=city["iata"],candidateCoordinates=coords,confidence="high",confidenceMessage=None),display=dict(revealNarrative=[city["tagline"],"沿着城市长卷，选择一处想停留的地方。"],predictionNote="这是一次直接点亮的快捷旅程。"),evidenceAnchors=[],landmarks=[],visualBrief=dict(primaryScene=city["description"],atmosphere="城市艺术名片")),geography=dict(status="estimated",provider="fixed",placeId=f"quick-journey-{slug}",displayName=city["name"],coordinates=coords,boundary=None,landmarks=[]))

main = ROOT / "recovered/page-cfec76f4fe91be41.split.js"
city_file = ROOT / "recovered/city/%5Bslug%5D/page-236750cf20f1491a.split.js"
for source_file in (main, city_file):
    source = source_file.read_text()
    source = inject(source, 'let r=[{"key":"tokyo"', "REGISTRY", compact(registry)[1:-1] + ",")
    if source_file == main:
        source = inject(source, "let w=[", "ROUTES", compact(routes)[1:-1] + ",")
        source = inject(source, "let E={", "QUICK", compact(quick)[1:-1] + ",")
    source_file.write_text(source)
    bundle = source.replace("\n", "").replace("云中客", "何月").replace("YOUR PLACE \\xb7 THE WORLD", "HOWMOON \\xb7 EARTH DIALOGUE")
    targets = [ROOT / "site/_next/static/chunks/app/page-cfec76f4fe91be41.js"] if source_file == main else [ROOT / f"site/_next/static/chunks/app/city/{folder}/page-236750cf20f1491a.js" for folder in ("%5Bslug%5D", "[slug]")]
    for target in targets:
        target.write_text(bundle)
print(f"Synchronized {len(DATA)} city atlas entries.")
