// pages/api/bulkUpdateUnternehmen.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, Standort, Unternehmensverknuepfung, Status } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Methode ${req.method} ist nicht erlaubt`);
  }

  const { ids, updates } = req.body;

  try {
    // Überprüfe, ob IDs bereitgestellt wurden
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'Keine IDs bereitgestellt' });
    }

    const updateData: any = {};

    // Validierung und Zuordnung der Updates

    // Status aktualisieren
    if (updates.status) {
      if (!Object.values(Status).includes(updates.status as Status)) {
        return res.status(400).json({ error: 'Ungültiger Statuswert' });
      }
      updateData.status = updates.status;
    }

    // Kategorie aktualisieren
    if (updates.kategorie) {
      const parsedKategorie = parseInt(updates.kategorie, 10);
      if (isNaN(parsedKategorie)) {
        return res.status(400).json({ error: 'Ungültiger Kategorienwert' });
      }
      updateData.kategorie = parsedKategorie;
    }

    // Betreuer aktualisieren
    if (updates.betreuerId) {
      const betreuerExists = await prisma.user.findUnique({ where: { id: updates.betreuerId } });
      if (!betreuerExists) {
        return res.status(400).json({ error: 'Betreuer-ID nicht gültig' });
      }
      updateData.betreuerId = updates.betreuerId;
    }

    // Unternehmensverknüpfung aktualisieren
    if (updates.unternehmensverknuepfung) {
      if (!Object.values(Unternehmensverknuepfung).includes(updates.unternehmensverknuepfung as Unternehmensverknuepfung)) {
        return res.status(400).json({ error: 'Ungültiger Wert für Unternehmensverknüpfung' });
      }
      updateData.unternehmensverknuepfung = updates.unternehmensverknuepfung;
    }

    // Führe die Aktualisierung durch
    await prisma.unternehmen.updateMany({
      where: { id: { in: ids } },
      data: updateData,
    });

    res.status(200).json({ message: 'Unternehmen erfolgreich aktualisiert' });
  } catch (error) {
    console.error('Fehler beim Aktualisieren der Unternehmen:', error);
    res.status(500).json({ error: 'Fehler beim Aktualisieren der Unternehmen' });
  }
}
