import React, { useState, useEffect, useMemo } from 'react';
import { 
  ClassroomRoom, 
  MultiRoomGroup, 
  GroupAssessmentReport 
} from '../types/game';
import { multiplayerClient } from '../utils/multiplayerClient';
import { soundManager } from '../utils/audio';
import { ClassroomProgressMap } from './ClassroomProgressMap';
import { EndOfGameReportModal } from './EndOfGameReportModal';
import { ClassroomScreenMode } from './ClassroomScreenMode';
import { 
  Users2, 
  Trophy, 
  Sparkles, 
  Star, 
  ShieldCheck, 
  AlertTriangle, 
  HelpCircle, 
  Send, 
  Radio, 
  Maximize2, 
  FileSpreadsheet, 
  Play, 
  RotateCcw, 
  Copy, 
  Check, 
  ChevronRight, 
  Volume2, 
  CheckCircle2, 
  X,
  MessageSquare,
  ArrowLeft,
  Flame,
  Plus
} from 'lucide-react';

interface TeacherDashboardProps {
  onBack: () => void;
}

const PRESET_ROOMS = ['KELAS-4A', 'KELAS-4B', 'IVC-PANCASILA', 'CG-12345'];

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onBack }) => {
  const [selectedRoomCode, setSelectedRoomCode] = useState<string>('KELAS-4A');
  const [customRoomInput, setCustomRoomInput] = useState<string>('');
  const [teacherNameInput, setTeacherNameInput] = useState<string>('Ibu Guru Pancasila');
  const [room, setRoom] = useState<ClassroomRoom | null>(null);
  const [broadcastMessage, setBroadcastMessage] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'monitoring' | 'progress_map'>('monitoring');

  // Modals
  const [isScreenModeOpen, setIsScreenModeOpen] = useState<boolean>(false);
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);
  const [assessmentData, setAssessmentData] = useState<GroupAssessmentReport[]>([]);
  const [selectedGroupForHelp, setSelectedGroupForHelp] = useState<MultiRoomGroup | null>(null);
  const [teacherHintText, setTeacherHintText] = useState<string>('Semangat! Utamakan musyawarah dan perhatikan tata tertib!');

  // Initialize or fetch room
  useEffect(() => {
    multiplayerClient.createOrJoinRoom(selectedRoomCode, undefined, teacherNameInput).then((r) => {
      if (r) setRoom(r);
    });

    const unsub = multiplayerClient.onRoomUpdate((updatedRoom) => {
      setRoom(updatedRoom);
    });

    const timer = setInterval(() => {
      multiplayerClient.fetchRoomState(selectedRoomCode);
    }, 2500);

    return () => {
      unsub();
      clearInterval(timer);
    };
  }, [selectedRoomCode, teacherNameInput]);

  const handleSwitchRoom = async (code: string) => {
    soundManager.playButton();
    const clean = code.toUpperCase().trim();
    setSelectedRoomCode(clean);
    const r = await multiplayerClient.createOrJoinRoom(clean, undefined, teacherNameInput);
    if (r) setRoom(r);
  };

  const handleCreateCustomRoom = async () => {
    if (!customRoomInput.trim()) return;
    soundManager.playDeploy();
    await handleSwitchRoom(customRoomInput);
    setCustomRoomInput('');
  };

  const handleCopyShareLink = () => {
    soundManager.playButton();
    const shareUrl = `${window.location.origin}${window.location.pathname}?room=${selectedRoomCode}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return;
    soundManager.playSpecial();
    await multiplayerClient.sendTeacherBroadcast(broadcastMessage);
    setBroadcastMessage('');
  };

  const handleSendAssistanceToGroup = async (group: MultiRoomGroup) => {
    soundManager.playSpecial();
    await multiplayerClient.sendTeacherAssist(
      group.id,
      teacherHintText || 'Bantuan Guru: +50 Harmoni & Perlindungan Disiplin',
      50
    );
    setSelectedGroupForHelp(null);
  };

  const handleOpenReport = async () => {
    soundManager.playButton();
    const rep = await multiplayerClient.getAssessmentReport(selectedRoomCode);
    if (rep) {
      setAssessmentData(rep.groupsReport);
      setIsReportOpen(true);
    }
  };

  const handleHostReset = async () => {
    soundManager.playAlarm();
    await multiplayerClient.hostReset();
  };

  const groupsList: MultiRoomGroup[] = useMemo(() => {
    if (!room) return [];
    return Object.values(room.groups).sort((a, b) => {
      if (b.stars !== a.stars) return b.stars - a.stars;
      return b.score - a.score;
    });
  }, [room]);

  // Insights
  const leadingGroup = groupsList[0];
  const supportNeededGroups = groupsList.filter((g) => g.needsSupport);
  const stuckGroups = groupsList.filter((g) => g.isStuck);
  const totalStarsClass = groupsList.reduce((acc, g) => acc + (g.stars || 0), 0);
  const totalQuestions = groupsList.reduce((acc, g) => acc + (g.hotsAttempted || 0), 0);
  const totalCorrect = groupsList.reduce((acc, g) => acc + (g.hotsCorrect || 0), 0);
  const avgAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 100;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <header className="px-5 py-4 bg-slate-900 border-b border-indigo-500/30 shadow-lg sticky top-0 z-30 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            title="Kembali ke Menu Utama"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="w-10 h-10 rounded-2xl bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center text-indigo-300">
            <Radio className="w-5 h-5 animate-pulse text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-black uppercase tracking-wider">
                HOST MODE: GURU
              </span>
              <span className="text-xs text-slate-400">
                Monitoring 2–10 Kelompok Siswa
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-black text-white tracking-tight">
              DASBOR GURU: CIVIC GUARDIANS
            </h1>
          </div>
        </div>

        {/* Room Code & Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Quick Room Code Switcher */}
          <div className="flex items-center gap-1.5 bg-slate-800/90 border border-slate-700 px-3 py-1.5 rounded-2xl">
            <span className="text-xs text-slate-400 font-bold">Ruang:</span>
            <div className="flex gap-1">
              {PRESET_ROOMS.map((code) => (
                <button
                  key={code}
                  onClick={() => handleSwitchRoom(code)}
                  className={`px-2 py-0.5 rounded-lg text-xs font-bold transition ${
                    selectedRoomCode === code
                      ? 'bg-amber-400 text-slate-950 shadow'
                      : 'text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {code}
                </button>
              ))}
            </div>
          </div>

          {/* Copy link */}
          <button
            onClick={handleCopyShareLink}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition active:scale-95"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedLink ? 'Link Tersalin!' : 'Salin Kode'}
          </button>

          {/* Projector Screen Mode Button */}
          <button
            onClick={() => setIsScreenModeOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-xs font-black shadow-lg shadow-indigo-600/30 transition active:scale-95"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            Layar Proyektor
          </button>

          {/* End Session & Assessment Report */}
          <button
            onClick={handleOpenReport}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black shadow-lg shadow-emerald-600/30 transition active:scale-95"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            Laporan Asesmen
          </button>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 p-4 sm:p-6 max-w-7xl mx-auto w-full space-y-6">
        {/* KPI & Instant Alert Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4">
          {/* Total Groups */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 block font-semibold">Total Kelompok</span>
              <span className="text-2xl font-black text-white">{groupsList.length}</span>
              <span className="text-[10px] text-slate-500 block">Kapasitas 2–10 tim</span>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Users2 className="w-6 h-6" />
            </div>
          </div>

          {/* Leading Group */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-950/40 to-slate-900 border border-amber-500/30 shadow flex items-center justify-between">
            <div className="truncate">
              <span className="text-xs text-amber-400 font-bold block flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5" />
                Memimpin (Rank 1)
              </span>
              <span className="text-lg font-black text-white block truncate">
                {leadingGroup ? leadingGroup.name : 'Belum ada'}
              </span>
              <span className="text-[10px] text-amber-300/80 block">
                {leadingGroup ? `${leadingGroup.stars} ⭐ • ${leadingGroup.score} Pts` : '-'}
              </span>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
              🥇
            </div>
          </div>

          {/* Average Class Accuracy */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 block font-semibold">Rerata Akurasi Norma</span>
              <span className="text-2xl font-black text-emerald-400">{avgAccuracy}%</span>
              <span className="text-[10px] text-slate-500 block">
                {totalCorrect}/{totalQuestions} Soal HOTS
              </span>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </div>

          {/* Attention Needed Alert */}
          <div className={`p-4 rounded-2xl border shadow flex items-center justify-between transition ${
            supportNeededGroups.length > 0 || stuckGroups.length > 0
              ? 'bg-rose-950/30 border-rose-500/40 animate-pulse'
              : 'bg-slate-900 border-slate-800'
          }`}>
            <div>
              <span className="text-xs font-bold block text-rose-400 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                Perlu Perhatian Guru
              </span>
              <span className="text-2xl font-black text-white">
                {supportNeededGroups.length + stuckGroups.length}
              </span>
              <span className="text-[10px] text-slate-400 block">
                {supportNeededGroups.length} butuh bantuan • {stuckGroups.length} terhambat
              </span>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
              <HelpCircle className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* View Mode Navigation (Monitoring Table vs Live Progress Map) */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('monitoring')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'monitoring'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              📊 Tabel Monitoring Kelompok
            </button>
            <button
              onClick={() => setActiveTab('progress_map')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'progress_map'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              🗺️ Peta Perjalanan Langsung (Progress Map)
            </button>
          </div>

          {/* Teacher Broadcast Form */}
          <form onSubmit={handleSendBroadcast} className="flex items-center gap-2">
            <input
              type="text"
              value={broadcastMessage}
              onChange={(e) => setBroadcastMessage(e.target.value)}
              placeholder="Kirim instruksi suara/teks ke semua siswa..."
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-64"
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-1"
            >
              <Send className="w-3 h-3" />
              Siarkan
            </button>
          </form>
        </div>

        {/* TAB 1: Monitoring Grid Table */}
        {activeTab === 'monitoring' && (
          <div className="space-y-4">
            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-950/80 text-slate-400 border-b border-slate-800 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3.5 px-3 text-center w-12">Rank</th>
                    <th className="py-3.5 px-4">Kelompok & Siswa</th>
                    <th className="py-3.5 px-3 text-center">Bintang ⭐</th>
                    <th className="py-3.5 px-3 text-center">Harmoni 💎</th>
                    <th className="py-3.5 px-3.5">Dunia & Level 🎮</th>
                    <th className="py-3.5 px-3 text-center">Soal (✅/❌)</th>
                    <th className="py-3.5 px-3 text-center">Waktu ⏱</th>
                    <th className="py-3.5 px-3 text-center">Status</th>
                    <th className="py-3.5 px-3 text-center">Aksi Bantuan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-200">
                  {groupsList.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-slate-500">
                        <Users2 className="w-10 h-10 mx-auto mb-2 text-slate-600 animate-pulse" />
                        <span className="text-sm font-semibold text-slate-400 block">
                          Belum ada kelompok yang terhubung di ruang {selectedRoomCode}
                        </span>
                        <span className="text-xs text-slate-600 block mt-1">
                          Ajak siswa memasukkan kode ruangan "{selectedRoomCode}" di perangkat mereka
                        </span>
                      </td>
                    </tr>
                  ) : (
                    groupsList.map((grp, index) => {
                      const totalQ = grp.hotsAttempted || 0;
                      const correctQ = grp.hotsCorrect || 0;
                      const wrongQ = grp.wrongAnswers || Math.max(0, totalQ - correctQ);
                      const acc = totalQ > 0 ? Math.round((correctQ / totalQ) * 100) : 100;
                      const isGold = index === 0;

                      const minutes = Math.floor((grp.timePlayedSeconds || 0) / 60);
                      const seconds = (grp.timePlayedSeconds || 0) % 60;
                      const timeStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;

                      return (
                        <tr
                          key={grp.id}
                          className={`hover:bg-slate-800/40 transition ${
                            grp.needsSupport
                              ? 'bg-rose-950/15'
                              : grp.isStuck
                              ? 'bg-amber-950/15'
                              : isGold
                              ? 'bg-amber-500/5'
                              : ''
                          }`}
                        >
                          {/* Rank */}
                          <td className="py-3 px-3 text-center font-black">
                            {isGold ? (
                              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-400 text-slate-950 font-black shadow">
                                1
                              </span>
                            ) : index === 1 ? (
                              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-300 text-slate-950 font-bold">
                                2
                              </span>
                            ) : index === 2 ? (
                              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-700 text-white font-bold">
                                3
                              </span>
                            ) : (
                              <span className="text-slate-400">#{index + 1}</span>
                            )}
                          </td>

                          {/* Group Name & Members */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <span
                                className="w-3 h-3 rounded-full shrink-0"
                                style={{ backgroundColor: grp.color }}
                              />
                              <span className="font-black text-white text-sm">
                                {grp.name}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-400 mt-0.5 truncate max-w-xs">
                              {grp.members.join(', ')}
                            </div>
                          </td>

                          {/* Civic Stars */}
                          <td className="py-3 px-3 text-center">
                            <span className="font-black text-amber-300 text-sm flex items-center justify-center gap-1">
                              <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                              {grp.stars || 0}
                            </span>
                          </td>

                          {/* Harmony Points */}
                          <td className="py-3 px-3 text-center">
                            <span className="font-bold text-indigo-300 text-xs">
                              💎 {grp.harmony || 0}
                            </span>
                          </td>

                          {/* Current World & Level */}
                          <td className="py-3 px-3.5">
                            <div className="font-bold text-slate-200">
                              {grp.currentLevelTitle || `Level ${grp.currentLevelId || 1}`}
                            </div>
                            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                              {grp.currentWorld === 'world1'
                                ? '🏠 Home Territory'
                                : grp.currentWorld === 'world2'
                                ? '🏫 School Defense'
                                : grp.currentWorld === 'world3'
                                ? '🌳 Community Protector'
                                : '🛣 Final World'}
                            </span>
                          </td>

                          {/* Questions Answered */}
                          <td className="py-3 px-3 text-center">
                            <div className="font-bold">
                              <span className="text-emerald-400">{correctQ} ✅</span>{' '}
                              <span className="text-slate-500">/</span>{' '}
                              <span className="text-rose-400">{wrongQ} ❌</span>
                            </div>
                            <span className="text-[10px] text-slate-400">
                              Akurasi: {acc}%
                            </span>
                          </td>

                          {/* Time Played */}
                          <td className="py-3 px-3 text-center font-mono text-slate-300">
                            {timeStr}
                          </td>

                          {/* Status Badge */}
                          <td className="py-3 px-3 text-center">
                            {grp.needsSupport ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-black animate-pulse">
                                <HelpCircle className="w-3 h-3" />
                                Butuh Bimbingan
                              </span>
                            ) : grp.isStuck ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-black">
                                <AlertTriangle className="w-3 h-3" />
                                Terhambat Level
                              </span>
                            ) : isGold ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] font-black">
                                🥇 Memimpin
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[10px] font-bold">
                                🟢 Lancar
                              </span>
                            )}
                          </td>

                          {/* Teacher Action Button */}
                          <td className="py-3 px-3 text-center">
                            <button
                              onClick={() => setSelectedGroupForHelp(grp)}
                              className="px-2.5 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600 text-indigo-200 hover:text-white border border-indigo-500/40 text-[11px] font-bold transition active:scale-95"
                            >
                              Beri Bantuan 🎁
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Custom Room Creation Box */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-300">Buka Ruangan Baru Khusus:</span>
                <input
                  type="text"
                  value={customRoomInput}
                  onChange={(e) => setCustomRoomInput(e.target.value)}
                  placeholder="Contoh: KELAS-4B, IVC-PANCASILA"
                  className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white uppercase focus:outline-none focus:border-indigo-500 w-52"
                />
                <button
                  onClick={handleCreateCustomRoom}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition"
                >
                  <Plus className="w-3.5 h-3.5 inline mr-1" />
                  Buat Ruangan
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleHostReset}
                  className="text-rose-400 hover:text-rose-300 font-semibold transition"
                >
                  Reset Nilai Sesi Ruangan Ini
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Live Progress Map */}
        {activeTab === 'progress_map' && (
          <ClassroomProgressMap
            groups={groupsList}
            onSelectGroup={(grp) => setSelectedGroupForHelp(grp)}
          />
        )}
      </main>

      {/* Teacher Help Intervention Modal */}
      {selectedGroupForHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-slate-900 border border-indigo-500/40 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                Beri Dukungan Guru: {selectedGroupForHelp.name}
              </h3>
              <button
                onClick={() => setSelectedGroupForHelp(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Kirim energi harmoni bonus (+50 💎) dan petunjuk bimbingan norma Pancasila langsung ke layar siswa!
            </p>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Pesan / Petunjuk Bimbingan:
              </label>
              <textarea
                value={teacherHintText}
                onChange={(e) => setTeacherHintText(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedGroupForHelp(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                Batal
              </button>
              <button
                onClick={() => handleSendAssistanceToGroup(selectedGroupForHelp)}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black shadow-lg"
              >
                Kirim +50 Harmoni & Petunjuk ✨
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Classroom Screen Mode Modal (Projector View) */}
      {isScreenModeOpen && (
        <ClassroomScreenMode
          roomCode={selectedRoomCode}
          onClose={() => setIsScreenModeOpen(false)}
        />
      )}

      {/* End of Game Assessment Report Modal */}
      {isReportOpen && (
        <EndOfGameReportModal
          roomCode={selectedRoomCode}
          roomTitle={room?.title || `Ruang ${selectedRoomCode}`}
          teacherName={teacherNameInput}
          reportList={assessmentData}
          onClose={() => setIsReportOpen(false)}
          onNewSession={handleHostReset}
        />
      )}
    </div>
  );
};
