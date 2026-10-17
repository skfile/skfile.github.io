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
from urllib.error import HTTPError
from urllib.request import Request, urlopen
from xml.etree import ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
START, END = '<!-- POSTS:START -->', '<!-- POSTS:END -->'

def fetch_feed(url):
    request = Request(url, headers={
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8',
    })
    try:
        with urlopen(request, timeout=30) as response:
            return response.read()
    except HTTPError as error:
        if error.code != 403:
            raise
        return fetch_feed_in_browser(url)


def fetch_feed_in_browser(url):
    """Read the public RSS document with an ordinary browser when required."""
    from playwright.sync_api import sync_playwright
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(channel='chrome', headless=False)
        try:
            page = browser.new_page()
            with page.expect_response(lambda response: response.url == url and response.status == 200,
                                      timeout=45000) as response:
                page.goto(url, wait_until='domcontentloaded', timeout=45000)
            return response.value.body()
        finally:
            browser.close()


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

def update_site(payload, cached=False):
    """Validate before writing; unchanged feeds must not create hourly commits."""
    homepage = ROOT / 'index.html'
    out = ROOT / 'assets/data/substack_posts.json'
    sitemap = ROOT / 'sitemap.xml'
    source = homepage.read_text()
    if source.count(START) != 1 or source.count(END) != 1 or source.index(START) > source.index(END):
        raise ValueError('Homepage post markers missing, duplicated, or out of order; no files changed.')
    rows = render_posts(payload['posts'])
    updated = re.sub(re.escape(START) + r'.*?' + re.escape(END), lambda _: START + '\n' + rows + '\n            ' + END, source, flags=re.S)
    changed = False
    if not cached:
        previous = json.loads(out.read_text()) if out.exists() else {}
        if any(previous.get(key) != payload.get(key) for key in ('rss_url', 'posts')):
            out.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + '\n')
            changed = True
    if source != updated:
        homepage.write_text(updated)
        if sitemap.exists():
            today = datetime.datetime.now(datetime.timezone.utc).date().isoformat()
            sitemap.write_text(re.sub(r'<lastmod>[^<]+</lastmod>', f'<lastmod>{today}</lastmod>', sitemap.read_text()))
        changed = True
    return changed

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--cached', action='store_true')
    args = parser.parse_args()
    if args.cached:
        payload = json.loads((ROOT / 'assets/data/substack_posts.json').read_text())
    else:
        cfg = json.loads((ROOT / 'substack.json').read_text())
        feed = ET.fromstring(fetch_feed(cfg['rss_url']))
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
    changed = update_site(payload, cached=args.cached)
    print('Updated Substack posts.' if changed else 'Substack posts are unchanged; no files written.')

if __name__ == '__main__':
    main()
