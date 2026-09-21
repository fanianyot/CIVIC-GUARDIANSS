import React, { useState, useEffect, useMemo } from 'react';
import { ClassroomRoom, MultiRoomGroup } from '../types/game';
import { multiplayerClient } from '../utils/multiplayerClient';
import { soundManager } from '../utils/audio';
import { 
  Trophy, 
  Crown, 
  Star, 
  Sparkles, 
  Maximize2, 
  Minimize2, 
  X, 
  Volume2, 
  VolumeX, 
  Zap, 
  Users2,
  Gamepad2,
  Radio,
  Flame
} from 'lucide-react';

interface ClassroomScreenModeProps {
  roomCode: string;
  onClose: () => void;
}

export const ClassroomScreenMode: React.FC<ClassroomScreenModeProps> = ({
  roomCode,
  onClose,
}) => {
  const [room, setRoom] = useState<ClassroomRoom | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isSoundMuted, setIsSoundMuted] = useState<boolean>(false);
  const [celebrationPulse, setCelebrationPulse] = useState<boolean>(false);

  useEffect(() => {
    // Initial fetch
    multiplayerClient.fetchRoomState(roomCode).then((r) => {
      if (r) setRoom(r);
    });

    // Real-time listener
    const unsub = multiplayerClient.onRoomUpdate((updatedRoom) => {
      setRoom(updatedRoom);
      // Trigger subtle celebration pulse on score changes
      setCelebrationPulse(true);
      setTimeout(() => setCelebrationPulse(false), 800);
    });

    // Periodic check
    const timer = setInterval(() => {
      multiplayerClient.fetchRoomState(roomCode);
    }, 3000);

    return () => {
      unsub();
      clearInterval(timer);
    };
  }, [roomCode]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const groupsList: MultiRoomGroup[] = useMemo(() => {
    if (!room) return [];
    return Object.values(room.groups).sort((a, b) => {
      if (b.stars !== a.stars) return b.stars - a.stars;
      return b.score - a.score;
    });
  }, [room]);

  const rank1 = groupsList[0];
  const rank2 = groupsList[1];
  const rank3 = groupsList[2];
  const others = groupsList.slice(3);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col overflow-hidden select-none">
      {/* Dynamic Background Atmosphere */}
      <div className="absolute inset-0 bg-radial from-indigo-950/40 via-slate-950 to-slate-950 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Banner for Classroom Projector */}
      <header className="relative z-10 px-6 py-4 bg-slate-900/80 border-b border-indigo-500/30 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 p-0.5 shadow-lg shadow-amber-500/20 flex items-center justify-center text-slate-950">
            <Trophy className="w-7 h-7 fill-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 text-xs font-black uppercase tracking-wider">
                <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                LIVE SCREEN PROYEKTOR
              </span>
              <span className="text-xs text-slate-400">
                Civic Guardians: Defend the Community
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              PAPAN SKOR KELAS REAL-TIME
              <span className="text-indigo-400">({room?.title || roomCode})</span>
            </h1>
          </div>
        </div>

        {/* Room Code Badge & Screen Controls */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-slate-800/90 border border-indigo-500/40 shadow text-center">
            <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-widest">
              KODE RUANGAN
            </span>
            <span className="text-xl font-black text-amber-400 tracking-wider">
              {roomCode}
            </span>
          </div>

          <button
            onClick={() => setIsSoundMuted(!isSoundMuted)}
            className="w-11 h-11 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition"
            title="Suara"
          >
            {isSoundMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5 text-emerald-400" />}
          </button>

          <button
            onClick={toggleFullscreen}
            className="w-11 h-11 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center transition shadow-lg"
            title="Layar Penuh"
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>

          <button
            onClick={onClose}
            className="w-11 h-11 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition"
            title="Keluar Tampilan Proyektor"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content: Podium & Live Standings */}
      <main className="relative z-10 flex-1 p-6 sm:p-8 flex flex-col justify-between overflow-hidden">
        {groupsList.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <Users2 className="w-16 h-16 text-indigo-400 mb-4 animate-bounce" />
            <h2 className="text-2xl font-black text-white">Menunggu Kelompok Bergabung...</h2>
            <p className="text-slate-400 mt-2 max-w-md text-sm">
              Siswa dapat memasukkan Kode Ruangan <strong className="text-amber-400 font-black">{roomCode}</strong> pada perangkat masing-masing untuk tampil di layar proyektor ini!
            </p>
          </div>
        ) : (
          <>
            {/* Top 3 Podium Presentation */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 items-end max-w-4xl mx-auto w-full pt-4 pb-2">
              {/* Rank 2 (Silver) */}
              <div className="flex flex-col items-center">
                {rank2 ? (
                  <div className="w-full flex flex-col items-center animate-slideUp">
                    <div className="relative mb-2">
                      <div 
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl border-2 border-slate-300 flex items-center justify-center text-2xl sm:text-3xl shadow-lg"
                        style={{ backgroundColor: `${rank2.color}35`, borderColor: rank2.color }}
                      >
                        🥈
                      </div>
                      <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-slate-300 text-slate-900 font-black text-[11px] shadow">
                        #2
                      </span>
                    </div>

                    <h3 className="font-black text-white text-sm sm:text-base text-center truncate max-w-[200px]">
                      {rank2.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-amber-300 font-black text-sm flex items-center gap-1">
                        <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
                        {rank2.stars}
                      </span>
                      <span className="text-indigo-300 font-bold text-xs">
                        💎 {rank2.harmony}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 mt-0.5">
                      🎮 {rank2.currentLevelTitle || `Level ${rank2.currentLevelId || 1}`}
                    </span>

                    {/* Podium Stand */}
                    <div className="w-full h-28 sm:h-36 bg-gradient-to-t from-slate-800 to-slate-700/80 border-t-4 border-slate-300 rounded-t-2xl mt-4 flex flex-col items-center justify-center shadow-lg">
                      <span className="text-2xl sm:text-3xl font-black text-slate-300">2</span>
                      <span className="text-xs font-bold text-slate-400">
                        {rank2.score.toLocaleString()} Pts
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-28 bg-slate-900/50 rounded-t-2xl border-t-2 border-slate-800 flex items-center justify-center text-xs text-slate-600">
                    Posisi 2
                  </div>
                )}
              </div>

              {/* Rank 1 (Gold - Center) */}
              <div className="flex flex-col items-center">
                {rank1 ? (
                  <div className={`w-full flex flex-col items-center transition-transform ${celebrationPulse ? 'scale-105' : 'scale-100'}`}>
                    <div className="relative mb-2">
                      <Crown className="w-8 h-8 text-amber-400 mb-1 animate-bounce" />
                      <div 
                        className="w-20 h-20 sm:w-28 sm:h-28 rounded-3xl border-4 border-amber-400 flex items-center justify-center text-3xl sm:text-4xl shadow-2xl shadow-amber-500/40 animate-pulse"
                        style={{ backgroundColor: `${rank1.color}45`, borderColor: rank1.color }}
                      >
                        🥇
                      </div>
                      <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 font-black text-xs shadow-lg">
                        JUARA 1
                      </span>
                    </div>

                    <h3 className="font-black text-amber-300 text-base sm:text-xl text-center truncate max-w-[240px]">
                      {rank1.name}
                    </h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-amber-300 font-black text-base flex items-center gap-1 bg-amber-500/20 px-2.5 py-0.5 rounded-xl border border-amber-400/40">
                        <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
                        {rank1.stars} Bintang
                      </span>
                      <span className="text-indigo-300 font-bold text-sm bg-indigo-500/20 px-2 py-0.5 rounded-xl">
                        💎 {rank1.harmony}
                      </span>
                    </div>
                    <span className="text-xs text-emerald-400 font-bold mt-1">
                      🎮 {rank1.currentLevelTitle || `Level ${rank1.currentLevelId || 1}`}
                    </span>

                    {/* Podium Stand */}
                    <div className="w-full h-36 sm:h-48 bg-gradient-to-t from-amber-950/90 via-amber-900/60 to-amber-700/80 border-t-4 border-amber-400 rounded-t-2xl mt-4 flex flex-col items-center justify-center shadow-2xl shadow-amber-500/30">
                      <span className="text-4xl sm:text-5xl font-black text-amber-300 drop-shadow">1</span>
                      <span className="text-sm font-black text-amber-200 mt-1">
                        {rank1.score.toLocaleString()} POIN
                      </span>
                      <span className="text-[11px] text-amber-300/80 font-semibold">
                        Akurasi {rank1.hotsAttempted > 0 ? Math.round((rank1.hotsCorrect / rank1.hotsAttempted) * 100) : 100}%
                      </span>
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Rank 3 (Bronze) */}
              <div className="flex flex-col items-center">
                {rank3 ? (
                  <div className="w-full flex flex-col items-center animate-slideUp">
                    <div className="relative mb-2">
                      <div 
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl border-2 border-amber-700 flex items-center justify-center text-2xl sm:text-3xl shadow-lg"
                        style={{ backgroundColor: `${rank3.color}35`, borderColor: rank3.color }}
                      >
                        🥉
                      </div>
                      <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-amber-700 text-white font-black text-[11px] shadow">
                        #3
                      </span>
                    </div>

                    <h3 className="font-black text-white text-sm sm:text-base text-center truncate max-w-[200px]">
                      {rank3.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-amber-300 font-black text-sm flex items-center gap-1">
                        <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
                        {rank3.stars}
                      </span>
                      <span className="text-indigo-300 font-bold text-xs">
                        💎 {rank3.harmony}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 mt-0.5">
                      🎮 {rank3.currentLevelTitle || `Level ${rank3.currentLevelId || 1}`}
                    </span>

                    {/* Podium Stand */}
                    <div className="w-full h-24 sm:h-32 bg-gradient-to-t from-slate-900 to-amber-950/70 border-t-4 border-amber-700 rounded-t-2xl mt-4 flex flex-col items-center justify-center shadow-lg">
                      <span className="text-2xl sm:text-3xl font-black text-amber-600">3</span>
                      <span className="text-xs font-bold text-slate-400">
                        {rank3.score.toLocaleString()} Pts
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-24 bg-slate-900/50 rounded-t-2xl border-t-2 border-slate-800 flex items-center justify-center text-xs text-slate-600">
                    Posisi 3
                  </div>
                )}
              </div>
            </div>

            {/* Ranks 4 to 10 Live Ticker Grid */}
            {others.length > 0 && (
              <div className="mt-4 pt-3 border-t border-slate-800">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
                  {others.map((g, idx) => (
                    <div
                      key={g.id}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/70 border border-slate-800 shadow"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <span className="text-xs font-black text-slate-400 w-5">
                          #{idx + 4}
                        </span>
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: g.color }}
                        />
                        <div className="truncate">
                          <span className="font-bold text-white text-xs block truncate">
                            {g.name}
                          </span>
                          <span className="text-[10px] text-slate-400 block truncate">
                            🎮 {g.currentLevelTitle || `Level ${g.currentLevelId || 1}`}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-bold text-amber-300 block">
                          ⭐ {g.stars}
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          {g.score} Pts
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Bottom Live Activity Feed */}
      <footer className="relative z-10 px-6 py-2.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
          <span className="font-semibold text-slate-300">Aktivitas Terkini:</span>
          <span className="text-slate-400 truncate max-w-xl">
            {room?.activityLog[0]?.text || 'Menunggu aksi gotong royong kelas...'}
          </span>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <span>Pembaruan Otomatis Real-Time (3s) ⚡</span>
          <span>Kelas 4 Pendidikan Pancasila</span>
        </div>
      </footer>
    </div>
  );
};
