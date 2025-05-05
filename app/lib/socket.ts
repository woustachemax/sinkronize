import { Server as SocketIOServer } from 'socket.io';
import { Server as NetServer } from 'http';
import client from '@/app/lib/db';
import jwt, { JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export const getSocketIO = (server: NetServer) => {
  if (!(server as any).io) {
    console.log('*First use, starting Socket.io');

    const io = new SocketIOServer(server, {
      path: '/api/socket',
      addTrailingSlash: false,
    });

    (server as any).io = io;

    io.on('connection', (socket) => {
      console.log('New client connected:', socket.id);

      socket.on('join-room', (userId: string) => {
        socket.join(userId);
        console.log(`User ${userId} joined room`);
      });

      socket.on('send-message', async (payload: { to: string; message: string; from?: string }) => {
        try {
          const { from: senderId, to: recipientId, message: text } = payload;

          if (!senderId) {
            console.error('No sender ID provided for message');
            return;
          }

          const message = await client.message.create({
            data: {
              text,
              senderId,
              recipientId
            }
          });

          io.to(recipientId).emit('receive-message', {
            from: senderId,
            message: text,
            timestamp: message.createdAt.getTime(),
            messageId: message.id
          });

        } catch (error) {
          console.error('Error saving message:', error);
        }
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });
  }

  return (server as any).io;
};

export const setupSocketAuth = (io: SocketIOServer) => {
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error('Authentication error'));
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);

      if (typeof decoded === 'string' || !('id' in decoded)) {
        return next(new Error('Invalid token payload'));
      }

      socket.data.userId = (decoded as JwtPayload).id;
      next();
    } catch (err) {
      return next(new Error('Authentication error'));
    }
  });
};
