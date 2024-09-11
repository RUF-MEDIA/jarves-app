import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { currentCompanyId, companyId } = req.body;

  if (!currentCompanyId || !companyId) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Entfernen der Verknüpfung aus dem aktuellen Unternehmen
    await prisma.unternehmen.update({
      where: { id: currentCompanyId },
      data: {
        verknuepfteUnternehmen: {
          disconnect: { id: companyId },
        },
      },
    });

    // Entfernen der Verknüpfung aus dem anderen Unternehmen
    await prisma.unternehmen.update({
      where: { id: companyId },
      data: {
        verknuepfteUnternehmen: {
          disconnect: { id: currentCompanyId },
        },
      },
    });

    res.status(200).json({ message: 'Verknüpfung erfolgreich entfernt' });
  } catch (error) {
    console.error('Error unlinking company:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
