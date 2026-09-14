import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import type { CelestialBodyData } from '../../types/solar';
import { calculateOrbitalPosition } from '../../data/planets';
import { getProceduralTexture } from '../../utils/textureGenerator';

interface PlanetProps {
  data: CelestialBodyData;
  elapsedTime: number;
  onSelect: (id: string) => void;
  isSelected: boolean;
  isCurrentLocation: boolean;
  onPositionUpdate?: (id: string, pos: [number, number, number]) => void;
}

export const Planet: React.FC<PlanetProps> = ({
  data,
  elapsedTime,
  onSelect,
  isSelected,
  isCurrentLocation,
  onPositionUpdate,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const moonGroupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  const texture = getProceduralTexture(data.surfaceTheme);

  // Generate orbital ring path
  const orbitPoints = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const segments = 140;
    const period = (Math.PI * 2) / data.orbitSpeed;
    for (let i = 0; i <= segments; i++) {
      const t = (i / segments) * period;
      const [x, y, z] = calculateOrbitalPosition(data, t);
      points.push(new THREE.Vector3(x, y, z));
    }
    return points;
  }, [data]);

  const orbitLine = useMemo(() => {
    const geom = new THREE.BufferGeometry().setFromPoints(orbitPoints);
    // Outer distant orbits (like Neptune at r=162) need stronger minimum opacity to stay crisp against dark space
    const baseOpacity = data.id === 'askai' ? 0.32 : Math.max(0.16, 0.12 + data.orbitRadius * 0.001);
    const mat = new THREE.LineBasicMaterial({
      color: data.color,
      transparent: true,
      opacity: hovered || isSelected ? 0.65 : baseOpacity,
      blending: THREE.AdditiveBlending,
      depthTest: true,
      depthWrite: false,
    });
    const line = new THREE.Line(geom, mat);
    line.renderOrder = 0;
    return line;
  }, [orbitPoints, data.color, data.id, data.orbitRadius, hovered, isSelected]);

  useFrame((_, delta) => {
    // Current orbital position
    const [x, y, z] = calculateOrbitalPosition(data, elapsedTime);
    if (groupRef.current) {
      groupRef.current.position.set(x, y, z);
    }
    if (onPositionUpdate) {
      onPositionUpdate(data.id, [x, y, z]);
    }

    // Planetary rotation
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * data.rotationSpeed;
    }

    // Moons rotation if present
    if (moonGroupRef.current) {
      moonGroupRef.current.rotation.y += delta * 0.9;
    }
  });

  // Elevated label height ensuring it sits comfortably above rings and large atmospheres
  const labelHeight = useMemo(() => {
    if (data.rings) {
      return data.rings.outerRadius + 3.8;
    }
    return data.radius + 3.8;
  }, [data.rings, data.radius]);

  // Adaptive distance factor scaled for distant outer planets so headings remain prominently large and clearly legible
  const labelDistanceFactor = useMemo(() => {
    return Math.max(105, Math.min(185, 90 + data.orbitRadius * 0.65));
  }, [data.orbitRadius]);

  const ringTexture = useMemo(() => {
    if (data.surfaceTheme === 'saturn') {
      return getProceduralTexture('saturn_rings');
    }
    return null;
  }, [data.surfaceTheme]);

  return (
    <>
      {/* Orbital Path Line */}
      <primitive object={orbitLine} />

      {/* Planet Group at Orbital Position */}
      <group ref={groupRef}>
        {/* Invisible Click Target Sphere (for easy 3D selection) */}
        <mesh
          onClick={(e) => {
            e.stopPropagation();
            onSelect(data.id);
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
          <sphereGeometry args={[data.radius * 1.8, 16, 16]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>

        {/* Tilted Planetary Axis Group */}
        <group rotation={[data.axialTilt || 0, 0, (data.axialTilt || 0) * 0.35]}>
          {/* Main Body Mesh - Strictly Opaque with Depth Writing */}
          <mesh
            ref={meshRef}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(data.id);
            }}
            scale={hovered ? 1.06 : 1.0}
            renderOrder={1}
          >
            <sphereGeometry args={[data.radius, 48, 48]} />
            <meshStandardMaterial
              map={texture}
              roughness={0.65}
              metalness={0.1}
              transparent={false}
              opacity={1.0}
              depthTest={true}
              depthWrite={true}
              emissive={isSelected || hovered ? data.color : '#000000'}
              emissiveIntensity={hovered ? 0.4 : isSelected ? 0.25 : 0}
            />
          </mesh>

          {/* Atmosphere Halo Glow - FrontSide subtle rim glow */}
          {data.atmosphereColor && (
            <mesh scale={data.atmosphereScale || 1.12} renderOrder={2}>
              <sphereGeometry args={[data.radius, 32, 32]} />
              <meshBasicMaterial
                color={data.atmosphereColor}
                transparent
                opacity={hovered ? (data.atmosphereOpacity || 0.35) + 0.15 : (data.atmosphereOpacity || 0.35)}
                blending={THREE.AdditiveBlending}
                side={THREE.FrontSide}
                depthWrite={false}
                depthTest={true}
              />
            </mesh>
          )}

          {/* Planetary Rings (e.g. Saturn with concentric ring texture) */}
          {data.rings && (
            <mesh
              rotation={[
                Math.PI * 0.5,
                0,
                0,
              ]}
              renderOrder={3}
            >
              <ringGeometry
                args={[data.rings.innerRadius, data.rings.outerRadius, 80]}
              />
              <meshStandardMaterial
                map={ringTexture || undefined}
                color="#ffffff"
                transparent
                opacity={hovered ? Math.min(1.0, data.rings.opacity + 0.15) : data.rings.opacity}
                side={THREE.DoubleSide}
                roughness={0.5}
                metalness={0.1}
                depthTest={true}
                depthWrite={false}
              />
            </mesh>
          )}

          {/* Moons System (e.g. Uranus / Elysium) */}
          {data.hasMoons && (
            <group ref={moonGroupRef}>
              <mesh position={[data.radius + 1.8, 0.4, 0]}>
                <sphereGeometry args={[0.26, 16, 16]} />
                <meshStandardMaterial color="#94a3b8" roughness={0.9} />
              </mesh>
              <mesh position={[-data.radius - 2.5, -0.6, 0]}>
                <sphereGeometry args={[0.2, 16, 16]} />
                <meshStandardMaterial color="#cbd5e1" roughness={0.85} />
              </mesh>
            </group>
          )}
        </group>

        {/* Floating 3D Label or YOU ARE HERE Marker */}
        <Html
          position={[0, labelHeight, 0]}
          center
          distanceFactor={labelDistanceFactor}
          zIndexRange={[100, 0]}
        >
          {isCurrentLocation ? (
            <div
              className="planet-label-container"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(data.id);
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
                onSelect(data.id);
              }}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              <div
                className={`planet-label-badge ${isSelected ? 'active' : ''} ${
                  hovered ? 'hovered' : ''
                }`}
                style={{
                  borderColor: hovered ? '#ffffff' : isSelected ? data.color : `${data.color}66`,
                  boxShadow: hovered
                    ? `0 0 25px ${data.color}`
                    : isSelected
                    ? `0 0 15px ${data.color}88`
                    : undefined,
                }}
              >
                <div
                  className="planet-label-dot"
                  style={{
                    background: data.color,
                    boxShadow: `0 0 8px ${data.color}`,
                  }}
                />
                <span className="planet-label-text">{data.label}</span>
              </div>
              <div
                className="planet-label-stem"
                style={{
                  background: `linear-gradient(to bottom, ${data.color}aa, transparent)`,
                }}
              />
            </div>
          )}
        </Html>
      </group>
    </>
  );
};
