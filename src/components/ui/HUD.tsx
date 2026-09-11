import React, { useState } from 'react';
import { Volume2, VolumeX, Eye, Home, AlertTriangle } from 'lucide-react';
import { soundController } from '../../audio/SoundController';
import type { CelestialBodyData, FlightPhase, FlightStatus } from '../../types/solar';
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
  discoveredIds,
  totalPlanets,
  flightProgress,
  currentSpeedKmS,
  isOverview,
  allBodies,
  onSelectDestination,
  onReturnHome,
  onToggleOverview,
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

  return (
    <div className="hud-overlay">
      {/* Top Bar: Mission Control Header & Status */}
      <div className="hud-top-bar">
        <div className="hud-title-block">
          <div className="hud-brand">
            <span>TANIS</span>
            <span className="hud-brand-tag">MISSION CONTROL</span>
          </div>
          <div className="hud-subbrand">
            SOLAR SYSTEM PORTFOLIO // 8 ORBITAL SECTORS
          </div>
        </div>

        {/* Mission Status Indicator */}
        <div className="hud-mission-status">
          <div
            className={`mission-indicator-dot ${
              isSunTarget ? 'danger' : isFlying ? 'burn' : ''
            }`}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{ fontSize: '9px', letterSpacing: '1.5px', color: '#64748b' }}>
              TRAJECTORY STATUS
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '1px',
                color: isSunTarget ? '#ff4444' : isFlying ? '#ffaa00' : '#00f0ff',
              }}
            >
              {isOverview && !isFlying && 'SYSTEM OVERVIEW // ALL 8 PLANETS ACTIVE'}
              {!isOverview && flightPhase === 'IDLE' && `DOCKED // ${currentBody.name.toUpperCase()}`}
              {flightPhase === 'FOCUS_DEPARTURE' && `DESTINATION LOCKED // FOCUSING DEPARTURE: ${currentBody.label}`}
              {flightPhase === 'HOLD_DEPARTURE' && `PRE-LAUNCH SEQUENCE // ${currentBody.label} LAUNCH PAD`}
              {flightPhase === 'VERTICAL_ASCENT' && `VERTICAL ASCENT // CLEARING ATMOSPHERE`}
              {flightPhase === 'TRANSITION_TURN' && `TRAJECTORY ALIGNMENT // VECTOR LOCKED`}
              {flightPhase === 'DIRECT_CRUISE' && (isSunTarget ? 'CRITICAL SOLAR DESCENT' : `DIRECT CRUISE INTERCEPT // ${targetBody?.label} [${Math.round(flightProgress * 100)}%]`)}
              {flightPhase === 'APPROACH_DOCK' && `BRAKING & INSERTION // ${targetBody?.label}`}
              {flightStatus === 'SUPERNOVA_EXPLODING' && 'SUPERNOVA DETONATION'}
              {flightStatus === 'SUPERNOVA_RESETTING' && 'QUANTUM RECONSTRUCTION'}
            </span>
          </div>
        </div>

        {/* Worlds Discovered & Sound Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="hud-discovery-box">
            <span className="hud-discovery-label">Worlds Explored</span>
            <span className="hud-discovery-count">
              {discoveredIds.size} / {totalPlanets}
            </span>
          </div>

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

      {/* Sun Critical Trajectory Warning Banner */}
      {isSunTarget && (
        <div className="sun-warning-banner">
          <AlertTriangle size={18} color="#ff3344" />
          <span>WARNING: SOLAR VECTOR LOCKED // CRITICAL HEAT FLUX DETECTED</span>
        </div>
      )}

      {/* Bottom Area: Planet Quick-Dock & Telemetry */}
      <div className="hud-bottom-bar">
        {/* Telemetry Card */}
        <div className="hud-telemetry-card">
          <div className="telemetry-row">
            <span className="telemetry-label">CURRENT LOCATION</span>
            <span className="telemetry-val highlight">{currentBody.label}</span>
          </div>
          <div className="telemetry-row">
            <span className="telemetry-label">DESTINATION</span>
            <span className="telemetry-val">
              {targetBody ? targetBody.label : 'STANDBY // READY'}
            </span>
          </div>
          <div className="telemetry-row">
            <span className="telemetry-label">VELOCITY</span>
            <span className="telemetry-val highlight">
              {isFlying ? `${currentSpeedKmS.toFixed(1)} km/s` : 'ORBITAL 7.8 km/s'}
            </span>
          </div>
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

        {/* Camera Perspective Controls */}
        <div className="hud-nav-buttons hud-interactive">
          <button
            className={`hud-btn ${isOverview ? 'primary' : ''}`}
            onClick={onToggleOverview}
            title="Toggle between full Solar System Overview and close Planet Inspection"
          >
            <Eye size={14} />
            <span>{isOverview ? 'SYSTEM OVERVIEW' : 'INSPECT ORBIT'}</span>
          </button>

          {currentBody.id !== 'earth' && (
            <button
              className="hud-btn home-btn"
              onClick={onReturnHome}
              disabled={isFlying}
            >
              <Home size={14} />
              <span>RETURN HOME</span>
            </button>
          )}
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
