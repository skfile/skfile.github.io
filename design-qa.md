# Website design QA

final result: passed

## Evidence

- Source visual: `/Users/skinger/.codex/generated_images/01a086af-671c-7522-a92b-2d328e02bada/exec-8816f713-56ec-4a79-80b5-562d8f3e7558.png` (1374 × 1145 pixels).
- Implementation: `http://127.0.0.1:8000/`.
- Desktop capture: `/tmp/cvwebsite-preview/desktop-writing.png`.
- Mobile captures: `/tmp/cvwebsite-preview/mobile-closed.png`, `/tmp/cvwebsite-preview/mobile-writing.png`.
- Desktop CSS viewport: 1374 × 1145, devicePixelRatio 1, only Writing expanded, scroll position 0. The browser capture exports 1359 × 1133 pixels; this small capture scaling/cropping difference was treated as capture behavior, not layout drift.
- Mobile CSS viewport: 390 × 844, also checked at 320 × 740. Scrollbars reserve 15 pixels in this browser. Mobile writing capture is 375 × 812; the page was scrolled to inspect the entire article list.
- Source and final desktop screenshot were viewed together in one comparison input. Mobile open/closed states were separately inspected. Text content and actual DOM dimensions were checked alongside screenshots because the browser's desktop capture softens small text. Mobile writing provides a readable focused view of links and dates.

## Comparison history

1. Initial desktop implementation had an overly wide reading column and extra vertical space above the introduction. Narrowed content from 944 to 900 pixels, reduced two profile gaps by 10 pixels each, and adjusted body/date sizes to match the target hierarchy.
2. An initial full-page screenshot expanded native details and stitched duplicated content. Discarded that capture, reloaded the page, restored the reference viewport, opened only Writing, and captured the viewport instead. DOM verification confirmed one h1 and only Writing open.
3. Mobile dropdown opening initially introduced a scrollbar and reflowed the introduction. Added a stable scrollbar gutter. Post-fix measurement: page width 375 pixels and introduction height 160 pixels both before and after opening Writing.
4. Final source/implementation comparison and final mobile captures show no actionable P0/P1/P2 issues.

## Required fidelity surfaces

- Typography: serif name and section headings, sans-serif body and links; readable body sizes, no truncation. Georgia is a local-font approximation of the reference serif. Minor platform font-rendering differences are P3.
- Spacing: centered 900-pixel reading column, restrained rules, four ordered dropdowns, generous whitespace. Mobile uses one column with dates beneath article titles. No horizontal overflow at 390 or 320 pixels.
- Colors: white background, near-black headings, muted gray supporting text, blue underlined links. No cards, gradients, animated background, or shadows in the page layout.
- Assets: seven local social/contact icons load successfully. Existing site SVGs were reused; email/chevron use licensed Bootstrap assets. Supplied Scholar/LinkedIn/Substack glyphs differ slightly from image-generated shapes intentionally; real existing icons are preferred to tracing the mockup.
- Copy: requested introduction retained verbatim; About me now describes NeuroAI and the Columbia background; plain-language research summaries; exactly two projects, Aver and Neural Trajectory Explorer. Geometric Separation and YouTube analyzer omitted. Writing intro revised and five articles refreshed from the actual feed; these are intentional content differences from the reference.

## Functional checks

- All four sections open and close independently by mouse.
- Enter opens About me; Space closes it using native summary behavior.
- Seven social links are present and all icon images load.
- Old `/research/`, `/projects/`, `/writing/` pages redirect to their correct homepage hashes, with corresponding details open. Browser cache had to be refreshed to inspect changed legacy pages.
- Browser console: no errors or warnings after interactions.
- Static content and native details provide a no-JavaScript fallback by construction; browser JavaScript disabling was not separately tested.
- Reduced motion is respected in CSS and the animation's matchMedia guard; OS preference switching was not separately tested.
- JavaScript syntax, feed HTML escaping, unsafe URL rejection, semantic dates, local asset references, and `git diff --check` passed.
- Live Substack refresh succeeded and static links match the saved feed.

## Remaining notes

- Google Scholar now links directly to the user-provided profile `ERmD9kgAAAAJ`.
- Aver links to its public testing walkthrough and is labeled Early demo.
- Not deployed or pushed. The existing `.DS_Store` modification was left alone.


## September 9 research and project update

final result: passed

- Added all three requested 2026 arXiv preprints with supplied author lists, plain-language blurbs, PDF links, and the original Figure 1 from each paper. Source figure anchors were verified against the arXiv HTML; provenance and CC BY 4.0 attribution are recorded in `assets/img/SOURCES.md`.
- About me now states current PhD work in NeuroAI combining causal inference, manifold learning, and theoretical neuroscience; the generative-model research question; and undergraduate computer science/pure mathematics at Columbia with research on manifold inference.
- Project imagery uses Aver’s own preview artwork and a cropped screenshot detail from the existing traceDashboard retinal manifold visualization. No synthetic data or redrawn scientific diagrams.
- Desktop screenshots: `/tmp/cvwebsite-preview/research-desktop.png`, `/tmp/cvwebsite-preview/projects-desktop.png`. Mobile screenshots: `/tmp/cvwebsite-preview/research-mobile.png`, `/tmp/cvwebsite-preview/projects-mobile.png`.
- Visually inspected desktop (1374 × 1145) and mobile (390 × 844). Text/figure columns stack on mobile; intrinsic proportions are preserved. No horizontal overflow at 390 or 320 pixels. Figures remain detailed scientific thumbnails; full-size links provide legibility for their labels.
- All five new images loaded after their native dropdowns opened. Clicking the first figure opened its correct 1466-pixel-wide image. All local PNG dimensions and alt text validated; exactly three paper entries and two project entries; no duplicate IDs.
- Direct Scholar destination checked in the browser. Native dropdown and hash behavior remains intact. No new runtime dependencies.
- This update intentionally extends the selected text-first design with the requested media rows. Header, typography, colors, four-section order, and opening animation remain consistent with the approved direction.
- Browser console after the new content and interactions: no errors or warnings.
- Compared the original selected visual and `/tmp/cvwebsite-preview/updated-design-comparison.png` together. The comparison capture has a small vertical scroll offset from navigating to Writing; it is not a spacing change. The existing type, width, rules, and icon treatment remain consistent with the previously verified implementation.

## Final footer and copy polish

- Added a restrained footer with © 2026 Savik Kinger and a working mailto “Get in touch” link.
- Updated About me to “I’m a PhD student in NeuroAI at Yale” and renamed the writing introduction link to “Substack,” preserving its destination.
- Verified the final copy and link destination in the browser DOM; visually checked the footer at desktop 1374 × 1145 and mobile 390 × 844. No horizontal overflow. Temporary viewport override reset.
- The old preview tab stalled during debugger synchronization; a fresh preview successfully displayed the completed page.
- `git diff --check` passed. Final files remain local, ready for publication.

## Responsive and SEO finishing pass

Footer separation increased to a minimum 96 pixels on desktop and 72 pixels on mobile; the flex page layout also pushes it toward the viewport bottom on short pages. Desktop 1440, tablet 768, and mobile 390/320 widths passed overflow checks with all sections expanded. WebP thumbnails, search metadata, profile schema, sharing artwork, and Pages archive exclusions added. See `seo-qa.md` for evidence and post-publication checks.
