//pages/api/updateStammdaten.tsx
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
    betreuerId,
    unternehmensverknuepfung,
    hauptansprechpartnerId,
    umsatzsteuerId,
  } = req.body;

  try {
    // Überprüfe, ob die Betreuer-ID gültig ist
    if (betreuerId) {
      const betreuerExists = await prisma.user.findUnique({ where: { id: betreuerId } });
      if (!betreuerExists) {
        return res.status(400).json({ message: 'Betreuer-ID nicht gültig' });
      }
    }

    // Überprüfe, ob die Hauptansprechpartner-ID gültig ist
    if (hauptansprechpartnerId) {
      const hauptansprechpartnerExists = await prisma.ansprechpartner.findUnique({ where: { id: hauptansprechpartnerId } });
      if (!hauptansprechpartnerExists) {
        return res.status(400).json({ message: 'Hauptansprechpartner-ID nicht gültig' });
      }
    }

    // Validierungen für Standort und Unternehmensverknüpfung
    const validStandort: Standort | null = Object.values(Standort).includes(standort as Standort) ? (standort as Standort) : null;
    const validVerknuepfung: Unternehmensverknuepfung | null = Object.values(Unternehmensverknuepfung).includes(
      unternehmensverknuepfung as Unternehmensverknuepfung
    )
      ? (unternehmensverknuepfung as Unternehmensverknuepfung)
      : null;

    // Update-Daten vorbereiten
    const updateData: any = {
      name,
      strasse,
      postleitzahl,
      stadt,
      standort: validStandort,
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
      unternehmensverknuepfung: validVerknuepfung,
      hauptansprechpartnerId,
    };

    // Optional: Kategoriewert hinzufügen
    if (kategorie) {
      updateData.kategorie = parseInt(kategorie, 10);
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
