# Fill-In Guide

Everything you need to personalise this site, in order of priority.

---

## Step 1 — `assets/js/site-config.js` (one file, everything updates)

Open this file and fill in each field. The JS automatically propagates your info
to headers, social icons, hero section, email line, and structured data on
**every page**.

| Field | What it does | Example |
|---|---|---|
| `name` | Display name (header, hero h1, titles, LD+JSON) | `"Vik"` |
| `jobTitle` | Role shown in structured data | `"PhD Student"` |
| `university` | Affiliation (hero tagline + LD+JSON) | `"Columbia University"` |
| `yearInProgram` | Prefix for hero tagline | `"2nd-year"` |
| `department` | Prefix for hero tagline | `"CS"` |
| `siteUrl` | Updates canonical URLs, OG images, LD+JSON | `"https://skfile.github.io"` |
| `email.user` | Part before `@` | `"vik"` |
| `email.domain` | Part between `@` and last `.` | `"columbia"` |
| `email.tld` | Part after last `.` | `"edu"` |
| `github` | Full GitHub profile URL (blank = icon hidden) | `"https://github.com/skfile"` |
| `twitter` | Full X/Twitter URL (blank = icon hidden) | `"https://x.com/handle"` |
| `bluesky` | Full Bluesky URL (blank = icon hidden) | `"https://bsky.app/profile/handle.bsky.social"` |
| `linkedin` | Full LinkedIn URL (blank = icon hidden) | `"https://linkedin.com/in/username"` |
| `scholar` | Google Scholar profile URL (blank = icon hidden) | `"https://scholar.google.com/citations?user=ID"` |
| `substack` | Full Substack URL — **already set** | `"https://mindmesh.substack.com"` |
| `heroTagline` | 1–2 sentence research description under your name | `"I study how intelligent systems organize computation over time."` |
| `keywords` | Keyword string shown on homepage | `"multi-lag dynamics · causal direction · topology"` |
| `aboutBio` | 2–3 sentence about blurb on homepage | `"I'm a PhD student at..."` |
| `metaDescription` | Overrides the homepage meta description for SEO | `"Vik is a CS PhD student..."` |

**How it works:** When any field is blank, its corresponding UI element simply
hides (social icons, keywords line, about block, email line). Fill in a field
and it appears. No other files to touch.

### Research and Projects arrays

Research entries (`SITE.research`) and project entries (`SITE.projects`) are
arrays in the same config file. Each entry has:

| Key | Required | What it does |
|---|---|---|
| `title` | yes | Entry heading |
| `blurb` | yes | One-liner description |
| `link` | no | URL to paper / repo / demo |
| `image` | no | Path to thumbnail image |
| `keywords` | no | Array of tag strings shown below the blurb |

The Research and Projects pages render these arrays automatically —
you do **not** need to edit any HTML.

---

## Step 2 — HTML `<head>` tags (for SEO / social sharing)

JS updates these at runtime, but search-engine and social-media crawlers that
don't execute JS read the static HTML. Update these in **each** HTML file:

### `index.html`
```html
<title>YOUR NAME — Research, Projects, Writing</title>
<meta name="description" content="Your meta description."/>
<link rel="canonical" href="https://YOURDOMAIN/"/>
<meta property="og:title" content="YOUR NAME — Research, Projects, Writing"/>
<meta property="og:description" content="Your meta description."/>
<meta property="og:image" content="https://YOURDOMAIN/assets/img/og-card.png"/>
<meta name="twitter:title" content="YOUR NAME — Research, Projects, Writing"/>
<meta name="twitter:description" content="Your meta description."/>
<meta name="twitter:image" content="https://YOURDOMAIN/assets/img/og-card.png"/>
```

### `research/index.html`, `projects/index.html`, `writing/index.html`
Same pattern — just update `Vik` → your name and `vik.example` → your domain.

### `404.html`
Same pattern.

> **Shortcut:** Do a global find-and-replace across all `.html` files:
> - `Vik` → your name
> - `vik.example` → your domain (e.g. `skfile.github.io`)

---

## Step 3 — SEO files

### `robots.txt`
Replace the domain in the `Sitemap:` line with your real domain.

### `sitemap.xml`
Replace every URL with your real domain.

---

## Step 4 — Page-specific content

### Research and Projects (config-driven)

Both pages render from the `SITE.research` and `SITE.projects` arrays in
`site-config.js`. See the table above (Step 1) for the entry format.
No HTML editing needed.

### `writing/index.html`
- **Start here (manual)** — Replace the placeholder highlighted posts in the
  HTML with 2–3 handpicked posts you want to feature, with direct links.
- **Latest posts** — Auto-populated from Substack (see Step 6).

---

## Step 5 — Assets

| File | What to do |
|---|---|
| `assets/img/og-card.png` | Replace with a 1200×630 social-sharing card image |
| `assets/img/favicon.svg` | Replace with your own favicon/logo SVG |
| `assets/img/neural-bg.svg` | Optional — replace or keep the background texture |

---

## Step 6 — Substack integration

**Already configured:** `substack.json` points to `https://mindmesh.substack.com/feed`.

To refresh posts locally:
```bash
python3 scripts/fetch_substack.py
```

To auto-refresh on GitHub Pages, create `.github/workflows/substack.yml`:
```yaml
name: Fetch Substack posts
on:
  schedule:
    - cron: '0 6 * * *'   # daily at 6am UTC
  workflow_dispatch:

jobs:
  fetch:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.12'
      - run: python scripts/fetch_substack.py
      - uses: stefanzweifel/git-auto-commit-action@v5
        with:
          commit_message: 'auto: update substack posts'
          file_pattern: assets/data/substack_posts.json
```

---

## Quick-start checklist

- [ ] Fill in `assets/js/site-config.js` (all fields)
- [ ] Find-and-replace `Vik` → your name in all HTML files
- [ ] Find-and-replace `vik.example` → your domain in all HTML files
- [ ] Update `robots.txt` and `sitemap.xml` with your domain
- [ ] Add research and project entries in `site-config.js`
- [ ] Update writing featured posts in `writing/index.html`
- [ ] Replace `og-card.png` and `favicon.svg`
- [ ] (Optional) Set up the GitHub Action for auto Substack fetching
- [ ] Push and verify on your live site
