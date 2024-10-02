// pages/api/bulkUpdateKontaktpersonen.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, AnsprechpartnerStatus, AnsprechpartnerKategorie } from '@prisma/client';

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

    // Status aktualisieren
    if (updates.status) {
      if (!Object.values(AnsprechpartnerStatus).includes(updates.status)) {
        return res.status(400).json({ error: 'Ungültiger Statuswert' });
      }
      updateData.status = updates.status;
    }

    // Kategorie aktualisieren
    if (updates.kategorie) {
      if (!Object.values(AnsprechpartnerKategorie).includes(updates.kategorie)) {
        return res.status(400).json({ error: 'Ungültiger Kategorienwert' });
      }
      updateData.kategorie = updates.kategorie;
    }

    // Betreuer aktualisieren
    if (updates.betreuerId) {
      const betreuerExists = await prisma.user.findUnique({ where: { id: updates.betreuerId } });
      if (!betreuerExists) {
        return res.status(400).json({ error: 'Betreuer-ID nicht gültig' });
      }
      updateData.betreuerId = updates.betreuerId;
    }

    // Weitere Felder können hier hinzugefügt werden, falls benötigt

    // Führe die Aktualisierung durch
    await prisma.ansprechpartner.updateMany({
      where: { id: { in: ids } },
      data: updateData,
    });

    res.status(200).json({ message: 'Kontaktpersonen erfolgreich aktualisiert' });
  } catch (error) {
    console.error('Fehler beim Aktualisieren der Kontaktpersonen:', error);
    res.status(500).json({ error: 'Fehler beim Aktualisieren der Kontaktpersonen' });
  }
}
