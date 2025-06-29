import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import * as THREE from "three";

export interface Asteroid {
  id: string;
  position: THREE.Vector3;
  rotation: THREE.Euler;
  scale: number;
  resources: number;
  destroyed: boolean;
}

export interface Particle {
  id: string;
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

export type GameState = "menu" | "playing" | "paused" | "gameOver" | "levelComplete";

interface SpaceGameState {
  // Game state
  gameState: GameState;
  score: number;
  resources: number;
  health: number;
  maxHealth: number;
  
  // Ship state
  shipPosition: THREE.Vector3;
  shipRotation: THREE.Euler;
  shipVelocity: THREE.Vector3;
  
  // Asteroids
  asteroids: Asteroid[];
  
  // Particles
  particles: Particle[];
  
  // Actions
  setGameState: (state: GameState) => void;
  addResources: (amount: number) => void;
  takeDamage: (amount: number) => void;
  updateShipPosition: (position: THREE.Vector3) => void;
  updateShipRotation: (rotation: THREE.Euler) => void;
  updateShipVelocity: (velocity: THREE.Vector3) => void;
  addAsteroid: (asteroid: Asteroid) => void;
  removeAsteroid: (id: string) => void;
  updateAsteroid: (id: string, updates: Partial<Asteroid>) => void;
  addParticle: (particle: Particle) => void;
  updateParticles: (deltaTime: number) => void;
  resetGame: () => void;
}

export const useSpaceGame = create<SpaceGameState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    gameState: "menu", // Start in menu
    score: 0,
    resources: 0,
    health: 100,
    maxHealth: 100,
    
    shipPosition: new THREE.Vector3(0, 0, 0),
    shipRotation: new THREE.Euler(0, 0, 0),
    shipVelocity: new THREE.Vector3(0, 0, 0),
    
    asteroids: [],
    particles: [],
    
    // Actions
    setGameState: (state) => set({ gameState: state }),
    
    addResources: (amount) => set((state) => ({
      resources: state.resources + amount,
      score: state.score + amount * 10
    })),
    
    takeDamage: (amount) => set((state) => {
      const newHealth = Math.max(0, state.health - amount);
      return {
        health: newHealth,
        gameState: newHealth <= 0 ? "gameOver" : state.gameState
      };
    }),
    
    updateShipPosition: (position) => set({ shipPosition: position.clone() }),
    updateShipRotation: (rotation) => set({ shipRotation: rotation.clone() }),
    updateShipVelocity: (velocity) => set({ shipVelocity: velocity.clone() }),
    
    addAsteroid: (asteroid) => set((state) => ({
      asteroids: [...state.asteroids, asteroid]
    })),
    
    removeAsteroid: (id) => set((state) => ({
      asteroids: state.asteroids.filter(a => a.id !== id)
    })),
    
    updateAsteroid: (id, updates) => set((state) => ({
      asteroids: state.asteroids.map(a => 
        a.id === id ? { ...a, ...updates } : a
      )
    })),
    
    addParticle: (particle) => set((state) => ({
      particles: [...state.particles, particle]
    })),
    
    updateParticles: (deltaTime) => set((state) => ({
      particles: state.particles
        .map(p => ({
          ...p,
          position: p.position.clone().add(p.velocity.clone().multiplyScalar(deltaTime)),
          life: p.life - deltaTime
        }))
        .filter(p => p.life > 0)
    })),
    
    resetGame: () => set({
      gameState: "menu", // Reset to menu
      score: 0,
      resources: 0,
      health: 100,
      shipPosition: new THREE.Vector3(0, 0, 0),
      shipRotation: new THREE.Euler(0, 0, 0),
      shipVelocity: new THREE.Vector3(0, 0, 0),
      asteroids: [],
      particles: []
    })
  }))
);
