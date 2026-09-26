'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

function TechKnot() {
  const groupRef = useRef<THREE.Group>(null);
  const innerRef  = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.12;
      groupRef.current.rotation.x = Math.sin(t * 0.15) * 0.2;
    }
    if (innerRef.current) {
      innerRef.current.rotation.z = -t * 0.3;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
      <group ref={groupRef} scale={1.8}>
        <mesh>
          <torusKnotGeometry args={[1, 0.28, 200, 32, 2, 3]} />
          <meshBasicMaterial color="#0A84FF" wireframe transparent opacity={0.18} />
        </mesh>
        <mesh>
          <torusKnotGeometry args={[1, 0.22, 200, 32, 2, 3]} />
          <meshStandardMaterial color="#050520" metalness={0.9} roughness={0.1} transparent opacity={0.85} />
        </mesh>
        <mesh ref={innerRef} scale={0.25}>
          <icosahedronGeometry args={[1, 3]} />
          <meshBasicMaterial color="#0A84FF" transparent opacity={0.9} />
        </mesh>
      </group>
    </Float>
  );
}

function OrbitalRing() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.getElapsedTime() * 0.08;
      ref.current.rotation.z = -state.clock.getElapsedTime() * 0.05;
    }
  });
  return (
    <mesh ref={ref} scale={3.2}>
      <torusGeometry args={[1, 0.004, 2, 200]} />
      <meshBasicMaterial color="#0A84FF" transparent opacity={0.25} />
    </mesh>
  );
}

function Particles() {
  const ref = useRef<THREE.Points>(null);
  const count = 300;

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 4 + Math.random() * 6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.getElapsedTime() * 0.025;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#0A84FF" size={0.04} transparent opacity={0.45} sizeAttenuation />
    </points>
  );
}

export default function Hero3D() {
  return (
    <div className="absolute inset-0 -z-10 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 9], fov: 42 }}>
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={2} color="#0A84FF" />
        <pointLight position={[-10, -5, -10]} intensity={1} color="#6366f1" />
        <TechKnot />
        <OrbitalRing />
        <Particles />
      </Canvas>
    </div>
  );
}
