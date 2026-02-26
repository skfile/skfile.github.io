#!/usr/bin/env python3
import json, re, sys, datetime
from urllib.request import urlopen, Request
from xml.etree import ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CONF = ROOT / "substack.json"
OUT = ROOT / "assets" / "data" / "substack_posts.json"

def strip_html(s: str) -> str:
    s = re.sub(r"<[^>]+>", " ", s or "")
    s = re.sub(r"\s+", " ", s).strip()
    return s

def main():
    cfg = json.loads(CONF.read_text(encoding="utf-8"))
    rss_url = cfg.get("rss_url")
    max_posts = int(cfg.get("max_posts", 12))
    if not rss_url or "YOURSUBSTACK" in rss_url:
        print("Set substack.json:rss_url to your real Substack feed URL.", file=sys.stderr)
        sys.exit(2)

    req = Request(rss_url, headers={"User-Agent":"vik-site-bot/1.0"})
    xml = urlopen(req, timeout=30).read()

    root = ET.fromstring(xml)
    # RSS 2.0: channel/item
    channel = root.find("channel")
    items = channel.findall("item") if channel is not None else root.findall(".//item")

    posts = []
    for it in items[:max_posts]:
        title = (it.findtext("title") or "").strip()
        link = (it.findtext("link") or "").strip()
        pub = (it.findtext("pubDate") or "").strip()
        desc = (it.findtext("description") or "").strip()
        # prefer content:encoded if present
        ns = {"content":"http://purl.org/rss/1.0/modules/content/"}
        content = it.findtext("content:encoded", default="", namespaces=ns) or ""
        excerpt_src = content or desc
        excerpt = strip_html(excerpt_src)[:240]
        # best-effort date normalization
        date = pub
        posts.append({
            "title": title,
            "url": link,
            "date": date,
            "excerpt": excerpt
        })

    payload = {
        "generated_at": datetime.datetime.utcnow().isoformat() + "Z",
        "rss_url": rss_url,
        "posts": posts
    }
    OUT.write_text(json.dumps(payload, indent=2), encoding="utf-8")
    print(f"Wrote {OUT} with {len(posts)} posts.")

if __name__ == "__main__":
    main()
