import React, { useEffect, useRef } from 'react';

interface MarsParticlesProps {
  parallaxX?: number;
  parallaxY?: number;
}

interface DustParticle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  alpha: number;
  baseAlpha: number;
  phase: number;
  depth: number; // 0 (far) to 1 (near)
  color: string;
}

export const MarsParticles: React.FC<MarsParticlesProps> = ({ parallaxX = 0, parallaxY = 0 }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Natural Martian mineral dust palette (No artificial neon or glowing stars)
    const dustColors = [
      'rgba(215, 105, 75,',  // Red iron oxide
      'rgba(195, 88, 55,',   // Dark Martian soil
      'rgba(235, 155, 115,', // Sunlit dust grain
      'rgba(180, 75, 45,',   // Jezero crater silt
    ];

    const particleCount = Math.min(85, Math.floor((width * height) / 18000));
    const particles: DustParticle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const depth = Math.random(); // 0 (far, small) to 1 (near, slightly larger)
      const baseAlpha = 0.12 + depth * 0.35; // subtle transparency
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: 0.8 + depth * 1.5, // 0.8px to 2.3px
        speedX: 0.15 + Math.random() * 0.35 + depth * 0.25, // Gentle easterly wind
        speedY: (Math.random() - 0.5) * 0.1,
        alpha: baseAlpha,
        baseAlpha,
        phase: Math.random() * Math.PI * 2,
        depth,
        color: dustColors[Math.floor(Math.random() * dustColors.length)],
      });
    }

    let animationId: number;
    let time = 0;

    const render = () => {
      time += 0.016;
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Subtle wind drift + gentle atmospheric vertical wave
        p.x += p.speedX;
        p.y += Math.sin(time * 0.8 + p.phase) * 0.2 + p.speedY;

        // Subtle alpha pulsation (drifting through varying light)
        p.alpha = p.baseAlpha * (0.8 + Math.sin(time * 1.2 + p.phase) * 0.2);

        // Screen wrap-around
        if (p.x > width + 20) p.x = -20;
        if (p.x < -20) p.x = width + 20;
        if (p.y > height + 20) p.y = -20;
        if (p.y < -20) p.y = height + 20;

        // Apply depth-dependent parallax offset
        const drawX = p.x + parallaxX * (0.2 + p.depth * 0.6);
        const drawY = p.y + parallaxY * (0.2 + p.depth * 0.6);

        ctx.fillStyle = `${p.color} ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(drawX, drawY, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, [parallaxX, parallaxY]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 5,
      }}
    />
  );
};
