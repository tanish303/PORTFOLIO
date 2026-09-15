import React, { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SpaceBackground } from './components/3d/SpaceBackground';
import { Asteroids } from './components/3d/Asteroids';
import { Sun } from './components/3d/Sun';
import { Earth } from './components/3d/Earth';
import { Planet } from './components/3d/Planet';
import { Rocket } from './components/3d/Rocket';
import { CameraController } from './components/3d/CameraController';
import { SupernovaEffect } from './components/3d/SupernovaEffect';
import { HUD } from './components/ui/HUD';
import {
  ALL_CELESTIAL_BODIES,
  EARTH_DATA,
  SECTION_PLANETS,
  calculateOrbitalPosition,
  getSectorPath,
} from './data/planets';
import type { CelestialBodyData, FlightPhase, FlightStatus } from './types/solar';
import { soundController } from './audio/SoundController';
import { MarsExperience } from './components/planet-experiences/mars/MarsExperience';
import { PlanetEnvironment } from './components/planet-experiences/generic/PlanetEnvironment';
import { PLANET_ENVIRONMENTS } from './data/planetEnvironments';
import { PlanetDock } from './components/ui/PlanetDock';

// Main 3D Scene content running inside Canvas
interface UniverseSceneProps {
  currentBody: CelestialBodyData;
  targetBody: CelestialBodyData | null;
  flightStatus: FlightStatus;
  flightPhase: FlightPhase;
  phaseProgress: number;
  flightProgress: number;
  currentRocketPos: [number, number, number];
  currentRocketVel: [number, number, number];
  isFlying: boolean;
  isOverview: boolean;
  supernovaProgress: number;
  supernovaOrigin: [number, number, number];
  isSupernovaActive: boolean;
  onSelectDestination: (id: string) => void;
  onRocketWorldPosUpdate: (pos: THREE.Vector3, dir: THREE.Vector3, speed: number) => void;
  onFrameUpdate: (elapsedTime: number, delta: number) => void;
}

const UniverseScene: React.FC<UniverseSceneProps> = ({
  currentBody,
  targetBody,
  flightStatus,
  flightPhase,
  phaseProgress,
  flightProgress,
  currentRocketPos,
  currentRocketVel,
  isFlying,
  isOverview,
  supernovaProgress,
  supernovaOrigin,
  isSupernovaActive,
  onSelectDestination,
  onRocketWorldPosUpdate,
  onFrameUpdate,
}) => {
  const timeRef = useRef(0);
  const rocketWorldPos = useRef(new THREE.Vector3(...currentRocketPos));
  const rocketWorldDir = useRef(new THREE.Vector3(0, 1, 0));

  useFrame((state, delta) => {
    timeRef.current = state.clock.getElapsedTime();
    onFrameUpdate(timeRef.current, delta);
  });

  const handleRocketPosBroadcast = useCallback(
    (pos: THREE.Vector3, dir: THREE.Vector3, speed: number) => {
      rocketWorldPos.current.copy(pos);
      rocketWorldDir.current.copy(dir);
      onRocketWorldPosUpdate(pos, dir, speed);
    },
    [onRocketWorldPosUpdate]
  );

  const currentBodyPos = calculateOrbitalPosition(currentBody, timeRef.current);
  const targetBodyPos = targetBody ? calculateOrbitalPosition(targetBody, timeRef.current) : null;

  return (
    <>
      {/* Background Starfield */}
      <SpaceBackground />

      {/* Realistic Rocky Asteroids drifting through solar system */}
      <Asteroids />

      {/* Multi-Phase Cinematic Camera Controller */}
      <CameraController
        currentLocationPos={currentBodyPos}
        targetLocationPos={targetBodyPos}
        currentRadius={currentBody.radius}
        targetRadius={targetBody?.radius || 3.0}
        hasRings={!!currentBody.rings}
        rocketPos={rocketWorldPos.current}
        rocketDir={rocketWorldDir.current}
        isFlying={isFlying}
        flightProgress={flightProgress}
        flightPhase={flightPhase}
        phaseProgress={phaseProgress}
        isOverview={isOverview}
        flightStatus={flightStatus}
        supernovaProgress={supernovaProgress}
      />

      {/* Sun: Glowing solar surface with corona and sunlight */}
      <Sun
        onSelect={onSelectDestination}
        isSelected={targetBody?.id === 'sun'}
        isExploding={flightStatus === 'SUPERNOVA_EXPLODING'}
        hideLabels={isSupernovaActive}
      />

      {/* Supernova Detonation Effect on Sun Collision - Colossal expanding multi-ring shockwaves */}
      <SupernovaEffect
        active={
          flightStatus === 'SUPERNOVA_EXPLODING' ||
          flightStatus === 'SUPERNOVA_RESETTING'
        }
        progress={supernovaProgress}
        origin={supernovaOrigin}
      />

      {/* Earth: Terra Base with pulsing YOU ARE HERE marker */}
      <Earth
        onSelect={onSelectDestination}
        isSelected={targetBody?.id === 'earth'}
        isCurrentLocation={currentBody.id === 'earth'}
        hideLabels={isSupernovaActive}
      />

      {/* All Orbiting Section Planets */}
      {SECTION_PLANETS.map((planet) => (
        <Planet
          key={planet.id}
          data={planet}
          onSelect={onSelectDestination}
          isSelected={targetBody?.id === planet.id}
          isCurrentLocation={currentBody.id === planet.id}
          hideLabels={isSupernovaActive}
        />
      ))}

      {/* Interplanetary Rocket - Vaporized & completely hidden during blast & supernova */}
      <Rocket
        currentPos={currentRocketPos}
        travelVelocity={currentRocketVel}
        flightProgress={flightProgress}
        flightPhase={flightPhase}
        isFlying={isFlying}
        visible={
          (isFlying || isOverview) &&
          flightStatus !== 'SUPERNOVA_EXPLODING' &&
          flightStatus !== 'SUPERNOVA_RESETTING'
        }
        onRocketWorldPosUpdate={handleRocketPosBroadcast}
      />
    </>
  );
};

