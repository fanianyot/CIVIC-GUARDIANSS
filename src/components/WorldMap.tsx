import React, { useState, useEffect } from 'react';
import { LevelConfig, WorldId } from '../types/game';
import { LEVELS_CONFIG, WORLDS_CONFIG } from '../data/levels';
import { CaptainCivic } from './CaptainCivic';
import { EnemySprite } from './GameSprites';
import { soundManager } from '../utils/audio';
import { 
  Home, 
  GraduationCap, 
  Trees, 
  Building2, 
  Lock, 
  Star, 
  Play, 
  Skull, 
  CheckCircle2, 
  Sparkles,
  Users2,
  X,
  Award,
  BookOpen,
  ArrowRight
} from 'lucide-react';

interface WorldMapProps {
  unlockedLevel: number;
  levelStars: Record<number, number>;
  onSelectLevel: (level: LevelConfig) => void;
  onOpenAcademy: () => void;
  onOpenAchievements: () => void;
  onOpenMultiplayer: () => void;
  onOpenMultiDeviceMabar?: () => void;
  onOpenTeacherGuide: () => void;
}

export const WorldMap: React.FC<WorldMapProps> = ({
  unlockedLevel,
  levelStars,
  onSelectLevel,
  onOpenAcademy,
  onOpenAchievements,
  onOpenMultiplayer,
  onOpenMultiDeviceMabar,
  onOpenTeacherGuide,
}) => {
  const getInitialWorld = (): WorldId => {
    if (unlockedLevel <= 5) return 'world1';
    if (unlockedLevel <= 11) return 'world2';
    if (unlockedLevel <= 17) return 'world3';
    return 'world4';
  };

  const [activeWorldId, setActiveWorldId] = useState<WorldId>(getInitialWorld());
  const [briefingLevel, setBriefingLevel] = useState<LevelConfig | null>(null);

  const activeWorld = WORLDS_CONFIG[activeWorldId];
  const worldLevels = LEVELS_CONFIG.filter((l) => l.worldId === activeWorldId);
  const totalStars = Object.values(levelStars).reduce((acc, curr) => acc + curr, 0);

  // Play appropriate background music on world change
  useEffect(() => {
    soundManager.startWorldBgm(activeWorldId, false);
  }, [activeWorldId]);

  const getWorldVisual = (id: WorldId) => {
    switch (id) {
      case 'world1':
        return {
          icon: <Home className="w-5 h-5" />,
          title: 'Dunia Rumah & Keluarga',
          tag: '🏠 Sektor Rumah',
          themeColor: 'from-amber-400 via-orange-400 to-amber-500',
          bgStyle: 'bg-gradient-to-b from-sky-300 via-amber-100 to-emerald-200',
          roadColor: '#f59e0b',
          borderColor: 'border-amber-400',
          desc: 'Suasana keluarga hangat dan ceria. Jaga ketertiban kamar, rapikan mainan, dan patuhi jam belajar.',
          scenery: '🏡 🌳 🌻 🐶 🧺 🏠',
        };
      case 'world2':
        return {
          icon: <GraduationCap className="w-5 h-5" />,
          title: 'Dunia Sekolah Ceria',
          tag: '🏫 Sektor Sekolah',
          themeColor: 'from-sky-400 via-blue-500 to-indigo-500',
          bgStyle: 'bg-gradient-to-b from-sky-400 via-blue-100 to-emerald-200',
          roadColor: '#3b82f6',
          borderColor: 'border-blue-400',
          desc: 'Gedung sekolah megah dan bersih. Ikuti upacara bendera, perhatikan guru, dan rukun bermain.',
          scenery: '🏫 🎒 📚 ⚽ 🔔 🌳',
        };
      case 'world3':
        return {
          icon: <Trees className="w-5 h-5" />,
          title: 'Taman & Lingkungan Warga',
          tag: '🌳 Sektor Warga',
          themeColor: 'from-emerald-400 via-green-500 to-teal-500',
          bgStyle: 'bg-gradient-to-b from-sky-300 via-emerald-100 to-green-300',
          roadColor: '#10b981',
          borderColor: 'border-emerald-400',
          desc: 'Taman hijau asri dan fasilitas umum. Buang sampah pada tempatnya dan gotong royong bersama tetangga.',
          scenery: '🌳 🌷 ⛲ 🚲 🐦 🌲',
        };
      case 'world4':
      default:
        return {
          icon: <Building2 className="w-5 h-5" />,
          title: 'Ruang Publik & Jalan Raya',
          tag: '🛣 Sektor Publik',
          themeColor: 'from-slate-700 via-indigo-600 to-purple-600',
          bgStyle: 'bg-gradient-to-b from-sky-400 via-slate-200 to-indigo-100',
          roadColor: '#475569',
          borderColor: 'border-indigo-400',
          desc: 'Jalan raya tertib, zebra cross aman, dan trotoar nyaman. Disiplin lalu lintas demi keselamatan semua.',
          scenery: '🚸 🚦 🏙 🚌 🚶‍♂️ 🛣',
        };
    }
  };

  const currentVisual = getWorldVisual(activeWorldId);

  // Winding coordinates for 6 level nodes along the campaign road (percentage x, y)
  const nodePositions = [
    { x: 14, y: 72 },
    { x: 28, y: 44 },
    { x: 44, y: 68 },
    { x: 60, y: 38 },
    { x: 74, y: 62 },
    { x: 88, y: 32 }, // Boss node
  ];

  const handleOpenLevelBriefing = (lvl: LevelConfig) => {
    soundManager.playButton();
    setBriefingLevel(lvl);
  };

  const handleStartMission = (lvl: LevelConfig) => {
    soundManager.playWaveStart();
    onSelectLevel(lvl);
  };

  return (
    <div className={`min-h-screen ${currentVisual.bgStyle} text-slate-900 flex flex-col relative overflow-x-hidden select-none`}>
      {/* Animated Floating Cartoon Clouds */}
      <div className="absolute top-6 left-0 right-0 pointer-events-none overflow-hidden h-40 z-0">
        <div className="absolute top-2 w-32 h-14 bg-white/80 rounded-full blur-xs cloud-slow flex items-center justify-center">
          <div className="w-16 h-16 bg-white/80 rounded-full -top-4 -left-2 absolute" />
          <div className="w-12 h-12 bg-white/80 rounded-full -top-3 -right-2 absolute" />
        </div>
        <div className="absolute top-12 w-40 h-16 bg-white/70 rounded-full blur-xs cloud-fast flex items-center justify-center">
          <div className="w-20 h-20 bg-white/70 rounded-full -top-5 -left-3 absolute" />
          <div className="w-14 h-14 bg-white/70 rounded-full -top-4 -right-3 absolute" />
        </div>
      </div>

      {/* Top Playful Cartoon Header */}
      <header className="px-4 sm:px-6 py-3 bg-white/90 border-b-3 border-amber-300 backdrop-blur-md sticky top-0 z-30 flex flex-wrap items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center font-black text-white text-2xl shadow-lg border-2 border-white animate-bounce">
            🛡️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-xl font-black text-slate-900 leading-tight">
                Civic Guardians: Defend the Community
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 border border-emerald-300 text-[10px] font-black text-emerald-800 hidden sm:inline">
                Kelas 4 SD
              </span>
            </div>
            <p className="text-xs text-slate-600 font-bold">
              Pendidikan Pancasila: Aku Anak yang Disiplin di Rumah, Sekolah, dan Lingkungan
            </p>
          </div>
        </div>

        {/* Action Buttons Hub */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Civic Stars Counter Pill */}
          <button
            onClick={() => {
              soundManager.playButton();
              onOpenAcademy();
            }}
            className="px-3.5 py-1.5 rounded-2xl bg-amber-400 hover:bg-amber-300 border-2 border-amber-500 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-sm transition-transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Star className="w-4 h-4 fill-amber-950 text-amber-950" />
            <span>{totalStars} Bintang Sipil</span>
          </button>

          {/* Guardian Academy button */}
          <button
            onClick={() => {
              soundManager.playButton();
              onOpenAcademy();
            }}
            className="px-3 py-1.5 rounded-2xl bg-indigo-500 hover:bg-indigo-400 border-2 border-indigo-600 text-white font-black text-xs transition-transform hover:scale-105 active:scale-95 cursor-pointer shadow-sm"
          >
            🛡️ Akademi Penjaga
          </button>

          {/* Achievements button */}
          <button
            onClick={() => {
              soundManager.playButton();
              onOpenAchievements();
            }}
            className="px-3 py-1.5 rounded-2xl bg-white hover:bg-slate-100 border-2 border-slate-300 text-slate-800 font-black text-xs transition-transform hover:scale-105 active:scale-95 cursor-pointer shadow-sm"
          >
            🏆 Pencapaian
          </button>

          {/* Multi-Device Mabar (5-10 Kelompok) */}
          <button
            onClick={() => {
              soundManager.playButton();
              if (onOpenMultiDeviceMabar) onOpenMultiDeviceMabar();
            }}
            className="px-3.5 py-1.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-black text-xs flex items-center gap-1.5 shadow-md border-2 border-emerald-600 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Users2 className="w-3.5 h-3.5" />
            <span>Mabar (5–10 Kelompok)</span>
            <span className="w-2 h-2 rounded-full bg-yellow-300 animate-ping" />
          </button>

          {/* Classroom Group Role button */}
          <button
            onClick={() => {
              soundManager.playButton();
              onOpenMultiplayer();
            }}
            className="px-3 py-1.5 rounded-2xl bg-purple-500 hover:bg-purple-400 border-2 border-purple-600 text-white font-black text-xs flex items-center gap-1 transition-transform hover:scale-105 active:scale-95 cursor-pointer shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Peran Kelompok
          </button>

          {/* Teacher Guide */}
          <button
            onClick={() => {
              soundManager.playButton();
              onOpenTeacherGuide();
            }}
            className="px-2.5 py-1.5 rounded-2xl bg-amber-100 hover:bg-amber-200 border-2 border-amber-300 text-amber-900 font-black text-xs transition-colors cursor-pointer"
            title="Panduan Guru & RPP Modul Ajar"
          >
            📖 PPG
          </button>
        </div>
      </header>

      {/* World Selection Cartoon Signposts */}
      <div className="max-w-6xl w-full mx-auto px-4 pt-4 z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3">
          {(Object.keys(WORLDS_CONFIG) as WorldId[]).map((wId) => {
            const world = WORLDS_CONFIG[wId];
            const visual = getWorldVisual(wId);
            const isSelected = activeWorldId === wId;
            const isLocked = unlockedLevel < world.levelRange[0];

            return (
              <button
                key={wId}
                onClick={() => {
                  soundManager.playButton();
                  setActiveWorldId(wId);
                }}
                className={`p-3 rounded-2xl border-3 text-left transition-all relative overflow-hidden cursor-pointer shadow-md ${
                  isSelected
                    ? `bg-white ${visual.borderColor} ring-4 ring-amber-300/80 scale-102`
                    : 'bg-white/80 hover:bg-white border-slate-200 hover:scale-100 text-slate-600'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xl">{visual.tag.split(' ')[0]}</span>
                  {isLocked ? (
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-300 text-[10px] font-bold text-slate-500 flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Terkunci
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 border border-emerald-300 text-[10px] font-black text-emerald-800">
                      Buka ⭐
                    </span>
                  )}
                </div>
                <div className="font-black text-sm text-slate-900 truncate">{world.name}</div>
                <div className="text-[11px] font-bold text-slate-600 truncate">{world.theme}</div>
                <div className="text-[10px] font-bold text-amber-700 mt-1">Level {world.levelRange[0]} - {world.levelRange[1]}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Adventure Campaign Stage */}
      <main className="max-w-6xl w-full mx-auto px-4 py-4 sm:py-6 flex-1 flex flex-col z-10">
        {/* World Identity Banner & Captain Civic Guide */}
        <div className="mb-4 bg-white/90 border-3 border-white rounded-3xl p-4 sm:p-5 shadow-xl backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CaptainCivic
              mood="waving"
              size="md"
              showSpeechBubble={false}
              onClick={() => soundManager.playButton()}
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-0.5 rounded-full bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider">
                  Peta Petualangan
                </span>
                <span className="text-xs font-bold text-slate-600">{currentVisual.title}</span>
              </div>
              <h2 className="text-lg sm:text-2xl font-black text-slate-900 mt-0.5">
                {activeWorld.theme}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-xl">
                {activeWorld.description}
              </p>
            </div>
          </div>

          <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-3 text-center shrink-0">
            <div className="text-[11px] font-black text-amber-800 uppercase">Dekorasi Sektor</div>
            <div className="text-lg tracking-widest mt-0.5">{currentVisual.scenery}</div>
          </div>
        </div>

        {/* The Interactive Winding Campaign Map Stage */}
        <div className="relative w-full aspect-[16/9] min-h-[380px] max-h-[560px] bg-gradient-to-b from-emerald-300 via-green-400 to-emerald-500 rounded-3xl border-4 border-white shadow-2xl overflow-hidden flex items-center justify-center p-4">
          {/* Cartoon Grass & Ground Details */}
          <div className="absolute inset-0 pointer-events-none opacity-40">
            {/* Cute flowers and tufts of grass */}
            <div className="absolute top-12 left-10 text-xl">🌼</div>
            <div className="absolute top-24 left-1/3 text-lg">🌱</div>
            <div className="absolute top-8 right-16 text-2xl">🏡</div>
            <div className="absolute bottom-12 left-16 text-xl">🌻</div>
            <div className="absolute bottom-20 right-1/4 text-2xl">🌳</div>
            <div className="absolute bottom-8 right-12 text-xl">🌷</div>
          </div>

          {/* SVG Winding Road Connecting Level Nodes */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <filter id="roadShadow" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#064e3b" floodOpacity="0.4" />
              </filter>
            </defs>
            {/* Winding Dirt/Cobblestone Pathway */}
            <path
              d="M 14,72 Q 20,56 28,44 T 44,68 T 60,38 T 74,62 T 88,32"
              fill="none"
              stroke="#ca8a04"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#roadShadow)"
            />
            <path
              d="M 14,72 Q 20,56 28,44 T 44,68 T 60,38 T 74,62 T 88,32"
              fill="none"
              stroke="#fef08a"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="2 2"
            />
          </svg>

          {/* Interactive Level Nodes Positioned Along Road */}
          {worldLevels.map((lvl, index) => {
            const isUnlocked = lvl.id <= unlockedLevel;
            const isCompleted = (levelStars[lvl.id] || 0) > 0;
            const isNextToPlay = lvl.id === unlockedLevel;
            const stars = levelStars[lvl.id] || 0;
            const isBoss = !!lvl.bossType;
            const pos = nodePositions[index] || { x: 50, y: 50 };

            return (
              <div
                key={lvl.id}
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
              >
                {/* Captain Civic standing beside the active next level! */}
                {isNextToPlay && (
                  <div className="absolute -top-16 -left-12 pointer-events-none z-30 animate-bounce flex flex-col items-center">
                    <span className="px-2.5 py-1 rounded-full bg-rose-500 text-white font-black text-[10px] shadow-lg border-2 border-white whitespace-nowrap">
                      MAIN SEKARANG! ⚔️
                    </span>
                    <CaptainCivic mood="cheering" size="sm" showSpeechBubble={false} />
                  </div>
                )}

                {/* Level Node Button */}
                <button
                  onClick={() => isUnlocked && handleOpenLevelBriefing(lvl)}
                  disabled={!isUnlocked}
                  className={`group relative rounded-3xl transition-transform cursor-pointer select-none flex flex-col items-center justify-center ${
                    isBoss
                      ? 'w-20 h-20 sm:w-24 sm:h-24'
                      : 'w-14 h-14 sm:w-16 sm:h-16'
                  } ${
                    !isUnlocked
                      ? 'bg-slate-300 border-3 border-slate-400 text-slate-500 cursor-not-allowed opacity-75'
                      : isBoss
                      ? 'bg-gradient-to-br from-rose-500 to-red-700 border-4 border-amber-300 text-white shadow-2xl hover:scale-110 active:scale-95 animate-pulse'
                      : isCompleted
                      ? 'bg-gradient-to-br from-emerald-400 to-green-600 border-3 border-white text-white shadow-xl hover:scale-110 active:scale-95'
                      : 'bg-gradient-to-br from-amber-400 to-orange-500 border-3 border-white text-slate-950 shadow-xl hover:scale-110 active:scale-95 ring-4 ring-amber-300/70 animate-bounce'
                  }`}
                  title={lvl.title}
                >
                  {/* Stars Earned perched on top */}
                  {isUnlocked && isCompleted && (
                    <div className="absolute -top-3.5 flex items-center gap-0.5 bg-slate-900/80 px-2 py-0.5 rounded-full border border-amber-400 shadow-md">
                      {Array.from({ length: 3 }).map((_, sIdx) => (
                        <Star
                          key={sIdx}
                          className={`w-3 h-3 ${
                            sIdx < stars ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
                          }`}
                        />
                      ))}
                    </div>
                  )}

                  {/* Icon or Level Number */}
                  {!isUnlocked ? (
                    <Lock className="w-5 h-5 text-slate-600" />
                  ) : isBoss ? (
                    <div className="flex flex-col items-center">
                      <Skull className="w-7 h-7 sm:w-8 sm:h-8 text-yellow-300 drop-shadow-md animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-wider text-yellow-200">
                        BOS {lvl.id}
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <span className="text-base sm:text-lg font-black">{lvl.id}</span>
                      <span className="text-[9px] font-black uppercase opacity-90">Misi</span>
                    </div>
                  )}

                  {/* Level Tooltip label below */}
                  <div className="absolute -bottom-6 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap px-2.5 py-0.5 rounded-full bg-slate-900 text-white text-[10px] font-bold shadow-md pointer-events-none z-30">
                    {lvl.title.split(':')[1]?.trim() || lvl.title}
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </main>

      {/* Interactive Level Briefing Popup Modal */}
      {briefingLevel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-3xl border-4 border-amber-400 shadow-2xl overflow-hidden animate-pop-in">
            {/* Modal Header */}
            <div className="px-5 py-4 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 text-slate-950 flex items-center justify-between border-b-3 border-amber-500">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-2xl bg-white text-xl shadow-sm">
                  {briefingLevel.bossType ? '👑' : '⭐'}
                </span>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-wider text-amber-900">
                    Sektor {briefingLevel.worldId.toUpperCase()} • Misi {briefingLevel.id}
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-slate-950 leading-tight">
                    {briefingLevel.title}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => {
                  soundManager.playButton();
                  setBriefingLevel(null);
                }}
                className="w-8 h-8 rounded-full bg-white/80 hover:bg-white text-slate-700 flex items-center justify-center font-bold transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Briefing Body */}
            <div className="p-5 space-y-4 bg-slate-50">
              {/* Captain Civic Briefing Speech */}
              <div className="flex items-start gap-3 bg-white p-3.5 rounded-2xl border-2 border-amber-300 shadow-sm">
                <CaptainCivic mood="waving" size="sm" showSpeechBubble={false} />
                <div className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                  <strong className="text-amber-700 font-black block mb-0.5">
                    Arahan Kapten Sivik:
                  </strong>
                  {briefingLevel.learningFocus}
                </div>
              </div>

              {/* Enemy Wave Preview */}
              <div>
                <div className="text-xs font-black uppercase text-slate-600 mb-2 flex items-center gap-1.5">
                  <span>🚨</span> Pasukan Musuh yang Mengancam:
                </div>
                <div className="flex items-center gap-2 overflow-x-auto p-2 rounded-2xl bg-white border border-slate-200">
                  {briefingLevel.enemyTypes.map((eType) => (
                    <div
                      key={eType}
                      className="p-2 rounded-xl bg-slate-100 flex flex-col items-center gap-1 shrink-0"
                    >
                      <EnemySprite type={eType} className="w-9 h-9" />
                      <span className="text-[10px] font-bold text-slate-700 capitalize">
                        {eType.replace(/_/g, ' ')}
                      </span>
                    </div>
                  ))}
                  {briefingLevel.bossType && (
                    <div className="p-2 rounded-xl bg-rose-100 border border-rose-300 flex flex-col items-center gap-1 shrink-0">
                      <EnemySprite type={briefingLevel.bossType} className="w-10 h-10" />
                      <span className="text-[10px] font-black text-rose-700">BOS BESAR!</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Mission Details Pills */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700">
                  <span className="text-slate-500 font-bold block">Gelombang Musuh:</span>
                  <span className="text-sm font-black text-indigo-700">
                    {briefingLevel.wavesCount} Gelombang
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700">
                  <span className="text-slate-500 font-bold block">Pencapaian Bintang:</span>
                  <span className="text-sm font-black text-amber-600">
                    {levelStars[briefingLevel.id] ? `${levelStars[briefingLevel.id]} / 3 Bintang ⭐` : 'Belum Selesai'}
                  </span>
                </div>
              </div>
            </div>

            {/* Briefing Footer */}
            <div className="px-5 py-4 bg-white border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => {
                  soundManager.playButton();
                  setBriefingLevel(null);
                }}
                className="px-4 py-2 rounded-2xl text-xs font-black bg-slate-200 hover:bg-slate-300 text-slate-700 transition-colors cursor-pointer"
              >
                Pilih Misi Lain
              </button>

              <button
                onClick={() => {
                  handleStartMission(briefingLevel);
                  setBriefingLevel(null);
                }}
                className="btn-cartoon-green px-6 py-3 rounded-2xl text-sm font-black flex items-center gap-2 shadow-lg cursor-pointer"
              >
                <span>Mulai Misi Petualangan! 🚀</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
