import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSpaceGame } from "@/lib/stores/useSpaceGame";

export default function ParticleSystem() {
  const { particles, updateParticles } = useSpaceGame();
  
  useFrame((state, deltaTime) => {
    updateParticles(deltaTime);
  });
  
  return (
    <>
      {particles.map(particle => (
        <mesh
          key={particle.id}
          position={particle.position}
          scale={particle.size}
        >
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial 
            color={particle.color}
            transparent
            opacity={particle.life / particle.maxLife}
          />
        </mesh>
      ))}
    </>
  );
}
