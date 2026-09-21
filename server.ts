import express from 'express';
import http from 'http';
import path from 'path';
import { WebSocketServer, WebSocket } from 'ws';
import { createServer as createViteServer } from 'vite';

interface RoomGroup {
  id: string; // e.g. 'kelompok_1'
  name: string;
  color: string;
  members: string[];
  score: number;
  stars: number;
  hotsCorrect: number;
  hotsAttempted: number;
  defendersPlaced: number;
  currentWave: number;
  isReady: boolean;
  lastActive: number;
  recentAction?: string;
}

interface ClassroomRoom {
  code: string;
  title: string;
  mode: 'raid' | 'tournament';
  targetLevelId: number;
  bossName: string;
  bossHp: number;
  bossMaxHp: number;
  communityHealth: number; // 0 to 100
  status: 'lobby' | 'in_game' | 'finished';
  createdAt: number;
  groups: Record<string, RoomGroup>;
  activityLog: { id: string; timestamp: number; text: string; type: 'join' | 'attack' | 'help' | 'hots' }[];
}

const DEFAULT_GROUPS: Omit<RoomGroup, 'score' | 'stars' | 'hotsCorrect' | 'hotsAttempted' | 'defendersPlaced' | 'currentWave' | 'isReady' | 'lastActive' | 'members'>[] = [
  { id: 'kelompok_1', name: 'Kelompok 1 (Garuda Hebat)', color: '#3b82f6' },
  { id: 'kelompok_2', name: 'Kelompok 2 (Rajawali Tangguh)', color: '#ef4444' },
  { id: 'kelompok_3', name: 'Kelompok 3 (Merpati Damai)', color: '#10b981' },
  { id: 'kelompok_4', name: 'Kelompok 4 (Elang Perkasa)', color: '#f59e0b' },
  { id: 'kelompok_5', name: 'Kelompok 5 (Cendrawasih Adil)', color: '#8b5cf6' },
  { id: 'kelompok_6', name: 'Kelompok 6 (Komodo Berani)', color: '#ec4899' },
  { id: 'kelompok_7', name: 'Kelompok 7 (Banteng Solid)', color: '#14b8a6' },
  { id: 'kelompok_8', name: 'Kelompok 8 (Harimau Tanggap)', color: '#f97316' },
  { id: 'kelompok_9', name: 'Kelompok 9 (Bekantan Ramah)', color: '#06b6d4' },
  { id: 'kelompok_10', name: 'Kelompok 10 (Rangkong Bijak)', color: '#84cc16' },
];

const rooms: Record<string, ClassroomRoom> = {};

// Create initial default room for instant play
const INITIAL_ROOM_CODE = 'GARUDA';
rooms[INITIAL_ROOM_CODE] = {
  code: INITIAL_ROOM_CODE,
  title: 'Kelas 4: Misi Ketertiban Serentak (5-10 Kelompok)',
  mode: 'raid',
  targetLevelId: 1,
  bossName: 'Raja Kekacauan & Pasukan Pelanggar',
  bossHp: 5000,
  bossMaxHp: 5000,
  communityHealth: 100,
  status: 'lobby',
  createdAt: Date.now(),
  groups: {},
  activityLog: [
    {
      id: 'init_1',
      timestamp: Date.now(),
      text: 'Ruang Mabar Ketertiban Kelas 4 telah aktif! Silakan kelompok 1-10 bergabung.',
      type: 'join',
    },
  ],
};

// Client WebSocket tracking
const roomClients = new Map<string, Set<WebSocket>>();

function broadcastRoom(code: string, payload: unknown) {
  const clients = roomClients.get(code);
  if (!clients) return;
  const msg = JSON.stringify(payload);
  clients.forEach((ws) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(msg);
    }
  });
}

