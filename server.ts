import express from 'express';
import http from 'http';
import path from 'path';
import { WebSocketServer, WebSocket } from 'ws';
import { createServer as createViteServer } from 'vite';
import { PRESET_GROUPS } from './src/data/multiplayerPresets';

interface RoomGroup {
  id: string; // e.g. 'kelompok_1'
  name: string;
  color: string;
  members: string[];
  score: number;
  stars: number;
  harmony: number;
  currentWorld: string;
  currentLevelId: number;
  currentLevelTitle: string;
  hotsCorrect: number;
  hotsAttempted: number;
  wrongAnswers: number;
  defendersPlaced: number;
  currentWave: number;
  timePlayedSeconds: number;
  startedAt: number;
  levelEnteredAt: number;
  isStuck: boolean;
  needsSupport: boolean;
  supportMessage?: string;
  categoryStats: Record<string, { correct: number; total: number }>;
  isReady: boolean;
  lastActive: number;
  recentAction?: string;
}

interface ClassroomRoom {
  code: string;
  title: string;
  teacherName: string;
  mode: 'raid' | 'tournament';
  targetLevelId: number;
  bossName: string;
  bossHp: number;
  bossMaxHp: number;
  communityHealth: number; // 0 to 100
  status: 'lobby' | 'in_game' | 'finished';
  createdAt: number;
  groups: Record<string, RoomGroup>;
  activityLog: { id: string; timestamp: number; text: string; type: 'join' | 'attack' | 'help' | 'hots' | 'teacher' }[];
}

export { PRESET_GROUPS };

const rooms: Record<string, ClassroomRoom> = {};

export function normalizeRoomCode(raw: string): string {
  if (!raw) return 'KELAS-4A';
  return raw.toUpperCase().trim().replace(/\s+/g, '');
}

export function getOrCreateRoom(rawCode: string, title?: string, teacherName?: string): ClassroomRoom {
  const cleanCode = normalizeRoomCode(rawCode);
  if (!rooms[cleanCode]) {
    rooms[cleanCode] = {
      code: cleanCode,
      title: title || `Kelas ${cleanCode}: Civic Guardians Multi-Kelompok`,
      teacherName: teacherName || 'Ibu Guru Pancasila',
      mode: 'tournament',
      targetLevelId: 1,
      bossName: 'Lord of Chaos & Armada Anarki',
      bossHp: 8000,
      bossMaxHp: 8000,
      communityHealth: 100,
      status: 'lobby',
      createdAt: Date.now(),
      groups: {},
      activityLog: [
        {
          id: `init_${cleanCode}_${Date.now()}`,
          timestamp: Date.now(),
          text: `Ruang Kelas ${cleanCode} siap digunakan! Silakan kelompok 1–10 bergabung.`,
          type: 'join',
        },
      ],
    };
  } else {
    if (title) rooms[cleanCode].title = title;
    if (teacherName) rooms[cleanCode].teacherName = teacherName;
  }
  return rooms[cleanCode];
}

// Pre-initialize popular and requested classroom room codes so they are instantly ready
['KELAS-4A', 'KELAS-4B', 'KELAS-4C', '4A', '4B', '4C', '4D', 'IVC-PANCASILA', 'CG-12345'].forEach((code) => {
  getOrCreateRoom(code);
});

// Client WebSocket tracking
const roomClients = new Map<string, Set<WebSocket>>();

function broadcastRoom(rawCode: string, payload: unknown) {
  const code = normalizeRoomCode(rawCode);
  const clients = roomClients.get(code);
  if (!clients) return;
  const msg = JSON.stringify(payload);
  clients.forEach((ws) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(msg);
    }
  });
}

