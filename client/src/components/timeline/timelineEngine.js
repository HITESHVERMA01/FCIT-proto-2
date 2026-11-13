/**
 * FCIT Living Legacy Archive — Timeline Movement & Synchronization Engine
 * Pure measurement, modular conveyor wrapping, hover deceleration, pointer drag inertia,
 * keyboard snap transitions, and offscreen/reduced-motion lifecycle management.
 * Zero React or Tailwind presentation dependencies.
 */

export function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

export function positiveMod(val, span) {
  if (!span || span <= 0) return 0;
  return ((val % span) + span) % span;
}

/**
 * Compute responsive dimensions and virtual loop geometry for a stage width & item count.
 */
export function computeStageMetrics(stageWidth, milestoneCount) {
  const w = Math.max(stageWidth || 960, 280);
  const count = Math.max(milestoneCount || 1, 1);

  let mode = 'desktop';
  if (w < 768) {
    mode = 'mobile';
  } else if (w < 1024) {
    mode = 'tablet';
  }

  let cardWidth;
  let cardHeight;
  let gap;
  let particleStep;
  let scatterHorizon;
  let baseSpeed;

  if (mode === 'desktop') {
    cardWidth = Math.round(clamp(w * 0.36, 390, 500));
    cardHeight = 360;
    gap = Math.round(clamp(w * 0.065, 68, 108));
    particleStep = 3; // ~3px base sampling spacing on desktop
    scatterHorizon = 190;
    baseSpeed = 38;
  } else if (mode === 'tablet') {
    cardWidth = Math.round(clamp(w * 0.43, 300, 390));
    cardHeight = 320;
    gap = 56;
    particleStep = 4;
    scatterHorizon = 150;
    baseSpeed = 32;
  } else {
    cardWidth = Math.round(clamp(w * 0.82, 240, 340));
    cardHeight = 220;
    gap = 36;
    particleStep = 5;
    scatterHorizon = 110;
    baseSpeed = 28;
  }

  const scanX = w * 0.5;
  const slotPitch = cardWidth + gap;
  const minVisibleSpan = w + slotPitch * 2;
  const singleCycleSpan = count * slotPitch;
  const cycles = Math.max(1, Math.ceil(minVisibleSpan / Math.max(singleCycleSpan, 1)));
  const virtualCount = count * cycles;
  const virtualSpan = virtualCount * slotPitch;

  return {
    mode,
    stageWidth: w,
    scanX,
    cardWidth,
    cardHeight,
    gap,
    slotPitch,
    milestoneCount: count,
    cycles,
    virtualCount,
    virtualSpan,
    particleStep,
    scatterHorizon,
    baseSpeed,
  };
}

/**
 * Compute initial offset so milestone 0 is immediately crossing ~34% into the scanner
 * on page arrival, showcasing memory, dissolve particles, and emerging archival record at once.
 */
export function computeInitialOffset(metrics) {
  if (!metrics || !metrics.virtualSpan) return 0;
  const desiredLeft = metrics.scanX - metrics.cardWidth * 0.34;
  return positiveMod(-(desiredLeft + metrics.slotPitch), metrics.virtualSpan);
}

/**
 * Target offset aligned so virtual slot `virtualIdx` is seated cleanly at the active scan focus.
 */
export function computeSlotTargetOffset(metrics, virtualIdx, scanFraction = 0.42) {
  const desiredLeft = metrics.scanX - metrics.cardWidth * scanFraction;
  return positiveMod(
    virtualIdx * metrics.slotPitch - (desiredLeft + metrics.slotPitch),
    metrics.virtualSpan
  );
}

/**
 * Evaluate exact screen coordinates, clip bounds, and active scanner index for all slots.
 */
