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
  const coreRef = useRef<THREE.Mesh>(null);
  const shockwave1Ref = useRef<THREE.Mesh>(null);
  const shockwave2Ref = useRef<THREE.Mesh>(null);
  const shockwave3Ref = useRef<THREE.Mesh>(null);
  const bubbleRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  // 1100 High-Density Plasma Ejecta Embers (smooth 60fps performance)
  const particleCount = 1100;
  const { particleDirections, particleSpeeds, particleColors } = useMemo(() => {
    const dirs = new Float32Array(particleCount * 3);
    const speeds = new Float32Array(particleCount);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      // Uniform spherical random distribution with slight equatorial bias
      const theta = Math.random() * Math.PI * 2;
      const u = Math.random() * 2 - 1;
      const phi = Math.acos(u);

      dirs[i * 3] = Math.sin(phi) * Math.cos(theta);
      dirs[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * 0.85; // Slight flattening
      dirs[i * 3 + 2] = Math.cos(phi);

      // Varied ejection speeds: hypersonic debris vs glowing stellar cloud
      const speedTier = Math.random();
      if (speedTier > 0.85) {
        speeds[i] = 75 + Math.random() * 95; // High-velocity cosmic rays
      } else if (speedTier > 0.4) {
        speeds[i] = 38 + Math.random() * 50; // Main fireball shockwave
      } else {
        speeds[i] = 14 + Math.random() * 24; // Lingering core embers
      }

      // Triple-color plasma gradient
      const c = Math.random();
      if (c > 0.6) {
        // Pure blinding white-hot
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 0.98;
        colors[i * 3 + 2] = 0.88;
      } else if (c > 0.25) {
        // Radiant solar golden orange
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 0.58;
        colors[i * 3 + 2] = 0.08;
      } else {
        // Deep thermonuclear crimson
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 0.12;
        colors[i * 3 + 2] = 0.05;
      }
    }

    return {
      particleDirections: dirs,
      particleSpeeds: speeds,
      particleColors: colors,
    };
  }, []);

  const particlePositions = useMemo(() => new Float32Array(particleCount * 3), []);

  useFrame(() => {
    if (!active) return;

    // 1. Colossal Volumetric Expanding Plasma Core Sphere
    if (coreRef.current) {
      const coreScale = Math.max(0.1, Math.sin(progress * Math.PI * 0.7) * 95);
      coreRef.current.scale.set(coreScale, coreScale, coreScale);
      const mat = coreRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = Math.max(0, Math.pow(1.0 - progress, 1.3) * 0.95);
    }

    // 2. Primary Massive Equatorial Shockwave Ring (expands up to 260 units!)
    if (shockwave1Ref.current) {
      const s = Math.pow(progress, 0.82) * 260;
      shockwave1Ref.current.scale.set(s, s, s);
      const mat = shockwave1Ref.current.material as THREE.MeshBasicMaterial;
      mat.opacity = Math.max(0, Math.pow(1.0 - progress, 1.1));
    }

    // 3. Secondary Oblique Plasma Ring (expands up to 210 units)
    if (shockwave2Ref.current) {
      const s = Math.max(0, Math.pow(Math.max(0, progress - 0.04), 0.85) * 210);
      shockwave2Ref.current.scale.set(s, s, s);
      const mat = shockwave2Ref.current.material as THREE.MeshBasicMaterial;
      mat.opacity = Math.max(0, Math.pow(1.0 - progress, 1.2) * 0.85);
    }

    // 4. Tertiary Polar Radiant Ring (expands up to 175 units)
    if (shockwave3Ref.current) {
      const s = Math.max(0, Math.pow(Math.max(0, progress - 0.08), 0.88) * 175);
      shockwave3Ref.current.scale.set(s, s, s);
      const mat = shockwave3Ref.current.material as THREE.MeshBasicMaterial;
      mat.opacity = Math.max(0, Math.pow(1.0 - progress, 1.3) * 0.7);
    }

    // 5. Translucent Spherical Blast Bubble
    if (bubbleRef.current) {
      const s = Math.pow(progress, 0.75) * 155;
      bubbleRef.current.scale.set(s, s, s);
      const mat = bubbleRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = Math.max(0, Math.sin(progress * Math.PI) * 0.38);
    }

    // 6. Expanding 3500+ Particle Positions
    if (particlesRef.current) {
      const geom = particlesRef.current.geometry;
      const posAttr = geom.getAttribute('position') as THREE.BufferAttribute;

      for (let i = 0; i < particleCount; i++) {
        // Slower, dramatic expansion with subtle deceleration curve
        const expansion = Math.pow(progress, 0.88) * particleSpeeds[i] * 2.1;
        posAttr.setXYZ(
          i,
          particleDirections[i * 3] * expansion,
          particleDirections[i * 3 + 1] * expansion,
          particleDirections[i * 3 + 2] * expansion
        );
      }
      posAttr.needsUpdate = true;

      const pMat = particlesRef.current.material as THREE.PointsMaterial;
      pMat.opacity = Math.max(0, Math.pow(1.0 - progress, 0.9));
    }

    // 7. Dynamic Blinding Light Pulse
    if (lightRef.current) {
      lightRef.current.intensity = Math.max(0, Math.pow(1.0 - progress, 1.6) * 55);
    }
  });

  if (!active) return null;

  return (
    <group position={origin}>
      {/* 1. Volumetric Expanding White-Hot Fireball Core */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={1}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* 2. Primary Massive Shockwave Ring (Equatorial) */}
      <mesh ref={shockwave1Ref} rotation={[Math.PI * 0.5, 0, 0]}>
        <ringGeometry args={[0.93, 1.0, 128]} />
        <meshBasicMaterial
          color="#ffeedd"
          transparent
          opacity={1}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* 3. Secondary Oblique Plasma Halo Ring */}
      <mesh ref={shockwave2Ref} rotation={[0.45, 0.55, 0.25]}>
        <ringGeometry args={[0.9, 1.0, 96]} />
        <meshBasicMaterial
          color="#ff6600"
          transparent
          opacity={0.9}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* 4. Tertiary Polar Halo Ring */}
      <mesh ref={shockwave3Ref} rotation={[1.1, 0.2, 0.9]}>
        <ringGeometry args={[0.88, 1.0, 96]} />
        <meshBasicMaterial
          color="#ffaa00"
          transparent
          opacity={0.75}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* 5. Translucent Fiery Expansion Bubble */}
      <mesh ref={bubbleRef}>
        <sphereGeometry args={[1, 32, 16]} />
        <meshBasicMaterial
          color="#ff3300"
          transparent
          opacity={0.3}
          wireframe={false}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* 6. 3500+ Super-Dense Exploding Plasma Particles */}
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
          size={2.2}
          vertexColors
          transparent
          opacity={1}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* 7. Central Blinding Flash Light */}
      <pointLight
        ref={lightRef}
        color="#fff4e0"
        intensity={55}
        distance={450}
        decay={0.9}
      />
    </group>
  );
};