export function App() {
  // Navigation & Location State
  const [currentBodyId, setCurrentBodyId] = useState<string>('earth');
  const [targetBodyId, setTargetBodyId] = useState<string | null>(null);
  const [flightStatus, setFlightStatus] = useState<FlightStatus>('DOCKED');
  const [flightPhase, setFlightPhase] = useState<FlightPhase>('IDLE');
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [discoveredIds, setDiscoveredIds] = useState<Set<string>>(new Set(['earth']));

  // Start with the whole solar system visible on initial landing
  const [isOverview, setIsOverview] = useState<boolean>(true);

  // Inside-Planet Planetary Experience State
  const [activeExperience, setActiveExperience] = useState<string | null>(null);
  const [transitionBodyId, setTransitionBodyId] = useState<string>('projects');
  // Continuous Cinematic Entry Flow: 'idle' | 'entering' | 'skipping_clouds' | 'clearing'
  const [atmosphereFlowPhase, setAtmosphereFlowPhase] = useState<'idle' | 'entering' | 'skipping_clouds' | 'clearing'>('idle');
  const atmosphereFlowRef = useRef<'idle' | 'entering' | 'skipping_clouds' | 'clearing'>('idle');

  // Flight Physics & Telemetry State
  const [flightProgress, setFlightProgress] = useState(0);
  const [currentSpeedKmS, setCurrentSpeedKmS] = useState(7.8);
  const [supernovaProgress, setSupernovaProgress] = useState(0);
  const [supernovaOrigin, setSupernovaOrigin] = useState<[number, number, number]>([0, 0, 0]);

  // Trajectory tracking references
  const elapsedTimeRef = useRef<number>(0);
  const phaseStartTime = useRef<number>(0);
  const launchDir = useRef<THREE.Vector3>(new THREE.Vector3(0, 1, 0.25).normalize());
  const launchClearancePos = useRef<THREE.Vector3>(new THREE.Vector3());
  const currentRocketPos = useRef<[number, number, number]>([30, 3.2, 0]);
  const currentRocketVel = useRef<[number, number, number]>([0, 1, 0]);
  const rocketSimPos = useRef<THREE.Vector3>(new THREE.Vector3(30, 3.2, 0));
  const rocketSimVel = useRef<THREE.Vector3>(new THREE.Vector3(0, 1, 0));
  const initialDistToTarget = useRef<number>(100);
  const focusDuration = useRef<number>(1.2);
  const lastHudUpdate = useRef<number>(0);

  // Resolve body objects
  const currentBody = useMemo(() => {
    return ALL_CELESTIAL_BODIES.find((b) => b.id === currentBodyId) || EARTH_DATA;
  }, [currentBodyId]);

  const targetBody = useMemo(() => {
    return targetBodyId ? ALL_CELESTIAL_BODIES.find((b) => b.id === targetBodyId) || null : null;
  }, [targetBodyId]);

  const isFlying = flightPhase !== 'IDLE';

  // Audio initialization on user interaction
  useEffect(() => {
    const handleFirstClick = () => {
      soundController.init();
      window.removeEventListener('pointerdown', handleFirstClick);
    };
    window.addEventListener('pointerdown', handleFirstClick);
    return () => window.removeEventListener('pointerdown', handleFirstClick);
  }, []);

  // Technical Alert Toast Notification
  const [technicalToast, setTechnicalToast] = useState<{
    title: string;
    subtitle: string;
  } | null>(null);
  const toastTimeoutRef = useRef<number | null>(null);

  const showTechnicalToast = useCallback((title: string, subtitle: string = '') => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setTechnicalToast({ title, subtitle });
    toastTimeoutRef.current = window.setTimeout(() => {
      setTechnicalToast(null);
    }, 2800);
  }, []);

  // Initiate Flight Navigation to a Target Planet or Sun
  const handleSelectDestination = useCallback(
    (id: string) => {
      if (flightPhase !== 'IDLE') return;

      // When clicking the current planet:
      if (id === currentBodyId || (activeExperience && id === activeExperience)) {
        if (activeExperience) {
          // 1. Inside planet: show simplified red alert toast
          soundController.playTargetLock();
          const activeBody = ALL_CELESTIAL_BODIES.find((b) => b.id === (activeExperience || id)) || currentBody;
          showTechnicalToast(
            `Already on ${getSectorPath(activeBody.id)}!`,
            ''
          );
          return;
        } else {
          // 2. Outside planet: enter directly inside with smooth continuous flow!
          if (currentBody.id !== 'sun') {
            setTransitionBodyId(currentBody.id);
            atmosphereFlowRef.current = 'entering';
            setAtmosphereFlowPhase('entering');
            soundController.playAtmosphericEntry();
            setTimeout(() => {
              atmosphereFlowRef.current = 'skipping_clouds';
              setAtmosphereFlowPhase('skipping_clouds');
            }, 600);
            setTimeout(() => {
              setActiveExperience(currentBody.id);
              atmosphereFlowRef.current = 'clearing';
              setAtmosphereFlowPhase('clearing');
            }, 1400);
            setTimeout(() => {
              atmosphereFlowRef.current = 'idle';
              setAtmosphereFlowPhase('idle');
            }, 2600);
          }
          return;
        }
      }

      const target = ALL_CELESTIAL_BODIES.find((b) => b.id === id);
      if (!target) return;

      if (activeExperience) {
        setActiveExperience(null);
      }

      soundController.playTargetLock();
      setTargetBodyId(id);
      const tFocus = 0.65; // Gentle, cinematic departure focus
      focusDuration.current = tFocus;
      setIsOverview(false); // Smoothly stop overview mode, focus on current departure planet

      const now = performance.now() / 1000;
      phaseStartTime.current = now;

      // 1. Current departure planet position
      const simTime = elapsedTimeRef.current > 0 ? elapsedTimeRef.current : now * 0.15;
      const currentPlanetCenter = new THREE.Vector3(
        ...calculateOrbitalPosition(currentBody, simTime)
      );

      // 2. Compute outward vertical launch direction strictly from surface perch:
      // launchDirection = normalize(rocketPosition - currentPlanetCenter)
      const currentRocketPosVec = new THREE.Vector3(...currentRocketPos.current);
      let outDir = currentRocketPosVec.clone().sub(currentPlanetCenter).normalize();
      if (outDir.lengthSq() < 0.01) {
        outDir = new THREE.Vector3(0, 1, 0);
      }
      launchDir.current.copy(outDir);

      // 3. Rocket initial launch perch on departure planet surface
      const surfacePos = currentPlanetCenter.clone().addScaledVector(outDir, currentBody.radius + 0.2);
      rocketSimPos.current.copy(surfacePos);
      rocketSimVel.current.copy(outDir);

      currentRocketPos.current = [surfacePos.x, surfacePos.y, surfacePos.z];
      currentRocketVel.current = [outDir.x, outDir.y, outDir.z];

      // 4. Clearance waypoint
      const clearanceDist = currentBody.radius + (currentBody.rings ? 7.5 : 4.5);
      launchClearancePos.current = currentPlanetCenter.clone().addScaledVector(outDir, clearanceDist);

      // 5. Initial distance to target for flight progress HUD
      const estTargetPos = new THREE.Vector3(...calculateOrbitalPosition(target, simTime));
      initialDistToTarget.current = Math.max(10, surfacePos.distanceTo(estTargetPos));

      // 6. Begin Phase 1: FOCUS_DEPARTURE
      setFlightPhase('FOCUS_DEPARTURE');
      setFlightStatus(id === 'sun' ? 'SUPERNOVA_WARN' : 'LAUNCHING');
      setFlightProgress(0);
      setPhaseProgress(0);
      setCurrentSpeedKmS(7.8);
    },
    [currentBody, currentBodyId, flightPhase, isOverview, activeExperience, showTechnicalToast]
  );

  // Return Home Shortcut
  const handleReturnHome = useCallback(() => {
    handleSelectDestination('earth');
  }, [handleSelectDestination]);

  // Toggle Camera Overview
  const handleToggleOverview = useCallback(() => {
    setIsOverview((prev) => !prev);
  }, []);

  // Return to Orbit from Surface Experience (returns to full System Overview)
  const handleReturnToOrbit = useCallback(() => {
    atmosphereFlowRef.current = 'skipping_clouds';
    setAtmosphereFlowPhase('skipping_clouds');
    soundController.playAtmosphericEntry();
    setTimeout(() => {
      setActiveExperience(null);
      setIsOverview(true); // Return to full system overview
      atmosphereFlowRef.current = 'clearing';
      setAtmosphereFlowPhase('clearing');
    }, 800);
    setTimeout(() => {
      atmosphereFlowRef.current = 'idle';
      setAtmosphereFlowPhase('idle');
    }, 1900);
  }, []);

  // Physics & Animation Loop Frame Callback
  const handleFrameUpdate = useCallback(
    (elapsedTime: number, delta: number) => {
      elapsedTimeRef.current = elapsedTime;
      const dt = Math.min(delta, 0.05);

      // 1. SUPERNOVA DETONATION (Slow, colossal expansion over ~5.5 seconds)
      if (flightStatus === 'SUPERNOVA_EXPLODING') {
        setSupernovaProgress((prev) => {
          const next = prev + dt * 0.18;
          if (next >= 1.0) {
            setFlightStatus('SUPERNOVA_RESETTING');
            return 1.0;
          }
          return next;
        });
        return;
      }

      // 2. SUPERNOVA QUANTUM REBIRTH RESET (Smooth cosmic collapse over ~3.5 seconds)
      if (flightStatus === 'SUPERNOVA_RESETTING') {
        setSupernovaProgress((prev) => {
          const next = prev - dt * 0.28;
          if (next <= 0) {
            setCurrentBodyId('earth');
            setTargetBodyId(null);
            setFlightPhase('IDLE');
            setFlightStatus('DOCKED');
            const earthSpawn = calculateOrbitalPosition(EARTH_DATA, elapsedTime);
            currentRocketPos.current = [earthSpawn[0], earthSpawn[1] + EARTH_DATA.radius + 0.2, earthSpawn[2]];
            currentRocketVel.current = [0, 1, 0];
            rocketSimPos.current.set(earthSpawn[0], earthSpawn[1] + EARTH_DATA.radius + 0.2, earthSpawn[2]);
            rocketSimVel.current.set(0, 1, 0);
            setIsOverview(true);
            return 0;
          }
          return next;
        });
        return;
      }

      // 3. FLIGHT TRAJECTORY CALCULATION (Velocity-Based Direct Straight-Line Movement)
      if (flightPhase !== 'IDLE' && targetBody) {
        const now = performance.now() / 1000;
        const tInPhase = now - phaseStartTime.current;

        const C_curr = new THREE.Vector3(...calculateOrbitalPosition(currentBody, elapsedTime));
        const liveTarget = new THREE.Vector3(...calculateOrbitalPosition(targetBody, elapsedTime));

        // Update overall HUD flight progress based on distance to destination
        const currentDistToTarget = rocketSimPos.current.distanceTo(liveTarget);
        const touchDist = targetBody.radius + 0.2;
        const prog = THREE.MathUtils.clamp(
          1 - (currentDistToTarget - touchDist) / Math.max(1, initialDistToTarget.current),
          0,
          1
        );

        let phaseP = 0;
        let currentSpeed = 7.8;

        switch (flightPhase) {
          case 'FOCUS_DEPARTURE': {
            const dur = focusDuration.current;
            const p = THREE.MathUtils.clamp(tInPhase / dur, 0, 1);
            phaseP = p;

            // Rocket rests on departure surface pointing vertically outward
            const surfacePos = C_curr.clone().addScaledVector(launchDir.current, currentBody.radius + 0.2);
            rocketSimPos.current.copy(surfacePos);
            rocketSimVel.current.copy(launchDir.current);
            currentSpeed = 7.8;

            if (tInPhase >= dur) {
              setFlightPhase('HOLD_DEPARTURE');
              phaseStartTime.current = now;
              soundController.playEngineSpool();
            }
            break;
          }

          case 'HOLD_DEPARTURE': {
            const dur = 0.25;
            const p = THREE.MathUtils.clamp(tInPhase / dur, 0, 1);
            phaseP = p;

            // Hold current planet framed in viewport while engines spool up
            const surfacePos = C_curr.clone().addScaledVector(launchDir.current, currentBody.radius + 0.2);
            rocketSimPos.current.copy(surfacePos);
            rocketSimVel.current.copy(launchDir.current);
            currentSpeed = 7.8 + p * 4.0;

            if (tInPhase >= dur) {
              setFlightPhase('VERTICAL_ASCENT');
              phaseStartTime.current = now;
              soundController.playThrusterBlast();
            }
            break;
          }

          case 'VERTICAL_ASCENT': {
            const dur = 0.55;
            const p = THREE.MathUtils.clamp(tInPhase / dur, 0, 1);
            phaseP = p;

            // Rocket emerges vertically outward from current planet along launchDir
            const easeAscent = p * p;
            const clearanceDist = currentBody.radius + (currentBody.rings ? 7.5 : 4.5);
            const surfaceDist = currentBody.radius + 0.2;
            const currentAltitude = surfaceDist + (clearanceDist - surfaceDist) * easeAscent;

            const ascentPos = C_curr.clone().addScaledVector(launchDir.current, currentAltitude);
            rocketSimPos.current.copy(ascentPos);

            // Velocity vector points strictly along outward launch normal
            const ascentSpeed = 12.0 + easeAscent * 24.0;
            const velocity = launchDir.current.clone().multiplyScalar(ascentSpeed);
            rocketSimVel.current.copy(velocity);
            currentSpeed = ascentSpeed;

            if (tInPhase >= dur) {
              setFlightPhase('TRANSITION_TURN');
              phaseStartTime.current = now;
              launchClearancePos.current.copy(rocketSimPos.current);
            }
            break;
          }

          case 'TRANSITION_TURN': {
            const dur = 1.05; // Majestic, smooth banking turn
            const p = THREE.MathUtils.clamp(tInPhase / dur, 0, 1);
            phaseP = p;

            // Destination direction from current clearance position
            const toDest = liveTarget.clone().sub(rocketSimPos.current).normalize();

            // Smoothly curve velocity vector from vertical launchDir toward destination
            const ease = p * p * (3 - 2 * p);
            const turnDir = launchDir.current.clone().lerp(toDest, ease).normalize();

            const turnSpeed = 24.0 + ease * 18.0;
            const velocity = turnDir.clone().multiplyScalar(turnSpeed);
            rocketSimVel.current.copy(velocity);
            rocketSimPos.current.addScaledVector(velocity, dt);
            currentSpeed = turnSpeed;

            if (tInPhase >= dur) {
              setFlightPhase('DIRECT_CRUISE');
              phaseStartTime.current = now;
              setFlightStatus(targetBody.id === 'sun' ? 'SUPERNOVA_WARN' : 'CRUISING');
            }
            break;
          }

          case 'DIRECT_CRUISE': {
            // Straight-line travel: needle points directly at destination
            const toTarget = liveTarget.clone().sub(rocketSimPos.current);
            const distToTarget = toTarget.length();
            let cruiseDir = toTarget.clone().normalize();

            // Intervening planetary collision avoidance
            for (const body of ALL_CELESTIAL_BODIES) {
              if (body.id === currentBody.id || body.id === targetBody.id) continue;
              const bodyPos = new THREE.Vector3(...calculateOrbitalPosition(body, elapsedTime));
              const toBody = bodyPos.clone().sub(rocketSimPos.current);
              const dist = toBody.length();
              const safeRadius = body.id === 'sun' ? body.radius + 6.0 : body.radius + 3.2;

              if (dist < safeRadius) {
                let pushAway = rocketSimPos.current.clone().sub(bodyPos);
                if (pushAway.lengthSq() < 0.01) pushAway.set(0, 1, 0);
                pushAway.normalize();
                const factor = (safeRadius - dist) / safeRadius;
                cruiseDir.addScaledVector(pushAway, factor * 2.0).normalize();
              }
            }

            // Velocity-based movement: smooth, cinematic, and deliberate cruise
            const cruiseSpeed = THREE.MathUtils.clamp(distToTarget * 0.5 + 16.0, 24.0, 48.0);
            const velocity = cruiseDir.clone().multiplyScalar(cruiseSpeed);
            rocketSimVel.current.copy(velocity);
            rocketSimPos.current.addScaledVector(velocity, dt);
            currentSpeed = cruiseSpeed;

            if (distToTarget <= targetBody.radius + 11.5) {
              setFlightPhase('APPROACH_DOCK');
              phaseStartTime.current = now;
              setFlightStatus('BRAKING');
            }
            break;
          }

          case 'APPROACH_DOCK': {
            // Final approach: decelerate and plunge into destination atmosphere
            const toTarget = liveTarget.clone().sub(rocketSimPos.current);
            const distToTarget = toTarget.length();
            const approachDir = toTarget.clone().normalize();

            const surfaceContactDist = targetBody.radius + 0.2;
            const remaining = distToTarget - surfaceContactDist;

            // Step 1: Rocket entering planet atmosphere (wisps, hypersonic speed lines, plasma entry glow)
            if (remaining <= 7.5 && targetBody.id !== 'sun') {
              if (atmosphereFlowRef.current === 'idle') {
                atmosphereFlowRef.current = 'entering';
                setAtmosphereFlowPhase('entering');
                setTransitionBodyId(targetBody.id);
                soundController.playAtmosphericEntry();
              }
            }

            // Step 2: Plunging through cloud strata ("skipping clouds" at supersonic speed)
            if (remaining <= 4.0 && targetBody.id !== 'sun') {
              if (atmosphereFlowRef.current === 'entering') {
                atmosphereFlowRef.current = 'skipping_clouds';
                setAtmosphereFlowPhase('skipping_clouds');
              }
            }

            // Touchdown condition: rocket physically meets destination surface
            // For Sun: detonate early while plunging into the scorching solar corona (before physical surface impact!)
            const isSunTarget = targetBody.id === 'sun';
            const isTouchdown = isSunTarget
              ? remaining <= 4.2 || distToTarget <= targetBody.radius + 4.5 || tInPhase > 2.5
              : remaining <= 0.65 || distToTarget <= surfaceContactDist + 0.55 || tInPhase > 7.0;

            if (isTouchdown) {
              let outwardNormal = rocketSimPos.current.clone().sub(liveTarget);
              if (outwardNormal.lengthSq() < 0.01) {
                outwardNormal = new THREE.Vector3(0, 1, 0);
              } else {
                outwardNormal.normalize();
              }

              const touchPoint = liveTarget.clone().addScaledVector(outwardNormal, surfaceContactDist);
              rocketSimPos.current.copy(touchPoint);
              rocketSimVel.current.copy(outwardNormal);

              if (targetBody.id === 'sun') {
                // Blast origin: exactly where the rocket detonates before reaching the surface
                setSupernovaOrigin([rocketSimPos.current.x, rocketSimPos.current.y, rocketSimPos.current.z]);
                setFlightStatus('SUPERNOVA_EXPLODING');
                setFlightPhase('IDLE');
                setSupernovaProgress(0);
                soundController.playSupernova();
              } else {
                const reachedBodyId = targetBody.id;
                setCurrentBodyId(reachedBodyId);
                setTargetBodyId(null);
                setFlightPhase('IDLE');
                setFlightStatus('DOCKED');
                soundController.playArrival();

                // Save outward normal for future liftoffs from this planet
                launchDir.current.copy(outwardNormal);

                setDiscoveredIds((prev) => {
                  const next = new Set(prev);
                  next.add(reachedBodyId);
                  return next;
                });

                // Step 3: Seamless surface emergence!
                // Mount experience immediately underneath the parting clouds
                setActiveExperience(reachedBodyId);
                atmosphereFlowRef.current = 'clearing';
                setAtmosphereFlowPhase('clearing');

                // Clouds finish parting outward, leaving surface experience crystal clear
                setTimeout(() => {
                  atmosphereFlowRef.current = 'idle';
                  setAtmosphereFlowPhase('idle');
                }, 1400);
              }

              setFlightProgress(1.0);
              setPhaseProgress(1.0);
              setCurrentSpeedKmS(7.8);
            } else {
              // Smooth deceleration towards surface with closing speed against orbiting body
              const approachSpeed = THREE.MathUtils.clamp(remaining * 2.2 + 3.2, 3.5, 22.0);
              const velocity = approachDir.clone().multiplyScalar(approachSpeed);
              rocketSimVel.current.copy(velocity);
              rocketSimPos.current.addScaledVector(velocity, dt);
              currentSpeed = approachSpeed;
            }
            break;
          }
        }

        // Throttled HUD update for smooth 60fps rendering without React render lockup
        if (now - lastHudUpdate.current > 0.08) {
          lastHudUpdate.current = now;
          setFlightProgress(prog);
          setPhaseProgress(phaseP);
          setCurrentSpeedKmS(Math.round(currentSpeed));
        }

        currentRocketPos.current = [rocketSimPos.current.x, rocketSimPos.current.y, rocketSimPos.current.z];
        currentRocketVel.current = [rocketSimVel.current.x, rocketSimVel.current.y, rocketSimVel.current.z];
      } else {
        // IDLE / DOCKED: Rocket sits perched on currentBody launch surface
        const currentCenter = new THREE.Vector3(...calculateOrbitalPosition(currentBody, elapsedTime));
        const outDir = launchDir.current;
        const perchedPos = currentCenter.clone().addScaledVector(outDir, currentBody.radius + 0.2);

        rocketSimPos.current.copy(perchedPos);
        rocketSimVel.current.copy(outDir);

        currentRocketPos.current = [perchedPos.x, perchedPos.y, perchedPos.z];
        currentRocketVel.current = [outDir.x, outDir.y, outDir.z];
      }
    },
    [currentBody, targetBody, flightStatus, flightPhase]
  );

  const handleRocketWorldPosUpdate = useCallback(
    (_pos: THREE.Vector3, _dir: THREE.Vector3, _speed: number) => {},
    []
  );

  const isSupernovaActive =
    flightStatus === 'SUPERNOVA_EXPLODING' || flightStatus === 'SUPERNOVA_RESETTING';

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* 3D WebGL Canvas */}
      <div className={`canvas-container ${isSupernovaActive ? 'supernova-exploding-active' : ''}`}>
        <Canvas
          frameloop={activeExperience && atmosphereFlowPhase === 'idle' ? 'never' : 'always'}
          dpr={[1, Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 1.35)]}
          camera={{ position: [0, 160, 195], fov: 45, near: 0.1, far: 2000 }}
          gl={{ antialias: false, alpha: false, powerPreference: 'high-performance', stencil: false, depth: true }}
        >
          <UniverseScene
            currentBody={currentBody}
            targetBody={targetBody}
            flightStatus={flightStatus}
            flightPhase={flightPhase}
            phaseProgress={phaseProgress}
            flightProgress={flightProgress}
            currentRocketPos={currentRocketPos.current}
            currentRocketVel={currentRocketVel.current}
            isFlying={isFlying}
            isOverview={isOverview}
            isSupernovaActive={isSupernovaActive}
            supernovaProgress={supernovaProgress}
            supernovaOrigin={supernovaOrigin}
            onSelectDestination={handleSelectDestination}
            onRocketWorldPosUpdate={handleRocketWorldPosUpdate}
            onFrameUpdate={handleFrameUpdate}
          />
        </Canvas>
      </div>

      {/* 2.5D Photorealistic Mars Cinematic World (MARS ONLY, UNTOUCHED) */}
      {activeExperience === 'projects' && (
        <MarsExperience onReturnToOrbit={handleReturnToOrbit} />
      )}

      {/* 2.5D Photorealistic Generic Planetary Worlds (Earth, Mercury, Venus, Jupiter, Saturn, Uranus, Neptune) */}
      {activeExperience && activeExperience !== 'projects' && PLANET_ENVIRONMENTS[activeExperience] && (
        <PlanetEnvironment
          config={PLANET_ENVIRONMENTS[activeExperience]}
          onReturnToOrbit={handleReturnToOrbit}
        />
      )}

      {/* Planetary Navigation Dock inside Planet Views (Identical to System Overview) */}
      {activeExperience && (
        <div
          className="planet-surface-dock-wrapper"
          style={{
            position: 'fixed',
            bottom: '22px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 60,
            pointerEvents: 'auto',
          }}
        >
          <PlanetDock
            allBodies={ALL_CELESTIAL_BODIES}
            currentBody={currentBody}
            targetBody={targetBody}
            onSelectDestination={handleSelectDestination}
          />
        </div>
      )}

      {/* Cinematic Continuous Atmospheric Flow Transition (Rocket -> Clouds Rush -> Visible Screens) */}
      {atmosphereFlowPhase !== 'idle' && (() => {
        const isMars = transitionBodyId === 'projects';
        const planetConfig = PLANET_ENVIRONMENTS[transitionBodyId];
        const themeRgb = isMars ? '239, 68, 68' : planetConfig?.themeColorRgb || '56, 189, 248';

        return (
          <div
            className={`atmospheric-flow-overlay phase-${atmosphereFlowPhase}`}
            style={{
              ['--cloud-rgb' as string]: themeRgb,
            }}
          >
            {/* Hypersonic speed lines & entry plasma wisps */}
            <div className="flow-speed-streaks" />

            {/* Glowing outer atmospheric envelope */}
            <div className="flow-entry-glow" />

            {/* Volumetric high-speed cloud decks */}
            <div className="flow-cloud-deck flow-cloud-deck-1" />
            <div className="flow-cloud-deck flow-cloud-deck-2" />

            {/* Atmospheric haze sweep */}
            <div className="flow-haze-sweep" />
          </div>
        );
      })()}

      {/* Red Technical Alert Toast (Shown when clicking same planet while already inside) */}
      {technicalToast && (
        <div className="technical-alert-toast">
          <div className="technical-alert-inner">
            <div className="technical-alert-glow" />
            <div className="technical-alert-icon">⚠</div>
            <div className="technical-alert-content">
              <div className="technical-alert-title">{technicalToast.title}</div>
              {technicalToast.subtitle ? (
                <div className="technical-alert-sub">{technicalToast.subtitle}</div>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* Sci-Fi Mission Control HUD (Active only when in orbit) */}
      {!activeExperience && (
        <HUD
          currentBody={currentBody}
          targetBody={targetBody}
          flightStatus={flightStatus}
          flightPhase={flightPhase}
          discoveredIds={discoveredIds}
          totalPlanets={SECTION_PLANETS.length + 1}
          flightProgress={flightProgress}
          currentSpeedKmS={currentSpeedKmS}
          isOverview={isOverview}
          allBodies={ALL_CELESTIAL_BODIES}
          onSelectDestination={handleSelectDestination}
          onReturnHome={handleReturnHome}
          onToggleOverview={handleToggleOverview}
        />
      )}
    </div>
  );
}

export default App;
