import React from 'react';
import { Achievement } from '../types/game';
import { 
  Award, 
  Home, 
  GraduationCap, 
  Trees, 
  ShieldCheck, 
  Crown, 
  Sparkles, 
  X, 
  CheckCircle2, 
  Lock 
} from 'lucide-react';

interface AchievementsModalProps {
  achievements: Achievement[];
  onClose: () => void;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  achievements,
  onClose,
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Home':
        return <Home className="w-5 h-5 text-amber-400" />;
      case 'GraduationCap':
        return <GraduationCap className="w-5 h-5 text-blue-400" />;
      case 'Trees':
        return <Trees className="w-5 h-5 text-emerald-400" />;
      case 'Award':
        return <Award className="w-5 h-5 text-purple-400" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-indigo-400" />;
      case 'Crown':
        return <Crown className="w-5 h-5 text-rose-400" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-yellow-400" />;
      default:
        return <Award className="w-5 h-5 text-indigo-400" />;
    }
  };

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-auto text-slate-100 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">Buku Prestasi & Pencapaian</h2>
              <p className="text-xs text-slate-400">
                Pencapaian Civic Guardians dalam menegakkan ketertiban dan nilai Pancasila
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="px-3 py-1 rounded-xl text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {unlockedCount}/{achievements.length} Terbuka
            </span>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="p-6 overflow-y-auto space-y-3">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                ach.unlocked
                  ? 'bg-slate-800/80 border-emerald-500/50 shadow-md'
                  : 'bg-slate-900/50 border-slate-800/80 opacity-70'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`p-3 rounded-2xl border ${
                    ach.unlocked
                      ? 'bg-emerald-500/20 border-emerald-500/30'
                      : 'bg-slate-800 border-slate-700'
                  }`}
                >
                  {getIcon(ach.icon)}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">{ach.title}</h3>
                    <span className="text-xs text-indigo-300 font-medium">
                      ({ach.indonesianTitle})
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-snug">
                    {ach.description}
                  </p>

                  {/* Progress bar */}
                  <div className="mt-2.5 flex items-center gap-2">
                    <div className="w-36 h-2 rounded-full bg-slate-800 overflow-hidden border border-slate-700">
                      <div
                        className={`h-full rounded-full transition-all ${
                          ach.unlocked ? 'bg-emerald-500' : 'bg-indigo-500'
                        }`}
                        style={{
                          width: `${Math.min(
                            100,
                            Math.round((ach.progress / ach.maxProgress) * 100)
                          )}%`,
                        }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 font-semibold">
                      {ach.progress}/{ach.maxProgress}
                    </span>
                  </div>
                </div>
              </div>

              {ach.unlocked ? (
                <div className="flex items-center gap-1 text-emerald-400 font-bold text-xs shrink-0 pt-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Diraih</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-slate-500 text-xs shrink-0 pt-1">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Terkunci</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
