// pages/api/linkedCompanies.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { currentCompanyId } = req.query;

  if (!currentCompanyId || typeof currentCompanyId !== 'string') {
    return res.status(400).json({ message: 'Invalid currentCompanyId' });
  }

  try {
    const currentCompany = await prisma.unternehmen.findUnique({
      where: { id: currentCompanyId },
      include: { verknuepfteUnternehmen: true },
    });

    if (!currentCompany) {
      return res.status(404).json({ message: 'Company not found' });
    }

    const linkedCompanies = [
      {
        id: currentCompany.id,
        name: currentCompany.name,
        unternehmensverknuepfung: currentCompany.unternehmensverknuepfung,
      },
      ...currentCompany.verknuepfteUnternehmen.map((company) => ({
        id: company.id,
        name: company.name,
        unternehmensverknuepfung: company.unternehmensverknuepfung,
      })),
    ];

    res.status(200).json(linkedCompanies);
  } catch (error) {
    console.error('Error fetching linked companies:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
