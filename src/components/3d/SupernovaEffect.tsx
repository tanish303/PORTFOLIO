import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SupernovaEffectProps {
  active: boolean;
  progress: number; // 0 to 1
  origin?: [number, number, number];
}

export const SupernovaEffect: React.FC<SupernovaEffectProps> = ({
  active,
  progress,
  origin = [0, 0, 0],
}) => {
  // Core blast geometry refs
  const blindingCoreRef = useRef<THREE.Mesh>(null);   // Opaque white-hot center — hides everything behind
  const plasmaBodyRef = useRef<THREE.Mesh>(null);      // Large opaque orange/red plasma expanding dome
  const outerNebulaRef = useRef<THREE.Mesh>(null);     // Huge outer translucent nebula bloom
  const shockwave1Ref = useRef<THREE.Mesh>(null);      // Primary equatorial ring
  const shockwave2Ref = useRef<THREE.Mesh>(null);      // Secondary oblique ring
  const shockwave3Ref = useRef<THREE.Mesh>(null);      // Tertiary polar ring
  const shockwave4Ref = useRef<THREE.Mesh>(null);      // Outermost expanding wavefront
  const dustCloudRef = useRef<THREE.Mesh>(null);       // Volumetric dust occlusion sphere
  const coronaRef = useRef<THREE.Mesh>(null);          // Solar corona expanding aureole
  const lightRef = useRef<THREE.PointLight>(null);
  const ambientLightRef = useRef<THREE.PointLight>(null);

  // Particle system
  const particleCount = 1200;
  const { particleDirections, particleSpeeds, particleColors, particleSizes } = useMemo(() => {
    const dirs = new Float32Array(particleCount * 3);
    const speeds = new Float32Array(particleCount);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      // Spherical uniform distribution with equatorial bias
      const theta = Math.random() * Math.PI * 2;
      const u = Math.random() * 2 - 1;
      const phi = Math.acos(u);

      dirs[i * 3]     = Math.sin(phi) * Math.cos(theta);
      dirs[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * 0.75;
      dirs[i * 3 + 2] = Math.cos(phi);

      // 3-tier particle velocities
      const tier = Math.random();
      if (tier > 0.88) {
        speeds[i] = 95 + Math.random() * 80;   // Hypersonic cosmic rays
      } else if (tier > 0.45) {
        speeds[i] = 42 + Math.random() * 55;   // Main shockwave debris
      } else {
        speeds[i] = 10 + Math.random() * 30;   // Slow roiling ejecta
      }

      sizes[i] = 1.4 + Math.random() * 3.2;

      // Color: white-hot core → solar orange → deep crimson
      const c = Math.random();
      if (c > 0.65) {
        colors[i * 3] = 1.0; colors[i * 3 + 1] = 0.97; colors[i * 3 + 2] = 0.85; // white-hot
      } else if (c > 0.3) {
        colors[i * 3] = 1.0; colors[i * 3 + 1] = 0.52; colors[i * 3 + 2] = 0.04; // solar orange
      } else {
        colors[i * 3] = 0.95; colors[i * 3 + 1] = 0.08; colors[i * 3 + 2] = 0.02; // thermonuclear red
      }
    }

    return { particleDirections: dirs, particleSpeeds: speeds, particleColors: colors, particleSizes: sizes };
  }, []);

  const particlePositions = useMemo(() => new Float32Array(particleCount * 3), []);

  useFrame(() => {
    if (!active) return;

    const p = progress;
    const pFast = Math.pow(p, 0.6);    // fast-expanding curve
    const pSlow = Math.pow(p, 1.1);    // slower-expanding curve
    const fadeOut = Math.pow(1 - p, 1.4);
    const earlyFade = Math.pow(Math.max(0, 1 - p * 1.8), 1.2); // fades out in first half

    // ─────────────────────────────────────────────────────────
    // 1. BLINDING WHITE-HOT OPAQUE CORE (hides everything behind!)
    //    Peaks in first 0→0.35 of progress, then shrinks
    // ─────────────────────────────────────────────────────────
    if (blindingCoreRef.current) {
      const peakT = Math.min(p / 0.3, 1);  // 0→1 over first 30% of progress
      const shrinkT = Math.max(0, (p - 0.3) / 0.7); // 0→1 over remaining 70%
      // Grows from 0 to 90 units quickly, then slowly shrinks as plasma takes over
      const coreScale = peakT * 90 - shrinkT * shrinkT * 45;
      const s = Math.max(0.1, coreScale);
      blindingCoreRef.current.scale.setScalar(s);
      const mat = blindingCoreRef.current.material as THREE.MeshBasicMaterial;
      // Full opacity on the opaque core during peak, fading to zero by halfway
      mat.opacity = Math.max(0, earlyFade * 0.98);
    }

    // ─────────────────────────────────────────────────────────
    // 2. MASSIVE OPAQUE PLASMA BODY (obscures all planets!!)
    //    This is an OPAQUE sphere that completely occludes what's behind it
    // ─────────────────────────────────────────────────────────
    if (plasmaBodyRef.current) {
      // Expands from 0 to 180 units over whole timeline
      const plasmaScale = pFast * 180;
      plasmaBodyRef.current.scale.setScalar(Math.max(0.1, plasmaScale));
      const mat = plasmaBodyRef.current.material as THREE.MeshBasicMaterial;
      // Strong opacity through the middle of the explosion, then fades
      const peakOpacity = Math.sin(p * Math.PI) * 0.92;
      mat.opacity = Math.max(0, peakOpacity);
    }

    // ─────────────────────────────────────────────────────────
    // 3. OUTER NEBULA BLOOM (huge translucent gas cloud)
    // ─────────────────────────────────────────────────────────
    if (outerNebulaRef.current) {
      const s = pSlow * 320;
      outerNebulaRef.current.scale.setScalar(Math.max(0.1, s));
      const mat = outerNebulaRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = Math.max(0, Math.sin(p * Math.PI * 0.9) * 0.55);
    }

    // ─────────────────────────────────────────────────────────
    // 4. DUST OCCLUSION SPHERE
    //    Dark reddish-brown dust cloud fills the space, blocking planets further
    // ─────────────────────────────────────────────────────────
    if (dustCloudRef.current) {
      const s = Math.pow(p, 0.75) * 240;
      dustCloudRef.current.scale.setScalar(Math.max(0.1, s));
      const mat = dustCloudRef.current.material as THREE.MeshBasicMaterial;
      // Dust rises and lingers throughout, never fully transparent until end
      mat.opacity = Math.max(0, Math.sin(p * Math.PI * 0.85) * 0.65);
    }

    // ─────────────────────────────────────────────────────────
    // 5. SOLAR CORONA RING (expanding oblate golden ring)
    // ─────────────────────────────────────────────────────────
    if (coronaRef.current) {
      const s = Math.pow(p, 0.7) * 200;
      coronaRef.current.scale.setScalar(Math.max(0.1, s));
      const mat = coronaRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = Math.max(0, Math.pow(1 - p, 0.95) * 0.78);
    }

    // ─────────────────────────────────────────────────────────
    // 6. SHOCKWAVE RINGS (fast-travelling pressure wavefronts)
    // ─────────────────────────────────────────────────────────
    if (shockwave1Ref.current) {
      const s = Math.pow(p, 0.72) * 280;
      shockwave1Ref.current.scale.setScalar(Math.max(0, s));
      const mat = shockwave1Ref.current.material as THREE.MeshBasicMaterial;
      mat.opacity = Math.max(0, Math.pow(1 - p, 1.05) * 0.88);
    }

    if (shockwave2Ref.current) {
      const delay = Math.max(0, p - 0.05);
      const s = Math.pow(delay, 0.78) * 225;
      shockwave2Ref.current.scale.setScalar(Math.max(0, s));
      const mat = shockwave2Ref.current.material as THREE.MeshBasicMaterial;
      mat.opacity = Math.max(0, Math.pow(1 - p, 1.15) * 0.75);
    }

    if (shockwave3Ref.current) {
      const delay = Math.max(0, p - 0.1);
      const s = Math.pow(delay, 0.82) * 185;
      shockwave3Ref.current.scale.setScalar(Math.max(0, s));
      const mat = shockwave3Ref.current.material as THREE.MeshBasicMaterial;
      mat.opacity = Math.max(0, Math.pow(1 - p, 1.25) * 0.6);
    }

    if (shockwave4Ref.current) {
      // Outermost fast-moving pressure ring: thin and rapid
      const delay = Math.max(0, p - 0.02);
      const s = Math.pow(delay, 0.55) * 340;  // reaches 340 units at end
      shockwave4Ref.current.scale.setScalar(Math.max(0, s));
      const mat = shockwave4Ref.current.material as THREE.MeshBasicMaterial;
      mat.opacity = Math.max(0, Math.pow(1 - p, 0.85) * 0.5);
    }

    // ─────────────────────────────────────────────────────────
    // 7. PLASMA PARTICLE EJECTA
    // ─────────────────────────────────────────────────────────
    if (particlesRef.current) {
      const geom = particlesRef.current.geometry;
      const posAttr = geom.getAttribute('position') as THREE.BufferAttribute;
      for (let i = 0; i < particleCount; i++) {
        const expansion = Math.pow(p, 0.82) * particleSpeeds[i] * 2.4;
        posAttr.setXYZ(
          i,
          particleDirections[i * 3]     * expansion,
          particleDirections[i * 3 + 1] * expansion,
          particleDirections[i * 3 + 2] * expansion
        );
      }
      posAttr.needsUpdate = true;
      const pMat = particlesRef.current.material as THREE.PointsMaterial;
      pMat.opacity = Math.max(0, fadeOut * 0.88);
    }

    // ─────────────────────────────────────────────────────────
    // 8. LIGHTING — blinding at peak, then warm roiling glow
    // ─────────────────────────────────────────────────────────
    if (lightRef.current) {
      // Main light: blinding white-hot peak at p=0, fades fast
      lightRef.current.intensity = Math.max(0, Math.pow(1 - p, 1.2) * 180);
      lightRef.current.distance = 600 + p * 200;
    }
    if (ambientLightRef.current) {
      // Warm orange fill: peaks around p=0.3, lingers
      const warmPeak = Math.sin(Math.min(p / 0.4, 1) * Math.PI * 0.5);
      ambientLightRef.current.intensity = Math.max(0, warmPeak * 35 * Math.pow(1 - p, 0.7));
    }
  });

  const particlesRef = useRef<THREE.Points>(null);

  if (!active) return null;

  return (
    <group position={origin}>

      {/* ── 1. OPAQUE WHITE-HOT CORE (depthWrite ON, hides everything behind!) ─────── */}
      <mesh ref={blindingCoreRef}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshBasicMaterial
          color="#fffef5"
          transparent
          opacity={1}
          depthWrite={false}
          blending={THREE.NormalBlending}
        />
      </mesh>

      {/* ── 2. MASSIVE OPAQUE PLASMA BODY (orange-red, occludes all planets!) ──────── */}
      <mesh ref={plasmaBodyRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color="#ff3d00"
          transparent
          opacity={0.9}
          depthWrite={false}
          side={THREE.FrontSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* ── 3. OUTER NEBULA GAS CLOUD (deep red-purple expanding bloom) ─────────────── */}
      <mesh ref={outerNebulaRef}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshBasicMaterial
          color="#8b1a00"
          transparent
          opacity={0.5}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* ── 4. DUST OCCLUSION CLOUD (dark roiling debris, further blocks planets) ─── */}
      <mesh ref={dustCloudRef}>
        <sphereGeometry args={[1, 20, 20]} />
        <meshBasicMaterial
          color="#3d1200"
          transparent
          opacity={0.6}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* ── 5. SOLAR CORONA / AUREOLE (golden expanding sphere, like real CME) ────── */}
      <mesh ref={coronaRef} rotation={[0.2, 0.4, 0.1]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color="#ff9500"
          transparent
          opacity={0.75}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* ── 6. PRIMARY SHOCKWAVE RING (equatorial, white) ──────────────────────────── */}
      <mesh ref={shockwave1Ref} rotation={[Math.PI * 0.5, 0, 0]}>
        <ringGeometry args={[0.94, 1.0, 128]} />
        <meshBasicMaterial
          color="#fff8ee"
          transparent
          opacity={1}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* ── 7. SECONDARY SHOCKWAVE RING (oblique, orange) ──────────────────────────── */}
      <mesh ref={shockwave2Ref} rotation={[0.42, 0.55, 0.28]}>
        <ringGeometry args={[0.91, 1.0, 96]} />
        <meshBasicMaterial
          color="#ff6600"
          transparent
          opacity={0.85}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* ── 8. TERTIARY SHOCKWAVE RING (polar, golden) ─────────────────────────────── */}
      <mesh ref={shockwave3Ref} rotation={[1.05, 0.2, 0.88]}>
        <ringGeometry args={[0.89, 1.0, 96]} />
        <meshBasicMaterial
          color="#ffbb00"
          transparent
          opacity={0.7}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* ── 9. OUTERMOST PRESSURE WAVEFRONT (very thin, fast, reaches edge of scene) ── */}
      <mesh ref={shockwave4Ref} rotation={[0.15, 0.7, 0.5]}>
        <ringGeometry args={[0.97, 1.0, 160]} />
        <meshBasicMaterial
          color="#ffe0a0"
          transparent
          opacity={0.55}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* ── 10. HIGH-DENSITY PLASMA EJECTA PARTICLES ───────────────────────────────── */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={particlePositions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={particleCount}
            array={particleColors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={2.6}
          vertexColors
          transparent
          opacity={1}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>

      {/* ── 11. BLINDING WHITE-HOT FLASH POINT LIGHT ──────────────────────────────── */}
      <pointLight
        ref={lightRef}
        color="#fff4d8"
        intensity={180}
        distance={600}
        decay={0.8}
      />

      {/* ── 12. WARM ORANGE AMBIENT FILL (illuminates the scene with explosion glow) ─ */}
      <pointLight
        ref={ambientLightRef}
        color="#ff6600"
        intensity={35}
        distance={500}
        decay={1.0}
      />
    </group>
  );
};
