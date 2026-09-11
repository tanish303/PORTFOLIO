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

      // Slow organic idle drift (simulates slow atmospheric surveillance & sensor pan)
      const idleDriftX = Math.sin(elapsed * 0.2) * 0.16 + Math.sin(elapsed * 0.07) * 0.1;
      const idleDriftY = Math.cos(elapsed * 0.16) * 0.1 + Math.cos(elapsed * 0.05) * 0.05;

      const combinedTargetX = mouseTarget.current.x * 0.75 + idleDriftX;
      const combinedTargetY = mouseTarget.current.y * 0.65 + idleDriftY;

      // Smooth spring interpolation (0.038 for cinematic weight)
      currentPos.current.x += (combinedTargetX - currentPos.current.x) * 0.038;
      currentPos.current.y += (combinedTargetY - currentPos.current.y) * 0.038;

      const cx = currentPos.current.x;
      const cy = currentPos.current.y;

      setOffsets({
        normX: cx,
        normY: cy,
        // Background moves subtly (distant mountains / deep cloud features)
        bgX: -cx * 14,
        bgY: -cy * 9,
        // Midground moves moderately (main landscape / cloud bands)
        midX: -cx * 34,
        midY: -cy * 20,
        // Foreground moves fastest
        fgX: -cx * 62,
        fgY: -cy * 32,
        // UI floats with slight counter-perspective
        uiX: cx * 10,
        uiY: cy * 6,
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
