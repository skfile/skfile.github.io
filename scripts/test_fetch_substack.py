import copy
import datetime
import io
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch
from urllib.error import HTTPError, URLError

import fetch_substack as feed


class FeedRefreshTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.root_patch = patch.object(feed, 'ROOT', self.root)
        self.root_patch.start()
        self.addCleanup(self.root_patch.stop)
        (self.root / 'assets/data').mkdir(parents=True)
        (self.root / 'index.html').write_text(
            '<main>Keep my biography\n' + feed.START + '\nold posts\n            ' + feed.END + '\n</main>')
        (self.root / 'sitemap.xml').write_text('<url><lastmod>2020-01-01</lastmod></url>')
        (self.root / 'substack.json').write_text(json.dumps({'rss_url': 'https://example.substack.com/feed'}))
        self.payload = {
            'generated_at': '2026-10-01T00:00:00+00:00',
            'rss_url': 'https://example.substack.com/feed',
            'posts': [{'title': 'New & interesting', 'url': 'https://example.substack.com/p/new',
                       'date': 'Thu, 15 Oct 2026 05:58:49 GMT', 'excerpt': 'A new post.'}],
        }

    def snapshot(self):
        return {str(p.relative_to(self.root)): p.read_bytes() for p in self.root.rglob('*') if p.is_file()}

    def test_new_post_updates_html_cache_and_sitemap(self):
        self.assertTrue(feed.update_site(self.payload))
        page = (self.root / 'index.html').read_text()
        self.assertIn('Keep my biography', page)
        self.assertIn('New &amp; interesting', page)
        self.assertIn('datetime="2026-10-15"', page)
        self.assertEqual(json.loads((self.root / 'assets/data/substack_posts.json').read_text()), self.payload)
        self.assertIn(datetime.datetime.now(datetime.timezone.utc).date().isoformat(),
                      (self.root / 'sitemap.xml').read_text())

    def test_unchanged_feed_does_not_rewrite_files_or_timestamp(self):
        feed.update_site(self.payload)
        before = self.snapshot()
        later = copy.deepcopy(self.payload)
        later['generated_at'] = '2026-10-17T10:00:00+00:00'
        self.assertFalse(feed.update_site(later))
        self.assertEqual(before, self.snapshot())

    def test_revised_post_updates_existing_entry(self):
        feed.update_site(self.payload)
        revised = copy.deepcopy(self.payload)
        revised['posts'][0]['title'] = 'Revised title'
        self.assertTrue(feed.update_site(revised))
        self.assertIn('Revised title', (self.root / 'index.html').read_text())

    def test_invalid_feed_or_markers_leave_existing_files_untouched(self):
        feed.update_site(self.payload)
        empty = {**self.payload, 'posts': []}
        before = self.snapshot()
        with self.assertRaises(ValueError):
            feed.update_site(empty)
        self.assertEqual(before, self.snapshot())
        (self.root / 'index.html').write_text(feed.END + feed.START)
        before = self.snapshot()
        with self.assertRaises(ValueError):
            feed.update_site(self.payload)
        self.assertEqual(before, self.snapshot())

    def test_network_and_malformed_xml_fail_without_changes(self):
        feed.update_site(self.payload)
        before = self.snapshot()
        with patch('sys.argv', ['fetch_substack.py']), patch.object(feed, 'urlopen', side_effect=URLError('offline')):
            with self.assertRaises(URLError):
                feed.main()
        with patch('sys.argv', ['fetch_substack.py']), patch.object(feed, 'urlopen', return_value=io.BytesIO(b'<broken')):
            with self.assertRaises(feed.ET.ParseError):
                feed.main()
        self.assertEqual(before, self.snapshot())

    def test_only_five_safe_escaped_links_are_rendered(self):
        posts = [{'title': 'Unsafe', 'url': 'javascript:alert(1)'}]
        posts += [{'title': '<script>Title</script>', 'url': f'https://example.com/{i}?a=1&b=2'} for i in range(7)]
        rows = feed.render_posts(posts)
        self.assertEqual(rows.count('<li '), 5)
        self.assertNotIn('javascript:', rows)
        self.assertNotIn('<script>', rows)
        self.assertIn('&lt;script&gt;', rows)
        self.assertIn('a=1&amp;b=2', rows)

    def test_rss_403_uses_browser_for_same_public_feed(self):
        url = self.payload['rss_url']
        with patch.object(feed, 'urlopen', side_effect=HTTPError(url, 403, 'Forbidden', {}, None)), \
                patch.object(feed, 'fetch_feed_in_browser', return_value=b'<rss />') as browser:
            self.assertEqual(feed.fetch_feed(url), b'<rss />')
        browser.assert_called_once_with(url)


if __name__ == '__main__':
    unittest.main()
