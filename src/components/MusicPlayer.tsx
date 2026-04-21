import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Disc3 } from 'lucide-react';
import { Track } from '../types';

const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'SYS_OVERLOAD',
    artist: 'KERNEL_PANIC',
    coverUrl: 'https://picsum.photos/seed/glitch1/200/200',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    id: '2',
    title: 'MEM_LEAK',
    artist: 'NULL_PTR',
    coverUrl: 'https://picsum.photos/seed/retro2/200/200',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  {
    id: '3',
    title: 'BUFFER_UNDERRUN',
    artist: 'STACK_TRACE',
    coverUrl: 'https://picsum.photos/seed/cyber3/200/200',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);

  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex, volume]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(isNaN(p) ? 0 : p);
    }
  };

  const handleSkip = (direction: 'next' | 'prev') => {
    if (direction === 'next') {
      setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    } else {
      setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    }
    setIsPlaying(true);
  };

  return (
    <div className="p-4 w-full flex flex-col gap-4 relative overflow-hidden bg-dark">
      <audio
        ref={audioRef}
        src={currentTrack.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => handleSkip('next')}
      />

      <div className="flex gap-4 items-center z-10">
        <div className="relative border-2 border-magenta p-1 w-20 h-20 shrink-0">
          <img
            src={currentTrack.coverUrl}
            alt={currentTrack.title}
            className={`w-full h-full object-cover filter contrast-150 saturate-200 ${isPlaying ? 'animate-pulse' : 'grayscale'}`}
            referrerPolicy="no-referrer"
          />
          {isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-cyan mix-blend-overlay">
              <Disc3 className="text-white animate-spin" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <h3 className="text-xl font-bold truncate text-magenta uppercase font-sans tracking-tight leading-none mb-1">{currentTrack.title}</h3>
          <p className="text-cyan text-sm truncate uppercase tracking-widest font-mono">[{currentTrack.artist}]</p>
        </div>
      </div>

      <div className="space-y-4 z-10 border-t-2 border-cyan border-dashed pt-4">
        {/* Progress Bar */}
        <div className="w-full bg-dark border-2 border-cyan h-4 relative">
          <div
            className="h-full bg-magenta transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
          {/* Glitch lines on progress bar */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxwYXRoIGQ9Ik0wLDBIMlY0SDBaIiBmaWxsPSJyZ2JhKDAsMCwwLDAuNSkiLz48L3N2Zz4=')] opacity-50 mix-blend-overlay pointer-events-none" />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSkip('prev')}
              className="p-2 border-2 border-cyan bg-dark text-cyan hover:bg-cyan hover:text-dark transition-none"
            >
              <SkipBack size={16} />
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 border-2 border-magenta bg-dark text-magenta hover:bg-magenta hover:text-dark transition-none"
            >
              {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
            </button>
            <button
              onClick={() => handleSkip('next')}
              className="p-2 border-2 border-cyan bg-dark text-cyan hover:bg-cyan hover:text-dark transition-none"
            >
              <SkipForward size={16} />
            </button>
          </div>

          <div className="flex items-center gap-2 group p-1 border-2 border-dark hover:border-cyan">
            <Volume2 size={16} className="text-cyan" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-16 h-2 accent-magenta bg-dark border border-cyan appearance-none cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
