import { createElement } from 'react';
import { useReveal } from '../../hooks/useReveal';

export function Reveal({ as = 'div', className = '', delayMs = 0, children, ...rest }) {
  const { ref, revealed } = useReveal();

  return createElement(
    as,
    {
      ref,
      className: `reveal-block ${revealed ? 'is-revealed' : ''} ${className}`,
      style: delayMs > 0 ? { transitionDelay: `${delayMs}ms` } : undefined,
      ...rest,
    },
    children
  );
}
