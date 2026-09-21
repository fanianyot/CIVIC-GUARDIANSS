import React, { useState } from 'react';
import { DefenderConfig, Question } from '../types/game';
import { soundManager } from '../utils/audio';
import { DefenderSprite } from './GameSprites';
import { CaptainCivic } from './CaptainCivic';
import { Shield, Sparkles, CheckCircle2, XCircle, ArrowRight, BrainCircuit, Star } from 'lucide-react';

interface QuestionModalProps {
  question: Question;
  defender: DefenderConfig;
  targetPos: { row: number; col: number };
  onSuccess: (targetPos: { row: number; col: number }, q: Question) => void;
  onFail: (q: Question) => void;
  onCancel: () => void;
}

export const QuestionModal: React.FC<QuestionModalProps> = ({
  question,
  defender,
  targetPos,
  onSuccess,
  onFail,
  onCancel,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSelectOption = (index: number) => {
    if (hasAnswered) return;
    setSelectedIndex(index);
    setHasAnswered(true);

    const correct = index === question.correctIndex;
    setIsCorrect(correct);

    if (correct) {
      soundManager.playCorrect();
    } else {
      soundManager.playWrong();
    }
  };

  const handleContinue = () => {
    soundManager.playButton();
    if (isCorrect) {
      onSuccess(targetPos, question);
    } else {
      onFail(question);
    }
  };

  const optionLabels = ['A', 'B', 'C', 'D'];
  const optionColors = [
    'from-blue-500 to-indigo-600',
    'from-emerald-500 to-teal-600',
    'from-amber-500 to-orange-600',
    'from-purple-500 to-pink-600',
  ];

  // Derive rule & consequence details for rich feedback
  const getRuleDetails = () => {
    switch (question.category) {
      case 'rules_at_home':
        return {
          norm: 'Aturan dan Tata Tertib di Rumah (Keluarga)',
          why: 'Menjaga keharmonisan keluarga, melatih kemandirian, dan meringankan beban orang tua.',
          impact: 'Rumah menjadi tempat yang nyaman, damai, dan penuh kasih sayang bagi seluruh anggota keluarga.',
        };
      case 'rules_at_school':
        return {
          norm: 'Tata Tertib Sekolah & Disiplin Belajar',
          why: 'Menciptakan suasana belajar yang tertib, saling menghormati guru, dan rukun antar teman.',
          impact: 'Prestasi belajar meningkat, kelas kondusif, dan terbangun persahabatan yang suportif.',
        };
      case 'rules_in_society':
        return {
          norm: 'Norma Kesopanan & Keteraturan Lingkungan Masyarakat',
          why: 'Menghargai hak tetangga, menjaga kebersihan fasilitas umum, dan mengutamakan kepentingan bersama.',
          impact: 'Lingkungan rukun, aman, bebas dari konflik sosial, serta asri dan sehat untuk semua warga.',
        };
      case 'hots_civic_cases':
      default:
        return {
          norm: 'Penerapan Nilai-Nilai Luhur Pancasila dalam Kehidupan Sehari-hari',
          why: 'Keputusan yang adil dan bertanggung jawab mengutamakan musyawarah dan kebaikan bersama.',
          impact: 'Masyarakat menjadi kokoh, toleran, tertib, dan mencerminkan profil pelajar Pancasila yang berkarakter.',
        };
    }
  };

  const ruleDetails = getRuleDetails();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-200">
      {/* Confetti Particles when correct */}
      {hasAnswered && isCorrect && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
          {Array.from({ length: 28 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 rounded-sm animate-bounce"
              style={{
                left: `${(i * 3.7) % 95}%`,
                top: `${(i * 7) % 70}%`,
                backgroundColor: ['#10b981', '#fbbf24', '#38bdf8', '#f43f5e', '#a855f7'][i % 5],
                transform: `rotate(${i * 24}deg)`,
                animationDuration: `${1.2 + (i % 4) * 0.4}s`,
              }}
            />
          ))}
        </div>
      )}

      <div
        className={`relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border-4 transition-all duration-300 ${
          hasAnswered && isCorrect
            ? 'border-emerald-400 shadow-emerald-400/40 ring-4 ring-emerald-300/50'
            : hasAnswered && !isCorrect
            ? 'border-rose-400 shadow-rose-400/30 animate-shake'
            : 'border-amber-400 shadow-amber-500/20'
        }`}
      >
        {/* Top Challenge Banner Header */}
        <div className="relative px-5 py-3.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-2xl bg-white/20 backdrop-blur-xs text-xl">🧠</span>
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-amber-100">
                <span>Tantangan Edukasi Interaktif</span>
                <span>•</span>
                <span className="bg-amber-700/60 px-2 py-0.5 rounded-full text-white">
                  Petak [{targetPos.row + 1}, {targetPos.col + 1}]
                </span>
                {question.isHots && (
                  <span className="bg-rose-600 px-2 py-0.5 rounded-full text-white flex items-center gap-1 font-bold">
                    <BrainCircuit className="w-3 h-3" />
                    HOTS Analisis
                  </span>
                )}
              </div>
              <h2 className="text-base sm:text-xl font-black tracking-tight text-white drop-shadow-sm">
                Civic Question Challenge!
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-2xl backdrop-blur-xs">
            <DefenderSprite type={defender.id} className="w-8 h-8" />
            <div className="text-right hidden sm:block">
              <div className="text-[10px] uppercase font-bold text-amber-100">Penjaga:</div>
              <div className="text-xs font-black text-white">{defender.name}</div>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto bg-slate-50">
          {/* Captain Civic Introduction / Coaching */}
          <div className="flex items-center gap-3 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300/80 rounded-2xl p-3">
            <CaptainCivic
              mood={hasAnswered ? (isCorrect ? 'celebrating' : 'thinking') : 'waving'}
              size="sm"
              showSpeechBubble={false}
            />
            <div className="text-xs sm:text-sm text-slate-800 leading-snug">
              {!hasAnswered ? (
                <span>
                  <strong className="text-amber-700 font-black">Kapten Sivik Berkata: </strong>
                  "Jawablah dengan cermat! Tindakan disiplin apa yang paling tepat untuk situasi ini agar lingkungan tetap harmonis?"
                </span>
              ) : isCorrect ? (
                <span className="text-emerald-800">
                  <strong className="text-emerald-700 font-black">Hebat Sekali! </strong>
                  "Jawabanmu sangat tepat! Nilai disiplin dan kepedulianmu berhasil mengaktifkan kekuatan penjaga!"
                </span>
              ) : (
                <span className="text-rose-800">
                  <strong className="text-rose-700 font-black">Belum Tepat, Teman-teman! </strong>
                  "Jangan menyerah, mari kita cermati aturan yang berlaku agar pertahanan berikutnya semakin tangguh!"
                </span>
              )}
            </div>
          </div>

          {/* Scenario Context Box */}
          {question.scenario && (
            <div className="p-3.5 rounded-2xl bg-white border-2 border-indigo-200 text-slate-700 text-xs sm:text-sm leading-relaxed shadow-sm flex gap-3 items-start">
              <Shield className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-indigo-800 font-bold block mb-0.5">Skenario Kehidupan Nyata:</strong>
                {question.scenario}
              </div>
            </div>
          )}

          {/* Question Text */}
          <div className="text-base sm:text-lg font-black text-slate-900 leading-snug bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            {question.question}
          </div>

          {/* 4 Options Grid */}
          <div className="space-y-2.5">
            {question.options.map((opt, idx) => {
              const isSelected = selectedIndex === idx;
              const isThisCorrect = idx === question.correctIndex;

              let cardStyle = 'bg-white hover:bg-amber-50/60 border-2 border-slate-200 hover:border-amber-400 text-slate-800 hover:scale-[1.01]';
              if (hasAnswered) {
                if (isThisCorrect) {
                  cardStyle = 'bg-emerald-50 border-3 border-emerald-500 text-emerald-950 font-bold ring-2 ring-emerald-300';
                } else if (isSelected && !isThisCorrect) {
                  cardStyle = 'bg-rose-50 border-3 border-rose-500 text-rose-950 font-bold';
                } else {
                  cardStyle = 'bg-slate-100 border border-slate-200 text-slate-400 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={hasAnswered}
                  className={`w-full text-left p-3.5 rounded-2xl transition-all flex items-start gap-3 text-sm font-semibold cursor-pointer shadow-sm ${cardStyle}`}
                >
                  <span
                    className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center font-black text-sm text-white shadow-sm bg-gradient-to-br ${
                      hasAnswered && isThisCorrect
                        ? 'from-emerald-500 to-green-600'
                        : hasAnswered && isSelected
                        ? 'from-rose-500 to-red-600'
                        : optionColors[idx]
                    }`}
                  >
                    {optionLabels[idx]}
                  </span>
                  <span className="pt-1 leading-relaxed flex-1">{opt}</span>
                  {hasAnswered && isThisCorrect && (
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 self-center animate-bounce" />
                  )}
                  {hasAnswered && isSelected && !isThisCorrect && (
                    <XCircle className="w-6 h-6 text-rose-500 shrink-0 self-center" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Educational Feedback Section */}
          {hasAnswered && (
            <div
              className={`p-4 sm:p-5 rounded-2xl border-3 animate-in zoom-in-95 duration-200 space-y-3 ${
                isCorrect
                  ? 'bg-emerald-50/90 border-emerald-400 text-emerald-950 shadow-lg shadow-emerald-500/10'
                  : 'bg-amber-50/90 border-amber-400 text-slate-900 shadow-lg'
              }`}
            >
              {/* Status Banner */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-black text-sm sm:text-base">
                  {isCorrect ? (
                    <>
                      <Sparkles className="w-5 h-5 text-emerald-600 animate-spin" />
                      <span className="text-emerald-700">Jawaban Tepat! Penjaga Diaktifkan!</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-rose-600" />
                      <span className="text-rose-700">Mari Pelajari Pembahasannya:</span>
                    </>
                  )}
                </div>

                {/* +1 Civic Star reward banner if correct */}
                {isCorrect && (
                  <div className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1 shadow-md animate-star-burst">
                    <Star className="w-4 h-4 fill-amber-300 text-amber-950" />
                    <span>+1 Civic Star!</span>
                  </div>
                )}
              </div>

              {/* Explanatory text */}
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium bg-white/80 p-3 rounded-xl border border-slate-200/80">
                {question.explanation}
              </p>

              {/* Required 3 Pedagogical Elements */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-xs">
                <div className="p-2.5 rounded-xl bg-white border border-indigo-200">
                  <div className="font-black text-indigo-700 mb-0.5 flex items-center gap-1">
                    <span>📜</span> Aturan Terkait
                  </div>
                  <div className="text-slate-600 font-medium leading-tight">{ruleDetails.norm}</div>
                </div>

                <div className="p-2.5 rounded-xl bg-white border border-emerald-200">
                  <div className="font-black text-emerald-700 mb-0.5 flex items-center gap-1">
                    <span>💡</span> Mengapa Benar
                  </div>
                  <div className="text-slate-600 font-medium leading-tight">{ruleDetails.why}</div>
                </div>

                <div className="p-2.5 rounded-xl bg-white border border-amber-200">
                  <div className="font-black text-amber-700 mb-0.5 flex items-center gap-1">
                    <span>🌱</span> Dampak Positif
                  </div>
                  <div className="text-slate-600 font-medium leading-tight">{ruleDetails.impact}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
          {!hasAnswered ? (
            <>
              <span className="text-xs text-slate-500 font-bold flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-amber-600" />
                Pilih jawaban untuk mengerahkan penjaga ke petak terpilih
              </span>
              <button
                onClick={onCancel}
                className="px-4 py-2 rounded-2xl text-xs font-black bg-slate-200 hover:bg-slate-300 text-slate-700 transition-colors cursor-pointer"
              >
                Batalkan
              </button>
            </>
          ) : (
            <div className="w-full flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600">
                {isCorrect
                  ? 'Siap meluncurkan Penjaga Disiplin ke lapangan!'
                  : 'Pertajam pemahaman, lanjutkan perjuangan!'}
              </span>
              <button
                onClick={handleContinue}
                className={`px-6 py-2.5 rounded-2xl font-black text-sm flex items-center gap-2 transition-all shadow-lg cursor-pointer ${
                  isCorrect
                    ? 'btn-cartoon-green'
                    : 'btn-cartoon-amber'
                }`}
              >
                <span>{isCorrect ? 'Tugaskan Penjaga Sekarang! 🛡️' : 'Lanjutkan Pertempuran ⚔️'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
