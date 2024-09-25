import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { parse } from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const cookies = parse(req.headers.cookie || '');
  const token = cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Nicht authentifiziert' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    res.status(200).json({ userId: decoded.userId });
  } catch (error) {
    res.status(401).json({ message: 'Ungültiger Token' });
  }
}
