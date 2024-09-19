// pages/api/getUnternehmen.ts
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const allUsers = await prisma.unternehmen.findMany({
      include: {
        betreuer: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    res.status(200).json(allUsers);
  } catch (error) {
    console.error('Fehler beim Abrufen der Unternehmen:', error);
    res.status(500).json({ error: 'Fehler beim Abrufen der Unternehmen' });
  }
}
