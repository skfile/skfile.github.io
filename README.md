# Savik Kinger — personal website

A static, single-page website hosted on GitHub Pages at https://skfile.github.io.
The frontend needs no packages, external fonts, or client-side content fetches.

## Replace your profile photo

The homepage loads **`assets/img/profile.jpeg`** directly. A placeholder JPEG is already at that path.

1. Save your photo as `profile.jpeg` (a real JPEG; use lowercase and exactly this extension).
2. Replace `assets/img/profile.jpeg` with your photo. Do not change `index.html`.
3. Commit and push the replacement to `master`. The existing **Publish website** workflow deploys it automatically.
4. Refresh the website after deployment. If an old image remains cached, hard-refresh once.

A portrait-oriented photo with your face near the center works best. The website crops it to fit on desktop and mobile. About 800–1200 pixels tall is sufficient; keeping it below 1 MB makes the page faster.

You can also upload it directly on GitHub: open [assets/img](https://github.com/skfile/skfile.github.io/tree/master/assets/img), choose **Add file → Upload files**, upload `profile.jpeg` to replace the existing file, and commit to `master`.

The mockup gallery's **Try your photo** control only previews a photo in that browser. Replacing the actual JPEG above is what updates the published website.

## Editing

- `index.html` is the source of truth for the bio, research, projects, writing, social links, and metadata.
- `assets/css/styles.css` contains the approved Minimal layout and responsive styling.
- `assets/js/main.js` opens deep-linked sections and supplies a fallback if the portrait is missing.
- The photo and bio are always visible. Selected research starts open with four paper titles. Each paper, Projects, and Writing starts collapsed using native `<details>` elements.
- Core content and dropdowns work without JavaScript. No external fonts or UI packages are needed.

Featured projects: Aver (early demo) and Neural Trajectory Explorer. The Google Scholar icon/profile link targets `ERmD9kgAAAAJ`.

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

GitHub Actions checks the feed through **Refresh Substack** every hour (at minute 17 UTC), or manually through **Actions → Refresh Substack → Run workflow**. Successful refreshes commit changed post data and homepage links, then invoke **Publish website** to deploy. Unchanged feeds preserve the cache timestamp and create no commits. The sitemap date changes when visible post links change.

**Current upstream limitation (2026-10-17):** Substack returns a Cloudflare browser-verification page to GitHub-hosted runners. Linux, macOS, alternative HTTP clients, the public archive, and a Chrome session were tested without success. Scheduled refreshes therefore currently fail safely; automatic synchronization is not yet operational. A permitted feed source or another hosting environment is needed. Local refresh still works.

**Publish website** also runs independently on pushes to `master` and on manual dispatch. A Substack outage cannot block ordinary website deployment. A failed scheduled fetch leaves the saved posts and live website untouched. GitHub schedules can be delayed; public-repository schedules may also be disabled after 60 days without repository activity.

Run the refresh regression checks with `python3 -m unittest discover -s scripts -p 'test_*.py'`.

## Navigation and sharing

`/#about` scrolls to the visible biography. `/#research`, `/#projects`, and `/#writing` open the corresponding section. `/#positional-coupling` also opens the new paper’s details. Old `/research/`, `/projects/`, and `/writing/` URLs redirect to the homepage section. `404.html` uses absolute asset paths so nested missing URLs render correctly. The sitemap lists the canonical homepage only.

Metadata is static. The old placeholder social-sharing image is no longer referenced. Styles and script URLs carry a revision query to prevent visitors from receiving the previous design's cached assets; update it when changing those files.

## Assets

Social icons were carried over from the existing site. The email and chevron icons are from Bootstrap Icons v1.13.1, licensed under MIT; see `assets/img/icons/bootstrap-LICENSE.txt`. No external icon service is needed at runtime.

Older website versions remain in `archive/`.

## Analytics

The homepage loads the asynchronous Google tag for GA4 measurement ID `G-K04K6WJ9R9`. Its single `config` call enables the automatic page-view event. All four content sections live on this page; legacy redirect pages do not load a second tag. The tag is in `index.html`, following [Google’s installation instructions](https://developers.google.com/tag-platform/gtagjs). Verify incoming visits in the property’s Realtime report.

Research contains four papers, including the NeurIPS 2026 paper, each with a summary, figure, and reading link inside its dropdown. The NeurIPS paper uses a local camera-ready PDF in `assets/papers/`; its Figure 1 is in `assets/img/research/`. Google Scholar appears below the paper list. Image provenance is recorded in `assets/img/SOURCES.md`.

## Search and delivery

- The homepage has an explicit canonical URL, a research-specific title/description, ProfilePage/Person JSON-LD, and Open Graph/Twitter metadata with a 1200 × 630 sharing image.
- `robots.txt` allows crawling and points to the single canonical URL in `sitemap.xml`. Error pages are noindex, and legacy section URLs redirect to the homepage sections.
- Content is available in the initial HTML, including the collapsed native details. Images have alt text and reserved dimensions. Research/project thumbnails load lazily; full-resolution figures remain separate links.
- The footer uses a restrained divider and follows the collapsible sections.
- `_config.yml` excludes the local `mockups` gallery, archived websites, and maintenance files from the GitHub Pages build. Pages uses GitHub Actions publishing through `.github/workflows/publish.yml`, building the master branch root with Jekyll. Keep these exclusions in any future custom publishing workflow.
- After publishing, submit `https://skfile.github.io/sitemap.xml` in Google Search Console and inspect the homepage. Search indexing and real-user performance require the live deployment; local checks cannot verify them. See `seo-qa.md` for this review’s evidence and limits.
