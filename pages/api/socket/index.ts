import { NextApiRequest } from 'next';
import { NextApiResponse } from 'next';
import { getSocketIO } from '@/app/lib/socket';
import { NextApiResponseServerIO } from '@/app/types/next';


export default function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
  if (res.socket?.server) {
    getSocketIO(res.socket.server);
  }
  
  res.end();
}

export const config = {
  api: {
    bodyParser: false,
  },
};