import { Canvas } from "@react-three/fiber";
import { KeyboardControls, Stats } from "@react-three/drei";
import { Suspense } from "react";
import "@fontsource/inter";

import SpaceShip from "./components/game/SpaceShip";
import AsteroidField from "./components/game/AsteroidField";
import Environment from "./components/game/Environment";
import GameHUD from "./components/game/GameHUD";
import SoundManager from "./components/game/SoundManager";
import ParticleSystem from "./components/game/ParticleSystem";

// Define control keys for the space ship
enum Controls {
  forward = 'forward',
  backward = 'backward',
  left = 'left',
  right = 'right',
  up = 'up',
  down = 'down',
  boost = 'boost'
}

const keyMap = [
  { name: Controls.forward, keys: ['KeyW', 'ArrowUp'] },
  { name: Controls.backward, keys: ['KeyS', 'ArrowDown'] },
  { name: Controls.left, keys: ['KeyA', 'ArrowLeft'] },
  { name: Controls.right, keys: ['KeyD', 'ArrowRight'] },
  { name: Controls.up, keys: ['KeyQ'] },
  { name: Controls.down, keys: ['KeyE'] },
  { name: Controls.boost, keys: ['Space'] },
];

function App() {
  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      position: 'relative', 
      overflow: 'hidden',
      background: '#000011'
    }}>
      <KeyboardControls map={keyMap}>
        <Canvas
          shadows
          camera={{
            position: [0, 10, 20],
            fov: 60,
            near: 0.1,
            far: 1000
          }}
          gl={{
            antialias: true,
            powerPreference: "high-performance"
          }}
        >
          <color attach="background" args={["#000011"]} />
          
          <Suspense fallback={null}>
            <Environment />
            <SpaceShip />
            <AsteroidField />
            <ParticleSystem />
          </Suspense>
          
          <Stats />
        </Canvas>
        
        <GameHUD />
        <SoundManager />
      </KeyboardControls>
    </div>
  );
}

export default App;
