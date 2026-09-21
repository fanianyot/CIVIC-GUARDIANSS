import React, { useState, useEffect } from 'react';
import { 
  multiplayerClient, 
  ClassroomRoom, 
  PRESET_GROUPS 
} from '../utils/multiplayerClient';
import { 
  Users2, 
  Wifi, 
  Trophy, 
  Swords, 
  Sparkles, 
  Send, 
  HeartHandshake, 
  ShieldCheck, 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  Copy, 
  Check, 
  X,
  Radio,
  Flame
} from 'lucide-react';
import { soundManager } from '../utils/audio';

interface MultiDeviceMabarModalProps {
  onStartBattle: (groupId: string, roomCode: string) => void;
  onClose: () => void;
}

export function MultiDeviceMabarModal({ onStartBattle, onClose }: MultiDeviceMabarModalProps) {
  const [roomCodeInput, setRoomCodeInput] = useState('GARUDA');
  const [room, setRoom] = useState<ClassroomRoom | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<string>('kelompok_1');
  const [memberNamesInput, setMemberNamesInput] = useState<string>('Ahmad, Siti, Budi');
  const [isJoined, setIsJoined] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [assistanceNotice, setAssistanceNotice] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'lobby' | 'leaderboard' | 'activity'>('lobby');

  // Check URL parameters for room code
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const codeParam = params.get('room');
    if (codeParam) {
      setRoomCodeInput(codeParam.toUpperCase());
    }

    // Auto-fetch default room
    multiplayerClient.createOrJoinRoom('GARUDA').then((r) => {
      if (r) setRoom(r);
    });

    // Listen to real-time room updates
    const unsubRoom = multiplayerClient.onRoomUpdate((updatedRoom) => {
      setRoom(updatedRoom);
      const myId = multiplayerClient.getCurrentGroupId();
      if (myId && updatedRoom.groups[myId]) {
        setIsJoined(true);
      }
    });

    // Listen to assistance received from other groups
    const unsubHelp = multiplayerClient.onAssistanceReceived((help) => {
      soundManager.playCorrect();
      setAssistanceNotice(`Terima kasih! Kelompok Anda menerima ${help.helpType} dari ${help.fromGroupName}!`);
      setTimeout(() => setAssistanceNotice(null), 5000);
    });

    return () => {
      unsubRoom();
      unsubHelp();
    };
  }, []);

  const handleCreateOrJoinRoom = async () => {
    soundManager.playButton();
    const cleanCode = roomCodeInput.toUpperCase().trim() || 'GARUDA';
    const r = await multiplayerClient.createOrJoinRoom(cleanCode);
    if (r) setRoom(r);
  };

  const handleConfirmJoinGroup = async () => {
    soundManager.playDeploy();
    const cleanCode = roomCodeInput.toUpperCase().trim() || 'GARUDA';
    const preset = PRESET_GROUPS.find((g) => g.id === selectedGroupId);
    const members = memberNamesInput.split(',').map((s) => s.trim()).filter(Boolean);

    const updated = await multiplayerClient.joinGroup(
      cleanCode,
      selectedGroupId,
      preset?.name || 'Kelompok Pancasila',
      members.length > 0 ? members : ['Anggota 1', 'Anggota 2']
    );

    if (updated) {
      setRoom(updated);
      setIsJoined(true);
    }
  };

  const handleSendHelp = (targetGroupId: string) => {
    soundManager.playSpecial();
    multiplayerClient.sendAction('send_help', {
      targetGroupId,
      helpType: 'Energi Harmoni (+50) & Perlindungan Disiplin',
    });
  };

  const handleSendEmote = (emoteText: string) => {
    soundManager.playButton();
    multiplayerClient.sendAction('send_emote', { emote: emoteText });
  };

  const handleHostStart = () => {
    soundManager.playAlarm();
    multiplayerClient.sendAction('host_start');
    onStartBattle(selectedGroupId, room?.code || 'GARUDA');
  };

  const handleHostReset = () => {
    soundManager.playButton();
    multiplayerClient.sendAction('host_reset');
  };

  const handleCopyCode = () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?room=${room?.code || roomCodeInput}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const groupsList = room ? Object.values(room.groups) : [];
  const sortedGroups = [...groupsList].sort((a, b) => b.score - a.score);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-4xl max-h-[92vh] bg-slate-900 border border-indigo-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Top Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 border-b border-indigo-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-600/30 border border-indigo-400/50 flex items-center justify-center text-indigo-300">
              <Users2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white tracking-wide">
                  MABAR KELAS: 5–10 KELOMPOK
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                  <Wifi className="w-3 h-3 animate-pulse" /> Multi-Device Live
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Satu ruang kelas, berbagai perangkat (Chromebook/Laptop/Tablet/HP) terhubung secara serentak
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Assistance notification banner if received */}
        {assistanceNotice && (
          <div className="px-5 py-2 bg-emerald-500/20 border-b border-emerald-500/40 flex items-center justify-between text-xs font-bold text-emerald-300 animate-bounce">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>{assistanceNotice}</span>
            </div>
            <button onClick={() => setAssistanceNotice(null)} className="text-emerald-400 hover:text-white">
              ✕
            </button>
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Room Bar & Device Share Bar */}
          <div className="bg-slate-850 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full md:w-auto">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                KODE RUANGAN KELAS:
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={roomCodeInput}
                  onChange={(e) => setRoomCodeInput(e.target.value.toUpperCase())}
                  placeholder="KODE (GARUDA)"
                  className="px-3 py-1.5 bg-slate-900 border border-indigo-500/40 rounded-xl font-mono font-black text-sm text-indigo-300 w-28 uppercase text-center focus:outline-hidden focus:ring-2 focus:ring-indigo-400"
                />
                <button
                  onClick={handleCreateOrJoinRoom}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-md"
                >
                  Masuk / Sinkronkan
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              <button
                onClick={handleCopyCode}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Link Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Salin Link Device Siswa</span>
                  </>
                )}
              </button>

              <div className="px-3 py-1 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold flex items-center gap-1.5">
                <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                <span>{groupsList.length}/10 Kelompok Aktif</span>
              </div>
            </div>
          </div>

          {/* Shared Raid Boss / Community Health Status */}
          {room && (
            <div className="bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 rounded-2xl p-4 sm:p-5 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-rose-400 animate-pulse" />
                  <div>
                    <h3 className="text-base font-black text-white flex items-center gap-2">
                      {room.bossName}
                      <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        Target Serentak Kelas
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Setiap jawaban HOTS & Penjaga dari kelompok 1–10 mengurangi HP Bos secara bersama-sama!
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-semibold text-slate-400">HP Bos Bersama:</span>
                  <div className="text-lg font-black text-rose-400 font-mono">
                    {room.bossHp} / {room.bossMaxHp} HP
                  </div>
                </div>
              </div>

              {/* Boss HP Bar */}
              <div className="w-full h-3.5 bg-slate-950 rounded-full border border-slate-700 overflow-hidden mb-3">
                <div
                  className="h-full bg-gradient-to-r from-rose-600 via-orange-500 to-amber-400 transition-all duration-300"
                  style={{ width: `${Math.max(0, (room.bossHp / room.bossMaxHp) * 100)}%` }}
                />
              </div>

              {/* Community Health Bar */}
              <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
                <span className="flex items-center gap-1.5 font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> Ketertiban Komunitas Kelas:
                </span>
                <span className="font-extrabold text-emerald-400">{room.communityHealth}%</span>
              </div>
              <div className="w-full h-2 bg-slate-950 rounded-full border border-slate-800 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 transition-all duration-300"
                  style={{ width: `${room.communityHealth}%` }}
                />
              </div>
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <button
              onClick={() => setActiveTab('lobby')}
              className={`px-4 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
                activeTab === 'lobby'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Users2 className="w-3.5 h-3.5" />
              1. Pilih Kelompok Device ({PRESET_GROUPS.length} Kelompok)
            </button>

            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`px-4 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
                activeTab === 'leaderboard'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              2. Live Papan Skor & Saling Bantu
            </button>

            <button
              onClick={() => setActiveTab('activity')}
              className={`px-4 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
                activeTab === 'activity'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              3. Live Log Aksi Kelas
            </button>
          </div>

          {/* TAB 1: 5-10 GROUPS SELECTOR */}
          {activeTab === 'lobby' && (
            <div className="space-y-4">
              <div className="bg-slate-850 border border-slate-800 rounded-2xl p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <h4 className="text-xs font-black text-slate-300 uppercase tracking-wider">
                    Pilih Kelompok untuk Device Ini (1–10):
                  </h4>
                  <span className="text-[11px] text-indigo-400">
                    *Masing-masing meja/kelompok memilih nomor kelompoknya sendiri
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 mb-4">
                  {PRESET_GROUPS.map((grp) => {
                    const isOccupied = room?.groups[grp.id] !== undefined;
                    const isSelected = selectedGroupId === grp.id;
                    const groupData = room?.groups[grp.id];

                    return (
                      <button
                        key={grp.id}
                        onClick={() => {
                          setSelectedGroupId(grp.id);
                          soundManager.playButton();
                        }}
                        className={`p-3 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                          isSelected
                            ? 'bg-indigo-600/30 border-indigo-400 ring-2 ring-indigo-400 shadow-lg'
                            : isOccupied
                            ? 'bg-emerald-950/30 border-emerald-500/40 text-slate-200'
                            : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-400'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xl">{grp.icon}</span>
                          {isOccupied ? (
                            <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-[10px] font-bold flex items-center gap-0.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                              Aktif
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-500 font-semibold">Tersedia</span>
                          )}
                        </div>

                        <div>
                          <div className="text-xs font-black text-white leading-tight mb-0.5">
                            {grp.name}
                          </div>
                          {groupData ? (
                            <div className="text-[10px] font-bold text-amber-400">
                              {groupData.score} Poin • {groupData.hotsCorrect} HOTS
                            </div>
                          ) : (
                            <div className="text-[10px] text-slate-500">Klik untuk masuk</div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Member Names & Join Action */}
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3">
                  <div className="w-full md:w-2/3">
                    <label className="block text-xs font-bold text-slate-400 mb-1">
                      Nama-nama Anggota di Device Ini:
                    </label>
                    <input
                      type="text"
                      value={memberNamesInput}
                      onChange={(e) => setMemberNamesInput(e.target.value)}
                      placeholder="Contoh: Ahmad, Siti, Budi, Dewi"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <button
                    onClick={handleConfirmJoinGroup}
                    className="w-full md:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Hubungkan Device ke Kelompok
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LIVE LEADERBOARD & MUTUAL ASSISTANCE */}
          {activeTab === 'leaderboard' && (
            <div className="space-y-4">
              <div className="bg-slate-850 border border-slate-800 rounded-2xl p-4">
                <h4 className="text-xs font-black text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-400" /> Papan Skor Kolaboratif (5–10 Kelompok):
                </h4>

                <div className="space-y-2">
                  {sortedGroups.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 text-xs">
                      Belum ada kelompok yang terhubung. Silakan kelompok 1-10 memilih kelompok di Tab 1.
                    </div>
                  ) : (
                    sortedGroups.map((g, idx) => {
                      const isMe = g.id === selectedGroupId;
                      return (
                        <div
                          key={g.id}
                          className={`p-3 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-all ${
                            isMe
                              ? 'bg-indigo-950/40 border-indigo-400/60 ring-1 ring-indigo-400/50'
                              : 'bg-slate-900 border-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`w-7 h-7 rounded-lg font-black text-xs flex items-center justify-center ${
                                idx === 0
                                  ? 'bg-amber-500 text-slate-950'
                                  : idx === 1
                                  ? 'bg-slate-300 text-slate-950'
                                  : idx === 2
                                  ? 'bg-amber-700 text-white'
                                  : 'bg-slate-800 text-slate-400'
                              }`}
                            >
                              {idx + 1}
                            </span>

                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-extrabold text-sm text-white">{g.name}</span>
                                {isMe && (
                                  <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 text-[10px] font-black">
                                    DEVICE ANDA
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-400">
                                Anggota: {g.members.join(', ')} • {g.recentAction || 'Aktif berjaga'}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                            <div className="text-right">
                              <div className="text-sm font-black text-amber-400">{g.score} Poin</div>
                              <div className="text-[10px] text-slate-400">
                                {g.hotsCorrect}/{g.hotsAttempted} HOTS • {g.defendersPlaced} Penjaga
                              </div>
                            </div>

                            {/* Help button for allies */}
                            {!isMe && (
                              <button
                                onClick={() => handleSendHelp(g.id)}
                                className="px-3 py-1.5 rounded-xl bg-emerald-600/30 hover:bg-emerald-600 border border-emerald-500/50 text-emerald-300 hover:text-white text-xs font-bold flex items-center gap-1 transition-all"
                                title="Kirim bantuan harmoni & perlindungan kepada kelompok sekutu"
                              >
                                <HeartHandshake className="w-3.5 h-3.5" />
                                <span>Bantu</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Pancasila Emote Booster */}
              <div className="bg-slate-850 border border-slate-800 rounded-2xl p-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Kirim Sorak & Semboyan Pancasila ke Seluruh Kelas:
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    '🦅 Bhinneka Tunggal Ika! Bersatu kita teguh!',
                    '🤝 Ayo Gotong Royong pertahankan ketertiban!',
                    '🛡️ Disiplin & Tanggung Jawab adalah kunci!',
                    '✨ Semangat kawan-kawan! Kita pasti bisa kalahkan kekacauan!',
                    '🏆 Ayo Kelompok 1–10 bersatu demi Indonesia tertib!',
                  ].map((emote, eIdx) => (
                    <button
                      key={eIdx}
                      onClick={() => handleSendEmote(emote)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-indigo-400 text-slate-200 text-xs font-bold transition-all"
                    >
                      {emote}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: LIVE CLASSROOM ACTIVITY LOG */}
          {activeTab === 'activity' && (
            <div className="bg-slate-850 border border-slate-800 rounded-2xl p-4">
              <h4 className="text-xs font-black text-slate-300 uppercase tracking-wider mb-3">
                Linimasa Aksi Serentak Kelas 4:
              </h4>

              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {room?.activityLog.map((log) => (
                  <div
                    key={log.id}
                    className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs flex items-center justify-between gap-3 text-slate-200"
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      {log.text}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono shrink-0">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Control Bar */}
        <div className="px-5 py-4 bg-slate-900/90 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>
              Device ini aktif sebagai:{' '}
              <strong className="text-white">
                {PRESET_GROUPS.find((g) => g.id === selectedGroupId)?.name || 'Kelompok Belum Dipilih'}
              </strong>
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleHostReset}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-bold text-xs flex items-center gap-1.5 transition-all"
              title="Reset Skor & Misi (Khusus Guru/Host)"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>

            <button
              onClick={handleHostStart}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-white font-black text-xs flex items-center gap-2 shadow-xl shadow-emerald-500/20 transition-all hover:scale-102"
            >
              <Play className="w-4 h-4 fill-white" />
              MASUK PERTEMPURAN MABAR!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
