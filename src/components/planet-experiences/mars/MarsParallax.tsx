import { useState, useEffect, useRef } from 'react';

export interface ParallaxOffsets {
  // Normalized coordinates [-1, 1]
  normX: number;
  normY: number;
  // Background layer offset (distant crater rim & sky)
  bgX: number;
  bgY: number;
  // Midground layer offset (dunes, ridges, horizon)
  midX: number;
  midY: number;
  // Foreground layer offset (detailed rocks & near ground)
  fgX: number;
  fgY: number;
  // Glass UI subtle counter-perspective
  uiX: number;
  uiY: number;
}

export function useMarsParallax(): ParallaxOffsets {
  const [offsets, setOffsets] = useState<ParallaxOffsets>({
    normX: 0,
    normY: 0,
    bgX: 0,
    bgY: 0,
    midX: 0,
    midY: 0,
    fgX: 0,
    fgY: 0,
    uiX: 0,
    uiY: 0,
  });

  const mouseTarget = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });
  const animFrameId = useRef<number | null>(null);
  const startTime = useRef(performance.now());
  const lastUpdate = useRef(0);
  const lastDispatched = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize to [-1, 1]
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      mouseTarget.current.x = nx;
      mouseTarget.current.y = ny;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const nx = (touch.clientX / window.innerWidth) * 2 - 1;
        const ny = (touch.clientY / window.innerHeight) * 2 - 1;
        mouseTarget.current.x = nx;
        mouseTarget.current.y = ny;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    const updateLoop = () => {
      const now = performance.now();
      const elapsed = (now - startTime.current) / 1000;

      // 1. Enhanced organic cinematic idle drift
      const idleDriftX = Math.sin(elapsed * 0.32) * 0.28 + Math.sin(elapsed * 0.12) * 0.18;
      const idleDriftY = Math.cos(elapsed * 0.26) * 0.18 + Math.cos(elapsed * 0.08) * 0.12;

      const combinedTargetX = mouseTarget.current.x * 0.9 + idleDriftX;
      const combinedTargetY = mouseTarget.current.y * 0.8 + idleDriftY;

      // 2. Smooth, fluid spring interpolation (lerp factor 0.052)
      currentPos.current.x += (combinedTargetX - currentPos.current.x) * 0.052;
      currentPos.current.y += (combinedTargetY - currentPos.current.y) * 0.052;

      const cx = currentPos.current.x;
      const cy = currentPos.current.y;

      // 3. Throttle React state reconciliations to ~30fps with delta gate for silk-smooth rendering
      if (now - lastUpdate.current >= 33) {
        const dx = Math.abs(cx - lastDispatched.current.x);
        const dy = Math.abs(cy - lastDispatched.current.y);
        if (dx > 0.002 || dy > 0.002) {
          lastUpdate.current = now;
          lastDispatched.current.x = cx;
          lastDispatched.current.y = cy;

          setOffsets({
            normX: cx,
            normY: cy,
            // Background moves with cinematic depth (distant mountains)
            bgX: -cx * 42,
            bgY: -cy * 26,
            // Midground moves with pronounced perspective
            midX: -cx * 68,
            midY: -cy * 38,
            // Foreground moves fastest (near rocks)
            fgX: -cx * 95,
            fgY: -cy * 50,
            // UI floats with slight counter-perspective
            uiX: cx * 12,
            uiY: cy * 8,
          });
        }
      }

      animFrameId.current = requestAnimationFrame(updateLoop);
    };

    animFrameId.current = requestAnimationFrame(updateLoop);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, []);

  return offsets;
}