export function evaluateSlotsFrame(metrics, beltOffset, outSlots = []) {
  const {
    scanX,
    cardWidth,
    slotPitch,
    milestoneCount,
    virtualCount,
    virtualSpan,
    scatterHorizon,
  } = metrics;

  let activeVirtualIndex = 0;
  let activeMilestoneIndex = 0;
  let bestDist = Infinity;
  let straddlingFound = false;

  for (let i = 0; i < virtualCount; i += 1) {
    const raw = positiveMod(i * slotPitch - beltOffset, virtualSpan);
    const tileLeft = raw - slotPitch;
    const tileRight = tileLeft + cardWidth;
    const milestoneIndex = i % milestoneCount;

    const crossedPx = clamp(scanX - tileLeft, 0, cardWidth);
    const remainingRightPx = clamp(tileRight - scanX, 0, cardWidth);
    const scanProgress = crossedPx / cardWidth;
    const inDissolveWindow =
      tileLeft < scanX + 8 && tileRight > scanX - scatterHorizon;

    let slot = outSlots[i];
    if (!slot) {
      slot = {
        virtualIndex: i,
        milestoneIndex,
        tileLeft: 0,
        tileRight: 0,
        crossedPx: 0,
        remainingRightPx: 0,
        scanProgress: 0,
        inDissolveWindow: false,
      };
      outSlots[i] = slot;
    }

    slot.virtualIndex = i;
    slot.milestoneIndex = milestoneIndex;
    slot.tileLeft = tileLeft;
    slot.tileRight = tileRight;
    slot.crossedPx = crossedPx;
    slot.remainingRightPx = remainingRightPx;
    slot.scanProgress = scanProgress;
    slot.inDissolveWindow = inDissolveWindow;

    const straddles = tileLeft <= scanX && tileRight > scanX;
    if (straddles) {
      straddlingFound = true;
      activeVirtualIndex = i;
      activeMilestoneIndex = milestoneIndex;
    } else if (!straddlingFound) {
      const centerDist = Math.abs(tileLeft + cardWidth * 0.5 - scanX);
      if (centerDist < bestDist) {
        bestDist = centerDist;
        activeVirtualIndex = i;
        activeMilestoneIndex = milestoneIndex;
      }
    }
  }

  outSlots.length = virtualCount;

  return {
    slots: outSlots,
    activeVirtualIndex,
    activeMilestoneIndex,
    activeScanProgress: outSlots[activeVirtualIndex]?.scanProgress ?? 0,
  };
}

/**
 * Single requestAnimationFrame loop coordinator for the Living Legacy Archive.
 */
