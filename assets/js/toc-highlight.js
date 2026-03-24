document.addEventListener('DOMContentLoaded', () => {
  const tocLinks = Array.from(document.querySelectorAll('.toc-view > ul > li > a'));
  if (tocLinks.length === 0) return;

  const sections = tocLinks.map(link => {
    const href = link.getAttribute('href');
    if (!href || !href.startsWith('#')) return null;
    const id = href.substring(1);
    const el = document.getElementById(id);
    return el ? { link, el } : null;
  }).filter(s => s !== null);

  if (sections.length === 0) return;

  function onScroll() {
    // Adjust offset to account for fixed header + some padding
    const scrollPosition = window.scrollY + 120;
    
    let currentActive = null;
    
    // Iterate to find the last section that we've scrolled past
    sections.forEach(sec => {
      const rect = sec.el.getBoundingClientRect();
      const offsetTop = rect.top + window.scrollY;
      
      if (scrollPosition >= offsetTop) {
        currentActive = sec.link;
      }
    });
    
    // If we're at the very top, highlight the first section
    if (!currentActive && sections.length > 0) {
      currentActive = sections[0].link;
    }

    tocLinks.forEach(item => item.classList.remove('-active'));
    if (currentActive) {
      currentActive.classList.add('-active');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  // Call once to set initial state
  onScroll();
});
