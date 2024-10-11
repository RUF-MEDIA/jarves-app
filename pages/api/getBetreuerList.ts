// pages/api/getBetreuerList.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log('Fetching user list');
    const userList = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        vorname: true,
      },
    });

    if (!userList || userList.length === 0) {
      return res.status(404).json({ error: 'Keine Benutzer gefunden' });
    }

    res.status(200).json(userList);
  } catch (error) {
    console.error('Error fetching user list:', error);
    if (error instanceof Error) {
      res.status(500).json({ error: 'Fehler beim Abrufen der Benutzerliste', details: error.message });
    } else {
      res.status(500).json({ error: 'Unbekannter Fehler aufgetreten' });
    }
  }
}
