// import type { NextApiRequest } from 'next';
// import { Server as NetServer } from 'http';
// import { Server as SocketIOServer } from 'socket.io';
// import type { NextApiResponseServerIO } from '../../../types/next';

// let io: SocketIOServer | null = null;

// async function GET(req: NextApiRequest, res: NextApiResponseServerIO) {
//   if (!io) {
//     const httpServer: NetServer = res.socket.server as any;
//     io = new SocketIOServer(httpServer, {
//       path: '/api/user/socket',
//     });
//     io.on('connection', (socket) => {
//       console.log('Socket connected:', socket.id);
//       socket.on('send-message', ({ to, message }) => {
//         socket.to(to).emit('receive-message', { from: socket.id, message });
//       });
//       socket.on('join-room', (roomId) => {
//         socket.join(roomId);
//         console.log(`${socket.id} joined ${roomId}`);
//       });
//     });
//   }
//   res.end();
// }

// async function POST(req: NextApiRequest, res: NextApiResponseServerIO) {
//   res.end();
// }

// export { GET, POST };

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };