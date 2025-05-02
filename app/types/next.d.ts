import type { NextApiResponse } from 'next';
import type { Server as NetServer } from 'http';
import type { Server as IOServer } from 'socket.io';

export type NextApiResponseServerIO = NextApiResponse & {
  socket: NetServer & {
    server: NetServer & {
      io: IOServer;
    };
  };
};