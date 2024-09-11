import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, Standort, Unternehmensverknuepfung } from '@prisma/client';

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
    standort, // Standort kommt als String aus dem Frontend
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
    betreuerId,
    unternehmensverknuepfung, // Verknüpfung vom Frontend
  } = req.body;

  try {
    // Validierung für `kategorie`-Wert
    const kategorieValue: number | undefined = kategorie ? parseInt(kategorie, 10) : undefined;

    // Validierung für `standort`: Überprüfen, ob der Wert mit dem Prisma-Enum übereinstimmt
    const validStandort: Standort | null = Object.values(Standort).includes(standort as Standort) ? (standort as Standort) : null;

    // Validierung für `unternehmensverknuepfung`: Überprüfen, ob der Wert mit dem Prisma-Enum übereinstimmt
    const validVerknuepfung: Unternehmensverknuepfung | null = Object.values(Unternehmensverknuepfung).includes(
      unternehmensverknuepfung as Unternehmensverknuepfung
    )
      ? (unternehmensverknuepfung as Unternehmensverknuepfung)
      : null;

    // Aufbau der Daten für das Update
    const updateData: any = {
      name,
      strasse,
      postleitzahl,
      stadt,
      standort: validStandort, // Standort als Prisma Enum oder null, wenn ungültig
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
      betreuerId,
      unternehmensverknuepfung: validVerknuepfung, // Verknüpfung als Prisma Enum oder null, wenn ungültig
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
