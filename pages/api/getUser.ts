// pages/api/getUser.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid ID' });
  }

  try {
    console.log(`Fetching user with ID: ${id}`);
    const user = await prisma.unternehmen.findUnique({
      where: { id },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    if (error instanceof Error) {
      res.status(500).json({ error: 'Error fetching user', details: error.message });
    } else {
      res.status(500).json({ error: 'Unknown error occurred' });
    }
  }
}
