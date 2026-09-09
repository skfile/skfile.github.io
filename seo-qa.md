# Responsive layout and technical SEO review

Reviewed September 9, 2026. Local implementation checks passed. Not deployed.

## Layout and accessibility

- Desktop: 1440 × 1100. Footer gap measured 241.6 pixels with all sections closed and 96 pixels with all sections expanded. The footer is in normal flow and never overlays content.
- Tablet: 768 × 1024. Inspected the research rows; images and copy fit the side-by-side layout.
- Mobile: 390 × 844 and 320 × 740. All four sections expanded, no horizontal overflow. Images stack; footer gap is 72 pixels, plus the section’s existing internal padding.
- Visually reviewed desktop closed state, tablet research, mobile research, and the mobile footer below Writing. Captures: `/tmp/cvwebsite-preview/seo-desktop.png`, `/tmp/cvwebsite-preview/seo-mobile-footer.png`.
- All five new WebP thumbnails loaded. Source proportions and HTML aspect ratios were validated. Descriptive alt text, link labels, keyboard focus styles, native disclosure behavior, and reduced-motion support remain intact.
- Browser console: no warnings or errors. No new external fonts, libraries, trackers, or runtime fetches.

## Metadata and indexing

- Search title: Savik Kinger — NeuroAI research, projects, and writing.
- Meta description: 161 characters, accurate to the visible NeuroAI/Yale research biography.
- One absolute canonical URL: https://skfile.github.io/. Query-string previews resolve to that same canonical.
- One h1; unique element IDs; appropriate English language and responsive viewport declarations.
- ProfilePage/Person JSON-LD parses correctly; mainEntity points to the stable Person ID. Affiliation, background, interests, and verified social destinations match visible content. No invented ratings, credentials, or keyword meta tags.
- Open Graph and Twitter large-image previews include matching absolute image URLs, dimensions, type, and alternative text. The actual local sharing image is 1200 × 630.
- Sitemap XML parses and contains only the canonical homepage. robots.txt permits crawling and references that sitemap. Homepage has no noindex; 404 does.
- All three legacy section redirects and their canonicals verified in source. Core content and links are served directly in HTML without JavaScript content injection.
- GitHub API confirmed Pages `build_type: legacy`, source `master`, path `/`. Added valid `_config.yml` exclusions for archived sites and maintenance files. Historical files remain in git; the next Pages build should omit them. No deploy or production build was performed in this review.

## Performance

- WebP thumbnails reduced the five image downloads from 2,563,060 to 221,060 bytes (91.4%). Full-resolution research PNGs remain available on request.
- Images retain lazy loading, asynchronous decoding, and explicit dimensions to reduce unnecessary requests and layout shifts. The introductory content uses local fonts and no large hero image.
- Static HTML, CSS, and the small deferred script remain dependency-free at runtime.
- Asset existence, aspect ratios, metadata, schema references, redirects, sitemap, YAML syntax, and `git diff --check` passed.
- No Lighthouse score or field Core Web Vitals claim is made: those were not measured against a production deployment.

## After publication

Verify the deployed homepage and sharing image, confirm old `/archive/` pages return 404, run Google’s Rich Results Test, submit the sitemap in Search Console, and request homepage indexing. Search Console ownership is account-specific and has not been set up or changed here. Google decides when to crawl/index and how to display the site.

## Guidance checked

- [Google: ProfilePage structured data](https://developers.google.com/search/docs/appearance/structured-data/profile-page)
- [Google: canonical URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
- [Google: sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [GitHub Pages and Jekyll](https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/about-github-pages-and-jekyll)
