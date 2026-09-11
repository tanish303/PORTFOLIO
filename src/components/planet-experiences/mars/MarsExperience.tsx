import React, { useState, useEffect } from 'react';
import { useMarsParallax } from './MarsParallax';
import { MarsImageWorld } from './MarsImageWorld';
import { MarsAtmosphere } from './MarsAtmosphere';
import { MarsParticles } from './MarsParticles';
import { GlassProjectPanel } from './GlassProjectPanel';
import { soundController } from '../../../audio/SoundController';

interface MarsExperienceProps {
  onReturnToOrbit: () => void;
}

export const MarsExperience: React.FC<MarsExperienceProps> = ({ onReturnToOrbit }) => {
  const parallax = useMarsParallax();
  const [isSettled, setIsSettled] = useState(false);

  // Initial cinematic touchdown settle animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSettled(true);
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="mars-experience-container"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        overflow: 'hidden',
        background: '#0d0402',
        cursor: 'default',
      }}
    >
      {/* 1. Photorealistic 2.5D Mars Panoramic World */}
      <MarsImageWorld parallax={parallax} isSettled={isSettled} />

      {/* 2. Atmospheric Depth, Vignette & Horizon Dust Haze */}
      <MarsAtmosphere parallaxX={parallax.midX} parallaxY={parallax.midY} />

      {/* 3. Subtle Windblown Ochre Dust Micro-Particles */}
      <MarsParticles parallaxX={parallax.midX} parallaxY={parallax.midY} />

      {/* 4. Refined Floating Glass Projects Portfolio Interface */}
      <GlassProjectPanel uiX={parallax.uiX} uiY={parallax.uiY} />

      {/* 5. Minimal Cinematic Top Surface HUD: Return to Orbit Button Only */}
      <div className="mars-surface-hud" style={{ justifyContent: 'flex-end' }}>
        {/* Return to Orbit Button */}
        <button
          className="mars-return-btn"
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

export default MarsExperience;
