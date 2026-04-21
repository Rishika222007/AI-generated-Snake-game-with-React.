import { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import SettingsPanel from './components/SettingsPanel';
import { Settings, GameState } from './types';
import { Trophy, Settings as SettingsIcon, Play, Pause, Activity } from 'lucide-react';

export default function App() {
  const [settings, setSettings] = useState<Settings>({
    snakeSpeed: 80,
    theme: 'blue',
  });
  
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    highScore: parseInt(localStorage.getItem('highScore') || '0'),
    isGameOver: false,
    isPaused: false,
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleScoreChange = (score: number) => {
    setGameState(prev => {
      const newHighScore = Math.max(prev.highScore, score);
      if (newHighScore > prev.highScore) {
        localStorage.setItem('highScore', newHighScore.toString());
      }
      return { ...prev, score, highScore: newHighScore };
    });
  };

  return (
    <div className="min-h-screen relative flex flex-col p-4 lg:p-8 overflow-hidden bg-dark scanlines selection:bg-magenta selection:text-white pb-20">
      
      {/* Glitch Decorative Header */}
      <div className="absolute top-0 left-0 w-full h-8 bg-magenta flex items-center px-4 overflow-hidden -skew-x-12 transform origin-left -translate-y-2 z-0">
         <div className="animate-pulse whitespace-nowrap text-white font-mono text-xs opacity-50 space-x-4">
           <span>SYS_ERR_0091</span>
           <span>INIT_SEQUENCE</span>
           <span>OVERRIDE_ENABLED</span>
           <span>SYS_ERR_0091</span>
           <span>INIT_SEQUENCE</span>
         </div>
      </div>

      <main className="relative z-10 w-full max-w-6xl mx-auto flex flex-col gap-8 lg:gap-12 pt-8">
        
        {/* Header - Brutalist */}
        <header className="w-full flex flex-col md:flex-row items-start md:items-end justify-between border-b-4 border-cyan pb-4">
          <div className="flex flex-col">
            <h1 
              data-text="NEON_PULSE"
              className="text-5xl lg:text-7xl font-glitch uppercase tracking-tighter text-white glitch-text screen-tear"
            >
              NEON_PULSE
            </h1>
            <div className="flex items-center gap-2 mt-2 bg-yellow text-dark px-2 py-1 w-fit border-2 border-dark">
              <Activity size={14} className="animate-pulse" />
              <span className="text-xs font-mono uppercase tracking-[0.2em] font-bold">Status: Online</span>
            </div>
          </div>

          <div className="flex items-stretch gap-4 mt-6 md:mt-0">
            <div className="flex hard-panel text-white">
              <div className="flex flex-col justify-center px-4 py-2 border-r-2 border-cyan bg-dark w-24">
                <span className="text-[10px] uppercase font-bold text-magenta">HI_SCORE</span>
                <span className="text-xl font-mono flex items-center gap-2">
                  {gameState.highScore.toString().padStart(4, '0')}
                </span>
              </div>
              <div className="flex flex-col justify-center px-4 py-2 bg-dark w-24">
                <span className="text-[10px] uppercase font-bold text-magenta">SCORE</span>
                <span className="text-xl font-mono text-cyan">
                  {gameState.score.toString().padStart(4, '0')}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsSettingsOpen(true)}
              className="w-14 hard-button flex items-center justify-center p-0"
              title="Settings"
            >
              <SettingsIcon size={24} />
            </button>
          </div>
        </header>

        {/* Center Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
          
          {/* Game Section */}
          <section className="lg:col-span-8 flex flex-col gap-6">
            <div className="hard-panel p-2 bg-dark relative">
              {/* Decorative nodes */}
              <div className="absolute top-0; left-0 w-3 h-3 bg-cyan -translate-x-1.5 -translate-y-1.5"></div>
              <div className="absolute top-0 right-0 w-3 h-3 bg-cyan translate-x-1.5 -translate-y-1.5"></div>
              <div className="absolute bottom-0 left-0 w-3 h-3 bg-cyan -translate-x-1.5 translate-y-1.5"></div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-cyan translate-x-1.5 translate-y-1.5"></div>
              
              <SnakeGame 
                settings={settings} 
                onScoreChange={handleScoreChange}
                isPaused={gameState.isPaused}
              />
            </div>
            
            <div className="flex flex-wrap items-center justify-between gap-4 hard-panel-magenta p-2">
              <div className="flex items-center gap-4 px-4 py-2 bg-magenta text-white">
                <span className="font-bold uppercase tracking-widest text-sm">Controls</span>
                <kbd className="font-mono bg-dark px-2 text-cyan font-bold">↑ ↓ ← →</kbd>
              </div>
              
              <button 
                onClick={() => setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }))}
                className="hard-button px-6 py-2 flex items-center gap-2"
              >
                {gameState.isPaused ? (
                  <><Play size={16} fill="currentColor" /><span className="font-bold">RESUME</span></>
                ) : (
                  <><Pause size={16} fill="currentColor" /><span className="font-bold">PAUSE</span></>
                )}
              </button>
            </div>
          </section>

          {/* Sidebar */}
          <aside className="lg:col-span-4 flex flex-col gap-8 w-full">
            <div className="hard-panel">
               <div className="bg-cyan text-dark px-4 py-1 font-bold uppercase text-sm border-b-2 border-cyan flex justify-between items-center">
                 <span>Audio_Terminal</span>
                 <span className="animate-pulse">_</span>
               </div>
               <MusicPlayer />
            </div>
            
            <div className="hard-panel-magenta p-4 flex flex-col gap-2 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-16 h-16 bg-magenta opacity-20 group-hover:scale-150 transition-transform blur-xl"></div>
              <h3 className="text-magenta font-bold uppercase text-lg border-b-2 border-magenta border-dotted pb-2 mb-2">
                System_Log //
              </h3>
              <div className="font-mono text-sm text-cyan flex justify-between">
                <span>V_SYNC:</span>
                <span>{settings.snakeSpeed}Hz</span>
              </div>
              <div className="font-mono text-sm text-cyan flex justify-between">
                <span>MEM_ADDR:</span>
                <span>0x0F9A</span>
              </div>
              <p className="font-mono text-xs text-white/70 mt-4 leading-tight border-l-2 border-yellow pl-2">
                WARNING: High-speed traversal may result in temporal displacement. Eat bits to expand memory allocation.
              </p>
            </div>
          </aside>
        </div>
      </main>

      <SettingsPanel 
        settings={settings} 
        onSettingsChange={setSettings} 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}
