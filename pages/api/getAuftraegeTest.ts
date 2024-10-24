// pages/api/getAuftraegeTest.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const auftraege = await prisma.auftrag.findMany({
      include: {
        betreuer: {
          select: {
            id: true,
            vorname: true,
            name: true,
          },
        },
      },
    });

    const formattedAuftraege = auftraege.map((a) => ({
      id: a.id,
      autogeneratedNr: a.autogeneratedNr,
      job: a.job,
      status: a.status,
      kategorie: a.kategorie,
      einsatzort: a.einsatzort,
      postleitzahl: a.postleitzahl,
      strasse: a.strasse,
      startAb: a.startAb?.toISOString(),
      spaetestensZuBesetzenBis: a.spaetestensZuBesetzenBis?.toISOString(),
      grundgehaltBruttoJahr: a.grundgehaltBruttoJahr,
      gehaltObergrenzeBruttoJahr: a.gehaltObergrenzeBruttoJahr,
      anzahlOffenePositionen: a.anzahlOffenePositionen,
      erstelltAm: a.erstelltAm.toISOString(),
      letzteAenderungAm: a.letzteAenderungAm?.toISOString(),
      betreuer: a.betreuer
        ? {
            id: a.betreuer.id,
            name: `${a.betreuer.vorname} ${a.betreuer.name}`,
          }
        : null,
    }));

    res.status(200).json(formattedAuftraege);
  } catch (error) {
    console.error('Error fetching Aufträge:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error instanceof Error ? error.message : String(error) });
  }
}