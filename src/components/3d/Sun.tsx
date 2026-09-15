import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { SUN_DATA } from '../../data/planets';
import { getProceduralTexture } from '../../utils/textureGenerator';

interface SunProps {
  onSelect: (id: string) => void;
  isSelected: boolean;
  isExploding: boolean;
  hideLabels?: boolean;
}

export const Sun: React.FC<SunProps> = ({ onSelect, isSelected, isExploding, hideLabels = false }) => {
  const sunMeshRef = useRef<THREE.Mesh>(null);
  const coronaRef = useRef<THREE.Mesh>(null);
  const flareRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const texture = getProceduralTexture('sun');

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    if (sunMeshRef.current) {
      sunMeshRef.current.rotation.y += delta * 0.12;
      sunMeshRef.current.rotation.x += delta * 0.04;
    }
    if (coronaRef.current) {
      coronaRef.current.rotation.y -= delta * 0.08;
      const s = 1.0 + Math.sin(t * 2) * 0.03 + (hovered ? 0.08 : 0);
      coronaRef.current.scale.set(s, s, s);
    }
    if (flareRef.current) {
      flareRef.current.rotation.z += delta * 0.05;
      const s = 1.15 + Math.cos(t * 1.8) * 0.04 + (hovered ? 0.12 : 0);
      flareRef.current.scale.set(s, s, s);
    }
  });


  return (
    <group position={[0, 0, 0]}>
      {/* Central Sunlight Source */}
      <pointLight
        color={isExploding ? '#fff8e8' : '#fffaf0'}
        intensity={isExploding ? 22.0 : 7.0}
        distance={isExploding ? 1200 : 650}
        decay={0.35}
      />
      {/* Cinematic Space Ambient & Soft Starlight Bounce */}
      <ambientLight color="#475569" intensity={0.75} />
      <hemisphereLight
        args={['#93c5fd', '#0f172a', 0.55]}
      />

      {/* Main Core Mesh */}
      <mesh
        ref={sunMeshRef}
        renderOrder={1}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(SUN_DATA.id);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'default';
        }}
      >
        <sphereGeometry args={[SUN_DATA.radius, 32, 32]} />
        <meshBasicMaterial
          map={texture}
          color={isExploding ? '#ffffff' : hovered || isSelected ? '#fff0c2' : '#ffffff'}
          depthTest={true}
          depthWrite={true}
        />
      </mesh>

      {/* Primary Solar Corona Glow */}
      <mesh ref={coronaRef} renderOrder={2}>
        <sphereGeometry args={[SUN_DATA.radius * 1.18, 24, 24]} />
        <meshBasicMaterial
          color={hovered ? '#ffaa00' : '#ff7700'}
          transparent
          opacity={hovered ? 0.6 : 0.4}
          blending={THREE.AdditiveBlending}
          side={THREE.FrontSide}
          depthWrite={false}
          depthTest={true}
        />
      </mesh>

      {/* Outer Atmosphere Flare */}
      <mesh ref={flareRef} renderOrder={3}>
        <sphereGeometry args={[SUN_DATA.radius * 1.38, 24, 24]} />
        <meshBasicMaterial
          color="#ff3300"
          transparent
          opacity={hovered ? 0.35 : 0.2}
          blending={THREE.AdditiveBlending}
          side={THREE.FrontSide}
          depthWrite={false}
          depthTest={true}
        />
      </mesh>

      {/* Floating 3D Label - hidden during supernova blast */}
      {!isExploding && !hideLabels && (
        <Html
          position={[0, SUN_DATA.radius + 3.8, 0]}
          center
          distanceFactor={88}
          zIndexRange={[100, 0]}
        >
          <div
            className="planet-label-container"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(SUN_DATA.id);
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <div
              className={`planet-label-badge ${isSelected ? 'active' : ''} ${
                hovered ? 'hovered' : ''
              }`}
              style={{
                borderColor: hovered ? '#ffaa00' : 'rgba(255, 170, 0, 0.4)',
                boxShadow: hovered ? '0 0 25px rgba(255, 120, 0, 0.7)' : undefined,
              }}
            >
              <div
                className="planet-label-dot"
                style={{ background: '#ffaa00', boxShadow: '0 0 8px #ffaa00' }}
              />
              <span className="planet-label-text" style={{ color: '#fff' }}>
                SUN
              </span>
            </div>
            <div
              className="planet-label-stem"
              style={{
                background: 'linear-gradient(to bottom, #ffaa00, transparent)',
              }}
            />
          </div>
        </Html>
      )}
    </group>
  );
};
