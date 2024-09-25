import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { unternehmenId } = req.query;

  if (!unternehmenId || typeof unternehmenId !== 'string') {
    return res.status(400).json({ message: 'Ungültige unternehmenId' });
  }

  try {
    const documents = await prisma.dokument.findMany({
      where: { unternehmenId: unternehmenId },
      include: {
        ersteller: {
          select: {
            id: true,
            vorname: true,
            name: true,
          },
        },
      },
    });

    res.status(200).json(documents);
  } catch (error) {
    console.error('Fehler beim Abrufen der Dokumente:', error);
    res.status(500).json({ message: 'Interner Serverfehler', error: (error as Error).message });
  }
}
