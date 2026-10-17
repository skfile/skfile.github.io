# Content editing guide

All site copy and social destinations now live directly in `index.html`.

1. Edit the introduction in `<p class="introduction">`.
2. Edit the content inside the four `<details>` sections: `about`, `research`, `projects`, and `writing`.
3. Add or revise project `<article>` elements inside `.project-list`. Use a brief description and a descriptive link. Aver is labeled as an early demo; its repository is private, so the site links to the public walkthrough.
4. Update social link destinations inside `.socials`. Keep each icon's accessible label and title. The Scholar destination links to the direct profile.
5. Update the static title, description, social metadata, and structured data in `<head>` when changing identity or site positioning.
6. Run `python3 scripts/fetch_substack.py` locally to refresh Writing, then publish the changed files. It updates the JSON, the `POSTS:START` / `POSTS:END` block, and the sitemap date when visible links change. Do not remove those markers. An hourly **Refresh Substack** workflow is configured, but currently blocked by Substack's browser verification on GitHub's servers; see README.md. The independent **Publish website** workflow still deploys normal pushes.
7. Preview locally using the command in README.md, then publish the changed files through the repository's existing GitHub Pages setup.

The page works without JavaScript. JavaScript only enhances opening animation and section deep links; keep core content in HTML.

Research and project entries use `.work-item`, with text in `.work-copy` and an image in `.work-visual`. Keep image width/height attributes accurate, write descriptive alt text, and retain the original figure's proportions. Research figures link to their full-size assets; captions link to the source figure. Record new image sources in `assets/img/SOURCES.md`.
