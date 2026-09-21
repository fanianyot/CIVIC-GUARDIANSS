// Multi-Device Classroom Multiplayer Client
// Supports WebSockets with automatic REST polling fallback for school firewalls

export interface RoomGroup {
  id: string;
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

export interface ClassroomRoom {
  code: string;
  title: string;
  mode: 'raid' | 'tournament';
  targetLevelId: number;
  bossName: string;
  bossHp: number;
  bossMaxHp: number;
  communityHealth: number;
  status: 'lobby' | 'in_game' | 'finished';
  createdAt: number;
  groups: Record<string, RoomGroup>;
  activityLog: { id: string; timestamp: number; text: string; type: 'join' | 'attack' | 'help' | 'hots' }[];
}

export const PRESET_GROUPS = [
  { id: 'kelompok_1', name: 'Kelompok 1 (Garuda Hebat)', color: '#3b82f6', icon: '🦅' },
  { id: 'kelompok_2', name: 'Kelompok 2 (Rajawali Tangguh)', color: '#ef4444', icon: '⚡' },
  { id: 'kelompok_3', name: 'Kelompok 3 (Merpati Damai)', color: '#10b981', icon: '🕊️' },
  { id: 'kelompok_4', name: 'Kelompok 4 (Elang Perkasa)', color: '#f59e0b', icon: '🌟' },
  { id: 'kelompok_5', name: 'Kelompok 5 (Cendrawasih Adil)', color: '#8b5cf6', icon: '👑' },
  { id: 'kelompok_6', name: 'Kelompok 6 (Komodo Berani)', color: '#ec4899', icon: '🦎' },
  { id: 'kelompok_7', name: 'Kelompok 7 (Banteng Solid)', color: '#14b8a6', icon: '🛡️' },
  { id: 'kelompok_8', name: 'Kelompok 8 (Harimau Tanggap)', color: '#f97316', icon: '🐅' },
  { id: 'kelompok_9', name: 'Kelompok 9 (Bekantan Ramah)', color: '#06b6d4', icon: '🤝' },
  { id: 'kelompok_10', name: 'Kelompok 10 (Rangkong Bijak)', color: '#84cc16', icon: '📜' },
];

class MultiplayerClient {
  private ws: WebSocket | null = null;
  private currentCode: string | null = null;
  private currentGroupId: string | null = null;
  private listeners: ((room: ClassroomRoom) => void)[] = [];
  private assistanceListeners: ((help: { fromGroupName: string; helpType: string }) => void)[] = [];
  private pollTimer: number | null = null;
  private isConnected: boolean = false;

  public onRoomUpdate(callback: (room: ClassroomRoom) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }

  public onAssistanceReceived(callback: (help: { fromGroupName: string; helpType: string }) => void) {
    this.assistanceListeners.push(callback);
    return () => {
      this.assistanceListeners = this.assistanceListeners.filter((cb) => cb !== callback);
    };
  }

  public async getRoomsList(): Promise<{ code: string; title: string; groupCount: number }[]> {
    try {
      const res = await fetch('/api/rooms');
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    return [];
  }

  public async createOrJoinRoom(code: string, title?: string, mode?: 'raid' | 'tournament'): Promise<ClassroomRoom | null> {
    try {
      const res = await fetch('/api/rooms/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, title, mode }),
      });
      if (res.ok) {
        const data = await res.json();
        return data.room;
      }
    } catch (err) {
      console.error('Failed to create room:', err);
    }
    return null;
  }

  public async joinGroup(code: string, groupId: string, groupName: string, members: string[]): Promise<ClassroomRoom | null> {
    this.currentCode = code.toUpperCase().trim();
    this.currentGroupId = groupId;

    try {
      const res = await fetch(`/api/rooms/${this.currentCode}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ groupId, groupName, members }),
      });
      if (res.ok) {
        const data = await res.json();
        this.initWebSocket(this.currentCode, groupId);
        this.startPolling(this.currentCode);
        this.notify(data.room);
        return data.room;
      }
    } catch (err) {
      console.error('Failed to join group:', err);
    }
    return null;
  }

  public async fetchRoomState(code: string): Promise<ClassroomRoom | null> {
    try {
      const res = await fetch(`/api/rooms/${code.toUpperCase().trim()}`);
      if (res.ok) {
        const data = await res.json();
        this.notify(data);
        return data;
      }
    } catch (err) {
      console.error('Failed to fetch room:', err);
    }
    return null;
  }

  public async sendAction(actionType: 'hots_answer' | 'place_defender' | 'send_help' | 'send_emote' | 'host_start' | 'host_reset', payload: Record<string, unknown> = {}) {
    if (!this.currentCode || !this.currentGroupId) return;

    try {
      const res = await fetch(`/api/rooms/${this.currentCode}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actionType,
          groupId: this.currentGroupId,
          payload,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        this.notify(data.room);
      }
    } catch (err) {
      console.error('Error sending multiplayer action:', err);
    }
  }

  private initWebSocket(code: string, groupId: string) {
    if (this.ws) {
      try {
        this.ws.close();
      } catch {
        // ignore
      }
    }

    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        this.isConnected = true;
        this.ws?.send(JSON.stringify({ type: 'subscribe_room', code, groupId }));
      };

      this.ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === 'room_update' && msg.room) {
            this.notify(msg.room);
          } else if (msg.type === 'assistance_received') {
            if (msg.targetGroupId === this.currentGroupId) {
              this.assistanceListeners.forEach((cb) =>
                cb({ fromGroupName: msg.fromGroupName, helpType: msg.helpType })
              );
            }
          }
        } catch {
          // ignore
        }
      };

      this.ws.onclose = () => {
        this.isConnected = false;
      };

      this.ws.onerror = () => {
        this.isConnected = false;
      };
    } catch (err) {
      console.warn('WebSocket unavailable, relying on HTTP polling:', err);
    }
  }

  private startPolling(code: string) {
    if (this.pollTimer) clearInterval(this.pollTimer);
    this.pollTimer = window.setInterval(() => {
      this.fetchRoomState(code);
    }, 2500);
  }

  public stop() {
    if (this.pollTimer) clearInterval(this.pollTimer);
    if (this.ws) {
      try {
        this.ws.close();
      } catch {
        // ignore
      }
      this.ws = null;
    }
    this.currentCode = null;
    this.currentGroupId = null;
    this.isConnected = false;
  }

  private notify(room: ClassroomRoom) {
    this.listeners.forEach((cb) => cb(room));
  }

  public getConnectedStatus(): boolean {
    return this.isConnected;
  }

  public getCurrentGroupId(): string | null {
    return this.currentGroupId;
  }

  public getCurrentCode(): string | null {
    return this.currentCode;
  }
}

export const multiplayerClient = new MultiplayerClient();
