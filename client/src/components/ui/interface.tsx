import { useEffect } from "react";
import { useSpaceGame, GameState as SpaceGameConcreteState } from "@/lib/stores/useSpaceGame"; // Renamed to avoid conflict
import { useAudio } from "@/lib/stores/useAudio";
import { Button } from "./button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./card";
import Confetti from "react-confetti"; // Changed import path
import { VolumeX, Volume2, RotateCw, Trophy } from "lucide-react";

export function Interface() {
  const { gameState, resetGame, setGameState } = useSpaceGame(state => ({
    gameState: state.gameState,
    resetGame: state.resetGame,
    setGameState: state.setGameState,
  }));
  const { isMuted, toggleMute } = useAudio();

  // Handle clicks on the interface in the menu phase to start the game
  useEffect(() => {
    if (gameState === "menu") {
      const handleClickToStart = () => {
        // Check if the click is on a button, if so, don't start the game.
        // This is a simple check; a more robust solution might involve event.target.closest('button').
        if ((event?.target as HTMLElement)?.tagName === 'BUTTON' || (event?.target as HTMLElement)?.closest('button')) {
          return;
        }
        // Check if activeElement is an HTMLElement and then call blur
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur(); // Remove focus from any button
        }
        setGameState("playing"); // Directly set game state to playing
      };

      window.addEventListener("click", handleClickToStart);
      return () => window.removeEventListener("click", handleClickToStart);
    }
  }, [gameState, setGameState]);

  return (
    <>
      <Confetti />
      
      {/* Top-right corner UI controls */}
      <div className="fixed top-4 right-4 flex gap-2 z-10">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleMute}
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={resetGame}
          title="Restart Game"
        >
          <RotateCw size={18} />
        </Button>
      </div>
      
      {/* Game completion overlay */}
      {gameState === "levelComplete" && (
        <div className="fixed inset-0 flex items-center justify-center z-20 bg-black/30">
          <Card className="w-full max-w-md mx-4 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2">
                <Trophy className="text-yellow-500" />
                Level Complete!
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              <p className="text-center text-muted-foreground">
                Congratulations! You successfully navigated the course.
              </p>
            </CardContent>
            
            <CardFooter className="flex justify-center">
              <Button onClick={resetGame} className="w-full">
                Play Again
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
      
      {/* Instructions panel */}
      <div className="fixed bottom-4 left-4 z-10">
        <Card className="w-auto max-w-xs bg-background/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <h3 className="font-medium mb-2">Controls:</h3>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>WASD or Arrow Keys: Move the ball</li>
              <li>Space: Jump</li>
              <li>R: Restart game</li>
              <li>M: Toggle sound</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
