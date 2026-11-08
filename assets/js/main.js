(() => {
  function revealAnchor() {
    if (!location.hash) return;
    let id; try { id = decodeURIComponent(location.hash.slice(1)); } catch (_) { return; }
    const target = document.getElementById(id);
    if (!target) return;
    let current = target;
    while (current) { if (current.tagName === 'DETAILS') current.open = true; current = current.parentElement; }
    requestAnimationFrame(() => target.scrollIntoView({block:'start'}));
  }
  window.addEventListener('hashchange', revealAnchor);
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#"]');
    if (link && link.hash === location.hash) revealAnchor();
  });
  revealAnchor();
  const portrait = document.getElementById('profile-photo');
  if (portrait) {
    function showPlaceholder() {
      portrait.removeEventListener('error', showPlaceholder);
      portrait.src = '/assets/img/profile-placeholder.svg';
      portrait.alt = 'Portrait placeholder';
    }
    portrait.addEventListener('error', showPlaceholder);
    if (portrait.complete && !portrait.naturalWidth) showPlaceholder();
  }
})();
