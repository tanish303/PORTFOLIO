import React, { useState } from 'react';
import type { PlanetParallaxOffsets } from './PlanetParallax';

interface PlanetImageWorldProps {
  imageSrc: string;
  alt: string;
  parallax: PlanetParallaxOffsets;
  isSettled: boolean;
  themeColorRgb: string;
}

export const PlanetImageWorld: React.FC<PlanetImageWorldProps> = ({
  imageSrc,
  alt,
  parallax,
  isSettled,
  themeColorRgb,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        background: '#0a0a0f',
        userSelect: 'none',
      }}
    >
      {/* 1. Cinematic Photorealistic Planet Landscape Background */}
      <img
        src={imageSrc}
        alt={alt}
        onLoad={() => setImageLoaded(true)}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          minWidth: '116vw',
          minHeight: '116vh',
          width: '116vw',
          height: '116vh',
          objectFit: 'cover',
          objectPosition: '50% 50%',
          transform: `translate(-50%, -50%) translate3d(${parallax.midX}px, ${parallax.midY}px, 0) scale(${
            isSettled ? 1.05 : 1.14
          })`,
          transition: isSettled
            ? 'transform 0.08s ease-out, opacity 0.6s ease'
            : 'transform 2.2s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease',
          filter: 'brightness(1.02) contrast(1.03)',
          opacity: imageLoaded ? 1 : 0.8,
          willChange: 'transform',
        }}
      />

      {/* 2. Foreground Depth Ground Shadow Layer */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: '-5%',
          right: '-5%',
          height: '35%',
          background: `linear-gradient(0deg, rgba(8, 8, 12, 0.6) 0%, rgba(12, 12, 18, 0.2) 45%, transparent 100%)`,
          transform: `translate3d(${parallax.fgX * 0.35}px, ${parallax.fgY * 0.25}px, 0)`,
          transition: 'transform 0.08s ease-out',
          pointerEvents: 'none',
        }}
      />

      {/* 3. Subtle ambient light bleed matching planet theme */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at 50% 50%, rgba(${themeColorRgb}, 0.04) 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};
