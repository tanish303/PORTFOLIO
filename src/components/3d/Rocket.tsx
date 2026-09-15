import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { soundController } from '../../audio/SoundController';

import type { FlightPhase } from '../../types/solar';

interface RocketProps {
  currentPos: [number, number, number];
  travelVelocity?: [number, number, number];
  flightProgress?: number; // 0 to 1
  flightPhase?: FlightPhase;
  isFlying: boolean;
  visible?: boolean;
  onRocketWorldPosUpdate: (pos: THREE.Vector3, dir: THREE.Vector3, speed: number) => void;
}

export const Rocket: React.FC<RocketProps> = ({
  currentPos,
  travelVelocity,
  flightProgress = 0,
  flightPhase = 'IDLE',
  isFlying,
  visible = true,
  onRocketWorldPosUpdate,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const coreFlameRef = useRef<THREE.Mesh>(null);
  const outerPlumeRef = useRef<THREE.Mesh>(null);
  const thrusterCoreLightRef = useRef<THREE.PointLight>(null);
  const trailRef = useRef<THREE.Points>(null);

  // High-performance particle exhaust trail (longer & denser for dramatic visual trail)
  const trailCount = 80;
  const trailPositions = useMemo(() => new Float32Array(trailCount * 3), []);
  const trailHistory = useRef<THREE.Vector3[]>([]);

  // Orientation tracking
  const currentForward = useRef(new THREE.Vector3(0, 0, 1));
  const prevPos = useRef(new THREE.Vector3(...currentPos));
  // Pre-allocated scratch vectors to avoid GC pressure (no new THREE.Vector3 in hot path)
  const _shipPos = useRef(new THREE.Vector3());
  const _vel = useRef(new THREE.Vector3());
  const _upRef = useRef(new THREE.Vector3());
  const _right = useRef(new THREE.Vector3());
  const _orthoUp = useRef(new THREE.Vector3());
  const _rotMatrix = useRef(new THREE.Matrix4());
  const _targetQuat = useRef(new THREE.Quaternion());
  const _nozzleLocal = useRef(new THREE.Vector3(0, -0.04, -0.75));
  const _nozzleWorld = useRef(new THREE.Vector3());
  const _lerpHead = useRef(new THREE.Vector3());
  const _lerpTail = useRef(new THREE.Vector3());

  // Glowing circular particle texture for exhaust
  const exhaustSprite = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;
    const rad = ctx.createRadialGradient(32, 32, 0, 32, 32, 30);
    rad.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
    rad.addColorStop(0.2, 'rgba(0, 240, 255, 0.95)');
    rad.addColorStop(0.55, 'rgba(0, 140, 255, 0.45)');
    rad.addColorStop(0.85, 'rgba(0, 60, 255, 0.12)');
    rad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = rad;
    ctx.fillRect(0, 0, 64, 64);
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    if (visible === false) {
      groupRef.current.visible = false;
      if (trailRef.current) trailRef.current.visible = false;
      return;
    } else {
      groupRef.current.visible = true;
      if (trailRef.current) trailRef.current.visible = true;
    }

    // Use pre-allocated Vector3 (no GC)
    const shipPos = _shipPos.current.set(currentPos[0], currentPos[1], currentPos[2]);
    groupRef.current.position.copy(shipPos);

    let vel: THREE.Vector3;
    if (travelVelocity && (travelVelocity[0] !== 0 || travelVelocity[1] !== 0 || travelVelocity[2] !== 0)) {
      vel = _vel.current.set(travelVelocity[0], travelVelocity[1], travelVelocity[2]);
    } else {
      vel = _vel.current.copy(shipPos).sub(prevPos.current);
    }
    const speed = vel.length();
    prevPos.current.copy(shipPos);

    if (speed > 0.0001) {
      const direction = vel.normalize(); // normalize in place

      const upRef = _upRef.current;
      if (Math.abs(direction.y) > 0.96) {
        upRef.set(0, 0, -Math.sign(direction.y || 1));
      } else {
        upRef.set(0, 1, 0);
      }
      const right = _right.current.crossVectors(upRef, direction).normalize();
      const orthoUp = _orthoUp.current.crossVectors(direction, right).normalize();

      _rotMatrix.current.makeBasis(right, orthoUp, direction);
      _targetQuat.current.setFromRotationMatrix(_rotMatrix.current);

      // Silky smooth angular slerp — prevents snapping or jitter during phase transitions
      const slerpFactor = Math.min(1.0, (delta || 0.016) * 12.0);
      groupRef.current.quaternion.slerp(_targetQuat.current, slerpFactor);

      currentForward.current.copy(direction);
    }

    // Flame animation using clock (no Date.now())
    const nowTime = state.clock.getElapsedTime() * 40;
    const flicker = 1.0 + Math.sin(nowTime) * 0.18 + Math.cos(nowTime * 1.7) * 0.12;

    if (isFlying) {
      let stageFactor = 1.0;
      let isIgnited = true;

      switch (flightPhase) {
        case 'FOCUS_DEPARTURE':
          isIgnited = false;
          stageFactor = 0.15;
          break;
        case 'HOLD_DEPARTURE':
          isIgnited = true;
          stageFactor = 0.45;
          break;
        case 'VERTICAL_ASCENT':
          isIgnited = true;
          stageFactor = 1.55;
          break;
        case 'TRANSITION_TURN':
          isIgnited = true;
          stageFactor = 1.25;
          break;
        case 'DIRECT_CRUISE':
          isIgnited = true;
          stageFactor = 1.05;
          break;
        case 'APPROACH_DOCK':
          isIgnited = true;
          stageFactor = 0.55;
          break;
        default:
          isIgnited = true;
          stageFactor = 1.0;
      }

      const coreScaleZ = (1.4 + Math.sin(flightProgress * Math.PI) * 1.2) * flicker * stageFactor;
      const plumeScaleZ = (2.2 + Math.sin(flightProgress * Math.PI) * 1.6) * flicker * stageFactor;

      if (coreFlameRef.current) {
        coreFlameRef.current.scale.set(stageFactor > 0.3 ? 1.0 : 0.3, stageFactor > 0.3 ? 1.0 : 0.3, coreScaleZ);
        coreFlameRef.current.visible = isIgnited;
      }

      if (outerPlumeRef.current) {
        outerPlumeRef.current.scale.set(stageFactor > 0.3 ? 1.1 : 0.3, stageFactor > 0.3 ? 1.1 : 0.3, plumeScaleZ);
        outerPlumeRef.current.visible = isIgnited && stageFactor > 0.3;
      }

      if (thrusterCoreLightRef.current) {
        thrusterCoreLightRef.current.intensity = 3.5 * stageFactor;
      }
      soundController.setThrusterLevel(Math.min(1.0, stageFactor));
    } else {
      if (coreFlameRef.current) {
        coreFlameRef.current.scale.set(0.35, 0.35, 0.4);
        coreFlameRef.current.visible = true;
      }
      if (outerPlumeRef.current) {
        outerPlumeRef.current.scale.set(0.4, 0.4, 0.5);
        outerPlumeRef.current.visible = true;
      }
      if (thrusterCoreLightRef.current) {
        thrusterCoreLightRef.current.intensity = 0.4;
      }
      soundController.setThrusterLevel(0);
    }

    // Trail: use pre-allocated vectors
    if (trailRef.current) {
      if (isFlying) {
        _nozzleWorld.current.copy(
          groupRef.current.localToWorld(_nozzleLocal.current.clone())
        );
        trailHistory.current.unshift(_nozzleWorld.current.clone());
        if (trailHistory.current.length > trailCount) {
          trailHistory.current.pop();
        }
      } else {
        if (trailHistory.current.length > 0) {
          trailHistory.current.pop();
        }
      }

      const geom = trailRef.current.geometry;
      const posAttr = geom.getAttribute('position') as THREE.BufferAttribute;
      for (let i = 0; i < trailCount; i++) {
        if (i < trailHistory.current.length) {
          const p = trailHistory.current[i];
          posAttr.setXYZ(i, p.x, p.y, p.z);
        } else {
          posAttr.setXYZ(i, shipPos.x, shipPos.y, shipPos.z);
        }
      }
      posAttr.needsUpdate = true;
    }

    onRocketWorldPosUpdate(shipPos, currentForward.current, speed);
  });

  return (
    <>
      {/* Dynamic Luminous Particle Exhaust Trail */}
      <points ref={trailRef} visible={visible}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={trailCount}
            array={trailPositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.95}
          map={exhaustSprite}
          color="#38bdf8"
          transparent
          opacity={isFlying ? 0.95 : 0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Main Rocket Hull Group (Rigid single object with NOSE POINTING EXACTLY ALONG +Z) */}
      {/* Scaled to 0.70 for proportionate realism against planetary scales */}
      <group ref={groupRef} scale={[0.7, 0.7, 0.7]} visible={visible}>
        {/* 1. NASA Parker-Inspired Thermal Ceramic Heat Shield Nose (+Z Tip) */}
        <mesh position={[0, 0, 0.85]} rotation={[-Math.PI * 0.5, 0, 0]}>
          <coneGeometry args={[0.34, 0.9, 8]} />
          <meshStandardMaterial
            color="#ffffff"
            roughness={0.12}
            metalness={0.88}
            emissive="#ffffff"
            emissiveIntensity={0.15}
          />
        </mesh>

        {/* Forward Telemetry Sensor Mast (Nose Needle pointing forward along +Z) */}
        <mesh position={[0, 0, 1.45]} rotation={[-Math.PI * 0.5, 0, 0]}>
          <cylinderGeometry args={[0.015, 0.025, 0.6, 6]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#38bdf8"
            emissiveIntensity={0.8}
            metalness={0.9}
          />
        </mesh>

        {/* 2. Main Aerodynamic Fuselage (Titanium / High-Reflectivity Alloy) */}
        <mesh position={[0, 0, 0.05]} rotation={[-Math.PI * 0.5, 0, 0]}>
          <cylinderGeometry args={[0.32, 0.36, 1.1, 8]} />
          <meshStandardMaterial
            color="#f1f5f9"
            roughness={0.2}
            metalness={0.85}
          />
        </mesh>

        {/* 3. Golden Thermal Foil Insulation Panels (Like Parker Solar Probe / Apollo) */}
        <mesh position={[0, -0.05, 0.05]} rotation={[-Math.PI * 0.5, 0, 0]}>
          <cylinderGeometry args={[0.33, 0.37, 0.55, 8]} />
          <meshStandardMaterial
            color="#f59e0b"
            roughness={0.25}
            metalness={0.92}
            emissive="#d97706"
            emissiveIntensity={0.25}
          />
        </mesh>

        {/* High-Contrast Dark Carbon Composite Raceways along fuselage */}
        <mesh position={[0.33, 0, 0.05]}>
          <boxGeometry args={[0.04, 0.12, 1.0]} />
          <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.7} />
        </mesh>
        <mesh position={[-0.33, 0, 0.05]}>
          <boxGeometry args={[0.04, 0.12, 1.0]} />
          <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.7} />
        </mesh>

        {/* 4. Avionics Visor / Cockpit Dome */}
        <mesh position={[0, 0.22, 0.45]} rotation={[-Math.PI * 0.5, 0, 0]}>
          <sphereGeometry args={[0.16, 16, 16]} />
          <meshStandardMaterial
            color="#00f0ff"
            roughness={0.08}
            metalness={0.9}
            emissive="#00f0ff"
            emissiveIntensity={0.9}
          />
        </mesh>

        {/* 5. High-Speed Swept Delta Wings (Bright White with Dark Contrast Carbon Inlays) */}
        {/* Port Wing */}
        <mesh position={[-0.62, -0.06, -0.2]} rotation={[0, 0, -0.08]}>
          <boxGeometry args={[0.85, 0.04, 0.9]} />
          <meshStandardMaterial color="#ffffff" metalness={0.85} roughness={0.2} />
        </mesh>
        {/* Port Wing Solar / Radiator Inlay */}
        <mesh position={[-0.62, -0.04, -0.2]} rotation={[0, 0, -0.08]}>
          <boxGeometry args={[0.65, 0.02, 0.7]} />
          <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.3} />
        </mesh>
        {/* Port Wingtip Plasma Conduit */}
        <mesh position={[-1.05, -0.05, -0.2]}>
          <cylinderGeometry args={[0.02, 0.02, 0.8, 6]} />
          <meshBasicMaterial color="#00f0ff" />
        </mesh>
        {/* Port Wing Navigation Light (Red Strobe) */}
        <mesh position={[-1.06, -0.05, 0.18]}>
          <sphereGeometry args={[0.035, 8, 8]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>

        {/* Starboard Wing */}
        <mesh position={[0.62, -0.06, -0.2]} rotation={[0, 0, 0.08]}>
          <boxGeometry args={[0.85, 0.04, 0.9]} />
          <meshStandardMaterial color="#ffffff" metalness={0.85} roughness={0.2} />
        </mesh>
        {/* Starboard Wing Solar / Radiator Inlay */}
        <mesh position={[0.62, -0.04, -0.2]} rotation={[0, 0, 0.08]}>
          <boxGeometry args={[0.65, 0.02, 0.7]} />
          <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.3} />
        </mesh>
        {/* Starboard Wingtip Plasma Conduit */}
        <mesh position={[1.05, -0.05, -0.2]}>
          <cylinderGeometry args={[0.02, 0.02, 0.8, 6]} />
          <meshBasicMaterial color="#00f0ff" />
        </mesh>
        {/* Starboard Wing Navigation Light (Green Strobe) */}
        <mesh position={[1.06, -0.05, 0.18]}>
          <sphereGeometry args={[0.035, 8, 8]} />
          <meshBasicMaterial color="#22c55e" />
        </mesh>

        {/* 6. Dual Canted Vertical Stabilizers (High-tech aerospace fins) */}
        <mesh position={[-0.22, 0.32, -0.45]} rotation={[0, 0, 0.18]}>
          <boxGeometry args={[0.04, 0.45, 0.55]} />
          <meshStandardMaterial color="#ffffff" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0.22, 0.32, -0.45]} rotation={[0, 0, -0.18]}>
          <boxGeometry args={[0.04, 0.45, 0.55]} />
          <meshStandardMaterial color="#ffffff" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Dorsal Anti-Collision Beacon (White Strobe) */}
        <mesh position={[0, 0.58, -0.45]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>

        {/* 7. Twin High-Output Thruster Bells (At rear: -Z) */}
        <mesh position={[-0.16, -0.04, -0.6]} rotation={[-Math.PI * 0.5, 0, 0]}>
          <cylinderGeometry args={[0.11, 0.15, 0.3, 10]} />
          <meshStandardMaterial color="#0f172a" metalness={0.95} roughness={0.2} />
        </mesh>
        <mesh position={[0.16, -0.04, -0.6]} rotation={[-Math.PI * 0.5, 0, 0]}>
          <cylinderGeometry args={[0.11, 0.15, 0.3, 10]} />
          <meshStandardMaterial color="#0f172a" metalness={0.95} roughness={0.2} />
        </mesh>

        {/* 8. Inner Hyper-Intense White-Blue Core Flame */}
        <mesh
          ref={coreFlameRef}
          position={[0, -0.04, -1.25]}
          rotation={[Math.PI * 0.5, 0, 0]}
        >
          <coneGeometry args={[0.18, 1.1, 8]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.95}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* 9. Outer Elongated Cyan/Blue Plasma Plume */}
        <mesh
          ref={outerPlumeRef}
          position={[0, -0.04, -1.8]}
          rotation={[Math.PI * 0.5, 0, 0]}
        >
          <coneGeometry args={[0.28, 2.2, 10]} />
          <meshBasicMaterial
            color="#00f0ff"
            transparent
            opacity={0.82}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* 10. Engine Glow Core Light */}
        <pointLight
          ref={thrusterCoreLightRef}
          color="#38bdf8"
          intensity={isFlying ? 4.5 : 0.6}
          distance={14}
          decay={1.8}
          position={[0, -0.04, -1.2]}
        />
      </group>
    </>
  );
};
