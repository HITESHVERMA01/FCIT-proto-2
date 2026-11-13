/**
 * Shared Section & Component Visibility Observer
 * Lets heavy interactive sections (carousel auto-drift, particle canvas, parallax)
 * pause cleanly when outside the viewport or when tab is hidden.
 */

export function observeElementVisibility(
  element,
  onVisibilityChange,
  options = {}
) {
  if (typeof window === 'undefined' || !element) {
    return () => {};
  }

  if (typeof IntersectionObserver === 'undefined') {
    onVisibilityChange(true);
    return () => {};
  }

  let lastVisible = null;
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const nextVisible = Boolean(entry.isIntersecting);
        if (nextVisible !== lastVisible) {
          lastVisible = nextVisible;
          onVisibilityChange(nextVisible, entry);
        }
      }
    },
    {
      threshold: options.threshold ?? 0.05,
      rootMargin: options.rootMargin ?? '120px 0px 120px 0px',
    }
  );

  observer.observe(element);
  return () => observer.disconnect();
}

export function observeRevealOnce(element, onReveal, options = {}) {
  if (typeof window === 'undefined' || !element) {
    return () => {};
  }

  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
  if (reduced || typeof IntersectionObserver === 'undefined') {
    onReveal();
    return () => {};
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          onReveal();
          observer.unobserve(entry.target);
          break;
        }
      }
    },
    {
      threshold: options.threshold ?? 0.1,
      rootMargin: options.rootMargin ?? '0px 0px -36px 0px',
    }
  );

  observer.observe(element);
  return () => observer.disconnect();
}
