import { useState, useEffect, useRef } from 'react';

export interface PlanetParallaxOffsets {
  normX: number;
  normY: number;
  bgX: number;
  bgY: number;
  midX: number;
  midY: number;
  fgX: number;
  fgY: number;
  uiX: number;
  uiY: number;
}

export function usePlanetParallax(): PlanetParallaxOffsets {
  const [offsets, setOffsets] = useState<PlanetParallaxOffsets>({
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

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
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

      // Enhanced organic idle drift (dynamic atmospheric surveillance & gentle drift)
      const idleDriftX = Math.sin(elapsed * 0.32) * 0.28 + Math.sin(elapsed * 0.12) * 0.18;
      const idleDriftY = Math.cos(elapsed * 0.26) * 0.18 + Math.cos(elapsed * 0.08) * 0.12;

      const combinedTargetX = mouseTarget.current.x * 0.9 + idleDriftX;
      const combinedTargetY = mouseTarget.current.y * 0.8 + idleDriftY;

      // Smooth, responsive spring interpolation (0.052 for fluid yet noticeable motion)
      currentPos.current.x += (combinedTargetX - currentPos.current.x) * 0.052;
      currentPos.current.y += (combinedTargetY - currentPos.current.y) * 0.052;

      const cx = currentPos.current.x;
      const cy = currentPos.current.y;

      setOffsets({
        normX: cx,
        normY: cy,
        // Background moves visibly with cinematic depth (mountains / deep clouds)
        bgX: -cx * 42,
        bgY: -cy * 26,
        // Midground moves with pronounced perspective
        midX: -cx * 68,
        midY: -cy * 38,
        // Foreground moves fastest
        fgX: -cx * 95,
        fgY: -cy * 50,
        // UI floats with pleasant counter-perspective
        uiX: cx * 12,
        uiY: cy * 8,
      });

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
