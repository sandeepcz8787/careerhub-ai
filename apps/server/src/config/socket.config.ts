import type { Server } from 'http';

import { Server as SocketIOServer } from 'socket.io';

import { env } from './env.config';
import { logger } from '../utils/logger.util';

let io: SocketIOServer | null = null;

/**
 * Initialize Socket.io on the HTTP server.
 */
export function initSocketIO(httpServer: Server): SocketIOServer {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: env.ALLOWED_ORIGINS,
      credentials: true,
      methods: ['GET', 'POST'],
    },
    transports: ['websocket', 'polling'],
    pingTimeout: 60_000,
    pingInterval: 25_000,
  });

  io.on('connection', (socket) => {
    logger.debug(`Socket connected: ${socket.id}`);

    // Join a user-specific room (authentication happens in middleware)
    socket.on('join:room', (roomId: string) => {
      void socket.join(roomId);
      logger.debug(`Socket ${socket.id} joined room: ${roomId}`);
    });

    socket.on('leave:room', (roomId: string) => {
      void socket.leave(roomId);
    });

    socket.on('disconnect', (reason) => {
      logger.debug(`Socket disconnected: ${socket.id} — reason: ${reason}`);
    });

    socket.on('error', (error) => {
      logger.error(`Socket error on ${socket.id}:`, error);
    });
  });

  logger.info('✅ Socket.io initialized');
  return io;
}

/**
 * Get the Socket.io server instance.
 */
export function getSocketIO(): SocketIOServer {
  if (!io) {
    throw new Error('Socket.io not initialized. Call initSocketIO() first.');
  }
  return io;
}

/**
 * Emit an event to a specific user room.
 */
export function emitToUser(userId: string, event: string, data: unknown): void {
  if (!io) { return; }
  io.to(`user:${userId}`).emit(event, data);
}

/**
 * Broadcast to all connected clients.
 */
export function broadcast(event: string, data: unknown): void {
  if (!io) { return; }
  io.emit(event, data);
}
