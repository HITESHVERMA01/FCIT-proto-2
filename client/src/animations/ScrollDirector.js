/**
 * Central ScrollDirector Engine for FCIT 2.0
 * - Zero scroll hijacking (preserves 100% native browser scroll & touch momentum)
 * - Single passive `scroll`, passive `resize`, `visibilitychange`, and motion preference listeners
 * - Strictly separates batched DOM READ phase from DOM WRITE phase inside ONE requestAnimationFrame
 * - Mutates global CSS variables + subscriber refs with ZERO React setState on scroll ticks
 */

import {
  AMBIENT_BOWL_TRACK_DESKTOP,
  AMBIENT_BOWL_TRACK_MOBILE,
  SCROLL_BREAKPOINTS,
} from './scroll/motionTokens';
import { sampleKeyframeTrack } from './scroll/interpolate';
import {
  computeDistanceProgress,
  computeGlobalProgress,
} from './scroll/scrollProgress';

class ScrollDirectorEngine {
  constructor() {
    this.subscribers = new Set();
    this.targets = new Set(); // { element, callback }
    this.rafId = null;
    this.listening = false;
    this.reducedMotion = false;
    this.documentHidden = false;
    this.mediaQuery = null;
  }

  init() {
    if (typeof window === 'undefined' || this.listening) return;

    this.mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.reducedMotion = Boolean(this.mediaQuery.matches);
    this.documentHidden = Boolean(document.hidden);

    this.handleMediaChange = (e) => {
      this.reducedMotion = Boolean(e.matches);
      this.scheduleFlush();
    };

    this.handleVisibilityChange = () => {
      this.documentHidden = Boolean(document.hidden);
      if (!this.documentHidden) {
        this.scheduleFlush();
      }
    };

    this.scheduleFlush = () => {
      if (this.documentHidden || this.rafId !== null) return;
      this.rafId = window.requestAnimationFrame(() => {
        this.rafId = null;
        this.flush();
      });
    };

    this.mediaQuery.addEventListener?.('change', this.handleMediaChange);
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
    window.addEventListener('scroll', this.scheduleFlush, { passive: true });
    window.addEventListener('resize', this.scheduleFlush, { passive: true });

    this.listening = true;
    this.flush();
  }

  /**
   * Read layout first, compute metrics, then write styles/variables in strict separation.
   */
  flush() {
    if (typeof window === 'undefined' || this.documentHidden) return;

    // ------------------------------------------------------------------
    // PHASE 1: BATCHED DOM READS (no style writes allowed in this phase)
    // ------------------------------------------------------------------
    const scrollY = window.scrollY || window.pageYOffset || 0;
    const viewportWidth = window.innerWidth || 1024;
    const viewportHeight = window.innerHeight || 768;
    const scrollHeight = document.documentElement.scrollHeight || viewportHeight;
    const isDesktop = viewportWidth >= SCROLL_BREAKPOINTS.desktopMin;

    const measuredTargets = [];
    this.targets.forEach((entry) => {
      if (entry.element && entry.element.isConnected) {
        measuredTargets.push({
          entry,
          rect: entry.element.getBoundingClientRect(),
        });
      }
    });

    // ------------------------------------------------------------------
    // PHASE 2: PURE COMPUTATION
    // ------------------------------------------------------------------
    const progress = computeGlobalProgress(scrollY, scrollHeight, viewportHeight);
    const earlyDistance = isDesktop ? viewportHeight * 1.45 : viewportHeight * 1.1;
    const earlyProgress = computeDistanceProgress(scrollY, earlyDistance);

    const bowl = this.reducedMotion
      ? {
          p: 0,
          tip: 0.54,
          half: 0.58,
          soft: 1.0,
          scaleX: 1,
          scaleY: 1,
          shiftY: 0,
          opacity: 0.82,
        }
      : sampleKeyframeTrack(
          earlyProgress,
          isDesktop ? AMBIENT_BOWL_TRACK_DESKTOP : AMBIENT_BOWL_TRACK_MOBILE
        );

    const payload = {
      scrollY,
      viewportWidth,
      viewportHeight,
      scrollHeight,
      docHeight: Math.max(scrollHeight - viewportHeight, 1),
      progress,
      earlyProgress,
      isDesktop,
      reducedMotion: this.reducedMotion,
      bowl,
    };

    // ------------------------------------------------------------------
    // PHASE 3: BATCHED DOM WRITES (only transform / opacity CSS vars & refs)
    // ------------------------------------------------------------------
    const rootStyle = document.documentElement.style;
    rootStyle.setProperty('--scroll-progress', progress.toFixed(4));
    rootStyle.setProperty('--hero-scroll-progress', earlyProgress.toFixed(4));
    rootStyle.setProperty('--bowl-scale-x', bowl.scaleX.toFixed(4));
    rootStyle.setProperty('--bowl-scale-y', bowl.scaleY.toFixed(4));
    rootStyle.setProperty('--bowl-shift-y', `${Math.round(bowl.shiftY)}px`);
    rootStyle.setProperty('--bowl-opacity', bowl.opacity.toFixed(3));
    rootStyle.setProperty('--bowl-tip', bowl.tip.toFixed(3));
    rootStyle.setProperty('--bowl-half', bowl.half.toFixed(3));
    rootStyle.setProperty('--bowl-soft', bowl.soft.toFixed(3));

    for (let i = 0; i < measuredTargets.length; i += 1) {
      const { entry, rect } = measuredTargets[i];
      try {
        entry.callback({
          ...payload,
          rect,
        });
      } catch {
        // Keep other scroll targets resilient
      }
    }

    this.subscribers.forEach((fn) => {
      try {
        fn(payload);
      } catch {
        // Keep other scroll subscribers resilient
      }
    });
  }

