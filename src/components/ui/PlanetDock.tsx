import React from 'react';
import type { CelestialBodyData } from '../../types/solar';

interface PlanetDockProps {
  allBodies: CelestialBodyData[];
  currentBody: CelestialBodyData;
  targetBody: CelestialBodyData | null;
  onSelectDestination: (id: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

export const PlanetDock: React.FC<PlanetDockProps> = ({
  allBodies,
  currentBody,
  targetBody,
  onSelectDestination,
  className = '',
  style,
}) => {
  return (
    <div className={`hud-planet-dock hud-interactive ${className}`} style={style}>
      {allBodies.map((body) => {
        const isCurrent = currentBody.id === body.id;
        const isTarget = targetBody?.id === body.id;
        const isEarth = body.id === 'earth';
        const isSun = body.id === 'sun';

        return (
          <button
            key={body.id}
            className={`hud-dock-btn ${isCurrent ? 'current' : ''} ${
              isTarget ? 'target' : ''
            } ${isEarth ? 'earth-dock' : ''} ${isSun ? 'sun-dock' : ''}`}
            onClick={() => onSelectDestination(body.id)}
            title={`${body.label} - ${body.tagline}`}
          >
            <span
              className="hud-dock-dot"
              style={{
                backgroundColor: body.color,
                boxShadow: `0 0 8px ${body.color}`,
              }}
            />
            <span className="hud-dock-label">{body.label}</span>
            {isCurrent && <span className="hud-dock-badge">HERE</span>}
          </button>
        );
      })}
    </div>
  );
};
