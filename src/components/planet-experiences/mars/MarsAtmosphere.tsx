import React from 'react';

interface MarsAtmosphereProps {
  parallaxX?: number;
  parallaxY?: number;
}

export const MarsAtmosphere: React.FC<MarsAtmosphereProps> = ({ parallaxX = 0, parallaxY = 0 }) => {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 4,
        overflow: 'hidden',
      }}
    >
      {/* 1. Cinematic Photographic Vignette: frames the Martian landscape with realistic lens falloff */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at 50% 50%, rgba(0, 0, 0, 0) 50%, rgba(15, 6, 4, 0.3) 85%, rgba(10, 4, 2, 0.62) 100%)',
        }}
      />

      {/* 2. Low-Lying Horizon Dust Haze: authentic reddish dust suspension across the mid-distance */}
      <div
        style={{
          position: 'absolute',
          bottom: '26%',
          left: '-10%',
          right: '-10%',
          height: '24%',
          background:
            'linear-gradient(180deg, rgba(220, 100, 65, 0) 0%, rgba(200, 90, 55, 0.08) 40%, rgba(175, 75, 45, 0.14) 75%, rgba(160, 65, 40, 0) 100%)',
          transform: `translate3d(${parallaxX * 0.3}px, ${parallaxY * 0.2}px, 0)`,
          transition: 'transform 0.1s ease-out',
          mixBlendMode: 'screen',
        }}
      />

      {/* 3. Subtle Martian Sky Gradient: warm ochre illumination towards the upper atmosphere */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '35%',
          background:
            'linear-gradient(180deg, rgba(70, 20, 10, 0.18) 0%, rgba(140, 50, 25, 0.06) 60%, rgba(0, 0, 0, 0) 100%)',
        }}
      />

      {/* 4. Soft Solar Corona & Thermal Breathing Glow matching the sun in the upper-left */}
      <div
        className="mars-atmosphere-pulse"
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 14% 20%, rgba(255, 215, 165, 0.12) 0%, rgba(248, 140, 90, 0.05) 30%, transparent 65%)',
        }}
      />
    </div>
  );
};
