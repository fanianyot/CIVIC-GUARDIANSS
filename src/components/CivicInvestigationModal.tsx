import React, { useState, useMemo } from 'react';
import { LevelConfig } from '../types/game';
import { soundManager } from '../utils/audio';
import { SmartCaseGenerator, GeneratedCivicCase } from '../data/caseGenerator';
import { CaptainCivic } from './CaptainCivic';
import { 
  FileCheck2, 
  CheckCircle2, 
  XCircle, 
  Printer, 
  Sparkles, 
  ArrowRight,
  Brain,
  ShieldCheck,
  Star,
  RefreshCw,
  Lightbulb
} from 'lucide-react';

interface CivicInvestigationModalProps {
  level: LevelConfig;
  onComplete: (score: number, stars: number) => void;
  onClose?: () => void;
}

export const CivicInvestigationModal: React.FC<CivicInvestigationModalProps> = ({
  level,
  onComplete,
}) => {
  // Generate a smart real-life case based on the level's objective
  const [caseInstance, setCaseInstance] = useState<GeneratedCivicCase>(() =>
    SmartCaseGenerator.getCaseForLevel(level)
  );

  const [ansRule, setAnsRule] = useState<number | null>(null);
  const [ansDecision, setAnsDecision] = useState<number | null>(null);
  const [ansConsequence, setAnsConsequence] = useState<number | null>(null);
  const [ansSolution, setAnsSolution] = useState<number | null>(null);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [reportResult, setReportResult] = useState<{ score: number; stars: number } | null>(null);

  const allSelected =
    ansRule !== null &&
    ansDecision !== null &&
    ansConsequence !== null &&
    ansSolution !== null;

  const handleGenerateNewSituation = () => {
    soundManager.playButton();
    setCaseInstance(SmartCaseGenerator.getCaseForLevel(level));
    setAnsRule(null);
    setAnsDecision(null);
    setAnsConsequence(null);
    setAnsSolution(null);
    setIsSubmitted(false);
    setReportResult(null);
  };

  const handleSubmit = () => {
    if (!allSelected) return;

    let correctCount = 0;
    if (ansRule === caseInstance.questions.rule.correctIndex) correctCount++;
    if (ansDecision === caseInstance.questions.decision.correctIndex) correctCount++;
    if (ansConsequence === caseInstance.questions.consequence.correctIndex) correctCount++;
    if (ansSolution === caseInstance.questions.solution.correctIndex) correctCount++;

    const calculatedScore = correctCount * 25; // 0, 25, 50, 75, 100
    const stars = correctCount >= 4 ? 3 : correctCount >= 2 ? 2 : 1;

    setReportResult({ score: calculatedScore, stars });
    setIsSubmitted(true);
    soundManager.playVictory();
  };

  const handlePrint = () => {
    window.print();
  };

  const optionLetters = ['A', 'B', 'C', 'D'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden my-auto text-slate-900 border-4 border-amber-400 print:bg-white print:text-black print:border-none print:shadow-none">
        
        {/* Header with Cartoon Game Aesthetic */}
        <div className="px-6 py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 text-white flex items-center justify-between shadow-md print:bg-white print:text-black print:border-b-2 print:border-black">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white border border-white/30 shadow-inner">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-[11px] font-black tracking-wider uppercase text-amber-100">
                <span>Investigasi Kasus Disiplin • Kelas 4 SD</span>
                <span>•</span>
                <span className="bg-amber-700/60 px-2 py-0.5 rounded-full text-white">Level {level.id}</span>
              </div>
              <h2 className="text-xl font-black text-white tracking-tight drop-shadow-xs print:text-black">
                {caseInstance.caseTitle}
              </h2>
            </div>
          </div>

          {!isSubmitted && (
            <button
              onClick={handleGenerateNewSituation}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-bold transition-all shadow-xs border border-white/20"
              title="Coba situasi tantangan lain dengan tujuan pembelajaran yang sama"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Ganti Kasus Lain</span>
            </button>
          )}
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[72vh] overflow-y-auto bg-slate-50 print:max-h-none print:overflow-visible">
          
          {/* Captain Civic Guidance Banner */}
          <div className="flex items-center gap-3.5 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl p-3.5 shadow-xs">
            <CaptainCivic
              mood={isSubmitted ? (reportResult?.score === 100 ? 'celebrating' : 'thinking') : 'waving'}
              size="sm"
              showSpeechBubble={false}
            />
            <div className="text-xs sm:text-sm text-slate-800 leading-snug">
              {!isSubmitted ? (
                <span>
                  <strong className="text-amber-700 font-black">Kapten Sivik Berkata: </strong>
                  "Jadilah pemecah masalah yang hebat! Analisis situasi nyata di bawah ini dan tentukan keputusan yang paling adil dan bertanggung jawab."
                </span>
              ) : (
                <span>
                  <strong className="text-emerald-700 font-black">Hasil Investigasi Selesai! </strong>
                  "Kamu telah menganalisis aturan dengan berpikir kritis. Terus terapkan nilai-nilai ini di kehidupan sehari-hari ya!"
                </span>
              )}
            </div>
          </div>

          {/* Case Scenario Box */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border-2 border-indigo-200 text-slate-800 shadow-sm print:bg-gray-100 print:border-gray-400">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 font-black text-indigo-900 text-sm sm:text-base">
                <Brain className="w-5 h-5 text-indigo-600" />
                <span>Skenario Masalah Nyata:</span>
              </div>
              <span className="text-[11px] font-bold px-2.5 py-0.5 bg-indigo-50 border border-indigo-200 rounded-full text-indigo-700">
                Fokus: {caseInstance.learningObjective}
              </span>
            </div>
            <p className="text-slate-700 text-xs sm:text-sm leading-relaxed font-medium">
              {caseInstance.caseScenario}
            </p>
          </div>

          {!isSubmitted ? (
            <div className="space-y-6">
              {/* Question 1: Tindakan / Aturan */}
              <div className="p-4 rounded-2xl bg-white border-2 border-slate-200 shadow-xs space-y-3">
                <label className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-xl bg-indigo-600 text-white text-xs font-black flex items-center justify-center shrink-0">
                    1
                  </span>
                  <span>{caseInstance.questions.rule.prompt}</span>
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {caseInstance.questions.rule.options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setAnsRule(i);
                        soundManager.playButton();
                      }}
                      className={`text-left p-3 rounded-xl border-2 text-xs sm:text-sm transition-all flex items-start gap-2.5 cursor-pointer ${
                        ansRule === i
                          ? 'bg-indigo-50 border-indigo-500 text-indigo-950 font-bold ring-2 ring-indigo-300'
                          : 'bg-slate-50/80 border-slate-200 hover:border-amber-300 hover:bg-amber-50/40 text-slate-700'
                      }`}
                    >
                      <span className={`w-5 h-5 rounded-md text-[11px] font-bold flex items-center justify-center shrink-0 ${
                        ansRule === i ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {optionLetters[i]}
                      </span>
                      <span className="leading-snug pt-0.5">{opt}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 2: Keputusan Terbaik */}
              <div className="p-4 rounded-2xl bg-white border-2 border-slate-200 shadow-xs space-y-3">
                <label className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-xl bg-amber-600 text-white text-xs font-black flex items-center justify-center shrink-0">
                    2
                  </span>
                  <span>{caseInstance.questions.decision.prompt}</span>
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {caseInstance.questions.decision.options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setAnsDecision(i);
                        soundManager.playButton();
                      }}
                      className={`text-left p-3 rounded-xl border-2 text-xs sm:text-sm transition-all flex items-start gap-2.5 cursor-pointer ${
                        ansDecision === i
                          ? 'bg-amber-50 border-amber-500 text-amber-950 font-bold ring-2 ring-amber-300'
                          : 'bg-slate-50/80 border-slate-200 hover:border-amber-300 hover:bg-amber-50/40 text-slate-700'
                      }`}
                    >
                      <span className={`w-5 h-5 rounded-md text-[11px] font-bold flex items-center justify-center shrink-0 ${
                        ansDecision === i ? 'bg-amber-600 text-white' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {optionLetters[i]}
                      </span>
                      <span className="leading-snug pt-0.5">{opt}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 3: Akibat / Konsekuensi */}
              <div className="p-4 rounded-2xl bg-white border-2 border-slate-200 shadow-xs space-y-3">
                <label className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-xl bg-rose-600 text-white text-xs font-black flex items-center justify-center shrink-0">
                    3
                  </span>
                  <span>{caseInstance.questions.consequence.prompt}</span>
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {caseInstance.questions.consequence.options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setAnsConsequence(i);
                        soundManager.playButton();
                      }}
                      className={`text-left p-3 rounded-xl border-2 text-xs sm:text-sm transition-all flex items-start gap-2.5 cursor-pointer ${
                        ansConsequence === i
                          ? 'bg-rose-50 border-rose-500 text-rose-950 font-bold ring-2 ring-rose-300'
                          : 'bg-slate-50/80 border-slate-200 hover:border-amber-300 hover:bg-amber-50/40 text-slate-700'
                      }`}
                    >
                      <span className={`w-5 h-5 rounded-md text-[11px] font-bold flex items-center justify-center shrink-0 ${
                        ansConsequence === i ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {optionLetters[i]}
                      </span>
                      <span className="leading-snug pt-0.5">{opt}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 4: Solusi Nyata & Adil */}
              <div className="p-4 rounded-2xl bg-white border-2 border-slate-200 shadow-xs space-y-3">
                <label className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-xl bg-emerald-600 text-white text-xs font-black flex items-center justify-center shrink-0">
                    4
                  </span>
                  <span>{caseInstance.questions.solution.prompt}</span>
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {caseInstance.questions.solution.options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setAnsSolution(i);
                        soundManager.playButton();
                      }}
                      className={`text-left p-3 rounded-xl border-2 text-xs sm:text-sm transition-all flex items-start gap-2.5 cursor-pointer ${
                        ansSolution === i
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold ring-2 ring-emerald-300'
                          : 'bg-slate-50/80 border-slate-200 hover:border-amber-300 hover:bg-amber-50/40 text-slate-700'
                      }`}
                    >
                      <span className={`w-5 h-5 rounded-md text-[11px] font-bold flex items-center justify-center shrink-0 ${
                        ansSolution === i ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {optionLetters[i]}
                      </span>
                      <span className="leading-snug pt-0.5">{opt}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Result and Printable LKPD Summary */
            <div className="space-y-4 animate-in zoom-in-95 duration-200">
              {/* Scorecard Banner */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 border-2 border-indigo-400 text-center space-y-2 text-white shadow-xl">
                <div className="flex justify-center gap-1.5">
                  {[1, 2, 3].map((star) => (
                    <Star
                      key={star}
                      className={`w-8 h-8 ${
                        star <= (reportResult?.stars || 0)
                          ? 'text-amber-400 fill-amber-400 animate-bounce'
                          : 'text-slate-600'
                      }`}
                    />
                  ))}
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white">
                  Skor Investigasi: {reportResult?.score}/100
                </h3>
                <p className="text-xs sm:text-sm text-indigo-200 max-w-md mx-auto">
                  {reportResult?.score === 100
                    ? 'Hebat sekali! Semua keputusanmu sangat adil, bertanggung jawab, dan tepat!'
                    : reportResult?.score && reportResult.score >= 75
                    ? 'Bagus sekali! Pemahamanmu tentang aturan dan kepedulian bersama sudah sangat baik!'
                    : 'Tetap semangat! Mari pelajari kembali alasan pentingnya aturan demi kebaikan bersama.'}
                </p>
              </div>

              {/* Review Checklist */}
              <div className="space-y-2.5 text-xs sm:text-sm">
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
                  <div className="flex items-center gap-2 font-bold">
                    {ansRule === caseInstance.questions.rule.correctIndex ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-500" />
                    )}
                    <span className="text-slate-900 font-black">1. {caseInstance.questions.rule.prompt}</span>
                  </div>
                  <p className="pl-7 text-slate-700 font-medium">
                    {caseInstance.questions.rule.options[caseInstance.questions.rule.correctIndex]}
                  </p>
                  <p className="pl-7 text-[11px] text-indigo-600 font-semibold italic">
                    💡 {caseInstance.questions.rule.explanation}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
                  <div className="flex items-center gap-2 font-bold">
                    {ansDecision === caseInstance.questions.decision.correctIndex ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-500" />
                    )}
                    <span className="text-slate-900 font-black">2. {caseInstance.questions.decision.prompt}</span>
                  </div>
                  <p className="pl-7 text-slate-700 font-medium">
                    {caseInstance.questions.decision.options[caseInstance.questions.decision.correctIndex]}
                  </p>
                  <p className="pl-7 text-[11px] text-amber-700 font-semibold italic">
                    💡 {caseInstance.questions.decision.explanation}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
                  <div className="flex items-center gap-2 font-bold">
                    {ansConsequence === caseInstance.questions.consequence.correctIndex ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-500" />
                    )}
                    <span className="text-slate-900 font-black">3. {caseInstance.questions.consequence.prompt}</span>
                  </div>
                  <p className="pl-7 text-slate-700 font-medium">
                    {caseInstance.questions.consequence.options[caseInstance.questions.consequence.correctIndex]}
                  </p>
                  <p className="pl-7 text-[11px] text-rose-600 font-semibold italic">
                    💡 {caseInstance.questions.consequence.explanation}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
                  <div className="flex items-center gap-2 font-bold">
                    {ansSolution === caseInstance.questions.solution.correctIndex ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-500" />
                    )}
                    <span className="text-slate-900 font-black">4. {caseInstance.questions.solution.prompt}</span>
                  </div>
                  <p className="pl-7 text-slate-700 font-medium">
                    {caseInstance.questions.solution.options[caseInstance.questions.solution.correctIndex]}
                  </p>
                  <p className="pl-7 text-[11px] text-emerald-700 font-semibold italic">
                    💡 {caseInstance.questions.solution.explanation}
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-emerald-100 border-2 border-emerald-400 rounded-2xl text-emerald-950 text-xs font-bold flex items-center gap-2 shadow-xs">
                <Sparkles className="w-5 h-5 text-amber-500 shrink-0 animate-spin" />
                <span>Kamu mendapatkan {reportResult?.stars || 1} Bintang Kewarganegaraan untuk Akademi Penjaga!</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="px-6 py-4 bg-white border-t-2 border-slate-200 flex items-center justify-between print:hidden">
          {!isSubmitted ? (
            <>
              <span className="text-xs text-slate-500 font-medium">
                Pilihlah solusi terbaik di keempat pertanyaan di atas
              </span>
              <button
                onClick={handleSubmit}
                disabled={!allSelected}
                className={`px-6 py-2.5 rounded-2xl font-black text-sm flex items-center gap-2 transition-all cursor-pointer ${
                  allSelected
                    ? 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Kirim Laporan Investigasi</span>
              </button>
            </>
          ) : (
            <div className="w-full flex items-center justify-between">
              <button
                onClick={handlePrint}
                className="px-4 py-2.5 rounded-2xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 flex items-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Lembar LKPD (PDF)</span>
              </button>

              <button
                onClick={() => onComplete(reportResult?.score || 0, reportResult?.stars || 1)}
                className="px-6 py-2.5 rounded-2xl font-black text-sm bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white flex items-center gap-2 shadow-md shadow-emerald-600/30 cursor-pointer"
              >
                <span>Lanjutkan Perjalanan</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
