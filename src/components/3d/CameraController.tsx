import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import type { FlightPhase, FlightStatus } from '../../types/solar';

interface CameraControllerProps {
  currentLocationPos: [number, number, number];
  targetLocationPos?: [number, number, number] | null;
  currentRadius?: number;
  targetRadius?: number;
  hasRings?: boolean;
  rocketPos: THREE.Vector3;
  rocketDir: THREE.Vector3;
  isFlying: boolean;
  flightProgress: number;
  flightPhase?: FlightPhase;
  phaseProgress?: number;
  isOverview: boolean;
  flightStatus?: FlightStatus;
  supernovaProgress?: number;
}

export const CameraController: React.FC<CameraControllerProps> = ({
  currentLocationPos,
  targetLocationPos: _targetLocationPos = null,
  currentRadius = 3.0,
  targetRadius: _targetRadius = 3.0,
  hasRings = false,
  rocketPos,
  rocketDir,
  isFlying,
  flightProgress,
  flightPhase = 'IDLE',
  phaseProgress = 0,
  isOverview,
  flightStatus = 'DOCKED',
  supernovaProgress = 0,
}) => {
  const { camera, gl } = useThree();

  // Internal camera targets
  const targetCamPos = useRef(new THREE.Vector3(0, 145, 175));
  const targetLookAt = useRef(new THREE.Vector3(0, -4, 0));
  const currentLookAt = useRef(new THREE.Vector3(0, -4, 0));

  // Phase transition snapshots for deterministic smooth hermite blends
  const departureStartCamPos = useRef(new THREE.Vector3());
  const departureStartLookAt = useRef(new THREE.Vector3());
  const turnStartCamPos = useRef(new THREE.Vector3());
  const turnStartLookAt = useRef(new THREE.Vector3());
  const prevFlightPhase = useRef<FlightPhase>('IDLE');

  // Overview spherical orbit state: framed high with ample bottom gap clear of the HUD
  const overviewAngles = useRef({ theta: 0.18, phi: 0.75, distance: 365 });

  // Planet local orbit state
  const isDragging = useRef(false);
  const prevMouse = useRef({ x: 0, y: 0 });
  const localAngles = useRef({ theta: 0.6, phi: 0.35, distance: 8.5 });
  const subtleParallax = useRef({ x: 0, y: 0 });

  // Calculate ideal distance based on planet radius and rings
  const idealDistance = hasRings ? currentRadius * 3.6 : Math.max(7.5, currentRadius * 2.9);

  // Update local inspection distance whenever docked planet changes
  useEffect(() => {
    localAngles.current.distance = idealDistance;
  }, [idealDistance]);

  // Initial setup: start framed on the whole solar system with generous bottom clearance
  useEffect(() => {
    camera.position.set(0, 160, 195);
    currentLookAt.current.set(0, -18, -8);
    camera.lookAt(0, -18, -8);
  }, [camera]);

  // Mouse & touch drag listeners
  useEffect(() => {
    const dom = gl.domElement;

    const handlePointerDown = (e: PointerEvent) => {
      if (e.button === 0) {
        isDragging.current = true;
        prevMouse.current = { x: e.clientX, y: e.clientY };
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;
      subtleParallax.current = { x: nx * 1.2, y: ny * 0.8 };

      if (!isDragging.current) return;
      const dx = e.clientX - prevMouse.current.x;
      const dy = e.clientY - prevMouse.current.y;
      prevMouse.current = { x: e.clientX, y: e.clientY };

      if (isOverview) {
        overviewAngles.current.theta -= dx * 0.005;
        overviewAngles.current.phi = THREE.MathUtils.clamp(
          overviewAngles.current.phi + dy * 0.005,
          0.15,
          Math.PI * 0.48
        );
      } else {
        localAngles.current.theta -= dx * 0.006;
        localAngles.current.phi = THREE.MathUtils.clamp(
          localAngles.current.phi + dy * 0.006,
          -Math.PI * 0.4,
          Math.PI * 0.4
        );
      }
    };

    const handlePointerUp = () => {
      isDragging.current = false;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (isOverview) {
        overviewAngles.current.distance = THREE.MathUtils.clamp(
          overviewAngles.current.distance + e.deltaY * 0.08,
          90,
          500
        );
      } else {
        const minD = idealDistance * 0.45;
        const maxD = idealDistance * 2.5;
        localAngles.current.distance = THREE.MathUtils.clamp(
          localAngles.current.distance + e.deltaY * 0.02,
          minD,
          maxD
        );
      }
    };

    dom.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    dom.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      dom.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      dom.removeEventListener('wheel', handleWheel);
    };
  }, [gl, isOverview, idealDistance]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // 0. COSMIC SUPERNOVA CATACLYSM CAMERA
    if (flightStatus === 'SUPERNOVA_EXPLODING' || flightStatus === 'SUPERNOVA_RESETTING') {
      prevFlightPhase.current = 'IDLE';

      // Dramatic cinematic pullback: camera backs up steadily to view the monumental expanding shockwave
      const supernovaCam = targetCamPos.current.set(0, 52, 95);
      const supernovaLook = targetLookAt.current.set(0, 0, 0);

      camera.position.lerp(supernovaCam, 0.04);
      currentLookAt.current.lerp(supernovaLook, 0.05);

      // Camera Trauma & Shockwave Vibration during explosion
      if (flightStatus === 'SUPERNOVA_EXPLODING') {
        const trauma = Math.max(0, Math.pow(1 - supernovaProgress, 1.2) * 4.2);
        camera.position.x += (Math.random() - 0.5) * trauma;
        camera.position.y += (Math.random() - 0.5) * trauma;
        camera.position.z += (Math.random() - 0.5) * trauma;
      }

      if ((camera as THREE.PerspectiveCamera).fov) {
        const pCam = camera as THREE.PerspectiveCamera;
        pCam.fov = THREE.MathUtils.lerp(pCam.fov, 48, 0.05);
        pCam.updateProjectionMatrix();
      }

      camera.lookAt(currentLookAt.current);
      return;
    }

    if (isFlying) {
      const C_curr = new THREE.Vector3(...currentLocationPos);

      // Sun-facing illuminated vantage for departure planet
      const isSun = C_curr.lengthSq() < 1;
      const sunAngle = isSun ? 0 : Math.atan2(C_curr.z, C_curr.x);
      const angle = isSun ? 0 : sunAngle + Math.PI * 0.7;

      // Distance ensuring planet takes ~25% of viewport height (comfortable margins, full circumference visible, ample launch space above)
      const camDist = hasRings ? Math.max(26.0, currentRadius * 9.5) : Math.max(14.0, currentRadius * 8.5);
      const elev = 0.22; // ~12.5 degrees gentle elevation angle

      const framedCamPos = new THREE.Vector3(
        C_curr.x + camDist * Math.cos(elev) * Math.cos(angle),
        C_curr.y + camDist * Math.sin(elev),
        C_curr.z + camDist * Math.cos(elev) * Math.sin(angle)
      );

      // Position the current planet EXACTLY in the center of the viewport
      const framedLookAt = C_curr.clone();

      switch (flightPhase) {
        case 'FOCUS_DEPARTURE': {
          // Snapshot starting camera position on entering FOCUS_DEPARTURE
          if (prevFlightPhase.current !== 'FOCUS_DEPARTURE') {
            departureStartCamPos.current.copy(camera.position);
            departureStartLookAt.current.copy(currentLookAt.current);
          }

          // Smooth hermite ease from initial position to framed composition
          const p = phaseProgress;
          const ease = p * p * (3 - 2 * p);

          targetCamPos.current.lerpVectors(departureStartCamPos.current, framedCamPos, ease);
          targetLookAt.current.lerpVectors(departureStartLookAt.current, framedLookAt, ease);

          camera.position.copy(targetCamPos.current);
          currentLookAt.current.copy(targetLookAt.current);
          break;
        }

        case 'HOLD_DEPARTURE': {
          // PHASE 2: Hold steady on the current departure planet while rocket engines spool up
          targetCamPos.current.copy(framedCamPos);
          targetLookAt.current.copy(framedLookAt);

          camera.position.copy(framedCamPos);
          currentLookAt.current.copy(framedLookAt);
          break;
        }

        case 'VERTICAL_ASCENT': {
          // PHASE 3: Rocket emerges vertically away from planet. Camera stays framed on planet, tracking rocket into space above
          targetCamPos.current.copy(framedCamPos);
          const trackPoint = framedLookAt.clone().lerp(rocketPos, 0.22 * phaseProgress);
          targetLookAt.current.copy(trackPoint);

          camera.position.lerp(targetCamPos.current, 0.1);
          currentLookAt.current.lerp(targetLookAt.current, 0.12);
          break;
        }

        case 'TRANSITION_TURN': {
          if (prevFlightPhase.current !== 'TRANSITION_TURN') {
            turnStartCamPos.current.copy(camera.position);
            turnStartLookAt.current.copy(currentLookAt.current);
          }

          // Chase camera position behind and elevated above rocket
          const behindOffset = rocketDir.clone().negate().multiplyScalar(8.5);
          const upOffset = new THREE.Vector3(0, 2.6, 0);
          const chaseCamPos = rocketPos.clone().add(behindOffset).add(upOffset);
          const chaseLookAt = rocketPos.clone().add(rocketDir.clone().multiplyScalar(16.0));

          const p = phaseProgress;
          const ease = p * p * (3 - 2 * p);

          targetCamPos.current.lerpVectors(turnStartCamPos.current, chaseCamPos, ease);
          targetLookAt.current.lerpVectors(turnStartLookAt.current, chaseLookAt, ease);

          camera.position.lerp(targetCamPos.current, 0.12);
          currentLookAt.current.lerp(targetLookAt.current, 0.14);
          break;
        }

        case 'DIRECT_CRUISE':
        case 'APPROACH_DOCK': {
          // Chase camera directly following behind rocket, looking ahead at destination
          const behindOffset = rocketDir.clone().negate().multiplyScalar(8.5);
          const upOffset = new THREE.Vector3(0, 2.6, 0);
          targetCamPos.current.copy(rocketPos).add(behindOffset).add(upOffset);
          targetLookAt.current.copy(rocketPos).add(rocketDir.clone().multiplyScalar(16.0));

          camera.position.lerp(targetCamPos.current, 0.14);
          currentLookAt.current.lerp(targetLookAt.current, 0.16);
          break;
        }

        default: {
          const behindOffset = rocketDir.clone().negate().multiplyScalar(8.5);
          const upOffset = new THREE.Vector3(0, 2.6, 0);
          targetCamPos.current.copy(rocketPos).add(behindOffset).add(upOffset);
          targetLookAt.current.copy(rocketPos).add(rocketDir.clone().multiplyScalar(16.0));

          camera.position.lerp(targetCamPos.current, 0.1);
          currentLookAt.current.lerp(targetLookAt.current, 0.12);
        }
      }

      prevFlightPhase.current = flightPhase;

      // Dynamic FOV for cinematic sensation
      const targetFOV = 45 + Math.sin(flightProgress * Math.PI) * 5;
      if ((camera as THREE.PerspectiveCamera).fov) {
        const pCam = camera as THREE.PerspectiveCamera;
        pCam.fov = THREE.MathUtils.lerp(pCam.fov, targetFOV, 0.05);
        pCam.updateProjectionMatrix();
      }

      camera.lookAt(currentLookAt.current);
    } else if (isOverview) {
      prevFlightPhase.current = 'IDLE';

      // 2. MAJESTIC WHOLE SOLAR SYSTEM OVERVIEW (Default initial landing view)
      const { theta, phi, distance } = overviewAngles.current;
      const cosPhi = Math.cos(phi);
      const sinPhi = Math.sin(phi);

      const driftX = Math.sin(time * 0.1) * 0.8;
      const driftZ = Math.cos(time * 0.08) * 0.8;

      const camX = distance * cosPhi * Math.sin(theta) + subtleParallax.current.x + driftX;
      const camY = distance * sinPhi + subtleParallax.current.y;
      const camZ = distance * cosPhi * Math.cos(theta) + driftZ;

      targetCamPos.current.set(camX, camY, camZ);
      targetLookAt.current.set(0, -18, -8);

      if ((camera as THREE.PerspectiveCamera).fov) {
        const pCam = camera as THREE.PerspectiveCamera;
        pCam.fov = THREE.MathUtils.lerp(pCam.fov, 45, 0.05);
        pCam.updateProjectionMatrix();
      }

      camera.position.lerp(targetCamPos.current, 0.05);
      currentLookAt.current.lerp(targetLookAt.current, 0.06);
      camera.lookAt(currentLookAt.current);
    } else {
      prevFlightPhase.current = 'IDLE';

      // 3. DOCKED / LOCAL PLANET INSPECTION
      const center = new THREE.Vector3(...currentLocationPos);

      const driftX = Math.sin(time * 0.3) * 0.3;
      const driftY = Math.cos(time * 0.25) * 0.2;

      // Orient relative to sunlight vector so the illuminated surface and atmospheric glow are always prominent
      const isSun = center.lengthSq() < 1;
      const sunAngle = isSun ? 0 : Math.atan2(center.z, center.x);
      const angle = isSun
        ? localAngles.current.theta
        : sunAngle + Math.PI + 0.55 + localAngles.current.theta;

      const { phi, distance } = localAngles.current;
      const cosPhi = Math.cos(phi);
      const camX = center.x + distance * cosPhi * Math.cos(angle) + subtleParallax.current.x + driftX;
      const camY = center.y + distance * Math.sin(phi) + subtleParallax.current.y + driftY;
      const camZ = center.z + distance * cosPhi * Math.sin(angle);

      targetCamPos.current.set(camX, camY, camZ);
      targetLookAt.current.copy(center);

      if ((camera as THREE.PerspectiveCamera).fov) {
        const pCam = camera as THREE.PerspectiveCamera;
        pCam.fov = THREE.MathUtils.lerp(pCam.fov, 45, 0.05);
        pCam.updateProjectionMatrix();
      }

      camera.position.lerp(targetCamPos.current, 0.06);
      currentLookAt.current.lerp(targetLookAt.current, 0.08);
      camera.lookAt(currentLookAt.current);
    }
  });

  return null;
};
