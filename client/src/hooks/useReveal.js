import { useEffect, useRef, useState } from 'react';

export function useReveal(options = {}) {
  const ref = useRef(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || revealed) return undefined;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || typeof IntersectionObserver === 'undefined') {
      setRevealed(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealed(true);
            observer.unobserve(entry.target);
            break;
          }
        }
      },
      {
        threshold: options.threshold ?? 0.04,
        rootMargin: options.rootMargin ?? '24px 0px -20px 0px',
      }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [revealed, options.threshold, options.rootMargin]);

  return { ref, revealed };
}
