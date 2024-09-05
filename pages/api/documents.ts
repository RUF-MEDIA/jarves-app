// pages/api/documents.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { unternehmenId } = req.query;

  if (!unternehmenId) {
    return res.status(400).json({ error: 'unternehmenId is required' });
  }

  try {
    const documents = await prisma.dokument.findMany({
      where: {
        unternehmenId: unternehmenId as string,
      },
    });

    res.status(200).json(documents);
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ error: 'Error fetching documents' });
  }
}