export function createTimelineController({
  onFrame,
  onActiveChange,
  onDraggingChange,
}) {
  let metrics = computeStageMetrics(960, 1);
  let beltOffset = computeInitialOffset(metrics);
  let hasInitializedOffset = false;

  let autoSpeed = metrics.baseSpeed;
  let inertiaVelocity = 0;
  let currentVelocity = metrics.baseSpeed;
  let snapDeltaRemaining = 0;

  let paused = false;
  let hovering = false;
  let inView = false;
  let reducedMotion = false;
  let dragging = false;

  let dragStartX = 0;
  let lastPointerX = 0;
  let lastPointerTime = 0;
  let dragVelocity = 0;

  let rafId = null;
  let lastFrameTime = 0;
  let lastNotifiedActive = -1;

  const slotBuffer = [];

  function emitFrame(now) {
    const evalResult = evaluateSlotsFrame(metrics, beltOffset, slotBuffer);
    if (evalResult.activeMilestoneIndex !== lastNotifiedActive) {
      lastNotifiedActive = evalResult.activeMilestoneIndex;
      onActiveChange?.(evalResult.activeMilestoneIndex, evalResult.activeScanProgress);
    }

    onFrame?.({
      now,
      metrics,
      beltOffset,
      velocity: currentVelocity,
      dragging,
      paused,
      reducedMotion,
      ...evalResult,
    });
  }

  function tick(now) {
    if (!lastFrameTime) lastFrameTime = now;
    const dt = clamp((now - lastFrameTime) / 1000, 0.001, 0.05);
    lastFrameTime = now;

    if (inView) {
      let frameDisplacement = 0;

      if (!dragging) {
        if (Math.abs(snapDeltaRemaining) > 0.35) {
          const step = snapDeltaRemaining * (1 - Math.exp(-8.5 * dt));
          snapDeltaRemaining -= step;
          frameDisplacement += step;
          currentVelocity = step / dt;
          beltOffset = positiveMod(beltOffset + step, metrics.virtualSpan);
        } else {
          snapDeltaRemaining = 0;
          const targetAuto =
            paused || reducedMotion
              ? 0
              : hovering
                ? metrics.baseSpeed * 0.24
                : metrics.baseSpeed;

          autoSpeed += (targetAuto - autoSpeed) * (1 - Math.exp(-5.5 * dt));
          inertiaVelocity *= Math.exp(-3.8 * dt);
          if (Math.abs(inertiaVelocity) < 0.8) inertiaVelocity = 0;

          const netSpeed = autoSpeed + inertiaVelocity;
          currentVelocity = netSpeed;
          frameDisplacement = netSpeed * dt;
          beltOffset = positiveMod(beltOffset + frameDisplacement, metrics.virtualSpan);
        }
      }

      emitFrame(now);
    }

    rafId = window.requestAnimationFrame(tick);
  }

  function startLoop() {
    if (rafId !== null || typeof window === 'undefined') return;
    lastFrameTime = 0;
    rafId = window.requestAnimationFrame(tick);
  }

  function stopLoop() {
    if (rafId !== null && typeof window !== 'undefined') {
      window.cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  return {
    start() {
      startLoop();
      emitFrame(performance.now());
    },

    destroy() {
      stopLoop();
    },

    setMetrics(nextStageWidth, nextMilestoneCount) {
      const prevCount = metrics.milestoneCount;
      const next = computeStageMetrics(nextStageWidth, nextMilestoneCount);
      metrics = next;

      if (!hasInitializedOffset || prevCount !== next.milestoneCount) {
        beltOffset = computeInitialOffset(next);
        hasInitializedOffset = true;
        autoSpeed = reducedMotion || paused ? 0 : next.baseSpeed;
        snapDeltaRemaining = 0;
        inertiaVelocity = 0;
      } else {
        beltOffset = positiveMod(beltOffset, next.virtualSpan);
      }

      emitFrame(performance.now());
    },

    setPaused(nextPaused) {
      paused = Boolean(nextPaused);
      if (paused) {
        inertiaVelocity = 0;
      }
      emitFrame(performance.now());
    },

    setHovering(nextHovering) {
      hovering = Boolean(nextHovering);
    },

    setInView(nextInView) {
      inView = Boolean(nextInView);
      if (inView) {
        lastFrameTime = 0;
        emitFrame(performance.now());
      }
    },

    setReducedMotion(nextReduced) {
      reducedMotion = Boolean(nextReduced);
      if (reducedMotion) {
        autoSpeed = 0;
        inertiaVelocity = 0;
      }
      emitFrame(performance.now());
    },

    stepMilestone(delta) {
      if (!delta) return;
      inertiaVelocity = 0;
      const movePx = delta * metrics.slotPitch;
      if (reducedMotion) {
        beltOffset = positiveMod(beltOffset + movePx, metrics.virtualSpan);
        snapDeltaRemaining = 0;
        emitFrame(performance.now());
        return;
      }
      snapDeltaRemaining += movePx;
    },

    jumpToMilestone(targetIdx) {
      const targetNormalized = ((targetIdx % metrics.milestoneCount) + metrics.milestoneCount) % metrics.milestoneCount;
      const evalRes = evaluateSlotsFrame(metrics, beltOffset, slotBuffer);
      const currentVirtual = evalRes.activeVirtualIndex;
      const currentMod = currentVirtual % metrics.milestoneCount;

      let diffSlots = targetNormalized - currentMod;
      const half = metrics.milestoneCount / 2;
      if (diffSlots > half) diffSlots -= metrics.milestoneCount;
      if (diffSlots < -half) diffSlots += metrics.milestoneCount;

      const targetVirtual = positiveMod(currentVirtual + diffSlots, metrics.virtualCount);
      const targetOffset = computeSlotTargetOffset(metrics, targetVirtual, 0.44);

      let deltaOffset = targetOffset - beltOffset;
      if (deltaOffset > metrics.virtualSpan * 0.5) deltaOffset -= metrics.virtualSpan;
      if (deltaOffset < -metrics.virtualSpan * 0.5) deltaOffset += metrics.virtualSpan;

      inertiaVelocity = 0;
      if (reducedMotion) {
        beltOffset = positiveMod(beltOffset + deltaOffset, metrics.virtualSpan);
        snapDeltaRemaining = 0;
        emitFrame(performance.now());
        return;
      }
      snapDeltaRemaining = deltaOffset;
    },

    startDrag(clientX) {
      dragging = true;
      snapDeltaRemaining = 0;
      inertiaVelocity = 0;
      autoSpeed = 0;
      dragVelocity = 0;
      dragStartX = clientX;
      lastPointerX = clientX;
      lastPointerTime = performance.now();
      onDraggingChange?.(true);
    },

    moveDrag(clientX) {
      if (!dragging) return;
      const now = performance.now();
      const dx = lastPointerX - clientX; // Dragging left (+dx) advances belt leftwards; dragging right (-dx) reverses belt rightwards
      const dt = Math.max((now - lastPointerTime) / 1000, 0.004);

      beltOffset = positiveMod(beltOffset + dx, metrics.virtualSpan);
      const instVel = dx / dt;
      dragVelocity = dragVelocity * 0.55 + instVel * 0.45;
      currentVelocity = dragVelocity;

      lastPointerX = clientX;
      lastPointerTime = now;
      emitFrame(now);
    },

    endDrag() {
      if (!dragging) return 0;
      const totalMoved = Math.abs(lastPointerX - dragStartX);
      dragging = false;
      inertiaVelocity = clamp(dragVelocity, -960, 960);
      dragVelocity = 0;
      onDraggingChange?.(false);
      emitFrame(performance.now());
      return totalMoved;
    },

    applyWheel(deltaX) {
      snapDeltaRemaining = 0;
      beltOffset = positiveMod(beltOffset + deltaX, metrics.virtualSpan);
      inertiaVelocity = clamp(inertiaVelocity + deltaX * 2.2, -720, 720);
      currentVelocity = deltaX * 20;
      emitFrame(performance.now());
    },

    getSnapshot() {
      return {
        metrics,
        beltOffset,
        velocity: currentVelocity,
      };
    },
  };
}
