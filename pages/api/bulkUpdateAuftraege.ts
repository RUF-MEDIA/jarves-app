// pages/api/bulkUpdateAuftraege.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, AuftragStatus, AuftragQuelle } from '@prisma/client';

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
      if (!Object.values(AuftragStatus).includes(updates.status)) {
        return res.status(400).json({ error: 'Ungültiger Statuswert' });
      }
      updateData.status = updates.status;
    }

    // Quelle aktualisieren
    if (updates.quelle) {
      if (!Object.values(AuftragQuelle).includes(updates.quelle)) {
        return res.status(400).json({ error: 'Ungültiger Quellwert' });
      }
      updateData.quelle = updates.quelle;
    }

    // Betreuer aktualisieren
    if (updates.betreuerId) {
      const betreuerExists = await prisma.users.findUnique({ where: { id: updates.betreuerId } });
      if (!betreuerExists) {
        return res.status(400).json({ error: 'Betreuer-ID nicht gültig' });
      }
      updateData.betreuerId = updates.betreuerId;
    }

    // Weitere Felder können hier hinzugefügt werden, falls benötigt

    // Führe die Aktualisierung durch
    await prisma.auftrag.updateMany({
      where: { id: { in: ids } },
      data: updateData,
    });

    res.status(200).json({ message: 'Aufträge erfolgreich aktualisiert' });
  } catch (error) {
    console.error('Fehler beim Aktualisieren der Aufträge:', error);
    res.status(500).json({ error: 'Fehler beim Aktualisieren der Aufträge' });
  }
}
