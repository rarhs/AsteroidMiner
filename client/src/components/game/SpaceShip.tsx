import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import * as THREE from "three";
import { useSpaceGame } from "@/lib/stores/useSpaceGame";
import { useAudio } from "@/lib/stores/useAudio";

enum Controls {
  forward = 'forward',
  backward = 'backward',
  left = 'left',
  right = 'right',
  up = 'up',
  down = 'down',
  boost = 'boost'
}

export default function SpaceShip() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree();
  const [subscribe, getKeys] = useKeyboardControls<Controls>();
  
  const {
    shipPosition,
    shipRotation,
    shipVelocity,
    updateShipPosition,
    updateShipRotation,
    updateShipVelocity,
    asteroids,
    addResources,
    takeDamage,
    addParticle,
    removeAsteroid
  } = useSpaceGame();
  
  const { playHit, playSuccess } = useAudio();
  
  const velocity = useRef(new THREE.Vector3());
  const position = useRef(new THREE.Vector3());
  const rotation = useRef(new THREE.Euler());
  
  // Initialize position
  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.position.copy(shipPosition);
      meshRef.current.rotation.copy(shipRotation);
    }
    position.current.copy(shipPosition);
    rotation.current.copy(shipRotation);
    velocity.current.copy(shipVelocity);
  }, []);
  
  // Movement and collision detection
  useFrame((state, deltaTime) => {
    if (!meshRef.current) return;
    
    const keys = getKeys();
    const mesh = meshRef.current;
    
    // Movement parameters
    const acceleration = 15;
    const maxSpeed = 20;
    const boostMultiplier = 2;
    const rotationSpeed = 3;
    const friction = 0.95;
    
    // Handle rotation
    if (keys.left) {
      rotation.current.y += rotationSpeed * deltaTime;
    }
    if (keys.right) {
      rotation.current.y -= rotationSpeed * deltaTime;
    }
    if (keys.up) {
      rotation.current.x += rotationSpeed * deltaTime;
    }
    if (keys.down) {
      rotation.current.x -= rotationSpeed * deltaTime;
    }
    
    // Handle movement
    const moveSpeed = keys.boost ? acceleration * boostMultiplier : acceleration;
    const forward = new THREE.Vector3(0, 0, -1).applyEuler(rotation.current);
    const right = new THREE.Vector3(1, 0, 0).applyEuler(rotation.current);
    
    if (keys.forward) {
      velocity.current.add(forward.multiplyScalar(moveSpeed * deltaTime));
    }
    if (keys.backward) {
      velocity.current.add(forward.multiplyScalar(-moveSpeed * deltaTime * 0.5));
    }
    
    // Limit speed
    if (velocity.current.length() > maxSpeed) {
      velocity.current.normalize().multiplyScalar(maxSpeed);
    }
    
    // Apply friction
    velocity.current.multiplyScalar(friction);
    
    // Update position
    position.current.add(velocity.current.clone().multiplyScalar(deltaTime));
    
    // Update mesh transform
    mesh.position.copy(position.current);
    mesh.rotation.copy(rotation.current);
    
    // Update camera to follow ship
    const idealCameraPosition = position.current.clone().add(
      new THREE.Vector3(0, 5, 10).applyEuler(rotation.current)
    );
    camera.position.lerp(idealCameraPosition, deltaTime * 2);
    camera.lookAt(position.current);
    
    // Update game state
    updateShipPosition(position.current);
    updateShipRotation(rotation.current);
    updateShipVelocity(velocity.current);
    
    // Collision detection with asteroids
    asteroids.forEach(asteroid => {
      if (asteroid.destroyed) return;
      
      const distance = position.current.distanceTo(asteroid.position);
      
      // Refined radius calculations
      const asteroidBaseRadius = 0.75; // Max vertex displacement factor for icosahedron
      const asteroidEffectiveRadius = asteroid.scale * asteroidBaseRadius;
      const shipEffectiveRadius = 1.25; // Generous radius for the cone ship
      const collisionThreshold = asteroidEffectiveRadius + shipEffectiveRadius;

      if (distance < collisionThreshold) {
        // Determine if it's a hard collision (damage) or soft collision (mining)
        // Current logic: damage if distance < 70% of collisionRadius. Let's use 50% of new threshold.
        const damageThreshold = collisionThreshold * 0.5;

        if (distance >= damageThreshold) { // Mining collision (gentle)
          // Mine resources
          const resourcesGained = asteroid.resources;
          addResources(resourcesGained);
          playSuccess();
          
          // Create mining particles
          for (let i = 0; i < 10; i++) {
            addParticle({
              id: `mining-${Date.now()}-${i}`,
              position: asteroid.position.clone(),
              velocity: new THREE.Vector3(
                (Math.random() - 0.5) * 5,
                (Math.random() - 0.5) * 5,
                (Math.random() - 0.5) * 5
              ),
              life: 2,
              maxLife: 2,
              color: '#00ff00',
              size: 0.2
            });
          }
          
          removeAsteroid(asteroid.id);
        } else {
          // Collision damage
          takeDamage(20);
          playHit();
          
          // Create collision particles
          for (let i = 0; i < 15; i++) {
            addParticle({
              id: `collision-${Date.now()}-${i}`,
              position: position.current.clone(),
              velocity: new THREE.Vector3(
                (Math.random() - 0.5) * 8,
                (Math.random() - 0.5) * 8,
                (Math.random() - 0.5) * 8
              ),
              life: 1.5,
              maxLife: 1.5,
              color: '#ff4444',
              size: 0.3
            });
          }
          
          // Push ship away from asteroid
          const pushDirection = position.current.clone().sub(asteroid.position).normalize();
          velocity.current.add(pushDirection.multiplyScalar(10));
        }
      }
    });
    
    // console.log(`Ship position: ${position.current.x.toFixed(1)}, ${position.current.y.toFixed(1)}, ${position.current.z.toFixed(1)}`);
  });
  
  return (
    <mesh ref={meshRef} castShadow>
      {/* Ship body - triangular prism */}
      <coneGeometry args={[1, 3, 3]} />
      <meshStandardMaterial color="#4a90e2" metalness={0.8} roughness={0.2} />
      
      {/* Engine glow */}
      <mesh position={[0, 0, 1.8]}>
        <sphereGeometry args={[0.3, 8, 8]} />
        <meshBasicMaterial color="#00aaff" />
      </mesh>
    </mesh>
  );
}
