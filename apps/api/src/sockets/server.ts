import { Server as HTTPServer } from 'http';
import { Server } from 'socket.io';
import { redis } from '../config/redis';
import { SOCKET_CHANNELS } from './events';

let io: Server | null = null;
let subscriber = redis.duplicate();
let subscribed = false;

async function subscribeToGenerationEvents(): Promise<void> {
  if (subscribed) return;

  await subscriber.connect();
  subscriber.on('message', (channel, message) => {
    if (!io || channel !== SOCKET_CHANNELS.GENERATION) return;

    const payload = JSON.parse(message) as Record<string, unknown>;
    io.emit(`generation:${payload.status as string}`, payload);
    console.log(`✓ websocket emit: generation:${payload.status as string}`);
  });

  await subscriber.subscribe(SOCKET_CHANNELS.GENERATION);
  subscribed = true;
}

export function initializeSocket(httpServer: HTTPServer): Server {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log(`✓ Socket connected: ${socket.id}`);

    socket.on('disconnect', () => {
      console.log(`✗ Socket disconnected: ${socket.id}`);
    });
  });

  void subscribeToGenerationEvents().catch((error) => {
    console.error('Failed to subscribe to generation socket events:', error);
  });

  return io;
}

export function getSocketServer(): Server | null {
  return io;
}

export async function closeSocketServer(): Promise<void> {
  if (subscriber.status !== 'end') {
    await subscriber.quit();
  }

  if (io) {
    void io.close();
    io = null;
  }

  subscribed = false;
  subscriber = redis.duplicate();
}
