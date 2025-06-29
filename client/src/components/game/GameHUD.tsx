import { useSpaceGame } from "@/lib/stores/useSpaceGame";
import { useAudio } from "@/lib/stores/useAudio";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function GameHUD() {
  const { 
    gameState, 
    score, 
    resources, 
    health, 
    maxHealth, 
    resetGame 
  } = useSpaceGame();
  
  const { isMuted, toggleMute } = useAudio();
  
  if (gameState === "menu") {
    return (
      <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/80">
        <Card className="w-96 bg-gray-900 border-gray-700 text-white">
          <CardContent className="p-8 text-center">
            <h1 className="text-4xl font-bold mb-4 text-blue-400">Space Miner</h1>
            <p className="text-gray-300 mb-8">
              Navigate through asteroid fields and mine resources while avoiding collisions!
            </p>
            <div className="space-y-4">
              <Button 
                onClick={() => resetGame()}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Start Game
              </Button>
              <Button
                onClick={toggleMute}
                variant="outline"
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Sound: {isMuted ? "OFF" : "ON"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (gameState === "gameOver") {
    return (
      <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/80">
        <Card className="w-96 bg-gray-900 border-gray-700 text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl font-bold mb-4 text-red-400">Game Over</h2>
            <div className="space-y-2 mb-8">
              <p className="text-xl">Final Score: <span className="text-blue-400">{score}</span></p>
              <p className="text-lg">Resources Collected: <span className="text-green-400">{resources}</span></p>
            </div>
            <div className="space-y-4">
              <Button 
                onClick={() => resetGame()}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Play Again
              </Button>
              <Button
                onClick={toggleMute}
                variant="outline"
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Sound: {isMuted ? "OFF" : "ON"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="fixed top-4 left-4 z-10 space-y-4">
      {/* Health Bar */}
      <Card className="bg-black/70 border-gray-700 text-white">
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Hull Integrity</span>
              <span className="text-sm">{health}/{maxHealth}</span>
            </div>
            <Progress 
              value={(health / maxHealth) * 100} 
              className="w-48 h-3"
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Score and Resources */}
      <Card className="bg-black/70 border-gray-700 text-white">
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Score:</span>
              <span className="text-sm font-bold text-blue-400">{score}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Resources:</span>
              <span className="text-sm font-bold text-green-400">{resources}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Controls */}
      <Card className="bg-black/70 border-gray-700 text-white">
        <CardContent className="p-4">
          <div className="text-xs space-y-1">
            <p><strong>WASD:</strong> Move</p>
            <p><strong>Q/E:</strong> Up/Down</p>
            <p><strong>Space:</strong> Boost</p>
          </div>
        </CardContent>
      </Card>
      
      {/* Pause/Sound buttons */}
      <div className="space-y-2">
        <Button
          onClick={toggleMute}
          variant="outline"
          size="sm"
          className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
        >
          🔊 {isMuted ? "OFF" : "ON"}
        </Button>
      </div>
    </div>
  );
}
