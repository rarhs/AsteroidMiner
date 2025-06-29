import { useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSpaceGame } from "@/lib/stores/useSpaceGame";
import Asteroid from "./Asteroid";

export default function AsteroidField() {
  const { asteroids, addAsteroid, shipPosition } = useSpaceGame();
  
  // Pre-calculated asteroid data to avoid re-renders
  const asteroidData = useMemo(() => {
    const data = [];
    for (let i = 0; i < 50; i++) {
      data.push({
        id: `asteroid-${i}`,
        basePosition: new THREE.Vector3(
          (Math.random() - 0.5) * 200,
          (Math.random() - 0.5) * 100,
          (Math.random() - 0.5) * 200
        ),
        offset: new THREE.Vector3(
          Math.random() * 2 * Math.PI,
          Math.random() * 2 * Math.PI,
          Math.random() * 2 * Math.PI
        ),
        scale: 1 + Math.random() * 3,
        resources: Math.floor(5 + Math.random() * 15),
        orbitRadius: 5 + Math.random() * 10,
        orbitSpeed: 0.1 + Math.random() * 0.2
      });
    }
    return data;
  }, []);
  
  // Initialize asteroids
  useEffect(() => {
    asteroidData.forEach(data => {
      addAsteroid({
        id: data.id,
        position: data.basePosition.clone(),
        rotation: new THREE.Euler(0, 0, 0),
        scale: data.scale,
        resources: data.resources,
        destroyed: false
      });
    });
  }, [asteroidData, addAsteroid]);
  
  // Update asteroid positions (simple orbital motion)
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    asteroidData.forEach(data => {
      const asteroid = asteroids.find(a => a.id === data.id);
      if (!asteroid || asteroid.destroyed) return;
      
      // Simple orbital motion around their base position
      const orbitalX = Math.sin(time * data.orbitSpeed + data.offset.x) * data.orbitRadius;
      const orbitalY = Math.sin(time * data.orbitSpeed * 0.7 + data.offset.y) * data.orbitRadius * 0.5;
      const orbitalZ = Math.cos(time * data.orbitSpeed + data.offset.z) * data.orbitRadius;
      
      asteroid.position.copy(data.basePosition).add(new THREE.Vector3(orbitalX, orbitalY, orbitalZ));
    });
  });
  
  return (
    <>
      {asteroids.map(asteroid => (
        <Asteroid key={asteroid.id} asteroid={asteroid} />
      ))}
    </>
  );
}
