import React, { useState, useEffect } from 'react';
import type { PlanetEnvironmentConfig } from '../../../data/planetEnvironments';
import { usePlanetParallax } from './PlanetParallax';
import { PlanetImageWorld } from './PlanetImageWorld';
import { PlanetAtmosphere } from './PlanetAtmosphere';
import { PlanetGlassPanel } from './PlanetGlassPanel';
import { MercurySkillsPanel } from '../mercury/MercurySkillsPanel';
import { EarthExperiencePanel } from '../earth/EarthExperiencePanel';
import { VenusExperiencePanel } from '../venus/VenusExperiencePanel';
import { JupiterEducationPanel } from '../jupiter/JupiterEducationPanel';
import { SaturnGuestbookPanel } from '../saturn/SaturnGuestbookPanel';
import { UranusConnectPanel } from '../uranus/UranusConnectPanel';
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

  const renderPlanetPanel = () => {
    switch (config.id) {
      case 'skills':
        return <MercurySkillsPanel config={config} uiX={parallax.uiX} uiY={parallax.uiY} />;
      case 'earth':
        return <EarthExperiencePanel uiX={parallax.uiX} uiY={parallax.uiY} />;
      case 'experience':
        return <VenusExperiencePanel uiX={parallax.uiX} uiY={parallax.uiY} />;
      case 'education':
        return <JupiterEducationPanel uiX={parallax.uiX} uiY={parallax.uiY} />;
      case 'guestbook':
        return <SaturnGuestbookPanel uiX={parallax.uiX} uiY={parallax.uiY} />;
      case 'contact':
        return <UranusConnectPanel uiX={parallax.uiX} uiY={parallax.uiY} />;
      default:
        return <PlanetGlassPanel config={config} uiX={parallax.uiX} uiY={parallax.uiY} />;
    }
  };

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
      {renderPlanetPanel()}

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
