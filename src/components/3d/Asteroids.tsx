import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface AsteroidData {
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  rotSpeed: THREE.Vector3;
  scale: number;
}

// Helper to spawn an asteroid from outer space heading across the galaxy
function spawnAsteroid(index: number): AsteroidData {
  // Spawn around perimeter (radius 180 - 230)
  const angle = (index * Math.PI) + (Math.random() - 0.5) * 1.5;
  const dist = 180 + Math.random() * 40;
  const height = (Math.random() - 0.5) * 50;

  const startX = Math.cos(angle) * dist;
  const startZ = Math.sin(angle) * dist;
  const pos = new THREE.Vector3(startX, height, startZ);

  // Aim across toward the other side with a random offset
  const targetX = -startX * 0.7 + (Math.random() - 0.5) * 80;
  const targetZ = -startZ * 0.7 + (Math.random() - 0.5) * 80;
  const targetY = (Math.random() - 0.5) * 40;
  const target = new THREE.Vector3(targetX, targetY, targetZ);

  // Much slower graceful drift (0.45 - 0.85 units/s)
  const speed = 0.45 + Math.random() * 0.4;
  const vel = target.sub(pos).normalize().multiplyScalar(speed);

  // Slow, majestic tumbling rotational velocity
  const rotSpeed = new THREE.Vector3(
    (Math.random() - 0.5) * 0.15,
    (Math.random() - 0.5) * 0.2,
    (Math.random() - 0.5) * 0.12
  );

  // Size variation (radius scale 0.9 to 1.75)
  const scale = 0.95 + Math.random() * 0.8;

  return { pos, vel, rotSpeed, scale };
}

// Generate irregular craggy boulder geometry with displaced vertices
function createRockyGeometry(): THREE.BufferGeometry {
  const geom = new THREE.DodecahedronGeometry(1.2, 1);
  const posAttr = geom.getAttribute('position');
  const vertex = new THREE.Vector3();

  // Deterministic pseudo-noise displacement for craggy surface
  for (let i = 0; i < posAttr.count; i++) {
    vertex.fromBufferAttribute(posAttr, i);
    const length = vertex.length();
    const noise =
      Math.sin(vertex.x * 3.5) * Math.cos(vertex.y * 3.2) * 0.22 +
      Math.sin(vertex.z * 4.1) * 0.15;
    vertex.normalize().multiplyScalar(length + noise);
    posAttr.setXYZ(i, vertex.x, vertex.y, vertex.z);
  }

  geom.computeVertexNormals();
  return geom;
}

export const Asteroids: React.FC = () => {
  const meshRef1 = useRef<THREE.Mesh>(null);
  const meshRef2 = useRef<THREE.Mesh>(null);

  // Persistent tracking for exactly 2 asteroids
  const asteroids = useRef<AsteroidData[]>([
    spawnAsteroid(0),
    spawnAsteroid(1),
  ]);

  // Procedural rocky geometry
  const rockyGeometry = useMemo(() => createRockyGeometry(), []);

  // Procedural rough asteroid surface texture (gray-brown regolith with impact pits)
  const rockyTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Base carbonaceous chondrite / stony-iron gray-brown tone
    ctx.fillStyle = '#4a443b';
    ctx.fillRect(0, 0, 512, 512);

    // Rocky mineral mottling
    for (let i = 0; i < 600; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const r = 2 + Math.random() * 12;
      const shade = Math.floor(40 + Math.random() * 60);
      ctx.fillStyle = `rgb(${shade + 10}, ${shade}, ${shade - 10})`;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Impact craters and micro-fissures
    for (let c = 0; c < 20; c++) {
      const cx = Math.random() * 512;
      const cy = Math.random() * 512;
      const cr = 8 + Math.random() * 22;

      // Dark pit
      ctx.fillStyle = '#26221c';
      ctx.beginPath();
      ctx.arc(cx, cy, cr, 0, Math.PI * 2);
      ctx.fill();

      // Raised sunlit rim edge
      ctx.strokeStyle = '#787163';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(cx, cy, cr, -0.4, Math.PI * 0.7);
      ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }, []);

  useFrame((_, delta) => {
    const meshes = [meshRef1.current, meshRef2.current];

    asteroids.current.forEach((ast, idx) => {
      const mesh = meshes[idx];
      if (!mesh) return;

      // 1. Advance position along velocity trajectory
      ast.pos.addScaledVector(ast.vel, delta);
      mesh.position.copy(ast.pos);

      // 2. Continuous irregular 3D tumbling rotation
      mesh.rotation.x += ast.rotSpeed.x * delta;
      mesh.rotation.y += ast.rotSpeed.y * delta;
      mesh.rotation.z += ast.rotSpeed.z * delta;
      mesh.scale.setScalar(ast.scale);

      // 3. Boundary check: if asteroid has passed beyond visible solar system (r > 230 or |y| > 90), respawn!
      const distFromCenter = Math.sqrt(ast.pos.x * ast.pos.x + ast.pos.z * ast.pos.z);
      if (distFromCenter > 240 || Math.abs(ast.pos.y) > 95) {
        asteroids.current[idx] = spawnAsteroid(idx);
      }
    });
  });

  return (
    <group>
      {/* Asteroid 1 */}
      <mesh ref={meshRef1} geometry={rockyGeometry}>
        <meshStandardMaterial
          map={rockyTexture}
          roughness={0.92}
          metalness={0.12}
          color="#8c8275"
        />
      </mesh>

      {/* Asteroid 2 */}
      <mesh ref={meshRef2} geometry={rockyGeometry}>
        <meshStandardMaterial
          map={rockyTexture}
          roughness={0.94}
          metalness={0.15}
          color="#756b5e"
        />
      </mesh>
    </group>
  );
};
