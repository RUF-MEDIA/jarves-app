import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { currentCompanyId, selectedCompany, unternehmensverknuepfung } = req.body;

  if (!currentCompanyId || !selectedCompany || !unternehmensverknuepfung) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Verknüpfung vom aktuellen Unternehmen zum ausgewählten Unternehmen, aber ohne die Verknüpfungsart hinzuzufügen
    const updatedCurrentCompany = await prisma.unternehmen.update({
      where: { id: currentCompanyId },
      data: {
        verknuepfteUnternehmen: {
          connect: { id: selectedCompany },
        },
      },
    });

    console.log('Current company updated successfully:', updatedCurrentCompany);

    // Verknüpfung vom ausgewählten Unternehmen zum aktuellen Unternehmen, hier wird die Verknüpfungsart gesetzt
    const updatedSelectedCompany = await prisma.unternehmen.update({
      where: { id: selectedCompany },
      data: {
        verknuepfteUnternehmen: {
          connect: { id: currentCompanyId },
        },
        unternehmensverknuepfung: unternehmensverknuepfung, // Nur für das ausgewählte Unternehmen setzen
      },
    });

    console.log('Selected company updated successfully:', updatedSelectedCompany);

    // Antwort mit beiden aktualisierten Unternehmen
    res.status(200).json({ updatedCurrentCompany, updatedSelectedCompany });
  } catch (error) {
    console.error('Error linking companies:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
