#!/usr/bin/env python3
"""Refresh the saved feed and static writing links; --cached uses existing JSON."""
import argparse
import datetime
import html
import json
import re
from email.utils import parsedate_to_datetime
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse
from urllib.request import Request, urlopen
from xml.etree import ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'assets/data/substack_posts.json'
START, END = '<!-- POSTS:START -->', '<!-- POSTS:END -->'

class PlainText(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.parts = []
    def handle_data(self, data):
        self.parts.append(data)

def excerpt_from(source):
    parser = PlainText()
    parser.feed(source)
    text = ' '.join(' '.join(parser.parts).split())
    return text if len(text) <= 240 else text[:237].rsplit(' ', 1)[0] + '…'

def render_posts(posts):
    rows = []
    for post in posts:
        url = post.get('url', '')
        if urlparse(url).scheme not in ('https', 'http') or not post.get('title'):
            continue
        title = html.escape(html.unescape(post['title']))
        try:
            parsed = parsedate_to_datetime(post.get('date', ''))
            date_html = f'<time datetime="{parsed.date().isoformat()}">{parsed:%b} {parsed.day}, {parsed.year}</time>'
        except (TypeError, ValueError, OverflowError):
            date_html = ''
        rows.append(f'            <li class="post"><a href="{html.escape(url, quote=True)}">{title}</a>{date_html}</li>')
        if len(rows) == 5:
            break
    if not rows:
        raise ValueError('Feed contains no usable posts; keeping the existing homepage.')
    return '\n'.join(rows)

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--cached', action='store_true')
    args = parser.parse_args()
    if args.cached:
        payload = json.loads(OUT.read_text())
    else:
        cfg = json.loads((ROOT / 'substack.json').read_text())
        request = Request(cfg['rss_url'], headers={'User-Agent': 'savik-site/1.0'})
        with urlopen(request, timeout=30) as response:
            feed = ET.fromstring(response.read())
        posts = []
        for item in feed.findall('./channel/item')[:int(cfg.get('max_posts', 12))]:
            source = item.findtext('{http://purl.org/rss/1.0/modules/content/}encoded') or item.findtext('description') or ''
            posts.append({
                'title': html.unescape((item.findtext('title') or '').strip()),
                'url': (item.findtext('link') or '').strip(),
                'date': (item.findtext('pubDate') or '').strip(),
                'excerpt': excerpt_from(source),
            })
        payload = {'generated_at': datetime.datetime.now(datetime.timezone.utc).isoformat(), 'rss_url': cfg['rss_url'], 'posts': posts}
    homepage = ROOT / 'index.html'
    source = homepage.read_text()
    if source.count(START) != 1 or source.count(END) != 1:
        raise ValueError('Homepage post markers missing or duplicated; no files changed.')
    rows = render_posts(payload['posts'])
    updated = re.sub(re.escape(START) + r'.*?' + re.escape(END), lambda _: START + '\n' + rows + '\n            ' + END, source, flags=re.S)
    if not args.cached:
        OUT.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + '\n')
    homepage.write_text(updated)
    print('Updated the homepage writing links from the saved feed.')

if __name__ == '__main__':
    main()
