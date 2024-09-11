import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { currentCompanyId, selectedContactId } = req.body;

  // Debugging: Logge die empfangenen Parameter
  console.log('currentCompanyId:', currentCompanyId);
  console.log('selectedContactId:', selectedContactId);

  if (!currentCompanyId || !selectedContactId) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Verknüpfe den Ansprechpartner mit dem Unternehmen
    const updatedCompany = await prisma.unternehmen.update({
      where: { id: currentCompanyId },
      data: {
        ansprechpartner: {
          connect: { id: selectedContactId },
        },
      },
    });

    res.status(200).json(updatedCompany);
  } catch (error) {
    console.error('Error linking contact:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
