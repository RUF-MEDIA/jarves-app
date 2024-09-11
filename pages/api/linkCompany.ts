// pages/api/linkCompany.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // Logge den gesamten Request Body
  console.log('Request Body:', req.body);

  const { currentCompanyId, selectedCompany, unternehmensverknuepfung } = req.body;

  // Logge die Parameter, um sicherzustellen, dass sie korrekt übergeben wurden
  console.log('currentCompanyId:', currentCompanyId);
  console.log('selectedCompany:', selectedCompany);
  console.log('unternehmensverknuepfung:', unternehmensverknuepfung);

  if (!currentCompanyId || !selectedCompany || !unternehmensverknuepfung) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Verknüpfung vom aktuellen Unternehmen zum ausgewählten Unternehmen
    const updatedCurrentCompany = await prisma.unternehmen.update({
      where: { id: currentCompanyId },
      data: {
        verknuepfteUnternehmen: {
          connect: { id: selectedCompany },
        },
        unternehmensverknuepfung: unternehmensverknuepfung,
      },
    });

    console.log('Current company updated successfully:', updatedCurrentCompany);

    // Verknüpfung vom ausgewählten Unternehmen zum aktuellen Unternehmen (auf der anderen Seite)
    const updatedSelectedCompany = await prisma.unternehmen.update({
      where: { id: selectedCompany },
      data: {
        verknuepfteUnternehmen: {
          connect: { id: currentCompanyId },
        },
        unternehmensverknuepfung: unternehmensverknuepfung,
      },
    });

    console.log('Selected company updated successfully:', updatedSelectedCompany);

    // Antwort mit beiden aktualisierten Unternehmen
    res.status(200).json({ updatedCurrentCompany, updatedSelectedCompany });
  } catch (error) {
    // Logge den Fehler für detaillierte Debugging-Informationen
    console.error('Error linking companies:', error);

    res.status(500).json({ message: 'Internal Server Error' });
  }
}
