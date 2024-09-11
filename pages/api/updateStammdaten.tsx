import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, Standort } from '@prisma/client';

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
    vermittlungsprovision,
    usbBeschreibung,
    interneNotizen,
    betreuerId, // Hinzugefügt: betreuerId vom Request
  } = req.body;

  try {
    const kategorieValue: number | undefined = kategorie ? parseInt(kategorie, 10) : undefined;

    const updateData: any = {
      name,
      strasse,
      postleitzahl,
      stadt,
      standort: standort || null,
      homepage,
      jobsite,
      linkedin,
      xing,
      status,
      zentraleMail,
      zentralTelefon,
      vermittlungsprovision,
      usbBeschreibung,
      interneNotizen,
      betreuerId, // Aktualisiert: User ID für internen Betreuer
    };

    if (kategorieValue !== undefined) {
      updateData.kategorie = kategorieValue;
    }

    const updatedUnternehmen = await prisma.unternehmen.update({
      where: { id },
      data: updateData,
    });

    res.status(200).json(updatedUnternehmen);
  } catch (error) {
    console.error('Error updating company data:', error);
    res.status(500).json({ error: 'Error updating company data' });
  }
}
