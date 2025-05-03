import { Server as NetServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

let io: SocketIOServer | null = null;

export function getSocketIO(server?: NetServer) {
  if (!io && server) {
    io = new SocketIOServer(server, {
      path: '/api/socket',
      addTrailingSlash: false,
    });
    
    io.on('connection', (socket) => {
      console.log('Socket connected:', socket.id);
      
      socket.on('send-message', ({ to, message }) => {
        socket.to(to).emit('receive-message', { from: socket.id, message });
      });
      
      socket.on('join-room', (roomId) => {
        socket.join(roomId);
        console.log(`${socket.id} joined ${roomId}`);
      });
    });
  }
  
  return io;
}
