import * as THREE from "three";

export default function Environment() {
  return (
    <>
      {/* Ambient lighting */}
      <ambientLight intensity={0.3} color="#ffffff" />
      
      {/* Main directional light (simulating distant star) */}
      <directionalLight
        position={[50, 50, 50]}
        intensity={1}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={200}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />
      
      {/* Point lights for depth */}
      <pointLight position={[-30, 20, -30]} intensity={0.5} color="#4a90e2" />
      <pointLight position={[30, -20, 30]} intensity={0.5} color="#e24a90" />
      
      {/* Starfield background */}
      <Stars />
    </>
  );
}

function Stars() {
  const count = 1000;
  const positions = new Float32Array(count * 3);
  
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    // Create stars in a large sphere around the scene
    const radius = 400 + Math.random() * 200;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    
    positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i3 + 2] = radius * Math.cos(phi);
  }
  
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={2}
        color="#ffffff"
        transparent
        opacity={0.8}
        sizeAttenuation={false}
      />
    </points>
  );
}
