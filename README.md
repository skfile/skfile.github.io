# Savik Kinger — personal website

A static, single-page website hosted on GitHub Pages at https://skfile.github.io.
No packages, build step, external fonts, or client-side content fetches are required.

## Editing

- `index.html` is the source of truth for identity, introduction, dropdown copy, projects, social links, and metadata.
- `assets/css/styles.css` contains the responsive layout and typography.
- `assets/js/main.js` adds a short opening animation and opens deep-linked sections.
- Native `<details>` elements handle mouse, keyboard, and no-JavaScript access. All four sections start closed, and each can be opened independently.
- The former `site-config.js` renderer has been removed so the visible content and crawler-visible HTML cannot drift apart.

Sections: About me, Research, Projects, Writing. Featured projects: Aver (early demo) and Neural Trajectory Explorer.

The Google Scholar icon links directly to profile `ERmD9kgAAAAJ`.

## Preview

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open http://127.0.0.1:8000. GitHub Pages serves these same files directly.

## Writing

```sh
python3 scripts/fetch_substack.py
```

Fetches the public feed configured in `substack.json`, updates `assets/data/substack_posts.json`, and renders five article links into the marked block in `index.html`. Publish both changed files together. Feed failures leave the existing page untouched. Posts are served as HTML; there is no loading spinner or runtime feed dependency.

To render the existing saved feed without network access:

```sh
python3 scripts/fetch_substack.py --cached
```

There is no scheduled feed refresh configured. Run the command when updating the site.

## Navigation and sharing

`/#about`, `/#research`, `/#projects`, and `/#writing` open the corresponding section. Old `/research/`, `/projects/`, and `/writing/` URLs redirect to the homepage section. `404.html` uses absolute asset paths so nested missing URLs render correctly. The sitemap lists the canonical homepage only.

Metadata is static. The old placeholder social-sharing image is no longer referenced. Styles and script URLs carry a revision query to prevent visitors from receiving the previous design's cached assets; update it when changing those files.

## Assets

Social icons were carried over from the existing site. The email and chevron icons are from Bootstrap Icons v1.13.1, licensed under MIT; see `assets/img/icons/bootstrap-LICENSE.txt`. No external icon service is needed at runtime.

Older website versions remain in `archive/`.

## Analytics

The homepage loads the asynchronous Google tag for GA4 measurement ID `G-K04K6WJ9R9`. Its single `config` call enables the automatic page-view event. All four content sections live on this page; legacy redirect pages do not load a second tag. The tag is in `index.html`, following [Google’s installation instructions](https://developers.google.com/tag-platform/gtagjs). Verify incoming visits in the property’s Realtime report.

Research contains three 2026 arXiv preprints, each with its original overview figure and links to the paper and full-size image. Research and project images sit beside their descriptions on desktop and stack below them on mobile. Image provenance is recorded in `assets/img/SOURCES.md`.

## Search and delivery

- The homepage has an explicit canonical URL, a research-specific title/description, ProfilePage/Person JSON-LD, and Open Graph/Twitter metadata with a 1200 × 630 sharing image.
- `robots.txt` allows crawling and points to the single canonical URL in `sitemap.xml`. Error pages are noindex, and legacy section URLs redirect to the homepage sections.
- Content is available in the initial HTML, including the collapsed native details. Images have alt text and reserved dimensions; five lazy-loaded WebP thumbnails total about 221 KB. Full-resolution research figures remain separate links.
- The footer keeps a minimum 96-pixel content gap on desktop and 72 pixels on mobile, and moves toward the viewport bottom when the page is short.
- `_config.yml` excludes archived websites and maintenance files from the GitHub Pages build. Pages was verified to build from the master branch root using its legacy/Jekyll pipeline. Keep these exclusions in any future custom publishing workflow.
- After publishing, submit `https://skfile.github.io/sitemap.xml` in Google Search Console and inspect the homepage. Search indexing and real-user performance require the live deployment; local checks cannot verify them. See `seo-qa.md` for this review’s evidence and limits.
