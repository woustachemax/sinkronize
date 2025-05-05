import { NextApiRequest, NextApiResponse } from 'next';
import client from '@/app/lib/db';
import jwt, { JwtPayload } from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (typeof decoded === 'string' || !('id' in decoded)) {
      return res.status(401).json({ error: 'Invalid token payload' });
    }

    const userId = (decoded as JwtPayload).id;

    if (req.method === 'GET') {
      const { friendId } = req.query;
      
      if (!friendId || typeof friendId !== 'string') {
        return res.status(400).json({ error: 'Friend ID is required' });
      }

      const messages = await client.message.findMany({
        where: {
          OR: [
            { senderId: userId, recipientId: friendId },
            { senderId: friendId, recipientId: userId }
          ]
        },
        orderBy: {
          createdAt: 'asc'
        }
      });

      return res.status(200).json({ messages });
    } 
    else if (req.method === 'POST') {
      const { text, recipientId } = req.body;
      
      if (!text || !recipientId) {
        return res.status(400).json({ error: 'Text and recipient ID are required' });
      }

      const message = await client.message.create({
        data: {
          text,
          senderId: userId,
          recipientId
        }
      });

      return res.status(201).json({ message });
    }
    
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Message API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
