import React from 'react';
import { DEFENDERS_CONFIG } from '../data/defenders';
import { DefenderType } from '../types/game';
import { DefenderSprite } from './GameSprites';
import { Star, ArrowUpCircle, Sparkles, X, Shield, Zap } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface GuardianAcademyProps {
  civicStars: number;
  upgrades: Record<DefenderType, number>;
  onUpgrade: (type: DefenderType, cost: number) => void;
  onClose: () => void;
}

export const GuardianAcademy: React.FC<GuardianAcademyProps> = ({
  civicStars,
  upgrades,
  onUpgrade,
  onClose,
}) => {
  const defenderKeys = Object.keys(DEFENDERS_CONFIG) as DefenderType[];

  const getUpgradeCost = (currentLvl: number) => {
    return (currentLvl + 1) * 2; // e.g. level 0->1 costs 2 stars, 1->2 costs 4 stars
  };

  const handleUpgradeClick = (type: DefenderType, cost: number) => {
    if (civicStars >= cost) {
      soundManager.playCollect();
      onUpgrade(type, cost);
    } else {
      soundManager.playWrong();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-auto text-slate-100 flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">Akademi Penjaga Kewarganegaraan</h2>
              <p className="text-xs text-slate-400">
                Tingkatkan kekuatan karakter penjaga menggunakan Bintang Kewarganegaraan
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-sm flex items-center gap-1.5 shadow-sm">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{civicStars} Bintang Tersedia</span>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content: Defender Cards */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          {defenderKeys.map((type) => {
            const config = DEFENDERS_CONFIG[type];
            const currentLvl = upgrades[type] || 0;
            const cost = getUpgradeCost(currentLvl);
            const canAfford = civicStars >= cost && currentLvl < 5;
            const isMax = currentLvl >= 5;

            // Stat calculation bonus
            const bonusHp = Math.round(config.hp * (1 + currentLvl * 0.15));
            const bonusDamage = Math.round(config.damage * (1 + currentLvl * 0.2));

            return (
              <div
                key={type}
                className="p-4 rounded-2xl bg-slate-850/80 border border-slate-800 flex flex-col justify-between gap-3 relative overflow-hidden"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-slate-800 border border-slate-700/80 shrink-0">
                    <DefenderSprite type={type} className="w-12 h-12" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-white truncate">
                        {config.indonesianName}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        Tk. {currentLvl}/5
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">{config.title}</div>
                    <p className="text-xs text-slate-300 mt-1 leading-snug">
                      {config.specialAbility}
                    </p>
                  </div>
                </div>

                {/* Stat bars */}
                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Shield className="w-3.5 h-3.5 text-amber-400" /> HP:
                    </span>
                    <span className="font-bold text-white">
                      {bonusHp} {currentLvl > 0 && <span className="text-emerald-400 text-[10px]">(+{Math.round(currentLvl * 15)}%)</span>}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-indigo-400" /> Kekuatan:
                    </span>
                    <span className="font-bold text-white">
                      {config.damage > 0 ? bonusDamage : 'Support'}{' '}
                      {config.damage > 0 && currentLvl > 0 && <span className="text-emerald-400 text-[10px]">(+{Math.round(currentLvl * 20)}%)</span>}
                    </span>
                  </div>
                </div>

                {/* Action button */}
                <div className="flex items-center justify-between pt-1">
                  <div className="text-xs text-slate-400">
                    {isMax ? (
                      <span className="text-emerald-400 font-bold">Maksimal</span>
                    ) : (
                      <span className="flex items-center gap-1">
                        Biaya:{' '}
                        <strong className="text-amber-400 flex items-center gap-0.5">
                          <Star className="w-3 h-3 fill-amber-400" /> {cost}
                        </strong>
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleUpgradeClick(type, cost)}
                    disabled={!canAfford}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                      canAfford
                        ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-950'
                        : isMax
                        ? 'bg-slate-800 text-slate-500 cursor-default'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                    }`}
                  >
                    <ArrowUpCircle className="w-4 h-4" />
                    <span>{isMax ? 'Tingkat Maks' : 'Tingkatkan'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