  cleanupIfIdle() {
    if (
      this.subscribers.size === 0 &&
      this.targets.size === 0 &&
      this.listening
    ) {
      window.removeEventListener('scroll', this.scheduleFlush);
      window.removeEventListener('resize', this.scheduleFlush);
      document.removeEventListener('visibilitychange', this.handleVisibilityChange);
      this.mediaQuery?.removeEventListener?.('change', this.handleMediaChange);
      if (this.rafId !== null) {
        window.cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
      this.listening = false;
    }
  }

  /**
   * Subscribe to global scroll metrics (for custom refs/components).
   */
  subscribe(callback) {
    this.init();
    this.subscribers.add(callback);

    if (typeof window !== 'undefined') {
      const scrollY = window.scrollY || 0;
      const viewportWidth = window.innerWidth || 1024;
      const viewportHeight = window.innerHeight || 768;
      const scrollHeight = document.documentElement.scrollHeight || viewportHeight;
      const isDesktop = viewportWidth >= SCROLL_BREAKPOINTS.desktopMin;
      const earlyDistance = isDesktop ? viewportHeight * 1.45 : viewportHeight * 1.1;
      const earlyProgress = computeDistanceProgress(scrollY, earlyDistance);
      const bowl = sampleKeyframeTrack(
        this.reducedMotion ? 0 : earlyProgress,
        isDesktop ? AMBIENT_BOWL_TRACK_DESKTOP : AMBIENT_BOWL_TRACK_MOBILE
      );

      callback({
        scrollY,
        viewportWidth,
        viewportHeight,
        scrollHeight,
        docHeight: Math.max(scrollHeight - viewportHeight, 1),
        progress: computeGlobalProgress(scrollY, scrollHeight, viewportHeight),
        earlyProgress,
        isDesktop,
        reducedMotion: this.reducedMotion,
        bowl,
      });
    }

    return () => {
      this.subscribers.delete(callback);
      this.cleanupIfIdle();
    };
  }

  /**
   * Register an HTML element so its getBoundingClientRect() is batched in ScrollDirector's
   * read phase and delivered directly to callback during the write phase.
   */
  registerTarget(element, callback) {
    if (!element || typeof callback !== 'function') {
      return () => {};
    }
    this.init();
    const entry = { element, callback };
    this.targets.add(entry);

    if (typeof window !== 'undefined') {
      const rect = element.getBoundingClientRect();
      const scrollY = window.scrollY || 0;
      const viewportWidth = window.innerWidth || 1024;
      const viewportHeight = window.innerHeight || 768;
      const scrollHeight = document.documentElement.scrollHeight || viewportHeight;
      const isDesktop = viewportWidth >= SCROLL_BREAKPOINTS.desktopMin;
      const earlyDistance = isDesktop ? viewportHeight * 1.45 : viewportHeight * 1.1;
      const earlyProgress = computeDistanceProgress(scrollY, earlyDistance);
      const bowl = sampleKeyframeTrack(
        this.reducedMotion ? 0 : earlyProgress,
        isDesktop ? AMBIENT_BOWL_TRACK_DESKTOP : AMBIENT_BOWL_TRACK_MOBILE
      );

      callback({
        scrollY,
        viewportWidth,
        viewportHeight,
        scrollHeight,
        docHeight: Math.max(scrollHeight - viewportHeight, 1),
        progress: computeGlobalProgress(scrollY, scrollHeight, viewportHeight),
        earlyProgress,
        isDesktop,
        reducedMotion: this.reducedMotion,
        bowl,
        rect,
      });
    }

    return () => {
      this.targets.delete(entry);
      this.cleanupIfIdle();
    };
  }

  /**
   * Programmatic flush after async content loads / layout settles
   */
  refresh() {
    if (this.listening && !this.documentHidden) {
      this.scheduleFlush();
    }
  }
}

export const ScrollDirector = new ScrollDirectorEngine();