function computeCompetencyReport(groups: Record<string, RoomGroup>) {
  const sorted = Object.values(groups).sort((a, b) => {
    if (b.stars !== a.stars) return b.stars - a.stars;
    return b.score - a.score;
  });

  return sorted.map((g, idx) => {
    const totalQ = g.hotsAttempted || 0;
    const correctQ = g.hotsCorrect || 0;
    const wrongQ = Math.max(0, totalQ - correctQ);
    const accuracy = totalQ > 0 ? Math.round((correctQ / totalQ) * 100) : 100;

    // Analyze competencies
    const categories = Object.entries(g.categoryStats || {});
    let strongest = 'Nilai Kedisiplinan';
    let strongestPct = accuracy;
    let weakest = 'Tanggung Jawab Fasilitas';
    let weakestPct = accuracy;

    if (categories.length > 0) {
      const parsed = categories.map(([cat, stat]) => ({
        cat,
        pct: stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 100,
        total: stat.total,
      })).filter((item) => item.total > 0);

      if (parsed.length > 0) {
        parsed.sort((a, b) => b.pct - a.pct);
        strongest = formatCategoryName(parsed[0].cat);
        strongestPct = parsed[0].pct;
        weakest = formatCategoryName(parsed[parsed.length - 1].cat);
        weakestPct = parsed[parsed.length - 1].pct;
      }
    }

    const minutes = Math.floor((g.timePlayedSeconds || 0) / 60);
    const seconds = (g.timePlayedSeconds || 0) % 60;
    const timePlayedFormatted = `${minutes}m ${seconds.toString().padStart(2, '0')}s`;

    let statusLabel = 'Sangat Mahir ⭐⭐⭐';
    if (accuracy < 60) statusLabel = 'Perlu Bimbingan 🆘';
    else if (accuracy < 75) statusLabel = 'Cukup Berkembang ⭐';
    else if (accuracy < 90) statusLabel = 'Mahir ⭐⭐';

    return {
      groupId: g.id,
      groupName: g.name,
      members: g.members,
      color: g.color,
      finalScore: g.score,
      finalRank: idx + 1,
      stars: g.stars,
      harmony: g.harmony,
      currentWorld: g.currentWorld,
      currentLevel: g.currentLevelTitle || `Level ${g.currentLevelId}`,
      questionsAnswered: totalQ,
      correctAnswers: correctQ,
      incorrectAnswers: wrongQ,
      accuracyPercentage: accuracy,
      timePlayedFormatted,
      strongestCompetency: strongest,
      strongestPercentage: strongestPct,
      weakestCompetency: weakest,
      weakestPercentage: weakestPct,
      statusLabel,
    };
  });
}

