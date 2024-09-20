// pages/api/profile.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { vorname: true, name: true, email: true, profilBild: true },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (req.method === 'GET') {
      // Rückgabe der Profilinformationen
      return res.status(200).json({
        vorname: user.vorname,
        name: user.name,
        email: user.email,
        profilBild: user.profilBild,
      });
    } else if (req.method === 'PUT') {
      // Aktualisierung der Profilinformationen
      const { vorname, name, email, password } = req.body;

      // Optional: Validierung der Eingabedaten hier durchführen

      // Aktualisieren der Benutzerdaten
      const updatedUser = await prisma.user.update({
        where: { id: decoded.userId },
        data: {
          vorname,
          name,
          email,
          password: password ? await bcrypt.hash(password, 10) : undefined, // Passwort nur aktualisieren, wenn es gesetzt ist
        },
      });

      return res.status(200).json({ message: 'Profil erfolgreich aktualisiert' });
    } else {
      res.setHeader('Allow', ['GET', 'PUT']);
      return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error('Error handling profile:', error);
    return res.status(401).json({ message: 'Invalid token' });
  }
}
