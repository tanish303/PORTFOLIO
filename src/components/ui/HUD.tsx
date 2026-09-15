import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { soundController } from '../../audio/SoundController';
import type { CelestialBodyData, FlightPhase, FlightStatus } from '../../types/solar';
import { getLogicalFlightSpeed, getSectorPath } from '../../data/planets';
import { PlanetDock } from './PlanetDock';

interface HUDProps {
  currentBody: CelestialBodyData;
  targetBody: CelestialBodyData | null;
  flightStatus: FlightStatus;
  flightPhase?: FlightPhase;
  discoveredIds: Set<string>;
  totalPlanets: number;
  flightProgress: number;
  currentSpeedKmS: number;
  isOverview: boolean;
  allBodies: CelestialBodyData[];
  onSelectDestination: (id: string) => void;
  onReturnHome: () => void;
  onToggleOverview: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  currentBody,
  targetBody,
  flightStatus,
  flightPhase = 'IDLE',
  flightProgress,
  allBodies,
  onSelectDestination,
}) => {
  const [isMuted, setIsMuted] = useState(soundController.getMuted());

  const handleToggleSound = () => {
    const next = soundController.toggleMute();
    setIsMuted(next);
  };

  const isFlying = flightPhase !== 'IDLE' ||
    flightStatus === 'LAUNCHING' ||
    flightStatus === 'CRUISING' ||
    flightStatus === 'BRAKING';

  const isSunTarget = targetBody?.id === 'sun';
  const isSupernova =
    flightStatus === 'SUPERNOVA_EXPLODING' ||
    flightStatus === 'SUPERNOVA_RESETTING';

  // Compute realistic/logical speed based on planetary astronomical distances
  const logicalSpeedDisplay = isFlying && targetBody
    ? getLogicalFlightSpeed(currentBody.id, targetBody.id, flightProgress)
    : null;

  return (
    <div className="hud-overlay">
      {/* Top Bar: Clean Header & Audio Toggle */}
      <div className="hud-top-bar">
        {/* Top Left: Clean TANISH / PORTFOLIO branding */}
        <div className="hud-title-block">
          <div className="hud-clean-name">TANISH</div>
          <div className="hud-clean-portfolio">PORTFOLIO</div>
        </div>

        {/* Audio Mute/Unmute Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            className="hud-btn hud-interactive"
            onClick={handleToggleSound}
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            style={{ padding: '8px 10px' }}
          >
            {isMuted ? <VolumeX size={15} color="#94a3b8" /> : <Volume2 size={15} color="#00f0ff" />}
          </button>
        </div>
      </div>

      {/* Bottom Area: Telemetry, Navigation Dock & Non-clickable Instruction Banner */}
      <div className="hud-bottom-bar">
        {/* Telemetry Card: Shows location, destination while travelling, and speed only while flying */}
        <div className="hud-telemetry-card">
          <div className="telemetry-col">
            <span className="telemetry-label">CURRENT LOCATION</span>
            <span className="telemetry-val highlight telemetry-location-val">
              {getSectorPath(currentBody.id).toUpperCase()}
            </span>
          </div>

          {/* Destination displayed ONLY when travelling to a planet */}
          {isFlying && targetBody && (
            <div className="telemetry-col" style={{ marginTop: '8px' }}>
              <span className="telemetry-label">DESTINATION</span>
              <span className="telemetry-val highlight telemetry-destination-val">
                {(() => {
                  if (targetBody.id === 'sun') return 'Solar Core';
                  if (targetBody.id === 'earth') return 'Home';
                  if (targetBody.id === 'askai') return 'Ask AI';
                  return targetBody.label
                    .toLowerCase()
                    .split(' ')
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');
                })()}
              </span>
            </div>
          )}

          {/* Velocity displayed ONLY when the rocket is flying */}
          {isFlying && logicalSpeedDisplay && (
            <div className="telemetry-col" style={{ marginTop: '8px' }}>
              <span className="telemetry-label">SPEED</span>
              <span className="telemetry-val highlight">
                {logicalSpeedDisplay}
              </span>
            </div>
          )}

          {isFlying && (
            <div style={{ width: '100%', marginTop: '4px' }}>
              <div
                style={{
                  height: '3px',
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '2px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${flightProgress * 100}%`,
                    background: isSunTarget
                      ? 'linear-gradient(90deg, #ffaa00, #ff3344)'
                      : 'linear-gradient(90deg, #00f0ff, #00ffaa)',
                    boxShadow: '0 0 8px rgba(0,240,255,0.6)',
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Interactive Planetary Navigation Dock */}
        <PlanetDock
          allBodies={allBodies}
          currentBody={currentBody}
          targetBody={targetBody}
          onSelectDestination={onSelectDestination}
        />

        {/* Right Bottom Corner: Non-clickable instructional banner replacing the button */}
        <div className="hud-instruction-banner">
          <span className="hud-instruction-icon">✦</span>
          <span className="hud-instruction-text">
            Click on any planet in the solar system to visit
          </span>
        </div>
      </div>

      {/* Full-screen Flash Overlay during Supernova detonation */}
      {isSupernova && (
        <div
          className="supernova-screen-flash"
          style={{
            opacity: flightStatus === 'SUPERNOVA_EXPLODING' ? 0.9 : 0.2,
          }}
        />
      )}
    </div>
  );
};
