import React, { useState, useRef } from 'react';
import { GroupAssessmentReport } from '../types/game';
import { 
  Trophy, 
  Award, 
  Download, 
  Printer, 
  Copy, 
  Check, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  BookOpen,
  Calendar,
  GraduationCap,
  Users2
} from 'lucide-react';

interface EndOfGameReportModalProps {
  roomCode: string;
  roomTitle: string;
  teacherName?: string;
  reportList: GroupAssessmentReport[];
  onClose: () => void;
  onNewSession?: () => void;
}

export const EndOfGameReportModal: React.FC<EndOfGameReportModalProps> = ({
  roomCode,
  roomTitle,
  teacherName = 'Guru Kelas 4',
  reportList,
  onClose,
  onNewSession,
}) => {
  const [copied, setCopied] = useState(false);
  const printableRef = useRef<HTMLDivElement>(null);

  const handleCopyText = () => {
    let summaryText = `LAPORAN ASESMEN FORMATIF KELAS: CIVIC GUARDIANS\n`;
    summaryText += `Kode Ruangan: ${roomCode} | Tanggal: ${new Date().toLocaleDateString('id-ID')}\n`;
    summaryText += `Guru Pembimbing: ${teacherName}\n`;
    summaryText += `========================================================\n\n`;

    reportList.forEach((r) => {
      summaryText += `Peringkat #${r.finalRank}: ${r.groupName}\n`;
      summaryText += `• Skor Akhir: ${r.finalScore} | Bintang Sivik: ${r.stars}⭐\n`;
      summaryText += `• Akurasi Jawaban: ${r.accuracyPercentage}% (${r.correctAnswers}/${r.questionsAnswered} Tepat)\n`;
      summaryText += `• Kompetensi Terkuat: ${r.strongestCompetency} (${r.strongestPercentage}%)\n`;
      summaryText += `• Perlu Penguatan: ${r.weakestCompetency} (${r.weakestPercentage}%)\n`;
      summaryText += `• Status Capaian: ${r.statusLabel}\n`;
      summaryText += `• Anggota: ${r.members.join(', ')}\n\n`;
    });

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportCSV = () => {
    const headers = [
      'Peringkat',
      'Nama Kelompok',
      'Anggota',
      'Skor Akhir',
      'Bintang',
      'Harmoni',
      'Akurasi (%)',
      'Benar',
      'Salah',
      'Waktu Main',
      'Kompetensi Terkuat',
      'Persentase Terkuat',
      'Perlu Penguatan',
      'Persentase Penguatan',
      'Status Ketercapaian',
    ];

    const rows = reportList.map((r) => [
      r.finalRank,
      `"${r.groupName}"`,
      `"${r.members.join('; ')}"`,
      r.finalScore,
      r.stars,
      r.harmony,
      r.accuracyPercentage,
      r.correctAnswers,
      r.incorrectAnswers,
      `"${r.timePlayedFormatted}"`,
      `"${r.strongestCompetency}"`,
      r.strongestPercentage,
      `"${r.weakestCompetency}"`,
      r.weakestPercentage,
      `"${r.statusLabel}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Asesmen_Civic_Guardians_${roomCode}_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="w-full max-w-5xl bg-slate-900 border border-indigo-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="px-6 py-4 bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 border-b border-indigo-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                LAPORAN AKHIR ASESMEN KELAS (END OF GAME REPORT)
              </h2>
              <p className="text-xs text-slate-400">
                Ruang: <span className="text-indigo-300 font-bold">{roomCode}</span> • Kurikulum Merdeka Pendidikan Pancasila Kelas 4
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Toolbar */}
        <div className="px-6 py-3 bg-slate-950/70 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4 text-slate-300">
            <span className="flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-indigo-400" />
              Guru: <strong className="text-white">{teacherName}</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <Users2 className="w-4 h-4 text-emerald-400" />
              Total Kelompok: <strong className="text-white">{reportList.length}</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-amber-400" />
              {new Date().toLocaleDateString('id-ID', { dateStyle: 'long' })}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyText}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold transition active:scale-95"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Tersalin!' : 'Salin Ringkasan'}
            </button>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 font-semibold transition active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              Unduh CSV
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow transition active:scale-95"
            >
              <Printer className="w-3.5 h-3.5" />
              Cetak / PDF
            </button>
          </div>
        </div>

        {/* Report Content */}
        <div ref={printableRef} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Printable Header (Visible during print) */}
          <div className="hidden print:block mb-6 border-b-2 border-slate-900 pb-4 text-slate-900">
            <h1 className="text-2xl font-black uppercase tracking-tight">
              LEMBAR ASESMEN FORMATIF KELOMPOK: PENDIDIKAN PANCASILA
            </h1>
            <p className="text-sm font-semibold">
              Materi: Aturan & Norma Kehidupan Sehari-hari • Kelas 4 Sekolah Dasar
            </p>
            <p className="text-xs mt-1">
              Ruangan: {roomCode} | Guru: {teacherName} | Tanggal: {new Date().toLocaleDateString('id-ID')}
            </p>
          </div>

          {/* Assessment Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/50">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-800/80 text-slate-300 border-b border-slate-700 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-3.5 text-center w-12">Peringkat</th>
                  <th className="py-3 px-4">Nama Kelompok & Anggota</th>
                  <th className="py-3 px-3 text-center">Skor & Bintang</th>
                  <th className="py-3 px-3 text-center">Akurasi Soal</th>
                  <th className="py-3 px-4">Kompetensi Terkuat 🌟</th>
                  <th className="py-3 px-4">Perlu Bimbingan 🎯</th>
                  <th className="py-3 px-3.5 text-center">Capaian Profil</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70 text-slate-200">
                {reportList.map((rep) => {
                  const isGold = rep.finalRank === 1;
                  const isSilver = rep.finalRank === 2;
                  const isBronze = rep.finalRank === 3;

                  return (
                    <tr
                      key={rep.groupId}
                      className={`hover:bg-slate-800/40 transition ${
                        isGold ? 'bg-amber-500/5' : ''
                      }`}
                    >
                      {/* Rank */}
                      <td className="py-3 px-3.5 text-center font-black">
                        {isGold && <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">🥇 1</span>}
                        {isSilver && <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-400/20 text-slate-300 border border-slate-400/40">🥈 2</span>}
                        {isBronze && <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-700/20 text-amber-500 border border-amber-700/40">🥉 3</span>}
                        {!isGold && !isSilver && !isBronze && (
                          <span className="text-slate-400">#{rep.finalRank}</span>
                        )}
                      </td>

                      {/* Group Name & Members */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3 h-3 rounded-full shrink-0"
                            style={{ backgroundColor: rep.color }}
                          />
                          <span className="font-bold text-white text-sm">
                            {rep.groupName}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5 max-w-xs truncate">
                          Siswa: {rep.members.join(', ')}
                        </div>
                      </td>

                      {/* Score & Stars */}
                      <td className="py-3 px-3 text-center">
                        <div className="font-black text-amber-400 text-sm">
                          {rep.finalScore.toLocaleString()} Pts
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center justify-center gap-1 mt-0.5">
                          <span>{rep.stars} ⭐</span>
                          <span>•</span>
                          <span>{rep.harmony} 💎</span>
                        </div>
                      </td>

                      {/* Accuracy */}
                      <td className="py-3 px-3 text-center">
                        <div className={`font-black text-sm ${
                          rep.accuracyPercentage >= 80
                            ? 'text-emerald-400'
                            : rep.accuracyPercentage >= 60
                            ? 'text-amber-400'
                            : 'text-rose-400'
                        }`}>
                          {rep.accuracyPercentage}%
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {rep.correctAnswers}/{rep.questionsAnswered} benar
                        </div>
                      </td>

                      {/* Strongest */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-emerald-300">
                          {rep.strongestCompetency}
                        </div>
                        <div className="text-[10px] text-emerald-400/80 mt-0.5">
                          Ketuntasan: {rep.strongestPercentage}%
                        </div>
                      </td>

                      {/* Weakest */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-amber-300">
                          {rep.weakestCompetency}
                        </div>
                        <div className="text-[10px] text-amber-400/80 mt-0.5">
                          Perlu Penguatan: {rep.weakestPercentage}%
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3.5 text-center">
                        <span className={`inline-block px-2.5 py-1 rounded-lg text-[11px] font-bold border ${
                          rep.accuracyPercentage >= 80
                            ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                            : rep.accuracyPercentage >= 60
                            ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                            : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                        }`}>
                          {rep.statusLabel}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Teacher Pedagogical Reflection Box */}
          <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-200">
            <h4 className="font-bold text-sm text-indigo-100 mb-1 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              Catatan Pedagogis & Rekomendasi Tindak Lanjut Guru:
            </h4>
            <p className="leading-relaxed">
              • <strong>Hasil Pembelajaran:</strong> Seluruh kelompok telah aktif berkolaborasi dan memahami aturan dasar di rumah, sekolah, dan masyarakat.
              <br />
              • <strong>Tindak Lanjut Remedial:</strong> Bagi kelompok dengan akurasi di bawah 70%, berikan lembar kerja penguatan mengenai pemeliharaan fasilitas umum dan budaya antre.
              <br />
              • <strong>Pengayaan:</strong> Kelompok dengan capaian "Sangat Mahir" dapat ditugaskan menjadi Duta Ketertiban Kelas pada jam istirahat sekolah.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition"
          >
            Tutup Laporan
          </button>

          {onNewSession && (
            <button
              onClick={onNewSession}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow-lg transition active:scale-95"
            >
              Mulai Sesi Baru 🚀
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
