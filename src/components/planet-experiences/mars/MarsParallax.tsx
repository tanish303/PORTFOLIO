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

      // 1. Slow, organic cinematic idle drift
      // Simulates slow astronaut breathing and subtle horizon surveillance
      const idleDriftX = Math.sin(elapsed * 0.22) * 0.18 + Math.sin(elapsed * 0.08) * 0.12;
      const idleDriftY = Math.cos(elapsed * 0.18) * 0.12 + Math.cos(elapsed * 0.06) * 0.06;

      const combinedTargetX = mouseTarget.current.x * 0.75 + idleDriftX;
      const combinedTargetY = mouseTarget.current.y * 0.65 + idleDriftY;

      // 2. Smooth spring interpolation (lerp factor 0.038 for cinematic weight)
      currentPos.current.x += (combinedTargetX - currentPos.current.x) * 0.038;
      currentPos.current.y += (combinedTargetY - currentPos.current.y) * 0.038;

      const cx = currentPos.current.x;
      const cy = currentPos.current.y;

      // 3. Multi-layer depth shifts (in pixels)
      setOffsets({
        normX: cx,
        normY: cy,
        // Background moves subtly (distant mountains)
        bgX: -cx * 16,
        bgY: -cy * 10,
        // Midground moves moderately (main landscape)
        midX: -cx * 38,
        midY: -cy * 22,
        // Foreground moves fastest (near rocks)
        fgX: -cx * 68,
        fgY: -cy * 36,
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
