import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { currentCompanyId, contactId } = req.body;

  // Debugging: Logge die empfangenen Parameter
  console.log('currentCompanyId:', currentCompanyId);
  console.log('contactId:', contactId);

  if (!currentCompanyId || !contactId) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Entferne die Verknüpfung des Ansprechpartners vom Unternehmen
    const updatedCompany = await prisma.unternehmen.update({
      where: { id: currentCompanyId },
      data: {
        ansprechpartner: {
          disconnect: { id: contactId },
        },
      },
    });

    res.status(200).json(updatedCompany);
  } catch (error) {
    console.error('Error unlinking contact:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
