import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSpaceGame, type Asteroid as AsteroidType } from "@/lib/stores/useSpaceGame";

interface AsteroidProps {
  asteroid: AsteroidType;
}

export default function Asteroid({ asteroid }: AsteroidProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Generate random vertices for irregular asteroid shape
  const geometry = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(1, 1);
    const vertices = geo.attributes.position;
    
    // Randomly displace vertices to create irregular shape
    for (let i = 0; i < vertices.count; i++) {
      const vertex = new THREE.Vector3();
      vertex.fromBufferAttribute(vertices, i);
      
      // Add random displacement
      const displacement = 0.3 + Math.random() * 0.4;
      vertex.multiplyScalar(displacement);
      
      vertices.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }
    
    geo.attributes.position.needsUpdate = true;
    geo.computeVertexNormals();
    
    return geo;
  }, [asteroid.id]);
  
  // Rotate asteroid slowly
  useFrame((state, deltaTime) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += deltaTime * 0.2;
      meshRef.current.rotation.y += deltaTime * 0.15;
      meshRef.current.rotation.z += deltaTime * 0.1;
    }
  });
  
  // Color based on resource content
  const materialColor = useMemo(() => {
    const resourceDensity = asteroid.resources / 10;
    if (resourceDensity > 0.8) return "#ffd700"; // Gold for high resources
    if (resourceDensity > 0.5) return "#c0c0c0"; // Silver for medium resources
    return "#8b7355"; // Brown for low resources
  }, [asteroid.resources]);
  
  if (asteroid.destroyed) return null;
  
  return (
    <mesh
      ref={meshRef}
      position={asteroid.position}
      scale={asteroid.scale}
      castShadow
      receiveShadow
      geometry={geometry}
    >
      <meshStandardMaterial 
        color={materialColor}
        metalness={0.3}
        roughness={0.8}
      />
    </mesh>
  );
}
