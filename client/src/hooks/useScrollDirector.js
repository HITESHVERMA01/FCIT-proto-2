import { useEffect } from 'react';
import { ScrollDirector } from '../animations/ScrollDirector';

/**
 * Subscribe cleanly to ScrollDirector global metrics without triggering React state per tick.
 */
export function useScrollDirector(onUpdate, deps = []) {
  useEffect(() => {
    if (typeof onUpdate !== 'function') return undefined;
    return ScrollDirector.subscribe(onUpdate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/**
 * Register a target element ref with ScrollDirector so its DOMRect is measured
 * in the global batched READ phase and passed into onTargetUpdate during the WRITE phase.
 */
export function useScrollTarget(ref, onTargetUpdate, deps = []) {
  useEffect(() => {
    const el = ref?.current;
    if (!el || typeof onTargetUpdate !== 'function') return undefined;
    return ScrollDirector.registerTarget(el, onTargetUpdate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, ...deps]);
}
