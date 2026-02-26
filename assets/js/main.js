(() => {
  /* ── Helpers ───────────────────────────────────────────── */
  function esc(s) {
    return String(s).replace(/[&<>"']/g, c =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  function toast(msg) {
    let el = document.getElementById('toast');
    if (!el) { el = document.createElement('div'); el.id = 'toast'; document.body.appendChild(el); }
    el.textContent = msg;
    requestAnimationFrame(() => { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; });
    clearTimeout(el._t);
    el._t = setTimeout(() => { el.style.opacity = '0'; el.style.transform = 'translateY(6px)'; }, 1200);
  }

  /* ── Dark mode toggle ──────────────────────────────────── */
  function applyTheme(theme) {
    const html = document.documentElement;
    html.classList.remove('dark', 'light');
    if (theme === 'dark') html.classList.add('dark');
    else if (theme === 'light') html.classList.add('light');
    /* update meta theme-color */
    const tc = document.querySelector('meta[name="theme-color"]');
    if (tc) tc.setAttribute('content', theme === 'dark' ? '#0e1420' : '#fbfbfe');
  }
  function getStoredTheme() { try { return localStorage.getItem('theme'); } catch { return null; } }
  function setStoredTheme(t) { try { localStorage.setItem('theme', t); } catch {} }

  const stored = getStoredTheme();
  if (stored) applyTheme(stored);
  /* If no stored pref, CSS @media prefers-color-scheme handles it automatically */

  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const isDark = document.documentElement.classList.contains('dark') ||
        (!document.documentElement.classList.contains('light') &&
         window.matchMedia('(prefers-color-scheme: dark)').matches);
      const next = isDark ? 'light' : 'dark';
      applyTheme(next);
      setStoredTheme(next);
    });
  });

  /* ── Mobile hamburger toggle ───────────────────────────── */
  document.querySelectorAll('.hamburger').forEach(btn => {
    btn.addEventListener('click', () => {
      const hdr = btn.closest('header');
      const open = hdr.classList.toggle('nav-open');
      btn.setAttribute('aria-expanded', String(open));
    });
  });

  /* ═══════════════════════════════════════════════════════════
     Config-driven site population (reads SITE from site-config.js)
     ═══════════════════════════════════════════════════════════ */
  const cfg = (typeof SITE !== 'undefined') ? SITE : {};
  const em  = cfg.email || {};
  const hasEmail = !!(em.user && em.domain && em.tld);
  const emailStr = hasEmail ? `${em.user}@${em.domain}.${em.tld}` : '';

  /* ── Brand name ────────────────────────────────────────── */
  if (cfg.name) {
    document.querySelectorAll('.brand > span:last-child').forEach(el => {
      el.textContent = cfg.name;
    });
  }

  /* ── Social links (hide if URL is blank) ───────────────── */
  const socials = [
    { key: 'github',   sel: '[aria-label="GitHub"]',   label: 'GitHub' },
    { key: 'twitter',  sel: '[aria-label="X"]',        label: 'X' },
    { key: 'bluesky',  sel: '[aria-label="Bluesky"]',  label: 'Bluesky' },
    { key: 'linkedin', sel: '[aria-label="LinkedIn"]',        label: 'LinkedIn' },
    { key: 'scholar',  sel: '[aria-label="Google Scholar"]', label: 'Google Scholar' },
    { key: 'substack', sel: '[aria-label="Substack"]',       label: 'Substack' },
  ];
  socials.forEach(({ key, sel, label }) => {
    document.querySelectorAll(sel).forEach(el => {
      if (cfg[key]) {
        el.href = cfg[key];
        el.title = label;
      } else {
        el.style.display = 'none';
      }
    });
  });

  /* ── Homepage hero ──────────────────────────────────────── */
  const heroName = document.getElementById('hero-name');
  if (heroName && cfg.name) heroName.textContent = cfg.name;

  /* ── Optional avatar (homepage only) ────────────────────── */
  const heroTop = document.getElementById('hero-top');
  if (heroTop && cfg.avatar) {
    const img = document.createElement('img');
    img.className = 'hero-avatar';
    img.src = cfg.avatar;
    img.alt = cfg.name || 'Profile photo';
    img.loading = 'eager';
    heroTop.prepend(img);
  }

  const heroTagline = document.getElementById('hero-tagline');
  if (heroTagline) {
    if (cfg.heroTagline) {
      heroTagline.textContent = cfg.heroTagline;
    } else if (cfg.yearInProgram || cfg.university) {
      const parts = [cfg.yearInProgram, cfg.department, cfg.jobTitle].filter(Boolean).join(' ');
      heroTagline.textContent = cfg.university
        ? `${parts} at ${cfg.university}.`
        : `${parts}.`;
    }
  }

  /* Keywords stay hidden — used only for SEO (knowsAbout in LD+JSON) */

  const heroAbout = document.getElementById('hero-about');
  if (heroAbout) {
    if (cfg.aboutBio) {
      heroAbout.innerHTML = `<p class="subtitle">${esc(cfg.aboutBio)}</p>`;
      heroAbout.style.display = '';
    } else {
      heroAbout.style.display = 'none';
    }
  }

  /* ── Obfuscated email line at bottom of homepage ───────── */
  const heroEmail = document.getElementById('hero-email');
  if (heroEmail && hasEmail) {
    // Build a human-readable but bot-resistant email display
    // Uses Unicode zero-width joiners and CSS direction tricks
    const display = `${esc(em.user)}<span class="eat"> [at] </span>${esc(em.domain)}<span class="eat"> [dot] </span>${esc(em.tld)}`;
    heroEmail.innerHTML = `<span class="email-obf" role="button" tabindex="0" aria-label="Copy email address">${display}</span>`;
    heroEmail.style.display = '';
    const obf = heroEmail.querySelector('.email-obf');
    if (obf) {
      const clickHandler = async () => {
        try { await navigator.clipboard.writeText(emailStr); toast('Email copied.'); }
        catch { toast('Copy failed.'); }
      };
      obf.addEventListener('click', clickHandler);
      obf.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); clickHandler(); } });
    }
  }

  /* ── SEO: update canonical, OG, title from config ──────── */
  if (cfg.siteUrl) {
    const base = cfg.siteUrl.replace(/\/+$/, '');
    const canon = document.querySelector('link[rel="canonical"]');
    if (canon) {
      const path = canon.getAttribute('href').replace(/^https?:\/\/[^/]*/, '');
      canon.setAttribute('href', base + (path || '/'));
    }
    document.querySelectorAll('meta[property="og:image"], meta[name="twitter:image"]').forEach(m => {
      m.setAttribute('content', base + '/assets/img/og-card.png');
    });
  }

  if (cfg.metaDescription && document.querySelector('body.home')) {
    ['meta[name="description"]', 'meta[property="og:description"]', 'meta[name="twitter:description"]'].forEach(s => {
      const el = document.querySelector(s);
      if (el) el.setAttribute('content', cfg.metaDescription);
    });
  }

  if (cfg.name) {
    /* Replace the first word (the placeholder name) before the em-dash in titles,
       so the replacement works regardless of what name is in the HTML. */
    const nameRe = /^[^—]+(?=\s*—)/;
    document.title = document.title.replace(nameRe, cfg.name);
    document.querySelectorAll('meta[property="og:title"], meta[name="twitter:title"]').forEach(m => {
      m.setAttribute('content', m.getAttribute('content').replace(nameRe, cfg.name));
    });
  }

  /* ── Structured data (LD+JSON — richer SEO signals) ─────── */
  document.querySelectorAll('script[type="application/ld+json"]').forEach(el => el.remove());

  if (cfg.name) {
    const person = { "@context": "https://schema.org", "@type": "Person", name: cfg.name };
    if (cfg.jobTitle) person.jobTitle = cfg.jobTitle;
    if (cfg.university) person.affiliation = { "@type": "EducationalOrganization", name: cfg.university };
    if (cfg.siteUrl) person.url = cfg.siteUrl;
    if (hasEmail) person.email = `mailto:${emailStr}`;
    if (cfg.metaDescription || cfg.heroTagline) person.description = cfg.metaDescription || cfg.heroTagline;
    if (cfg.keywords) person.knowsAbout = cfg.keywords.split('·').map(k => k.trim()).filter(Boolean);
    const sameAs = [cfg.github, cfg.twitter, cfg.bluesky, cfg.linkedin, cfg.scholar, cfg.substack].filter(Boolean);
    if (sameAs.length) person.sameAs = sameAs;
    const s1 = document.createElement('script');
    s1.type = 'application/ld+json';
    s1.textContent = JSON.stringify(person);
    document.head.appendChild(s1);
  }

  if (cfg.name && cfg.siteUrl) {
    const ws = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: `${cfg.name} — Research, Projects, Writing`,
      url: cfg.siteUrl,
    };
    const s2 = document.createElement('script');
    s2.type = 'application/ld+json';
    s2.textContent = JSON.stringify(ws);
    document.head.appendChild(s2);
  }

  /* ── BreadcrumbList for sub-pages (SEO) ────────────────── */
  if (cfg.siteUrl && !document.querySelector('body.home')) {
    const base = cfg.siteUrl.replace(/\/+$/, '');
    const path = location.pathname.replace(/\/$/, '').split('/').filter(Boolean);
    const pageName = document.querySelector('.pagehead h1');
    if (path.length && pageName) {
      const bc = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: base + "/" },
          { "@type": "ListItem", position: 2, name: pageName.textContent }
        ]
      };
      const s3 = document.createElement('script');
      s3.type = 'application/ld+json';
      s3.textContent = JSON.stringify(bc);
      document.head.appendChild(s3);
    }
  }

  /* ── Research & Projects: render from config ───────────── */
  function renderEntries(mountId, items) {
    const el = document.getElementById(mountId);
    if (!el || !Array.isArray(items) || items.length === 0) return;
    el.innerHTML = '';
    items.forEach(item => {
      const div = document.createElement('div');
      div.className = 'entry';
      let html = '';
      if (item.image) {
        html += `<img class="entry-img" src="${esc(item.image)}" alt="${esc(item.title)}" loading="lazy"/>`;
      }
      html += `<h3>${esc(item.title)}</h3>`;
      html += `<p>${esc(item.blurb)}</p>`;
      if (item.link) {
        html += `<a class="entry-link" href="${esc(item.link)}" target="_blank" rel="noopener">View &rarr;</a>`;
      }
      if (Array.isArray(item.keywords) && item.keywords.length) {
        html += `<div class="tags">${item.keywords.map(k => `<span class="tag">${esc(k)}</span>`).join('')}</div>`;
      }
      div.innerHTML = html;
      el.appendChild(div);
    });
  }
  renderEntries('research-mount', cfg.research);
  renderEntries('projects-mount', cfg.projects);

  /* ── Writing page: auto-load Substack posts ────────────── */
  const mount = document.getElementById('post-mount');
  if (mount) {
    const isSubDir = location.pathname.replace(/\/$/, '').split('/').length > 2;
    const jsonPath = isSubDir ? '../assets/data/substack_posts.json' : 'assets/data/substack_posts.json';
    fetch(jsonPath, { cache: 'no-store' })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data || !Array.isArray(data.posts) || data.posts.length === 0) return;
        mount.innerHTML = '';
        data.posts.slice(0, 12).forEach(p => {
          const div = document.createElement('div');
          div.className = 'post';
          div.innerHTML = `
            <div class="date">${esc(p.date || '')}</div>
            <a class="title" href="${esc(p.url || '#')}" target="_blank" rel="noopener">${esc(p.title || '')}</a>
            ${p.excerpt ? `<div class="excerpt">${esc(p.excerpt)}</div>` : ''}
          `;
          mount.appendChild(div);
        });
      })
      .catch(() => {});
  }

  /* ── Scroll-reveal: animate entries/posts on scroll ────── */
  document.querySelectorAll('.entry, .post, .about-block, .email-line, .pagehead').forEach(el => {
    el.classList.add('reveal');
  });
  if ('IntersectionObserver' in window) {
    const ro = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          ro.unobserve(e.target);
        }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(el => ro.observe(el));
  } else {
    /* fallback: just show everything */
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
  }
})();