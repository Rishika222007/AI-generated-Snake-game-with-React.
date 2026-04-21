import { Settings, Theme } from '../types';
import { X, Cpu, Palette } from 'lucide-react';

interface SettingsPanelProps {
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsPanel({ settings, onSettingsChange, isOpen, onClose }: SettingsPanelProps) {
  if (!isOpen) return null;

  const themes: { id: Theme; color: string; hover: string; label: string }[] = [
    { id: 'blue', color: 'bg-cyan', hover: 'hover:bg-cyan', label: 'CYAN_PROTOCOL' },
    { id: 'pink', color: 'bg-magenta', hover: 'hover:bg-magenta', label: 'MAGENTA_PRIME' },
    { id: 'purple', color: 'bg-magenta', hover: 'hover:bg-magenta', label: 'PURPLE_VOID' },
    { id: 'green', color: 'bg-[#FFFF00]', hover: 'hover:bg-[#FFFF00]', label: 'YELLOW_NODE' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-dark/80 backdrop-blur-sm cursor-pointer"
        onClick={onClose}
      />
      
      {/* Brutalist Panel */}
      <div className="relative w-full max-w-md bg-dark border-4 border-magenta shadow-[8px_8px_0px_0px_rgba(0,255,255,1)] flex flex-col z-10 scanlines">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b-4 border-magenta bg-magenta p-4 text-dark">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-glitch uppercase tracking-widest mt-1">SYS_CONFIG</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 border-2 border-dark hover:bg-dark hover:text-magenta transition-none"
          >
            <X size={20} strokeWidth={3} />
          </button>
        </div>

        <div className="p-6 space-y-8">
          
          {/* Speed settings */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b-2 border-cyan border-dashed pb-2">
              <Cpu size={20} className="text-cyan animate-pulse" />
              <span className="text-lg font-bold uppercase tracking-widest text-cyan">Core_Velocity</span>
            </div>
            <div className="p-4 border-2 border-dark bg-dark/50 relative">
              <input
                type="range"
                min="50"
                max="120"
                value={settings.snakeSpeed}
                onChange={(e) => onSettingsChange({ ...settings, snakeSpeed: parseInt(e.target.value) })}
                className="w-full h-2 bg-dark border border-cyan accent-magenta appearance-none cursor-pointer relative z-10"
              />
              <div className="flex justify-between text-xs font-mono text-cyan/50 mt-4 uppercase font-bold">
                <span>[Underclock]</span>
                <span className="text-magenta">{settings.snakeSpeed} Hz</span>
                <span>[Overclock]</span>
              </div>
            </div>
          </div>

          {/* Theme settings */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b-2 border-cyan border-dashed pb-2">
              <Palette size={20} className="text-cyan animate-pulse" />
              <span className="text-lg font-bold uppercase tracking-widest text-cyan">Display_Matrix</span>
            </div>
            
            <div className="grid grid-cols-1 gap-3 shrink-0">
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => onSettingsChange({ ...settings, theme: t.id })}
                  className={`flex items-center justify-between p-3 border-2 transition-none uppercase font-mono font-bold ${
                    settings.theme === t.id 
                      ? 'border-magenta bg-dark text-magenta relative before:content-[">"] before:mr-2 before:animate-pulse' 
                      : 'border-cyan bg-dark text-cyan hover:bg-cyan hover:text-dark'
                  }`}
                >
                  <span className="text-sm">{t.label}</span>
                  <div className={`w-4 h-4 border-2 border-dark ${t.color}`} />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-auto p-4 border-t-2 border-cyan bg-cyan text-dark font-mono text-xs uppercase flex justify-between font-bold">
           <span>BUILD: INIT.002</span>
           <span>AUTHORIZED_ONLY</span>
        </div>
      </div>
    </div>
  );
}
