import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SupernovaEffectProps {
  active: boolean;
  progress: number; // 0 to 1
}

export const SupernovaEffect: React.FC<SupernovaEffectProps> = ({ active, progress }) => {
  const shockwave1Ref = useRef<THREE.Mesh>(null);
  const shockwave2Ref = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);

  const particleCount = 1200;
  const { particleDirections, particleSpeeds, particleColors } = useMemo(() => {
    const dirs = new Float32Array(particleCount * 3);
    const speeds = new Float32Array(particleCount);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      // Spherical explosion dispersal
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      dirs[i * 3] = Math.sin(phi) * Math.cos(theta);
      dirs[i * 3 + 1] = Math.sin(phi) * Math.sin(theta);
      dirs[i * 3 + 2] = Math.cos(phi);

      speeds[i] = 18 + Math.random() * 45;

      // Golden yellow, fiery orange, and white hot plasma
      const r = Math.random();
      if (r > 0.6) {
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 0.95;
        colors[i * 3 + 2] = 0.7; // White Hot
      } else if (r > 0.3) {
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 0.55;
        colors[i * 3 + 2] = 0.1; // Golden Orange
      } else {
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 0.15;
        colors[i * 3 + 2] = 0.1; // Fiery Red
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

    // Expanding shockwave rings
    if (shockwave1Ref.current) {
      const s = progress * 80;
      shockwave1Ref.current.scale.set(s, s, s);
      const mat = shockwave1Ref.current.material as THREE.MeshBasicMaterial;
      mat.opacity = Math.max(0, 1.0 - progress * 1.1);
    }

    if (shockwave2Ref.current) {
      const s = Math.max(0, (progress - 0.1) * 65);
      shockwave2Ref.current.scale.set(s, s, s);
      const mat = shockwave2Ref.current.material as THREE.MeshBasicMaterial;
      mat.opacity = Math.max(0, 0.8 - progress * 0.9);
    }

    // Expanding particle positions
    if (particlesRef.current) {
      const geom = particlesRef.current.geometry;
      const posAttr = geom.getAttribute('position') as THREE.BufferAttribute;

      for (let i = 0; i < particleCount; i++) {
        const dist = particleSpeeds[i] * progress * 2.2;
        posAttr.setXYZ(
          i,
          particleDirections[i * 3] * dist,
          particleDirections[i * 3 + 1] * dist,
          particleDirections[i * 3 + 2] * dist
        );
      }
      posAttr.needsUpdate = true;

      const pMat = particlesRef.current.material as THREE.PointsMaterial;
      pMat.opacity = Math.max(0, 1.0 - progress * 0.95);
    }
  });

  if (!active) return null;

  return (
    <group position={[0, 0, 0]}>
      {/* Primary Shockwave Ring */}
      <mesh ref={shockwave1Ref} rotation={[Math.PI * 0.5, 0, 0]}>
        <ringGeometry args={[0.92, 1.0, 64]} />
        <meshBasicMaterial
          color="#ffeedd"
          transparent
          opacity={1}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Secondary Plasma Halo Ring */}
      <mesh ref={shockwave2Ref} rotation={[0.4, 0.5, 0.2]}>
        <ringGeometry args={[0.88, 1.0, 64]} />
        <meshBasicMaterial
          color="#ff6600"
          transparent
          opacity={0.8}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Exploding Plasma Particles */}
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
          size={1.4}
          vertexColors
          transparent
          opacity={1}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Central Blinding Flash Light */}
      <pointLight
        color="#ffffff"
        intensity={Math.max(0, (1 - progress) * 20)}
        distance={250}
        decay={1.2}
      />
    </group>
  );
};
