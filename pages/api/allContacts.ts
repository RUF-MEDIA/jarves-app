import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const allContacts = await prisma.ansprechpartner.findMany({
      select: {
        id: true,
        vorname: true,
        nachname: true,
        positionJobtitel: true,
      },
    });

    res.status(200).json(allContacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
