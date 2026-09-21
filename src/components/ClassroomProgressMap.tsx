import React from 'react';
import { MultiRoomGroup } from '../types/game';
import { LEVELS_CONFIG, WORLDS_CONFIG } from '../data/levels';
import { 
  Home, 
  GraduationCap, 
  Trees, 
  Building2, 
  Crown, 
  Skull, 
  ShieldCheck, 
  Sparkles,
  AlertTriangle,
  HelpCircle
} from 'lucide-react';

interface ClassroomProgressMapProps {
  groups: MultiRoomGroup[];
  onSelectGroup?: (group: MultiRoomGroup) => void;
  compact?: boolean;
}

export const ClassroomProgressMap: React.FC<ClassroomProgressMapProps> = ({
  groups,
  onSelectGroup,
  compact = false,
}) => {
  const getWorldIcon = (worldId: string) => {
    switch (worldId) {
      case 'world1': return <Home className="w-4 h-4 text-amber-400" />;
      case 'world2': return <GraduationCap className="w-4 h-4 text-blue-400" />;
      case 'world3': return <Trees className="w-4 h-4 text-emerald-400" />;
      case 'world4': return <Building2 className="w-4 h-4 text-rose-400" />;
      default: return <ShieldCheck className="w-4 h-4 text-indigo-400" />;
    }
  };

  return (
    <div className="w-full bg-slate-900/90 border border-indigo-500/30 rounded-2xl p-4 sm:p-5 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            PETA PERJALANAN KELAS REAL-TIME (LIVE PROGRESS MAP)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Posisi langsung setiap kelompok di 4 Dunia (Home ➔ School ➔ Community ➔ Final World)
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Lancar
          </span>
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20">
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            Terhambat (&gt;4m)
          </span>
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-300 border border-rose-500/20">
            <HelpCircle className="w-3 h-3 text-rose-400" />
            Perlu Bimbingan
          </span>
        </div>
      </div>

      {/* Track Nodes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {(['world1', 'world2', 'world3', 'world4'] as const).map((worldId) => {
          const world = WORLDS_CONFIG[worldId];
          const levels = LEVELS_CONFIG.filter((l) => l.worldId === worldId);

          return (
            <div 
              key={worldId} 
              className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between"
            >
              {/* World Header */}
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-800">
                {getWorldIcon(worldId)}
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    {world.name}
                  </h4>
                  <span className="text-[10px] text-slate-400">
                    {world.theme}
                  </span>
                </div>
              </div>

              {/* Levels in this world */}
              <div className="space-y-2.5 flex-1">
                {levels.map((level) => {
                  const groupsHere = groups.filter((g) => (g.currentLevelId || 1) === level.id);
                  const isBoss = !!level.bossType;

                  return (
                    <div
                      key={level.id}
                      className={`relative p-2.5 rounded-xl border transition-all ${
                        groupsHere.length > 0
                          ? 'bg-indigo-950/40 border-indigo-500/60 shadow-lg shadow-indigo-950/50'
                          : 'bg-slate-900/50 border-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`text-xs font-bold flex items-center gap-1.5 ${
                          isBoss ? 'text-rose-400' : 'text-slate-300'
                        }`}>
                          {isBoss ? (
                            <Skull className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                          ) : (
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                          )}
                          {level.title}
                        </span>
                        {groupsHere.length > 0 && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                            {groupsHere.length} Kelompok
                          </span>
                        )}
                      </div>

                      {/* Groups currently on this node */}
                      {groupsHere.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {groupsHere.map((grp) => (
                            <button
                              key={grp.id}
                              onClick={() => onSelectGroup?.(grp)}
                              className="group flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-semibold text-white shadow transition-all hover:scale-105 active:scale-95"
                              style={{ backgroundColor: `${grp.color}25`, borderColor: grp.color, borderWidth: '1px' }}
                              title={`${grp.name} (${grp.stars}⭐, ${grp.score} Poin) - Klik untuk detail`}
                            >
                              <span 
                                className="w-2 h-2 rounded-full" 
                                style={{ backgroundColor: grp.color }} 
                              />
                              <span className="truncate max-w-[110px] text-left">
                                {grp.name.replace('Kelompok ', 'K-')}
                              </span>
                              {grp.isStuck && (
                                <AlertTriangle className="w-3 h-3 text-amber-400 animate-bounce" />
                              )}
                              {grp.needsSupport && (
                                <HelpCircle className="w-3 h-3 text-rose-400 animate-pulse" />
                              )}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="text-[11px] text-slate-600 italic py-0.5">
                          Kosong
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
