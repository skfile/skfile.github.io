# Personal Academic Site

Minimal, config-driven personal website for research, projects, and writing.
Hosted on GitHub Pages at [skfile.github.io](https://skfile.github.io).

## Architecture

All personal data lives in **one file**: `assets/js/site-config.js`.
The JS engine (`assets/js/main.js`) reads it at page load and updates:

- Header brand name and social icon links (hidden when URL is blank)
- Homepage hero (name, tagline, about bio, obfuscated email)
- Research and Projects pages (rendered from config arrays)
- SEO: canonical URLs, OG/Twitter meta, LD+JSON (Person, WebSite, BreadcrumbList)

## Pages

| Page     | Path         | Content source                              |
| -------- | ------------ | ------------------------------------------- |
| Home     | `/`          | site-config.js (hero, bio, email)           |
| Research | `/research/` | `SITE.research` array                       |
| Projects | `/projects/` | `SITE.projects` array                       |
| Writing  | `/writing/`  | Manual featured section + auto Substack posts |
| 404      | `/404.html`  | Static                                      |

## Quick start

1. Edit `assets/js/site-config.js` with your name, socials, research, and projects.
2. Find-and-replace **Vik** with your name in every `.html` title and OG/Twitter meta tags.
3. Find-and-replace **skfile.github.io** with your domain in `.html`, `robots.txt`, `sitemap.xml`.
4. Replace `assets/img/og-card.png` and `assets/img/favicon.svg`.
5. Push to GitHub.

See **FILL-IN-GUIDE.md** for a detailed walkthrough.

## Features

- **Dark mode** — auto-detects system preference; toggle persists via localStorage
- **Scroll-reveal animations** — entries fade in as you scroll; honours `prefers-reduced-motion`
- **Optional avatar** — set `avatar` in site-config.js to show a profile photo in the hero
- **Config-driven** — one JS file powers all pages; leave a field blank and it hides

## Social icons

Supported: GitHub, X (Twitter), Bluesky, LinkedIn, Google Scholar, Substack.
Leave any URL blank in `site-config.js` and the corresponding icon auto-hides.

## Substack integration

`substack.json` defines the RSS feed URL. Fetch posts locally:

```bash
python3 scripts/fetch_substack.py
```

Output goes to `assets/data/substack_posts.json`. The Writing page loads
them automatically. You can set up a GitHub Action to auto-refresh daily
(see FILL-IN-GUIDE.md).

## SEO notes

- Static `<head>` tags are what crawlers read (Twitter, Facebook, Google do not run JS).
- The JS runtime updates meta at load time as a safety net for in-browser display.
- `robots.txt` and `sitemap.xml` must contain your real domain.
- Structured data injected at runtime: Person (sameAs, knowsAbout), WebSite, BreadcrumbList.

## Mobile

Responsive at 720 px with hamburger menu. Additional scaling at 480 px.

## Local preview

```bash
python3 -m http.server 8000
```

Open <http://localhost:8000>.
