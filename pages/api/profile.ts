import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ message: 'Authorization header required' });
  }

  const token = authorization.split(' ')[1];

  try {
    // Token dekodieren
    const decoded: any = jwt.verify(token, JWT_SECRET);

    // Verwende 'userId' aus dem Token
    const userId = decoded.userId;

    if (!userId) {
      return res.status(400).json({ message: 'Invalid token, no userId found' });
    }

    // GET-Methode, um die Profildaten abzurufen
    if (req.method === 'GET') {
      try {
        const user = await prisma.user.findUnique({
          where: { id: userId },
        });

        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }

        // Rückgabe der Benutzerdaten inklusive `profilBild`
        return res.status(200).json({
          vorname: user.vorname,
          name: user.name,
          email: user.email,
          profilBild: user.profilBild || null, // Profilbild-Feld zurückgeben
        });
      } catch (error) {
        console.error('Error fetching user:', error);
        return res.status(500).json({ message: 'Error fetching user' });
      }
    } else if (req.method === 'PUT') {
      // Update-Methode, um Profildaten zu aktualisieren
      try {
        const { vorname, name, email, password } = req.body;

        const updatedUser = await prisma.user.update({
          where: { id: userId },
          data: { vorname, name, email },
        });

        return res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
      } catch (error) {
        console.error('Error updating user:', error);
        return res.status(500).json({ message: 'Error updating user' });
      }
    }

    return res.status(405).json({ message: 'Method Not Allowed' });
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
