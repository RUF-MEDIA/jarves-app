// pages/api/uploadStammdaten.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const {
    id,
    name,
    strasse,
    postleitzahl,
    stadt,
    standort,
    homepage,
    jobsite,
    linkedin,
    xing,
    status,
    kategorie,
    zentraleMail,
    zentralTelefon,
    hauptansprechpartner,
    vermittlungsprovision,
    vermittlungsprovisionIntervall,
    usbBeschreibung,
    interneNotizen,
  } = req.body;

  try {
    const updatedUnternehmen = await prisma.unternehmen.update({
      where: { id },
      data: {
        name,
        strasse,
        postleitzahl,
        stadt,
        standort,
        homepage,
        jobsite,
        linkedin,
        xing,
        status,
        kategorie,
        zentraleMail,
        zentralTelefon,
        vermittlungsprovision,
        usbBeschreibung,
        interneNotizen,
      },
    });

    res.status(200).json(updatedUnternehmen);
  } catch (error) {
    console.error('Error updating company data:', error);
    res.status(500).json({ error: 'Error updating company data' });
  }
}
