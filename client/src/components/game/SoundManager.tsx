import { useEffect } from "react";
import { useAudio } from "@/lib/stores/useAudio";

export default function SoundManager() {
  const { setBackgroundMusic, setHitSound, setSuccessSound, isMuted } = useAudio();
  
  useEffect(() => {
    // Initialize background music
    const bgMusic = new Audio("/sounds/background.mp3");
    bgMusic.loop = true;
    bgMusic.volume = 0.3;
    setBackgroundMusic(bgMusic);
    
    // Initialize sound effects
    const hitSfx = new Audio("/sounds/hit.mp3");
    hitSfx.volume = 0.5;
    setHitSound(hitSfx);
    
    const successSfx = new Audio("/sounds/success.mp3");
    successSfx.volume = 0.4;
    setSuccessSound(successSfx);
    
    // Start background music if not muted
    if (!isMuted) {
      bgMusic.play().catch(err => console.log("Background music autoplay prevented:", err));
    }
    
    return () => {
      bgMusic.pause();
      bgMusic.src = "";
      hitSfx.src = "";
      successSfx.src = "";
    };
  }, [setBackgroundMusic, setHitSound, setSuccessSound, isMuted]);
  
  return null;
}
