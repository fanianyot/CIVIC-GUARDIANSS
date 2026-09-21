// Multi-Device Classroom Multiplayer Client
// Supports WebSockets with automatic REST polling fallback for school firewalls
import { MultiRoomGroup, ClassroomRoom, GroupAssessmentReport } from '../types/game';
import { PRESET_GROUPS } from '../data/multiplayerPresets';

export { PRESET_GROUPS };
export type { PresetGroupInfo } from '../data/multiplayerPresets';

export interface RoomProgressUpdate {
  currentLevelId?: number;
  currentLevelTitle?: string;
  currentWorld?: string;
  stars?: number;
  harmony?: number;
  score?: number;
  currentWave?: number;
  timePlayedSeconds?: number;
  hotsCorrect?: number;
  hotsAttempted?: number;
  wrongAnswers?: number;
  categoryStats?: Record<string, { correct: number; total: number }>;
  isStuck?: boolean;
  needsSupport?: boolean;
  supportMessage?: string;
}

class MultiplayerClient {
  private ws: WebSocket | null = null;
  private currentCode: string | null = null;
  private currentGroupId: string | null = null;
  private listeners: ((room: ClassroomRoom) => void)[] = [];
  private assistanceListeners: ((help: { fromGroupName: string; helpType: string }) => void)[] = [];
  private teacherAssistListeners: ((data: { message: string; bonusHarmony: number }) => void)[] = [];
  private teacherAnnouncementListeners: ((msg: string) => void)[] = [];
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

  public onTeacherAssist(callback: (data: { message: string; bonusHarmony: number }) => void) {
    this.teacherAssistListeners.push(callback);
    return () => {
      this.teacherAssistListeners = this.teacherAssistListeners.filter((cb) => cb !== callback);
    };
  }

  public onTeacherAnnouncement(callback: (msg: string) => void) {
    this.teacherAnnouncementListeners.push(callback);
    return () => {
      this.teacherAnnouncementListeners = this.teacherAnnouncementListeners.filter((cb) => cb !== callback);
    };
  }

  public async getRoomsList(): Promise<{ code: string; title: string; groupCount: number; status: string }[]> {
    try {
      const res = await fetch('/api/rooms');
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    return [];
  }

  public async createOrJoinRoom(code: string, title?: string, teacherName?: string, mode?: 'raid' | 'tournament'): Promise<ClassroomRoom | null> {
    const cleanCode = (code || 'KELAS-4A').toUpperCase().trim();
    try {
      const res = await fetch('/api/rooms/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: cleanCode, title, teacherName, mode }),
      });
      if (res.ok) {
        const data = await res.json();
        this.currentCode = cleanCode;
        this.initWebSocket(cleanCode);
        this.startPolling(cleanCode);
        this.notify(data.room);
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

  public async updateProgress(progress: RoomProgressUpdate) {
    if (!this.currentCode || !this.currentGroupId) return;

    try {
      const res = await fetch(`/api/rooms/${this.currentCode}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          groupId: this.currentGroupId,
          progress,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        this.notify(data.room);
      }
    } catch (err) {
      console.error('Error reporting multiplayer progress:', err);
    }
  }

  public async requestSupport(message: string) {
    return this.sendAction('request_support', { message });
  }

  public async sendTeacherAssist(targetGroupId: string, message: string, bonusHarmony = 50) {
    return this.sendAction('teacher_assist', { targetGroupId, message, bonusHarmony });
  }

  public async sendTeacherBroadcast(message: string) {
    return this.sendAction('teacher_broadcast', { message });
  }

  public async hostStart() {
    return this.sendAction('host_start');
  }

  public async hostFinish() {
    return this.sendAction('host_finish');
  }

  public async hostReset() {
    return this.sendAction('host_reset');
  }

  public async getAssessmentReport(code?: string): Promise<{
    roomCode: string;
    title: string;
    teacherName: string;
    totalGroups: number;
    groupsReport: GroupAssessmentReport[];
  } | null> {
    const targetCode = (code || this.currentCode || 'KELAS-4A').toUpperCase().trim();
    try {
      const res = await fetch(`/api/rooms/${targetCode}/report`);
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.error('Error fetching assessment report:', err);
    }
    return null;
  }

  public async sendAction(
    actionType:
      | 'hots_answer'
      | 'place_defender'
      | 'send_help'
      | 'send_emote'
      | 'request_support'
      | 'teacher_assist'
      | 'teacher_broadcast'
      | 'host_start'
      | 'host_finish'
      | 'host_reset',
    payload: Record<string, unknown> = {}
  ) {
    const code = this.currentCode;
    if (!code) return;

    try {
      const res = await fetch(`/api/rooms/${code}/action`, {
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

  private initWebSocket(code: string, groupId?: string) {
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
          } else if (msg.type === 'teacher_assistance_received') {
            if (msg.targetGroupId === this.currentGroupId) {
              this.teacherAssistListeners.forEach((cb) =>
                cb({ message: msg.message, bonusHarmony: msg.bonusHarmony })
              );
            }
          } else if (msg.type === 'teacher_announcement') {
            this.teacherAnnouncementListeners.forEach((cb) => cb(msg.message));
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
export type { MultiRoomGroup, ClassroomRoom, GroupAssessmentReport };
