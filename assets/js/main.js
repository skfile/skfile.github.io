/* Native details provide mouse, keyboard, and no-JavaScript access. */
(() => {
  const sections = [...document.querySelectorAll('details.section')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function revealLinkedSection() {
    const section = sections.find(item => `#${item.id}` === location.hash);
    if (section) {
      section.open = true;
      requestAnimationFrame(() => section.scrollIntoView({ block: 'start' }));
    }
  }
  sections.forEach(section => {
    section.addEventListener('toggle', () => {
      const content = section.querySelector('.section-content');
      content.getAnimations?.().forEach(animation => animation.cancel());
      if (section.open && !reducedMotion.matches && content.animate) {
        content.animate([
          { opacity: 0, transform: 'translateY(-4px)' },
          { opacity: 1, transform: 'translateY(0)' }
        ], { duration: 160, easing: 'ease-out' });
      }
    });
  });
  window.addEventListener('hashchange', revealLinkedSection);
  revealLinkedSection();
})();
