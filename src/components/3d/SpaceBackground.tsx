import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const SpaceBackground: React.FC = () => {
  const starsRef = useRef<THREE.Points>(null);
  const glowingStarsRef = useRef<THREE.Points>(null);
  const distantStarsRef = useRef<THREE.Points>(null);
  const dustRef = useRef<THREE.Points>(null);

  // Soft circular glow texture for natural round stars (NO square artifacts!)
  const circleSpriteTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;
    const rad = ctx.createRadialGradient(32, 32, 0, 32, 32, 30);
    rad.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
    rad.addColorStop(0.2, 'rgba(255, 255, 255, 0.85)');
    rad.addColorStop(0.5, 'rgba(230, 240, 255, 0.3)');
    rad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = rad;
    ctx.fillRect(0, 0, 64, 64);
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);

  // Radiant blooming sprite for the rare subtle glowing stars
  const glowSpriteTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;
    const rad = ctx.createRadialGradient(64, 64, 0, 64, 64, 62);
    rad.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
    rad.addColorStop(0.12, 'rgba(255, 255, 255, 0.95)');
    rad.addColorStop(0.28, 'rgba(186, 230, 253, 0.65)');
    rad.addColorStop(0.65, 'rgba(56, 189, 248, 0.22)');
    rad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = rad;
    ctx.fillRect(0, 0, 128, 128);
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);

  // Subtle Glowing Stars: A small percentage (~85 stars) with halo bloom and twinkling
  const { glowingPositions, glowingColors } = useMemo(() => {
    const count = 85;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const r = 320 + Math.random() * 260;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      const rand = Math.random();
      if (rand > 0.7) {
        colors[i * 3] = 0.6; colors[i * 3 + 1] = 0.88; colors[i * 3 + 2] = 1.0; // Cyan
      } else if (rand > 0.4) {
        colors[i * 3] = 1.0; colors[i * 3 + 1] = 0.9; colors[i * 3 + 2] = 0.6; // Gold
      } else if (rand > 0.2) {
        colors[i * 3] = 0.92; colors[i * 3 + 1] = 0.78; colors[i * 3 + 2] = 1.0; // Lilac
      } else {
        colors[i * 3] = 1.0; colors[i * 3 + 1] = 1.0; colors[i * 3 + 2] = 1.0; // Diamond White
      }
    }

    return { glowingPositions: positions, glowingColors: colors };
  }, []);

  // Primary Starfield: 3,200 natural round stars with subtle color temp variation (lightweight 60fps)
  const { starPositions, starColors } = useMemo(() => {
    const count = 3200;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const r = 300 + Math.random() * 320;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      // Natural stellar spectra: O/B blue-white, A/F crisp white, G/K warm yellow
      const temp = Math.random();
      if (temp > 0.82) {
        colors[i * 3] = 0.75;
        colors[i * 3 + 1] = 0.88;
        colors[i * 3 + 2] = 1.0; // Cool Blue-White
      } else if (temp > 0.68) {
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 0.92;
        colors[i * 3 + 2] = 0.78; // Warm Golden
      } else {
        const val = 0.85 + Math.random() * 0.15;
        colors[i * 3] = val;
        colors[i * 3 + 1] = val;
        colors[i * 3 + 2] = val; // Crisp White
      }
    }

    return { starPositions: positions, starColors: colors };
  }, []);

  // Distant Micro Star Cluster (Faint deep space background layer)
  const distantPositions = useMemo(() => {
    const count = 1400;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 500 + Math.random() * 260;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    return positions;
  }, []);

  // Subtle natural space dust / cosmic haze (smooth circular particles)
  const dustPositions = useMemo(() => {
    const count = 300;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 200 + Math.random() * 250;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.PI * 0.5 + (Math.random() - 0.5) * 0.8;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    return positions;
  }, []);

  // Shooting star animation state
  const meteorState = useRef({
    active: false,
    start: new THREE.Vector3(),
    end: new THREE.Vector3(),
    progress: 0,
    timer: 4.0,
  });

  const meteorGeometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    const pos = new Float32Array([0, 0, 0, 0, 0, 0]);
    geom.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return geom;
  }, []);

  const meteorLine = useMemo(() => {
    const mat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    const line = new THREE.Line(meteorGeometry, mat);
    line.visible = false;
    return line;
  }, [meteorGeometry]);

  useFrame((_, delta) => {
    // Subtle background celestial drift
    if (starsRef.current) {
      starsRef.current.rotation.y += delta * 0.002;
    }
    if (glowingStarsRef.current) {
      glowingStarsRef.current.rotation.y += delta * 0.0018;
      const t = performance.now() * 0.001;
      const mat = glowingStarsRef.current.material as THREE.PointsMaterial;
      if (mat) {
        mat.size = 5.4 + Math.sin(t * 1.8) * 0.8;
        mat.opacity = 0.88 + Math.sin(t * 2.4) * 0.1;
      }
    }
    if (distantStarsRef.current) {
      distantStarsRef.current.rotation.y += delta * 0.001;
    }
    if (dustRef.current) {
      dustRef.current.rotation.y += delta * 0.0015;
    }

    // Occasional shooting star
    const m = meteorState.current;
    if (!m.active) {
      m.timer -= delta;
      if (m.timer <= 0) {
        m.active = true;
        m.progress = 0;
        m.timer = 6 + Math.random() * 8;

        const startX = (Math.random() - 0.5) * 350;
        const startY = 90 + Math.random() * 100;
        const startZ = (Math.random() - 0.5) * 350;
        m.start.set(startX, startY, startZ);
        m.end.copy(m.start).add(new THREE.Vector3(
          (Math.random() - 0.5) * 100,
          -50 - Math.random() * 40,
          (Math.random() - 0.5) * 100
        ));
      }
    } else {
      m.progress += delta * 1.6;
      if (m.progress >= 1.0) {
        m.active = false;
        meteorLine.visible = false;
      } else {
        meteorLine.visible = true;
        const head = new THREE.Vector3().lerpVectors(m.start, m.end, m.progress);
        const tail = new THREE.Vector3().lerpVectors(m.start, m.end, Math.max(0, m.progress - 0.22));

        const posAttr = meteorGeometry.getAttribute('position') as THREE.BufferAttribute;
        posAttr.setXYZ(0, head.x, head.y, head.z);
        posAttr.setXYZ(1, tail.x, tail.y, tail.z);
        posAttr.needsUpdate = true;
      }
    }
  });

  return (
    <group>
      {/* Primary High-Resolution Starfield (Round smooth stars) */}
      <points ref={starsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={starPositions.length / 3}
            array={starPositions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={starColors.length / 3}
            array={starColors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={2.2}
          map={circleSpriteTexture}
          vertexColors
          transparent
          opacity={0.88}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          depthTest={true}
        />
      </points>

      {/* Subtle Glowing Stars with Soft Halo Bloom & Twinkling */}
      <points ref={glowingStarsRef} renderOrder={0}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={glowingPositions.length / 3}
            array={glowingPositions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={glowingColors.length / 3}
            array={glowingColors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={5.4}
          map={glowSpriteTexture}
          vertexColors
          transparent
          opacity={0.92}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          depthTest={true}
        />
      </points>

      {/* Deep Background Micro Stars */}
      <points ref={distantStarsRef} renderOrder={0}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={distantPositions.length / 3}
            array={distantPositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={1.5}
          map={circleSpriteTexture}
          color="#94a3b8"
          transparent
          opacity={0.55}
          sizeAttenuation
          depthWrite={false}
          depthTest={true}
        />
      </points>

      {/* Subtle Cosmic Dust (Round, very soft, natural haze) */}
      <points ref={dustRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={dustPositions.length / 3}
            array={dustPositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={5.0}
          map={circleSpriteTexture}
          color="#38bdf8"
          transparent
          opacity={0.12}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Shooting Star */}
      <primitive object={meteorLine} />
    </group>
  );
};
