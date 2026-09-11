import React, { useState, useEffect } from 'react';
import type { PlanetEnvironmentConfig } from '../../../data/planetEnvironments';
import { usePlanetParallax } from './PlanetParallax';
import { PlanetImageWorld } from './PlanetImageWorld';
import { PlanetAtmosphere } from './PlanetAtmosphere';
import { PlanetGlassPanel } from './PlanetGlassPanel';
import { soundController } from '../../../audio/SoundController';

interface PlanetEnvironmentProps {
  config: PlanetEnvironmentConfig;
  onReturnToOrbit: () => void;
}

export const PlanetEnvironment: React.FC<PlanetEnvironmentProps> = ({ config, onReturnToOrbit }) => {
  const parallax = usePlanetParallax();
  const [isSettled, setIsSettled] = useState(false);

  // Cinematic touchdown settle animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSettled(true);
    }, 150);
    return () => clearTimeout(timer);
  }, [config.id]);

  return (
    <div
      className="planet-experience-container"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        overflow: 'hidden',
        background: '#0a0a0f',
        cursor: 'default',
      }}
    >
      {/* 1. Photorealistic 2.5D Planet Landscape Environment */}
      <PlanetImageWorld
        imageSrc={config.bgImage}
        alt={config.name}
        parallax={parallax}
        isSettled={isSettled}
        themeColorRgb={config.themeColorRgb}
      />

      {/* 2. Atmospheric Layers & Light Interaction tailored to this planet */}
      <PlanetAtmosphere
        atmosphereType={config.atmosphereType}
        themeColorRgb={config.themeColorRgb}
        parallaxX={parallax.midX}
        parallaxY={parallax.midY}
      />

      {/* 3. Floating Glassmorphic Portfolio Card Interface */}
      <PlanetGlassPanel config={config} uiX={parallax.uiX} uiY={parallax.uiY} />

      {/* 4. Minimal Cinematic Top Surface HUD: Return to Orbit Button Only */}
      <div className="planet-surface-hud" style={{ justifyContent: 'flex-end' }}>
        {/* Return to Orbit Button */}
        <button
          className="planet-return-btn"
          style={{
            borderColor: `rgba(${config.themeColorRgb}, 0.4)`,
            boxShadow: `0 8px 24px rgba(0, 0, 0, 0.5), 0 0 20px rgba(${config.themeColorRgb}, 0.15)`,
          }}
          onClick={() => {
            soundController.playDestinationSelect();
            onReturnToOrbit();
          }}
        >
          <span>▲ RETURN TO ORBIT</span>
        </button>
      </div>
    </div>
  );
};

export default PlanetEnvironment;
