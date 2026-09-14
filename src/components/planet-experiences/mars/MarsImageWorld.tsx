import React, { useState } from 'react';
import type { ParallaxOffsets } from './MarsParallax';

interface MarsImageWorldProps {
  parallax: ParallaxOffsets;
  isSettled: boolean;
}

export const MarsImageWorld: React.FC<MarsImageWorldProps> = ({ parallax, isSettled }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  // The user's chosen cinematic Mars landscape image
  const marsLandscapeUrl = '/images/mars/mars_cinematic_landscape.jpg';

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        background: '#160805',
        userSelect: 'none',
      }}
    >
      {/* Cinematic Mars Landscape Environment */}
      <img
        src={marsLandscapeUrl}
        alt="Cinematic Martian landscape with distant mountains, canyon valley and glowing sun"
        onLoad={() => setImageLoaded(true)}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          minWidth: '118vw',
          minHeight: '118vh',
          width: '118vw',
          height: '118vh',
          objectFit: 'cover',
          objectPosition: '50% 48%',
          transform: `translate(-50%, -50%) translate3d(${parallax.midX}px, ${parallax.midY}px, 0) scale(${
            isSettled ? 1.15 : 1.22
          })`,
          transition: isSettled
            ? 'transform 0.08s ease-out, opacity 0.6s ease'
            : 'transform 2.2s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease',
          filter: 'brightness(1.08) contrast(1.06) saturate(1.08)',
          opacity: imageLoaded ? 1 : 0.88,
          willChange: 'transform',
        }}
      />

      {/* 3. Foreground Depth Ground Layer (Crisp, lightened for clear landscape viewing) */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: '-5%',
          right: '-5%',
          height: '24%',
          background:
            'linear-gradient(0deg, rgba(14, 5, 3, 0.28) 0%, rgba(20, 8, 4, 0.08) 45%, rgba(0, 0, 0, 0) 100%)',
          transform: `translate3d(${parallax.fgX * 0.4}px, ${parallax.fgY * 0.3}px, 0)`,
          transition: 'transform 0.08s ease-out',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};
