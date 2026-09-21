import React, { useState } from 'react';
import { ClassroomGroup } from '../types/game';
import { 
  Users2, 
  Crown, 
  Sparkles, 
  UserCheck, 
  Timer, 
  FileSpreadsheet, 
  Copy, 
  Check, 
  Play, 
  Plus, 
  Trash2, 
  ArrowLeft
} from 'lucide-react';

interface ClassroomMultiplayerProps {
  onStartGroupGame: (group: ClassroomGroup) => void;
  onOpenMultiDeviceMabar?: () => void;
  onOpenTeacherDashboard?: () => void;
  onBack: () => void;
}

const DEFAULT_GROUPS: ClassroomGroup[] = [
  {
    id: 'grp_1',
    name: 'Kelompok 1: Gotong Royong',
    color: '#10b981',
    score: 120,
    correctAnswers: 6,
    wrongAnswers: 0,
    investigationsCompleted: 2,
    roles: {
      operator: 'Ahmad (Operator Layar)',
      ruleAnalyst: 'Siti (Analis Aturan)',
      disciplineAnalyst: 'Budi (Analis Disiplin)',
      problemSolver: 'Dewi (Pemecah Masalah)',
      recorder: 'Eko (Pencatat Kasus)',
      presenter: 'Fani (Juru Bicara)',
    },
  },
  {
    id: 'grp_2',
    name: 'Kelompok 2: Tanggung Jawab',
    color: '#3b82f6',
    score: 105,
    correctAnswers: 5,
    wrongAnswers: 1,
    investigationsCompleted: 2,
    roles: {
      operator: 'Gilang (Operator Layar)',
      ruleAnalyst: 'Hana (Analis Aturan)',
      disciplineAnalyst: 'Indra (Analis Disiplin)',
      problemSolver: 'Joko (Pemecah Masalah)',
      recorder: 'Kartika (Pencatat Kasus)',
      presenter: 'Lina (Juru Bicara)',
    },
  },
  {
    id: 'grp_3',
    name: 'Kelompok 3: Kejujuran & Disiplin',
    color: '#f59e0b',
    score: 90,
    correctAnswers: 4,
    wrongAnswers: 1,
    investigationsCompleted: 1,
    roles: {
      operator: 'Mega (Operator Layar)',
      ruleAnalyst: 'Naufal (Analis Aturan)',
      disciplineAnalyst: 'Olga (Analis Disiplin)',
      problemSolver: 'Putri (Pemecah Masalah)',
      recorder: 'Qori (Pencatat Kasus)',
      presenter: 'Rafi (Juru Bicara)',
    },
  },
  {
    id: 'grp_4',
    name: 'Kelompok 4: Keadilan & Toleransi',
    color: '#8b5cf6',
    score: 85,
    correctAnswers: 4,
    wrongAnswers: 2,
    investigationsCompleted: 1,
    roles: {
      operator: 'Sultan (Operator Layar)',
      ruleAnalyst: 'Tia (Analis Aturan)',
      disciplineAnalyst: 'Umar (Analis Disiplin)',
      problemSolver: 'Vina (Pemecah Masalah)',
      recorder: 'Wahyu (Pencatat Kasus)',
      presenter: 'Yuni (Juru Bicara)',
    },
  },
];

