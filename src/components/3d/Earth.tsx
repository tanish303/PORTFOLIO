import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { EARTH_DATA, calculateOrbitalPosition } from '../../data/planets';
import { getProceduralTexture } from '../../utils/textureGenerator';

interface EarthProps {
  elapsedTime: number;
  onSelect: (id: string) => void;
  isSelected: boolean;
  isCurrentLocation: boolean;
  onPositionUpdate?: (pos: [number, number, number]) => void;
}

export const Earth: React.FC<EarthProps> = ({
  elapsedTime,
  onSelect,
  isSelected,
  isCurrentLocation,
  onPositionUpdate,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const earthMeshRef = useRef<THREE.Mesh>(null);
  const cloudsMeshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const earthTexture = getProceduralTexture('earth');
  const cloudsTexture = getProceduralTexture('clouds');

  // Generate orbital trail line
  const orbitPoints = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const segments = 120;
    for (let i = 0; i <= segments; i++) {
      const t = (i / segments) * ((Math.PI * 2) / EARTH_DATA.orbitSpeed);
      const [x, y, z] = calculateOrbitalPosition(EARTH_DATA, t);
      points.push(new THREE.Vector3(x, y, z));
    }
    return points;
  }, []);

  const orbitLine = useMemo(() => {
    const geom = new THREE.BufferGeometry().setFromPoints(orbitPoints);
    const mat = new THREE.LineBasicMaterial({
      color: 0x00ffaa,
      transparent: true,
      opacity: hovered || isSelected ? 0.45 : 0.15,
      blending: THREE.AdditiveBlending,
    });
    return new THREE.Line(geom, mat);
  }, [orbitPoints, hovered, isSelected]);

  useFrame((_, delta) => {
    // Current orbital position
    const [x, y, z] = calculateOrbitalPosition(EARTH_DATA, elapsedTime);
    if (groupRef.current) {
      groupRef.current.position.set(x, y, z);
    }
    if (onPositionUpdate) {
      onPositionUpdate([x, y, z]);
    }

    // Planetary rotation
    if (earthMeshRef.current) {
      earthMeshRef.current.rotation.y += delta * EARTH_DATA.rotationSpeed;
    }
    // Atmospheric clouds rotate slightly faster
    if (cloudsMeshRef.current) {
      cloudsMeshRef.current.rotation.y += delta * (EARTH_DATA.rotationSpeed * 1.3);
    }
  });

  return (
    <>
      {/* Faint Orbital Path Ring */}
      <primitive object={orbitLine} />

      {/* Earth Group */}
      <group ref={groupRef}>
        {/* Invisible Click Target Sphere */}
        <mesh
          onClick={(e) => {
            e.stopPropagation();
            onSelect(EARTH_DATA.id);
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
          visible={false}
        >
          <sphereGeometry args={[EARTH_DATA.radius * 1.8, 16, 16]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>

        {/* Earth Axial Tilt (23.4°) Group */}
        <group rotation={[0.41, 0, 0.12]}>
          {/* Main Earth Sphere */}
          {/* Main Earth Sphere - Strictly Opaque with Depth Writing */}
          <mesh
            ref={earthMeshRef}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(EARTH_DATA.id);
            }}
            renderOrder={1}
          >
            <sphereGeometry args={[EARTH_DATA.radius, 48, 48]} />
            <meshStandardMaterial
              map={earthTexture}
              roughness={0.65}
              metalness={0.1}
              transparent={false}
              opacity={1.0}
              depthTest={true}
              depthWrite={true}
              emissive={isSelected || hovered ? '#003366' : '#000000'}
              emissiveIntensity={0.6}
            />
          </mesh>

          {/* Dynamic Cloud Layer */}
          <mesh ref={cloudsMeshRef} renderOrder={2}>
            <sphereGeometry args={[EARTH_DATA.radius * 1.025, 36, 36]} />
            <meshStandardMaterial
              map={cloudsTexture}
              transparent
              opacity={0.48}
              depthWrite={false}
              depthTest={true}
            />
          </mesh>
        </group>

        {/* Rayleigh Atmosphere Rim Glow - FrontSide subtle glow */}
        <mesh renderOrder={3}>
          <sphereGeometry args={[EARTH_DATA.radius * 1.12, 32, 32]} />
          <meshBasicMaterial
            color="#38bdf8"
            transparent
            opacity={hovered ? 0.35 : 0.22}
            blending={THREE.AdditiveBlending}
            side={THREE.FrontSide}
            depthWrite={false}
            depthTest={true}
          />
        </mesh>

        {/* YOU ARE HERE Marker or Planet Label */}
        <Html
          position={[0, EARTH_DATA.radius + 3.8, 0]}
          center
          distanceFactor={120}
          zIndexRange={[100, 0]}
        >
          {isCurrentLocation ? (
            <div
              className="planet-label-container"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(EARTH_DATA.id);
              }}
              style={{ pointerEvents: 'auto', cursor: 'pointer' }}
            >
              <div
                className="planet-label-badge active"
                style={{
                  borderColor: '#00ffaa',
                  background: 'rgba(0, 255, 170, 0.22)',
                  boxShadow: '0 0 20px rgba(0, 255, 170, 0.6)',
                }}
              >
                <div
                  className="planet-label-dot"
                  style={{ background: '#00ffaa', boxShadow: '0 0 8px #00ffaa' }}
                />
                <span className="planet-label-text" style={{ color: '#a7f3d0' }}>
                  YOU ARE HERE
                </span>
              </div>
              <div
                className="planet-label-stem"
                style={{
                  background: 'linear-gradient(to bottom, #00ffaa, transparent)',
                }}
              />
            </div>
          ) : (
            <div
              className="planet-label-container"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(EARTH_DATA.id);
              }}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              <div
                className={`planet-label-badge ${isSelected ? 'active' : ''} ${
                  hovered ? 'hovered' : ''
                }`}
                style={{
                  borderColor: hovered ? '#00ffaa' : 'rgba(0, 255, 170, 0.4)',
                  boxShadow: hovered ? '0 0 20px rgba(0, 255, 170, 0.6)' : undefined,
                }}
              >
                <div
                  className="planet-label-dot"
                  style={{ background: '#00ffaa', boxShadow: '0 0 8px #00ffaa' }}
                />
                <span className="planet-label-text">EARTH</span>
              </div>
              <div
                className="planet-label-stem"
                style={{
                  background: 'linear-gradient(to bottom, #00ffaa, transparent)',
                }}
              />
            </div>
          )}
        </Html>
      </group>
    </>
  );
};
