/* ═══════════════════════════════════════════════════════════════
   SITE CONFIG — Edit this ONE file to personalise your website.
   Everything (header, social icons, email button, structured
   data, hero section) updates automatically across all pages.

   See FILL-IN-GUIDE.md for a step-by-step walkthrough.
   ═══════════════════════════════════════════════════════════════ */

const SITE = {

  /* ── Identity ───────────────────────────────────────────── */
  name:           "Savik Kinger",
  jobTitle:       "PhD Student",
  university:     "Yale University",
  yearInProgram:  "2nd-year",
  department:     "CS",

  /* ── Site URL ───────────────────────────────────────────── */
  siteUrl:        "https://skfile.github.io",

  /* ── Contact ────────────────────────────────────────────── */
  email: {
    user:   "savik.kinger",
    domain: "yale",
    tld:    "edu",
  },

  /* ── Social (leave blank to hide that icon) ─────────────── */
  github:    "https://github.com/skfile",
  twitter:   "https://x.com/savik_k_",
  bluesky:   "https://bsky.app/profile/savik-k.bsky.social",
  linkedin:  "https://linkedin.com/in/savikkinger",
  scholar:   "", // e.g. "https://scholar.google.com/citations?user=xxxx"
  substack:  "https://mindmesh.substack.com",

  /* ── Avatar (optional — leave blank to hide) ────────── */
  avatar:    "",   // e.g. "assets/img/avatar.jpg"

  /* ── Homepage ───────────────────────────────────────────── */
  heroTagline: "I study how intelligent systems organize computation over time — especially when influence is distributed across lags.",
  keywords:    "multi-lag dynamics · causal direction · representation geometry/topology",
  aboutBio:    "I'm interested in the temporal structure of learned and biological systems. My work focuses on building identifiable models for multi-lag dependencies and understanding when causal direction can be reliably recovered from time series. I also explore how manifold geometry and persistent homology can serve as diagnostics for representations.",

  /* ── SEO (JS also updates <title> and meta tags from above) */
  metaDescription: "Vik is a CS PhD student at Columbia University working on multi-lag dynamics, causal direction in time series, and representation geometry/topology.",

  /* ── Research entries ───────────────────────────────────── */
  /* Each entry: { title, blurb, image (optional), link (optional), keywords [] } */
  research: [
    {
      title:    "Multi-lag dynamics",
      blurb:    "Finite-history models to separate fast and slow pathways in neural/learned systems.",
      image:    "",
      link:     "",
      keywords: ["dynamics", "multi-lag", "effective coupling"],
    },
    {
      title:    "Causal direction in time series",
      blurb:    "Directionality beyond correlation, with explicit identifiability + bias/variance framing.",
      image:    "",
      link:     "",
      keywords: ["causal", "identifiability", "robustness"],
    },
    {
      title:    "Geometry & topology",
      blurb:    "Manifold structure and topological signatures as diagnostics for representations and dynamics.",
      image:    "",
      link:     "",
      keywords: ["manifolds", "PH", "stability"],
    },
  ],

  /* ── Project entries ────────────────────────────────────── */
  /* Same structure as research */
  projects: [
    // {
    //   title:    "(Project name)",
    //   blurb:    "What it does in one line.",
    //   image:    "",
    //   link:     "",
    //   keywords: ["research prototypes", "systems"],
    // },
    // {
    //   title:    "(Another project)",
    //   blurb:    "One-line description.",
    //   image:    "",
    //   link:     "",
    //   keywords: ["analysis", "tools"],
    // },
  ],

};
