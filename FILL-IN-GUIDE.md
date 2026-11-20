# Content editing guide

## Replace the photo

Replace **`assets/img/profile.jpeg`** with your own JPEG using exactly the same filename. Commit and push it to `master`; the existing GitHub Pages workflow publishes it. No HTML changes are needed. If replacing through GitHub, open `assets/img`, choose **Add file → Upload files**, and upload `profile.jpeg` there.

Use a centered portrait around 800–1200 pixels tall. The layout crops it automatically. Refresh after deployment (hard-refresh once if the old image remains cached). A fallback SVG is available if the JPEG is missing or cannot load.

## Edit the page

All site text lives in `index.html`.

1. The visible introduction and biography are in `<section class="intro" id="about">`. Keep the current PhD sentence, previous studies, and research question together in one paragraph.
2. Research papers are grouped into Neuroscience, Theory, and Interpretability using `.research-group` sections inside `#research`. Each paper is a `<details class="paper-disclosure">` entry. Edit the title in `<summary><h4>`, and the authors, venue, description, links, and figure in `.disclosure-body`. Keep new entries collapsed by omitting `open`.
3. Keep the Google Scholar link after the paper list.
4. Projects and Writing are closed `<details class="section-disclosure">` sections. Aver remains labeled as an early demo.
5. Update social link destinations inside `.socials` and preserve their visible names.
6. Keep exactly one `POSTS:START` / `POSTS:END` marker pair around the writing list. `python3 scripts/fetch_substack.py --cached` renders saved posts; omit `--cached` to fetch new ones. See README for the current upstream feed limitation.
7. Preserve the title, metadata, structured data, and analytics in `<head>`. Update the CSS/JS revision suffix when changing those assets.
8. Preview with `python3 -m http.server 8765 --bind 127.0.0.1`, then commit and push only intended production files.

The local `mockups/` gallery is excluded from publication. The NeurIPS camera-ready PDF lives at `assets/papers/reading-positional-coupling.pdf`, and its supplied Figure 1 is in `assets/img/research/`. Keep figures at their original proportions, give images descriptive alt text, and record new image sources in `assets/img/SOURCES.md`.