async function startServer() {
  const app = express();
  const PORT = 3000;
  app.use(express.json());

  // REST API Endpoints for resilient multiplayer support
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: Date.now() });
  });

  // Get active rooms
  app.get('/api/rooms', (req, res) => {
    const list = Object.values(rooms).map((r) => ({
      code: r.code,
      title: r.title,
      mode: r.mode,
      groupCount: Object.keys(r.groups).length,
      status: r.status,
      communityHealth: r.communityHealth,
      bossHp: r.bossHp,
      bossMaxHp: r.bossMaxHp,
    }));
    res.json(list);
  });

  // Create or get room
  app.post('/api/rooms/create', (req, res) => {
    const { code, title, mode, targetLevelId } = req.body;
    const cleanCode = (code || `CIVIC${Math.floor(100 + Math.random() * 900)}`).toUpperCase().trim();

    if (!rooms[cleanCode]) {
      rooms[cleanCode] = {
        code: cleanCode,
        title: title || `Misi Ketertiban Kelas 4 (${cleanCode})`,
        mode: mode || 'raid',
        targetLevelId: targetLevelId || 1,
        bossName: 'Raja Ketidaktertiban & Anarki',
        bossHp: 6000,
        bossMaxHp: 6000,
        communityHealth: 100,
        status: 'lobby',
        createdAt: Date.now(),
        groups: {},
        activityLog: [
          {
            id: `log_${Date.now()}`,
            timestamp: Date.now(),
            text: `Ruang Mabar ${cleanCode} berhasil dibuka untuk 5-10 kelompok!`,
            type: 'join',
          },
        ],
      };
    }

    res.json({ success: true, room: rooms[cleanCode] });
  });

  // Get specific room status
  app.get('/api/rooms/:code', (req, res) => {
    const code = req.params.code.toUpperCase().trim();
    const room = rooms[code];
    if (!room) {
      return res.status(404).json({ error: 'Ruangan tidak ditemukan' });
    }
    res.json(room);
  });

  // Join group in room
  app.post('/api/rooms/:code/join', (req, res) => {
    const code = req.params.code.toUpperCase().trim();
    const room = rooms[code];
    if (!room) {
      return res.status(404).json({ error: 'Ruangan tidak ditemukan' });
    }

    const { groupId, groupName, members } = req.body;
    const defaultMeta = DEFAULT_GROUPS.find((g) => g.id === groupId) || {
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
        hotsCorrect: 0,
        hotsAttempted: 0,
        defendersPlaced: 0,
        currentWave: 1,
        isReady: true,
        lastActive: Date.now(),
        recentAction: 'Telah bergabung ke markas!',
      };

      room.activityLog.unshift({
        id: `act_${Date.now()}_${Math.random()}`,
        timestamp: Date.now(),
        text: `${room.groups[groupId].name} masuk ke medan kolaborasi!`,
        type: 'join',
      });
      if (room.activityLog.length > 30) room.activityLog.pop();

      broadcastRoom(code, { type: 'room_update', room });
    } else {
      // Update existing group members / heartbeat
      if (members && members.length > 0) {
        room.groups[groupId].members = members;
      }
      room.groups[groupId].lastActive = Date.now();
    }

    res.json({ success: true, group: room.groups[groupId], room });
  });

  // Submit action (HOTS result, Boss damage, Guardian deployed, Assistance)
  app.post('/api/rooms/:code/action', (req, res) => {
    const code = req.params.code.toUpperCase().trim();
    const room = rooms[code];
    if (!room) {
      return res.status(404).json({ error: 'Ruangan tidak ditemukan' });
    }

    const { actionType, groupId, payload } = req.body;
    const group = room.groups[groupId];
    if (!group) {
      return res.status(400).json({ error: 'Kelompok belum terdaftar' });
    }

    group.lastActive = Date.now();

    if (actionType === 'hots_answer') {
      const { correct, topic, scoreBoost } = payload;
      group.hotsAttempted++;
      if (correct) {
        group.hotsCorrect++;
        const points = scoreBoost || 50;
        group.score += points;

        // Damage boss if in raid mode!
        const bossDmg = Math.round(points * 1.5);
        room.bossHp = Math.max(0, room.bossHp - bossDmg);
        room.communityHealth = Math.min(100, room.communityHealth + 2);

        group.recentAction = `Berhasil menyelesaikan HOTS ${topic || 'Aturan'}! (-${bossDmg} HP Bos)`;

        room.activityLog.unshift({
          id: `act_${Date.now()}_${Math.random()}`,
          timestamp: Date.now(),
          text: `[HOTS] ${group.name} menjawab tepat! Bos terkena serangan ${bossDmg} DMG!`,
          type: 'hots',
        });
      } else {
        group.recentAction = `Mempelajari kembali HOTS ${topic || 'Aturan'}`;
      }
    } else if (actionType === 'place_defender') {
      const { defenderName } = payload;
      group.defendersPlaced++;
      group.score += 20;
      group.recentAction = `Menempatkan ${defenderName || 'Penjaga'} di garis pertahanan!`;

      // Small boss chip damage
      room.bossHp = Math.max(0, room.bossHp - 40);

      room.activityLog.unshift({
        id: `act_${Date.now()}_${Math.random()}`,
        timestamp: Date.now(),
        text: `🛡️ ${group.name} mengerahkan ${defenderName || 'Penjaga'}!`,
        type: 'attack',
      });
    } else if (actionType === 'send_help') {
      const { targetGroupId, helpType } = payload;
      const targetGroup = room.groups[targetGroupId];
      const targetName = targetGroup ? targetGroup.name : 'Sekutu';

      group.score += 30; // Altruism civic score reward!
      room.activityLog.unshift({
        id: `act_${Date.now()}_${Math.random()}`,
        timestamp: Date.now(),
        text: `🤝 ${group.name} mengirim bantuan ${helpType || 'Energi Harmoni'} kepada ${targetName}!`,
        type: 'help',
      });

      broadcastRoom(code, {
        type: 'assistance_received',
        fromGroupId: groupId,
        fromGroupName: group.name,
        targetGroupId,
        helpType,
      });
    } else if (actionType === 'send_emote') {
      const { emote } = payload;
      room.activityLog.unshift({
        id: `act_${Date.now()}_${Math.random()}`,
        timestamp: Date.now(),
        text: `${group.name}: ${emote || 'Semangat Teman-teman! ✨'}`,
        type: 'join',
      });
    } else if (actionType === 'host_start') {
      room.status = 'in_game';
      room.activityLog.unshift({
        id: `act_${Date.now()}_${Math.random()}`,
        timestamp: Date.now(),
        text: `⚔️ Pertempuran Dimulai! Semua 5-10 kelompok bersatu mempertahankan ketertiban!`,
        type: 'join',
      });
    } else if (actionType === 'host_reset') {
      room.status = 'lobby';
      room.bossHp = room.bossMaxHp;
      room.communityHealth = 100;
      Object.values(room.groups).forEach((g) => {
        g.score = 0;
        g.hotsCorrect = 0;
        g.hotsAttempted = 0;
        g.defendersPlaced = 0;
      });
      room.activityLog.unshift({
        id: `act_${Date.now()}_${Math.random()}`,
        timestamp: Date.now(),
        text: `Misi di-reset oleh guru/host. Siap untuk putaran baru!`,
        type: 'join',
      });
    }

    if (room.activityLog.length > 40) room.activityLog.pop();
    broadcastRoom(code, { type: 'room_update', room });

    res.json({ success: true, room });
  });

  const httpServer = http.createServer(app);

  // WebSocket Server for instantaneous bi-directional sync
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws: WebSocket) => {
    let currentCode: string | null = null;
    let currentGroupId: string | null = null;

    ws.on('message', (data: string) => {
      try {
        const message = JSON.parse(data.toString());

        if (message.type === 'subscribe_room') {
          const { code, groupId } = message;
          const cleanCode = (code || '').toUpperCase().trim();
          if (!cleanCode) return;
          currentCode = cleanCode;
          currentGroupId = groupId || null;

          if (!roomClients.has(cleanCode)) {
            roomClients.set(cleanCode, new Set());
          }
          roomClients.get(cleanCode)!.add(ws);

          // Send current state immediately
          if (rooms[cleanCode]) {
            ws.send(JSON.stringify({ type: 'room_update', room: rooms[cleanCode] }));
          }
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
