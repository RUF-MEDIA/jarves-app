// pages/api/bulkDeleteUnternehmen.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Methode ${req.method} ist nicht erlaubt`);
  }

  const { ids } = req.body;

  try {
    // Überprüfe, ob IDs bereitgestellt wurden
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'Keine IDs bereitgestellt' });
    }

    // Lösche die Unternehmen
    await prisma.unternehmen.deleteMany({
      where: { id: { in: ids } },
    });

    res.status(200).json({ message: 'Unternehmen erfolgreich gelöscht' });
  } catch (error) {
    console.error('Fehler beim Löschen der Unternehmen:', error);

    // Spezifische Fehlerbehandlung für Fremdschlüsselverletzungen
    if ((error as any).code === 'P2003') {
      return res.status(400).json({ error: 'Unternehmen können aufgrund verknüpfter Datensätze nicht gelöscht werden' });
    }

    res.status(500).json({ error: 'Fehler beim Löschen der Unternehmen' });
  }
}
