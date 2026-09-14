import React from 'react';

interface PlanetAtmosphereProps {
  atmosphereType: 'earth' | 'mercury' | 'venus' | 'jupiter' | 'saturn' | 'uranus' | 'neptune';
  themeColorRgb: string;
  parallaxX?: number;
  parallaxY?: number;
}

export const PlanetAtmosphere: React.FC<PlanetAtmosphereProps> = ({
  atmosphereType,
  themeColorRgb,
  parallaxX = 0,
  parallaxY = 0,
}) => {
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
      {/* 1. Cinematic Lens Falloff / Soft Vignette (Ultra-clear, lets landscape shine through) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse at 50% 50%, rgba(0, 0, 0, 0) 65%, rgba(0, 0, 0, 0.15) 88%, rgba(0, 0, 0, 0.32) 100%)`,
        }}
      />

      {/* 2. Planet-Specific Atmospheric Overlays */}

      {/* MERCURY: Barren rocky surface, NO atmosphere. Stark sunlight corona, intense thermal solar radiation glow */}
      {atmosphereType === 'mercury' && (
        <>
          {/* Intense solar corona flare towards the huge glowing sun in the upper center/left */}
          <div
            className="mercury-solar-corona"
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(circle at 45% 28%, rgba(255, 255, 255, 0.22) 0%, rgba(254, 240, 138, 0.14) 25%, rgba(245, 158, 11, 0.05) 55%, transparent 75%)',
              mixBlendMode: 'screen',
            }}
          />
          {/* Stark ground heat-shimmer gradient on crater ridges */}
          <div
            className="mercury-heat-shimmer"
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '25%',
              background:
                'linear-gradient(0deg, rgba(20, 20, 25, 0.25) 0%, rgba(30, 30, 40, 0.08) 50%, transparent 100%)',
            }}
          />
        </>
      )}

      {/* VENUS: Golden atmospheric glow and slow cloud movement (Clear, unmurky) */}
      {atmosphereType === 'venus' && (
        <>
          {/* Subtle golden warm ambient glow */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(circle at 50% 30%, rgba(254, 240, 138, 0.12) 0%, rgba(234, 179, 8, 0.14) 45%, rgba(161, 98, 7, 0.16) 100%)',
              mixBlendMode: 'screen',
            }}
          />
          {/* Slowly drifting sulfur cloud sheen */}
          <div
            className="venus-cloud-layer-1"
            style={{
              position: 'absolute',
              top: '-15%',
              left: '-20%',
              width: '140%',
              height: '130%',
              background:
                'radial-gradient(ellipse at 35% 40%, rgba(250, 204, 21, 0.1) 0%, rgba(202, 138, 4, 0.05) 50%, transparent 80%)',
              transform: `translate3d(${parallaxX * 0.4}px, ${parallaxY * 0.25}px, 0)`,
              mixBlendMode: 'screen',
            }}
          />
          <div
            className="venus-cloud-layer-2"
            style={{
              position: 'absolute',
              bottom: '10%',
              left: '-10%',
              right: '-10%',
              height: '35%',
              background:
                'linear-gradient(180deg, transparent 0%, rgba(217, 119, 6, 0.06) 40%, rgba(180, 83, 9, 0.12) 100%)',
              mixBlendMode: 'screen',
            }}
          />
        </>
      )}

      {/* JUPITER: Turbulent gas bands and subtle atmospheric movement */}
      {atmosphereType === 'jupiter' && (
        <>
          {/* Dynamic cyclonic gas band drift */}
          <div
            className="jupiter-gas-flow-1"
            style={{
              position: 'absolute',
              top: '15%',
              left: '-15%',
              width: '130%',
              height: '70%',
              background:
                'linear-gradient(90deg, transparent 0%, rgba(245, 158, 11, 0.06) 25%, rgba(217, 119, 6, 0.1) 50%, rgba(180, 83, 9, 0.05) 75%, transparent 100%)',
              transform: `translate3d(${parallaxX * 0.5}px, ${parallaxY * 0.2}px, 0)`,
              mixBlendMode: 'screen',
            }}
          />
          {/* Great Red Spot / cyclonic storm warm pulse */}
          <div
            className="jupiter-storm-glow"
            style={{
              position: 'absolute',
              bottom: '22%',
              left: '20%',
              width: '45vw',
              height: '35vh',
              background:
                'radial-gradient(ellipse at 50% 50%, rgba(239, 68, 68, 0.12) 0%, rgba(217, 119, 6, 0.05) 55%, transparent 80%)',
              mixBlendMode: 'screen',
              transform: `translate3d(${parallaxX * 0.35}px, ${parallaxY * 0.25}px, 0)`,
            }}
          />
        </>
      )}

      {/* SATURN: Calm gaseous atmosphere with distant enormous rings */}
      {atmosphereType === 'saturn' && (
        <>
          {/* Serene golden ring-shadow gradient */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(circle at 60% 40%, rgba(254, 240, 138, 0.1) 0%, rgba(234, 179, 8, 0.05) 50%, rgba(15, 12, 5, 0.15) 100%)',
              mixBlendMode: 'screen',
            }}
          />
          {/* Distant majestic ring illumination sheen */}
          <div
            className="saturn-ring-sheen"
            style={{
              position: 'absolute',
              top: '5%',
              left: '-10%',
              right: '-10%',
              height: '40%',
              background:
                'linear-gradient(135deg, rgba(254, 249, 195, 0.1) 0%, rgba(253, 224, 71, 0.06) 40%, transparent 80%)',
              transform: `translate3d(${parallaxX * 0.2}px, ${parallaxY * 0.15}px, 0)`,
              mixBlendMode: 'screen',
            }}
          />
        </>
      )}

      {/* URANUS: Pale cyan, smooth calm atmosphere with subtle movement */}
      {atmosphereType === 'uranus' && (
        <>
          {/* Pale cyan smooth calm atmospheric envelope */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(circle at 50% 40%, rgba(165, 243, 252, 0.1) 0%, rgba(103, 232, 249, 0.06) 50%, rgba(8, 51, 68, 0.15) 100%)',
              mixBlendMode: 'screen',
            }}
          />
          {/* Ethereal drifting cyan ice mist */}
          <div
            className="uranus-ice-drift"
            style={{
              position: 'absolute',
              bottom: '15%',
              left: '-20%',
              width: '140%',
              height: '45%',
              background:
                'linear-gradient(180deg, transparent 0%, rgba(165, 243, 252, 0.06) 50%, rgba(34, 211, 238, 0.08) 100%)',
              transform: `translate3d(${parallaxX * 0.3}px, ${parallaxY * 0.2}px, 0)`,
              mixBlendMode: 'screen',
            }}
          />
        </>
      )}

      {/* NEPTUNE: Deep rich cobalt/azure oceanic atmosphere (Clear, bright) */}
      {atmosphereType === 'neptune' && (
        <>
          {/* Deep cobalt azure oceanic atmosphere envelope */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.14) 0%, rgba(29, 78, 216, 0.12) 60%, rgba(15, 23, 42, 0.2) 100%)',
              mixBlendMode: 'screen',
            }}
          />
          {/* Supersonic methane storm wind streaks */}
          <div
            className="neptune-storm-winds"
            style={{
              position: 'absolute',
              top: '25%',
              left: '-30%',
              width: '160%',
              height: '55%',
              background:
                'linear-gradient(95deg, transparent 0%, rgba(96, 165, 250, 0.1) 30%, rgba(59, 130, 246, 0.14) 60%, transparent 100%)',
              transform: `translate3d(${parallaxX * 0.55}px, ${parallaxY * 0.25}px, 0)`,
              mixBlendMode: 'screen',
            }}
          />
        </>
      )}

      {/* EARTH: Realistic landscape with subtle cloud/foreground parallax */}
      {atmosphereType === 'earth' && (
        <>
          {/* Morning alpine sunlight glow from upper left */}
          <div
            className="earth-sun-lens"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '65vw',
              height: '55vh',
              background:
                'radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.25) 0%, rgba(186, 230, 253, 0.15) 35%, rgba(56, 189, 248, 0.05) 70%, transparent 100%)',
              mixBlendMode: 'screen',
            }}
          />
          {/* Subtle low-altitude alpine lake mist */}
          <div
            style={{
              position: 'absolute',
              bottom: '22%',
              left: '-10%',
              right: '-10%',
              height: '20%',
              background:
                'linear-gradient(180deg, transparent 0%, rgba(224, 242, 254, 0.1) 60%, transparent 100%)',
              transform: `translate3d(${parallaxX * 0.3}px, ${parallaxY * 0.18}px, 0)`,
              mixBlendMode: 'screen',
            }}
          />
        </>
      )}

      {/* 3. Subtle Horizon Ambient Ground Tint */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '28%',
          background: `linear-gradient(0deg, rgba(10, 10, 15, 0.6) 0%, rgba(${themeColorRgb}, 0.08) 60%, transparent 100%)`,
        }}
      />
    </div>
  );
};
