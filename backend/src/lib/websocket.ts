import { WebSocketServer, WebSocket } from 'ws';
import { Server as HttpServer } from 'http';

export type EventType =
  | 'SUBMISSION_NEW'
  | 'SUBMISSION_APPROVED'
  | 'SUBMISSION_REVISION'
  | 'DISPUTE_RAISED'
  | 'DISPUTE_RESOLVED'
  | 'WITHDRAWAL_REQUESTED'
  | 'WITHDRAWAL_STATUS_CHANGED'
  | 'REVIEW_SUBMITTED'
  | 'BOUNTY_CREATED';

export interface RealtimeEvent {
  type: EventType;
  title: string;
  message: string;
  roleTarget?: 'TALENT' | 'CLIENT' | 'ADMIN' | 'ALL';
  bountyId?: string;
  data?: any;
  timestamp?: string;
}

interface ExtendedWebSocket extends WebSocket {
  isAlive?: boolean;
}

let wss: WebSocketServer | null = null;
const clients = new Set<ExtendedWebSocket>();

export function initWebSocket(server: HttpServer) {
  wss = new WebSocketServer({ server, path: '/ws' });

  wss.on('connection', (ws: ExtendedWebSocket) => {
    ws.isAlive = true;
    clients.add(ws);

    // Heartbeat listener
    ws.on('pong', () => {
      ws.isAlive = true;
    });

    // Send welcome handshake message
    ws.send(
      JSON.stringify({
        type: 'CONNECTED',
        title: 'WebSocket Terhubung',
        message: 'Menerima pembaruan notifikasi realtime SkillBounty.',
        timestamp: new Date().toISOString()
      })
    );

    ws.on('message', (message: string) => {
      try {
        const parsed = JSON.parse(message.toString());
        if (parsed.type === 'PING') {
          ws.isAlive = true;
          ws.send(JSON.stringify({ type: 'PONG', timestamp: new Date().toISOString() }));
        }
      } catch (e) {}
    });

    ws.on('close', () => {
      clients.delete(ws);
    });

    ws.on('error', (err) => {
      console.error('WebSocket Client Error:', err);
      clients.delete(ws);
    });
  });

  // Heartbeat ping interval every 30s to prune dead sockets & avoid memory leaks
  const heartbeatInterval = setInterval(() => {
    clients.forEach((ws) => {
      if (ws.isAlive === false) {
        clients.delete(ws);
        return ws.terminate();
      }
      ws.isAlive = false;
      ws.ping();
    });
  }, 30000);

  wss.on('close', () => {
    clearInterval(heartbeatInterval);
  });

  console.log('⚡ WebSocket Server initialized at ws://localhost:5000/ws with Heartbeat Keeper');
}

export function broadcastEvent(event: RealtimeEvent) {
  const payload = JSON.stringify({
    ...event,
    timestamp: event.timestamp || new Date().toISOString()
  });

  console.log(`📡 [WS BROADCAST] [${event.type}] ${event.title}: ${event.message}`);

  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });
}
