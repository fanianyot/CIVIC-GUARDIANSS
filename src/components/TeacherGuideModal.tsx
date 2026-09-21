import React from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Award, 
  X, 
  Printer, 
  GraduationCap, 
  CheckCircle2, 
  Layers 
} from 'lucide-react';

interface TeacherGuideModalProps {
  onClose: () => void;
}

export const TeacherGuideModal: React.FC<TeacherGuideModalProps> = ({ onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-auto text-slate-100 flex flex-col max-h-[90vh] print:bg-white print:text-black print:border-none print:shadow-none print:max-h-none">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-b border-slate-800 flex items-center justify-between print:border-b-2 print:border-black">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-violet-500/20 border border-violet-500/30 text-violet-400 print:text-black">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-violet-400">
                Media Pembelajaran Digital Inovatif • Seminar PPG
              </span>
              <h2 className="text-lg sm:text-xl font-black text-white print:text-black">
                Buku Panduan Guru & Modul Ajar Digital
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3 print:hidden">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4 text-emerald-400" />
              <span>Cetak Modul (PDF)</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs sm:text-sm text-slate-300 print:text-black leading-relaxed">
          {/* Identitas Modul */}
          <div className="p-4 rounded-xl bg-slate-850 border border-slate-700/80 space-y-2 print:bg-gray-100 print:border-gray-400">
            <h3 className="font-bold text-white print:text-black text-base flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-violet-400" />
              Identitas Pembelajaran & Kurikulum Merdeka
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div><strong>Mata Pelajaran:</strong> Pendidikan Pancasila</div>
              <div><strong>Fase / Kelas:</strong> Fase B / Kelas 4 SD</div>
              <div><strong>Bab 2:</strong> Aku Anak yang Disiplin</div>
              <div><strong>Subtopik A:</strong> Aturan di Lingkungan Sekitar (Rumah, Sekolah, Masyarakat)</div>
              <div><strong>Model Pembelajaran:</strong> Game-Based Learning (GBL) terintegrasi Problem-Based Learning (PBL)</div>
              <div><strong>Alokasi Waktu:</strong> 2 x 35 Menit (Dapat diadaptasi sesuai RPP)</div>
            </div>
          </div>

          {/* Capaian Pembelajaran & Tujuan */}
          <div className="space-y-3">
            <h4 className="font-bold text-white print:text-black text-sm uppercase tracking-wider text-indigo-400">
              A. Capaian & Tujuan Pembelajaran
            </h4>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <p>
                <strong>Capaian Pembelajaran (Elemen UUD 1945 / Norma):</strong> Peserta didik mampu mengidentifikasi dan menerapkan aturan-aturan yang berlaku di lingkungan rumah, sekolah, dan lingkungan masyarakat sekitar, memahami pentingnya aturan, serta membiasakan perilaku disiplin dan bertanggung jawab dalam kehidupan sehari-hari.
              </p>
              <div className="pt-2">
                <strong>Tujuan Pembelajaran Khusus (10 Indikator Kunci):</strong>
                <ul className="list-disc pl-5 mt-1 space-y-1 text-xs">
                  <li>Menjelaskan makna dan fungsi aturan dalam menciptakan ketertiban hidup bersama.</li>
                  <li>Mengidentifikasi macam-macam aturan di lingkungan rumah, sekolah, dan masyarakat.</li>
                  <li>Menganalisis alasan mengapa aturan penting untuk ditegakkan dan dipatuhi.</li>
                  <li>Mengidentifikasi contoh-contoh perilaku disiplin dalam berbagai situasi nyata.</li>
                  <li>Membedakan tindakan yang mencerminkan kedisiplinan dan ketidakdisiplinan.</li>
                  <li>Menganalisis dampak serta konsekuensi dari pelanggaran aturan terhadap diri dan orang lain.</li>
                  <li>Menerapkan aturan dalam kehidupan sehari-hari secara konsisten dan berakhlak mulia.</li>
                  <li>Mengambil keputusan yang tepat berdasarkan norma hukum dan norma kesopanan.</li>
                  <li>Memecahkan masalah (problem solving) terkait ketidakdisiplinan di lingkungan sekitar.</li>
                  <li>Menumbuhkan komitmen perilaku bertanggung jawab sebagai wujud Profil Pelajar Pancasila.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Dimensi Profil Pelajar Pancasila */}
          <div className="space-y-3">
            <h4 className="font-bold text-white print:text-black text-sm uppercase tracking-wider text-indigo-400">
              B. Profil Pelajar Pancasila yang Dikembangkan
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <strong className="text-emerald-400 block mb-1">1. Mandiri</strong>
                Membiasakan regulasi diri, ketepatan waktu, dan tanggung jawab menuntaskan tugas tanpa harus selalu diawasi.
              </div>
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <strong className="text-indigo-400 block mb-1">2. Bernalar Kritis</strong>
                Menganalisis sebab-akibat pelanggaran aturan melalui 500 soal studi kasus HOTS dan penyelidikan investigasi.
              </div>
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <strong className="text-amber-400 block mb-1">3. Gotong Royong</strong>
                Bekerja sama dalam Mode Kelas Kolaboratif (2-6 kelompok) dengan 6 peran terstruktur saling melengkapi.
              </div>
            </div>
          </div>

          {/* Sintaks Pembelajaran di Kelas */}
          <div className="space-y-3">
            <h4 className="font-bold text-white print:text-black text-sm uppercase tracking-wider text-indigo-400">
              C. Sintaks Pembelajaran Berbasis Game (Game-Based Learning)
            </h4>
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 flex gap-3">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0">1</span>
                <div>
                  <strong>Tahap Orientasi & Apersepsi:</strong> Guru membuka cerita Kota Harmoni yang diserang oleh Pasukan Ketidakteraturan (littering, lateness, egoism). Siswa diajak memahami misi sebagai Civic Guardians.
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 flex gap-3">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0">2</span>
                <div>
                  <strong>Tahap Pengorganisasian Kelompok & Pembagian Peran:</strong> Siswa dibagi menjadi 2-6 kelompok dengan 1 laptop/gawai per kelompok. Siswa menyepakati 6 peran: Operator, Analis Aturan, Analis Disiplin, Pemecah Masalah, Pencatat, dan Presenter.
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 flex gap-3">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0">3</span>
                <div>
                  <strong>Tahap Investigasi & Pertempuran Strategis:</strong> Siswa memainkan level pertahanan. Setiap kali mengerahkan penjaga, kelompok bermusyawarah menjawab kartu kasus HOTS.
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 flex gap-3">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0">4</span>
                <div>
                  <strong>Tahap Penyelidikan & Pelaporan (Civic Investigation Challenge):</strong> Kelompok melengkapi 4 butir investigasi (Aturan yang dilanggar, pentingnya aturan, akibat pelanggaran, dan solusi terbaik), lalu mencetak/menyalin LKPD.
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 flex gap-3">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0">5</span>
                <div>
                  <strong>Tahap Evaluasi & Refleksi Bersama:</strong> Presenter menyampaikan temuan kelompok, guru memberikan penguatan konsep dan apresiasi bintang civic guardians.
                </div>
              </div>
            </div>
          </div>

          {/* Rubrik Penilaian Formatif */}
          <div className="space-y-3">
            <h4 className="font-bold text-white print:text-black text-sm uppercase tracking-wider text-indigo-400">
              D. Rubrik Asesmen Formatif Guru
            </h4>
            <div className="overflow-x-auto rounded-xl border border-slate-800 text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 text-[11px] uppercase">
                  <tr>
                    <th className="p-2.5">Aspek Asesmen</th>
                    <th className="p-2.5">Sangat Baik (4)</th>
                    <th className="p-2.5">Baik (3)</th>
                    <th className="p-2.5">Cukup (2)</th>
                    <th className="p-2.5">Perlu Bimbingan (1)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  <tr>
                    <td className="p-2.5 font-bold text-white">Pemahaman Aturan</td>
                    <td className="p-2.5">Mampu menganalisis seluruh aturan dan dampaknya dengan sangat tepat.</td>
                    <td className="p-2.5">Mampu mengidentifikasi aturan dengan tepat dengan sedikit bantuan.</td>
                    <td className="p-2.5">Dapat menyebutkan aturan dasar namun belum memahami akibatnya.</td>
                    <td className="p-2.5">Belum mampu membedakan aturan dan pelanggarannya.</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-white">Pengambilan Keputusan HOTS</td>
                    <td className="p-2.5">Memilih solusi terbaik secara kritis, adil, dan berakhlak mulia.</td>
                    <td className="p-2.5">Memilih keputusan yang benar dengan pertimbangan logis.</td>
                    <td className="p-2.5">Membutuhkan bimbingan teman untuk memutuskan solusi.</td>
                    <td className="p-2.5">Memilih opsi secara acak tanpa pertimbangan dampak.</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-white">Kolaborasi Kelompok</td>
                    <td className="p-2.5">Seluruh 6 peran aktif berdiskusi dan menghargai pendapat rekan.</td>
                    <td className="p-2.5">Sebagian besar anggota aktif menjalankan peran masing-masing.</td>
                    <td className="p-2.5">Hanya 1-2 siswa yang mendominasi jalannya permainan.</td>
                    <td className="p-2.5">Terjadi perselisihan dan peran tidak berjalan tertib.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between print:hidden">
          <span className="text-xs text-slate-400">
            Disusun untuk inovasi pembelajaran PPG Prajabatan / Dalam Jabatan
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
          >
            Tutup Panduan
          </button>
        </div>
      </div>
    </div>
  );
};