export const ClassroomMultiplayer: React.FC<ClassroomMultiplayerProps> = ({
  onStartGroupGame,
  onOpenMultiDeviceMabar,
  onOpenTeacherDashboard,
  onBack,
}) => {
  const [roomCode, setRoomCode] = useState('PANCASILA4A');
  const [copied, setCopied] = useState(false);
  const [groups, setGroups] = useState<ClassroomGroup[]>(DEFAULT_GROUPS);
  const [selectedGroup, setSelectedGroup] = useState<ClassroomGroup>(groups[0]);
  const [activeTab, setActiveTab] = useState<'lobby' | 'roles' | 'leaderboard'>('lobby');

  const handleCopyCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddGroup = () => {
    if (groups.length >= 6) return;
    const num = groups.length + 1;
    const colors = ['#ec4899', '#06b6d4', '#84cc16'];
    const newGrp: ClassroomGroup = {
      id: `grp_${num}`,
      name: `Kelompok ${num}: Budi Pekerti`,
      color: colors[(num - 5) % colors.length] || '#f43f5e',
      score: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
      investigationsCompleted: 0,
      roles: {
        operator: `Siswa A (Operator)`,
        ruleAnalyst: `Siswa B (Analis Aturan)`,
        disciplineAnalyst: `Siswa C (Analis Disiplin)`,
        problemSolver: `Siswa D (Pemecah Masalah)`,
        recorder: `Siswa E (Pencatat)`,
        presenter: `Siswa F (Presenter)`,
      },
    };
    setGroups([...groups, newGrp]);
    setSelectedGroup(newGrp);
  };

  const handleRemoveGroup = (id: string) => {
    if (groups.length <= 2) return;
    const updated = groups.filter((g) => g.id !== id);
    setGroups(updated);
    if (selectedGroup.id === id) {
      setSelectedGroup(updated[0]);
    }
  };

  const handleRoleChange = (roleKey: keyof ClassroomGroup['roles'], value: string) => {
    const updatedGroup = {
      ...selectedGroup,
      roles: {
        ...selectedGroup.roles,
        [roleKey]: value,
      },
    };
    setSelectedGroup(updatedGroup);
    setGroups(groups.map((g) => (g.id === updatedGroup.id ? updatedGroup : g)));
  };

  const handlePrintAssessment = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 flex flex-col">
      {/* Top Header */}
      <div className="max-w-6xl w-full mx-auto flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-wide">
                Mode Pembelajaran Kelas Kolaboratif
              </span>
              <span className="text-xs text-slate-400">2 - 6 Kelompok Peserta Didik</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <Users2 className="w-6 h-6 text-indigo-400" />
              Ruang Kelas Kolaborasi Civic Guardians
            </h1>
          </div>
        </div>

        {/* Teacher Dashboard & Multi-Device Buttons */}
        <div className="flex items-center gap-2">
          {onOpenTeacherDashboard && (
            <button
              onClick={onOpenTeacherDashboard}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 border border-indigo-400/40 transition-all hover:scale-102"
            >
              <Crown className="w-4 h-4 text-amber-300" />
              <span>Dasbor Guru (Host)</span>
            </button>
          )}

          {onOpenMultiDeviceMabar && (
            <button
              onClick={onOpenMultiDeviceMabar}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/30 border border-emerald-400/40 transition-all hover:scale-102"
            >
              <Users2 className="w-4 h-4" />
              <span>Mabar Multi-Device (5–10 Kelompok)</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </button>
          )}
        </div>

        {/* Room Code Card */}
        <div className="flex items-center gap-3 bg-slate-900 border border-slate-700/80 px-4 py-2.5 rounded-2xl shadow-md">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Kode Ruang Kelas:</div>
            <div className="text-lg font-mono font-black text-emerald-400 tracking-wider">
              {roomCode}
            </div>
          </div>
          <button
            onClick={handleCopyCode}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 transition-colors"
            title="Salin Kode Ruang"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
          <button
            onClick={() => {
              const codes = ['PANCASILA4A', 'DISIPLIN4B', 'HARMONI4C', 'GOTONG4D'];
              setRoomCode(codes[Math.floor(Math.random() * codes.length)] + Math.floor(Math.random() * 90 + 10));
            }}
            className="text-[11px] text-indigo-400 hover:text-indigo-300 underline font-medium"
          >
            Ubah
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-6xl w-full mx-auto flex items-center gap-2 pt-4">
        <button
          onClick={() => setActiveTab('lobby')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'lobby'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950'
              : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
          }`}
        >
          Pilih Kelompok & Mulai
        </button>
        <button
          onClick={() => setActiveTab('roles')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'roles'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950'
              : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
          }`}
        >
          Struktur Peran (6 Peran Siswa)
        </button>
        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'leaderboard'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950'
              : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
          }`}
        >
          Papan Skor & Rubrik Penilaian
        </button>
      </div>

      {/* Tab 1: Lobby */}
      {activeTab === 'lobby' && (
        <div className="max-w-6xl w-full mx-auto py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Groups List */}
          <div className="lg:col-span-1 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
                Daftar Kelompok ({groups.length}/6)
              </h2>
              {groups.length < 6 && (
                <button
                  onClick={handleAddGroup}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Tambah
                </button>
              )}
            </div>

            <div className="space-y-2.5">
              {groups.map((grp) => (
                <div
                  key={grp.id}
                  onClick={() => setSelectedGroup(grp)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    selectedGroup.id === grp.id
                      ? 'bg-slate-800/90 border-indigo-500 ring-2 ring-indigo-500/40 shadow-lg'
                      : 'bg-slate-900/60 border-slate-800 hover:bg-slate-850 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-3.5 h-3.5 rounded-full"
                      style={{ backgroundColor: grp.color }}
                    />
                    <div>
                      <div className="font-bold text-sm text-white">{grp.name}</div>
                      <div className="text-xs text-slate-400">
                        Skor: <span className="text-amber-400 font-semibold">{grp.score}</span> • Benar: {grp.correctAnswers}
                      </div>
                    </div>
                  </div>

                  {groups.length > 2 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveGroup(grp.id);
                      }}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/40"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Selected Group Active Overview */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase">Kelompok Aktif Saat Ini</span>
                <h3 className="text-2xl font-black text-white flex items-center gap-2">
                  <span
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: selectedGroup.color }}
                  />
                  {selectedGroup.name}
                </h3>
              </div>

              <button
                onClick={() => onStartGroupGame(selectedGroup)}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 font-bold text-white shadow-lg shadow-emerald-950/60 flex items-center gap-2"
              >
                <Play className="w-5 h-5 fill-white" />
                <span>Mulai Sesi Permainan Kelompok</span>
              </button>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <span className="text-xs text-slate-400">Total Skor Harmoni:</span>
                <div className="text-xl font-bold text-amber-400">{selectedGroup.score}</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <span className="text-xs text-slate-400">Soal HOTS Benar:</span>
                <div className="text-xl font-bold text-emerald-400">{selectedGroup.correctAnswers}</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <span className="text-xs text-slate-400">Laporan Selesai:</span>
                <div className="text-xl font-bold text-indigo-400">{selectedGroup.investigationsCompleted}</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <span className="text-xs text-slate-400">Akurasi Tim:</span>
                <div className="text-xl font-bold text-cyan-400">
                  {selectedGroup.correctAnswers + selectedGroup.wrongAnswers > 0
                    ? `${Math.round(
                        (selectedGroup.correctAnswers /
                          (selectedGroup.correctAnswers + selectedGroup.wrongAnswers)) *
                          100
                      )}%`
                    : '100%'}
                </div>
              </div>
            </div>

            {/* Collaborative Roles Preview */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Anggota & Pembagian 6 Peran di Laptop Kelompok
                </h4>
                <button
                  onClick={() => setActiveTab('roles')}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
                >
                  Edit Nama Anggota &rarr;
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/60 flex items-center justify-between">
                  <span className="text-slate-400 font-medium">1. Operator:</span>
                  <span className="font-bold text-white">{selectedGroup.roles.operator}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/60 flex items-center justify-between">
                  <span className="text-slate-400 font-medium">2. Analis Aturan:</span>
                  <span className="font-bold text-white">{selectedGroup.roles.ruleAnalyst}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/60 flex items-center justify-between">
                  <span className="text-slate-400 font-medium">3. Analis Disiplin:</span>
                  <span className="font-bold text-white">{selectedGroup.roles.disciplineAnalyst}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/60 flex items-center justify-between">
                  <span className="text-slate-400 font-medium">4. Pemecah Masalah:</span>
                  <span className="font-bold text-white">{selectedGroup.roles.problemSolver}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/60 flex items-center justify-between">
                  <span className="text-slate-400 font-medium">5. Pencatat (Recorder):</span>
                  <span className="font-bold text-white">{selectedGroup.roles.recorder}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/60 flex items-center justify-between">
                  <span className="text-slate-400 font-medium">6. Juru Bicara (Presenter):</span>
                  <span className="font-bold text-white">{selectedGroup.roles.presenter}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Roles Configuration */}
      {activeTab === 'roles' && (
        <div className="max-w-4xl w-full mx-auto py-6 space-y-6">
          <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-xs sm:text-sm text-indigo-200">
            <strong>Petunjuk Guru / Fasilitator:</strong> Setiap kelompok beranggotakan 4-6 siswa dengan 1 laptop. Bagikan peran di bawah ini secara bergantian agar semua peserta didik aktif berdiskusi dan berpartisipasi dalam pengambilan keputusan.
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Konfigurasi Nama Siswa - {selectedGroup.name}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <label className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4" />
                  1. Operator (Pengendali Layar & Mouse)
                </label>
                <p className="text-[11px] text-slate-400">Bertugas mengklik, menempatkan penjaga, dan memungut energi harmoni.</p>
                <input
                  type="text"
                  value={selectedGroup.roles.operator}
                  onChange={(e) => handleRoleChange('operator', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm text-white"
                />
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <label className="text-xs font-bold text-indigo-400 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4" />
                  2. Rule Analyst (Analis Aturan)
                </label>
                <p className="text-[11px] text-slate-400">Membaca skenario kasus dan mengidentifikasi aturan apa yang dilanggar.</p>
                <input
                  type="text"
                  value={selectedGroup.roles.ruleAnalyst}
                  onChange={(e) => handleRoleChange('ruleAnalyst', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm text-white"
                />
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <label className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4" />
                  3. Discipline Analyst (Analis Disiplin)
                </label>
                <p className="text-[11px] text-slate-400">Mengevaluasi dampak ketidakdisiplinan dan akibat yang ditimbulkan.</p>
                <input
                  type="text"
                  value={selectedGroup.roles.disciplineAnalyst}
                  onChange={(e) => handleRoleChange('disciplineAnalyst', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm text-white"
                />
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <label className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4" />
                  4. Problem Solver (Pemecah Masalah)
                </label>
                <p className="text-[11px] text-slate-400">Menentukan tindakan nyata dan alternatif solusi terbaik untuk kasus.</p>
                <input
                  type="text"
                  value={selectedGroup.roles.problemSolver}
                  onChange={(e) => handleRoleChange('problemSolver', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm text-white"
                />
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <label className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4" />
                  5. Recorder (Pencatat Kasus & Laporan LKPD)
                </label>
                <p className="text-[11px] text-slate-400">Menuliskan simpulan investigasi ke lembar kerja kelompok.</p>
                <input
                  type="text"
                  value={selectedGroup.roles.recorder}
                  onChange={(e) => handleRoleChange('recorder', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm text-white"
                />
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <label className="text-xs font-bold text-violet-400 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4" />
                  6. Presenter (Juru Bicara Kelas)
                </label>
                <p className="text-[11px] text-slate-400">Menyampaikan laporan investigasi kepada guru dan teman sekelas.</p>
                <input
                  type="text"
                  value={selectedGroup.roles.presenter}
                  onChange={(e) => handleRoleChange('presenter', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm text-white"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Leaderboard & Teacher Assessment */}
      {activeTab === 'leaderboard' && (
        <div className="max-w-5xl w-full mx-auto py-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-400" />
                Papan Skor & Rekap Hasil Belajar Kelas
              </h3>
              <p className="text-xs text-slate-400">Asesmen Formatif Pembelajaran Pendidikan Pancasila Bab 2</p>
            </div>

            <button
              onClick={handlePrintAssessment}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 flex items-center gap-2"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Cetak Rekap Nilai Asesmen (PDF)</span>
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Peringkat</th>
                  <th className="py-3.5 px-4">Nama Kelompok</th>
                  <th className="py-3.5 px-4">Skor Harmoni</th>
                  <th className="py-3.5 px-4">Soal HOTS Benar</th>
                  <th className="py-3.5 px-4">Salah</th>
                  <th className="py-3.5 px-4">Investigasi Tuntas</th>
                  <th className="py-3.5 px-4 text-center">Predikat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {[...groups]
                  .sort((a, b) => b.score - a.score)
                  .map((grp, rank) => (
                    <tr key={grp.id} className="hover:bg-slate-800/40">
                      <td className="py-3.5 px-4 font-bold text-center w-16">
                        {rank === 0 ? (
                          <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 inline-flex items-center justify-center font-bold">1</span>
                        ) : rank === 1 ? (
                          <span className="w-6 h-6 rounded-full bg-slate-400/20 text-slate-300 inline-flex items-center justify-center font-bold">2</span>
                        ) : (
                          <span className="w-6 h-6 rounded-full bg-amber-700/20 text-amber-600 inline-flex items-center justify-center font-bold">{rank + 1}</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: grp.color }} />
                        {grp.name}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-amber-400">{grp.score}</td>
                      <td className="py-3.5 px-4 text-emerald-400 font-semibold">{grp.correctAnswers}</td>
                      <td className="py-3.5 px-4 text-rose-400 font-semibold">{grp.wrongAnswers}</td>
                      <td className="py-3.5 px-4 text-indigo-300">{grp.investigationsCompleted} Level</td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          Sangat Disiplin
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