function formatCategoryName(cat: string): string {
  switch (cat) {
    case 'rules_at_home': return 'Aturan di Rumah';
    case 'rules_at_school': return 'Tata Tertib Sekolah';
    case 'rules_in_society': return 'Norma Masyarakat & Warga';
    case 'disciplined_behavior': return 'Perilaku Disiplin';
    case 'consequences_of_breaking_rules': return 'Konsekuensi Aturan';
    case 'hots_civic_cases': return 'Studi Kasus HOTS';
    default: return 'Pemahaman Aturan & Norma';
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;
  app.use(express.json());

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: Date.now() });
  });

  // Get active rooms list
  app.get('/api/rooms', (req, res) => {
    const list = Object.values(rooms).map((r) => ({
      code: r.code,
      title: r.title,
      teacherName: r.teacherName,
      mode: r.mode,
      groupCount: Object.keys(r.groups).length,
      status: r.status,
      communityHealth: r.communityHealth,
      bossHp: r.bossHp,
      bossMaxHp: r.bossMaxHp,
    }));
    res.json(list);
  });

  // Create or retrieve room (Teacher host or student)
  app.post('/api/rooms/create', (req, res) => {
    const { code, title, teacherName, mode, targetLevelId } = req.body;
    const room = getOrCreateRoom(code, title, teacherName);
    if (mode) room.mode = mode;
    if (targetLevelId) room.targetLevelId = targetLevelId;
    broadcastRoom(room.code, { type: 'room_update', room });
    res.json({ success: true, room });
  });

  // Get specific room status (never 404s, auto-creates room)
  app.get('/api/rooms/:code', (req, res) => {
    const room = getOrCreateRoom(req.params.code);

    // Auto check for stuck groups: level duration > 240 seconds (4 minutes)
    const now = Date.now();
    Object.values(room.groups).forEach((g) => {
      if (g.levelEnteredAt && now - g.levelEnteredAt > 240000 && !g.isStuck) {
        g.isStuck = true;
      }
    });

    res.json(room);
  });

  // Join group in room (never 404s, auto-creates room if not yet created)
  app.post('/api/rooms/:code/join', (req, res) => {
    const room = getOrCreateRoom(req.params.code);
    const code = room.code;

    const { groupId, groupName, members } = req.body;
    const defaultMeta = PRESET_GROUPS.find((g) => g.id === groupId) || {
      id: groupId || 'kelompok_1',
      name: groupName || 'Kelompok Pancasila',
      color: '#3b82f6',
    };

    if (!room.groups[groupId]) {
      room.groups[groupId] = {
        id: groupId,
        name: groupName || defaultMeta.name,
        color: defaultMeta.color,
        members: members || ['Anggota Kelompok'],
        score: 0,
        stars: 0,
        harmony: 200,
        currentWorld: 'world1',
        currentLevelId: 1,
        currentLevelTitle: 'Level 1: Make Your Bed',
        hotsCorrect: 0,
        hotsAttempted: 0,
        wrongAnswers: 0,
        defendersPlaced: 0,
        currentWave: 1,
        timePlayedSeconds: 0,
        startedAt: Date.now(),
        levelEnteredAt: Date.now(),
        isStuck: false,
        needsSupport: false,
        categoryStats: {},
        isReady: true,
        lastActive: Date.now(),
        recentAction: 'Telah bergabung ke markas!',
      };

      room.activityLog.unshift({
        id: `act_${Date.now()}_${Math.random()}`,
        timestamp: Date.now(),
        text: `✨ ${room.groups[groupId].name} bergabung ke room ${code}!`,
        type: 'join',
      });
      if (room.activityLog.length > 40) room.activityLog.pop();

      broadcastRoom(code, { type: 'room_update', room });
    } else {
      if (members && members.length > 0) {
        room.groups[groupId].members = members;
      }
      if (groupName) {
        room.groups[groupId].name = groupName;
      }
      room.groups[groupId].lastActive = Date.now();
      broadcastRoom(code, { type: 'room_update', room });
    }

    res.json({ success: true, group: room.groups[groupId], room });
  });

  // Update live progress from playing devices
  app.post('/api/rooms/:code/progress', (req, res) => {
    const room = getOrCreateRoom(req.params.code);
    const code = room.code;

    const { groupId, progress } = req.body;
    let group = room.groups[groupId];
    if (!group) {
      // Auto-register group if needed
      const defaultMeta = PRESET_GROUPS.find((g) => g.id === groupId) || {
        id: groupId || 'kelompok_1',
        name: 'Kelompok Siswa',
        color: '#3b82f6',
      };
      room.groups[groupId] = {
        id: groupId,
        name: defaultMeta.name,
        color: defaultMeta.color,
        members: ['Anggota Kelompok'],
        score: 0,
        stars: 0,
        harmony: 200,
        currentWorld: 'world1',
        currentLevelId: 1,
        currentLevelTitle: 'Level 1: Make Your Bed',
        hotsCorrect: 0,
        hotsAttempted: 0,
        wrongAnswers: 0,
        defendersPlaced: 0,
        currentWave: 1,
        timePlayedSeconds: 0,
        startedAt: Date.now(),
        levelEnteredAt: Date.now(),
        isStuck: false,
        needsSupport: false,
        categoryStats: {},
        isReady: true,
        lastActive: Date.now(),
        recentAction: 'Telah bergabung!',
      };
      group = room.groups[groupId];
    }

    group.lastActive = Date.now();

    if (progress.currentLevelId && progress.currentLevelId !== group.currentLevelId) {
      group.currentLevelId = progress.currentLevelId;
      group.levelEnteredAt = Date.now();
      group.isStuck = false; // Reset stuck timer when progressing
    }
    if (progress.currentLevelTitle) group.currentLevelTitle = progress.currentLevelTitle;
    if (progress.currentWorld) group.currentWorld = progress.currentWorld;
    if (typeof progress.stars === 'number') group.stars = progress.stars;
    if (typeof progress.harmony === 'number') group.harmony = progress.harmony;
    if (typeof progress.score === 'number') group.score = progress.score;
    if (typeof progress.currentWave === 'number') group.currentWave = progress.currentWave;
    if (typeof progress.timePlayedSeconds === 'number') group.timePlayedSeconds = progress.timePlayedSeconds;
    if (typeof progress.hotsCorrect === 'number') group.hotsCorrect = progress.hotsCorrect;
    if (typeof progress.hotsAttempted === 'number') group.hotsAttempted = progress.hotsAttempted;
    if (typeof progress.wrongAnswers === 'number') group.wrongAnswers = progress.wrongAnswers;
    if (progress.categoryStats) group.categoryStats = { ...group.categoryStats, ...progress.categoryStats };
    if (typeof progress.isStuck === 'boolean') group.isStuck = progress.isStuck;
    if (typeof progress.needsSupport === 'boolean') group.needsSupport = progress.needsSupport;
    if (progress.supportMessage) group.supportMessage = progress.supportMessage;

    // Check low accuracy trigger (< 60% with >= 3 questions)
    if (group.hotsAttempted >= 3) {
      const acc = group.hotsCorrect / group.hotsAttempted;
      if (acc < 0.6) {
        group.needsSupport = true;
      }
    }

    broadcastRoom(code, { type: 'room_update', room });
    res.json({ success: true, room });
  });

  // Action events (HOTS answers, help requests, teacher interventions)
  app.post('/api/rooms/:code/action', (req, res) => {
    const room = getOrCreateRoom(req.params.code);
    const code = room.code;

    const { actionType, groupId, payload } = req.body;
    const group = groupId ? room.groups[groupId] : null;

    if (group) group.lastActive = Date.now();

    if (actionType === 'hots_answer' && group) {
      const { correct, topic, scoreBoost, category } = payload;
      group.hotsAttempted++;
      if (!group.categoryStats[category || 'general']) {
        group.categoryStats[category || 'general'] = { correct: 0, total: 0 };
      }
      group.categoryStats[category || 'general'].total++;

      if (correct) {
        group.hotsCorrect++;
        group.categoryStats[category || 'general'].correct++;
        const points = scoreBoost || 60;
        group.score += points;
        group.harmony = (group.harmony || 0) + 20;

        const bossDmg = Math.round(points * 1.5);
        room.bossHp = Math.max(0, room.bossHp - bossDmg);
        room.communityHealth = Math.min(100, room.communityHealth + 2);

        group.recentAction = `Menjawab tepat: ${topic || 'Tantangan Norma'} (+${points} Poin)`;

        room.activityLog.unshift({
          id: `act_${Date.now()}_${Math.random()}`,
          timestamp: Date.now(),
          text: `🧠 ${group.name} menjawab tepat soal ${topic || 'Norma'}!`,
          type: 'hots',
        });
      } else {
        group.wrongAnswers = (group.wrongAnswers || 0) + 1;
        group.recentAction = `Mempelajari kembali: ${topic || 'Norma'}`;
      }
    } else if (actionType === 'request_support' && group) {
      group.needsSupport = true;
      group.supportMessage = payload.message || 'Membutuhkan bimbingan materi aturan!';
      room.activityLog.unshift({
        id: `act_${Date.now()}_${Math.random()}`,
        timestamp: Date.now(),
        text: `🆘 ${group.name} memohon bantuan guru!`,
        type: 'help',
      });
    } else if (actionType === 'teacher_assist') {
      const { targetGroupId, message, bonusHarmony } = payload;
      const targetGroup = room.groups[targetGroupId];
      if (targetGroup) {
        targetGroup.needsSupport = false;
        targetGroup.isStuck = false;
        targetGroup.levelEnteredAt = Date.now();
        targetGroup.harmony = (targetGroup.harmony || 0) + (bonusHarmony || 50);
        targetGroup.score += 25;

        room.activityLog.unshift({
          id: `act_${Date.now()}_${Math.random()}`,
          timestamp: Date.now(),
          text: `👑 Guru mengirim dukungan ke ${targetGroup.name}: "${message || '+50 Harmoni & Petunjuk Disiplin'}"`,
          type: 'teacher',
        });

        broadcastRoom(code, {
          type: 'teacher_assistance_received',
          targetGroupId,
          message: message || 'Guru memberikan dorongan +50 Poin Harmoni!',
          bonusHarmony: bonusHarmony || 50,
        });
      }
    } else if (actionType === 'teacher_broadcast') {
      const { message } = payload;
      room.activityLog.unshift({
        id: `act_${Date.now()}_${Math.random()}`,
        timestamp: Date.now(),
        text: `📢 PENGUMUMAN GURU: ${message}`,
        type: 'teacher',
      });
      broadcastRoom(code, {
        type: 'teacher_announcement',
        message,
      });
    } else if (actionType === 'host_start') {
      room.status = 'in_game';
      room.activityLog.unshift({
        id: `act_${Date.now()}_${Math.random()}`,
        timestamp: Date.now(),
        text: `🚀 Misi Dimulai! Seluruh kelompok serentak berjuang mempertahankan ketertiban!`,
        type: 'join',
      });
    } else if (actionType === 'host_finish') {
      room.status = 'finished';
      room.activityLog.unshift({
        id: `act_${Date.now()}_${Math.random()}`,
        timestamp: Date.now(),
        text: `🏁 Misi Selesai! Selamat kepada seluruh kelompok Civic Guardians!`,
        type: 'join',
      });
    } else if (actionType === 'host_reset') {
      room.status = 'lobby';
      room.bossHp = room.bossMaxHp;
      room.communityHealth = 100;
      Object.values(room.groups).forEach((g) => {
        g.score = 0;
        g.stars = 0;
        g.harmony = 200;
        g.currentWorld = 'world1';
        g.currentLevelId = 1;
        g.currentLevelTitle = 'Level 1: Make Your Bed';
        g.hotsCorrect = 0;
        g.hotsAttempted = 0;
        g.wrongAnswers = 0;
        g.defendersPlaced = 0;
        g.timePlayedSeconds = 0;
        g.isStuck = false;
        g.needsSupport = false;
        g.categoryStats = {};
        g.startedAt = Date.now();
        g.levelEnteredAt = Date.now();
      });
      room.activityLog.unshift({
        id: `act_${Date.now()}_${Math.random()}`,
        timestamp: Date.now(),
        text: `Misi di-reset oleh guru. Siap untuk sesi baru!`,
        type: 'join',
      });
    }

    if (room.activityLog.length > 50) room.activityLog.pop();
    broadcastRoom(code, { type: 'room_update', room });

    res.json({ success: true, room });
  });

  // End of Game Assessment Report API
  app.get('/api/rooms/:code/report', (req, res) => {
    const room = getOrCreateRoom(req.params.code);

    const report = computeCompetencyReport(room.groups);
    res.json({
      roomCode: room.code,
      title: room.title,
      teacherName: room.teacherName,
      totalGroups: Object.keys(room.groups).length,
      createdAt: room.createdAt,
      groupsReport: report,
    });
  });

  const httpServer = http.createServer(app);

  // WebSocket Server for real-time bi-directional broadcast
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws: WebSocket) => {
    let currentCode: string | null = null;

    ws.on('message', (data: string) => {
      try {
        const message = JSON.parse(data.toString());

        if (message.type === 'subscribe_room') {
          const { code } = message;
          const cleanCode = normalizeRoomCode(code);
          if (!cleanCode) return;
          currentCode = cleanCode;

          if (!roomClients.has(cleanCode)) {
            roomClients.set(cleanCode, new Set());
          }
          roomClients.get(cleanCode)!.add(ws);

          const room = getOrCreateRoom(cleanCode);
          ws.send(JSON.stringify({ type: 'room_update', room }));
        }
      } catch (err) {
        console.error('WebSocket parse error:', err);
      }
    });

    ws.on('close', () => {
      if (currentCode && roomClients.has(currentCode)) {
        roomClients.get(currentCode)!.delete(ws);
      }
    });
  });

  // Vite middleware for dev mode vs static production serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Civic Guardians Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
