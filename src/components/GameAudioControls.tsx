import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Music, Sliders, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface GameAudioControlsProps {
  currentThemeLabel?: string;
  className?: string;
}

export const GameAudioControls: React.FC<GameAudioControlsProps> = ({
  currentThemeLabel = 'Musik Aktif',
  className = '',
}) => {
  const [isMuted, setIsMuted] = useState(soundManager.isMutedState());
  const [musicVol, setMusicVol] = useState(Math.round(soundManager.getMusicVolume() * 100));
  const [sfxVol, setSfxVol] = useState(Math.round(soundManager.getSfxVolume() * 100));
  const [isExpanded, setIsExpanded] = useState(false);
  const [needsUnlock, setNeedsUnlock] = useState(false);

  useEffect(() => {
    // Check if audio context is suspended by browser autoplay policy
    const checkAudio = () => {
      setNeedsUnlock(!soundManager.isAudioUnlocked());
    };
    checkAudio();

    const handleFirstInteraction = () => {
      soundManager.unlockAudio();
      setNeedsUnlock(false);
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction, { once: true });
    window.addEventListener('keydown', handleFirstInteraction, { once: true });

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
  }, []);

  const handleToggleMute = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
    soundManager.playButton();
  };

  const handleMusicChange = (val: number) => {
    setMusicVol(val);
    soundManager.setMusicVolume(val / 100);
  };

  const handleSfxChange = (val: number) => {
    setSfxVol(val);
    soundManager.setSfxVolume(val / 100);
    soundManager.playButton();
  };

  return (
    <div className={`fixed bottom-4 right-4 z-50 select-none ${className}`}>
      {/* Unblock Banner if suspended */}
      {needsUnlock && (
        <button
          onClick={() => {
            soundManager.unlockAudio();
            setNeedsUnlock(false);
            soundManager.playButton();
          }}
          className="mb-2 px-4 py-2 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-xl border-2 border-amber-300 flex items-center gap-2 animate-bounce cursor-pointer"
        >
          <Sparkles className="w-4 h-4 fill-slate-950" />
          <span>Klik untuk Nyalakan Musik Game! 🎵</span>
        </button>
      )}

      {/* Main Pill Bar */}
      <div className="bg-white/95 backdrop-blur-md border-3 border-emerald-400 rounded-3xl shadow-2xl p-1.5 flex items-center gap-2 text-slate-800">
        {/* Quick Mute Toggle Button */}
        <button
          onClick={handleToggleMute}
          className={`p-2 rounded-2xl font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
            isMuted
              ? 'bg-rose-100 text-rose-600 border border-rose-300'
              : 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-sm'
          }`}
          title={isMuted ? 'Nyalakan Suara' : 'Matikan Suara (Mute)'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          <span className="hidden sm:inline font-bold">{isMuted ? 'Mute' : 'Audio On'}</span>
        </button>

        {/* Current Playing World Music Badge */}
        <div className="px-2.5 py-1 rounded-xl bg-slate-100 border border-slate-200 hidden sm:flex items-center gap-1.5 text-xs font-bold text-slate-700">
          <Music className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
          <span className="truncate max-w-[130px]">{currentThemeLabel}</span>
        </div>

        {/* Volume Settings Drawer Toggle */}
        <button
          onClick={() => {
            soundManager.playButton();
            setIsExpanded(!isExpanded);
          }}
          className="p-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
          title="Pengaturan Volume"
        >
          <Sliders className="w-4 h-4" />
        </button>
      </div>

      {/* Expanded Volume Sliders Popover */}
      {isExpanded && (
        <div className="absolute bottom-16 right-0 w-64 bg-white border-3 border-emerald-400 rounded-3xl shadow-2xl p-4 text-slate-800 animate-pop-in space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-xs font-black uppercase text-emerald-700 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-emerald-600" />
              Kontrol Audio Game
            </span>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-slate-400 hover:text-slate-600 text-xs font-bold"
            >
              Tutup
            </button>
          </div>

          {/* Music Volume Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1">
                <Music className="w-3.5 h-3.5 text-indigo-600" />
                Musik Latar (BGM)
              </span>
              <span>{musicVol}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={musicVol}
              onChange={(e) => handleMusicChange(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
            />
          </div>

          {/* SFX Volume Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1">
                <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                Efek Suara (SFX)
              </span>
              <span>{sfxVol}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={sfxVol}
              onChange={(e) => handleSfxChange(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
            />
          </div>

          {/* Theme Info */}
          <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 font-medium">
            Tema BGM berganti otomatis sesuai dunia: Rumah, Sekolah, Taman, & Bos Tempur!
          </div>
        </div>
      )}
    </div>
  );
};
