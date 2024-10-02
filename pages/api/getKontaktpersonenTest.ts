// pages/api/getKontaktpersonenTest.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const kontaktpersonen = await prisma.ansprechpartner.findMany({
      include: {
        betreuer: {
          select: {
            id: true,
            vorname: true,
            name: true,
          },
        },
        unternehmen: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const formattedKontaktpersonen = kontaktpersonen.map((k) => ({
      id: k.id,
      autogeneratedNr: k.autogeneratedNr,
      email: k.email,
      anrede: k.anrede,
      duAnsprache: k.duAnsprache,
      erstelltAm: k.erstelltAm.toISOString(),
      kategorie: k.kategorie,
      letzteAenderungAm: k.letzteAenderungAm?.toISOString(),
      linkedin: k.linkedin,
      mobil: k.mobil,
      nachname: k.nachname,
      notiz: k.notiz,
      positionJobtitel: k.positionJobtitel,
      status: k.status,
      telefon: k.telefon,
      titel: k.titel,
      vorname: k.vorname,
      xing: k.xing,
      betreuer: k.betreuer
        ? {
            id: k.betreuer.id,
            name: `${k.betreuer.vorname} ${k.betreuer.name}`,
          }
        : null,
      unternehmen: k.unternehmen.map((u) => ({
        id: u.id,
        name: u.name,
      })),
    }));

    res.status(200).json(formattedKontaktpersonen);
  } catch (error) {
    console.error('Error fetching contact persons:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error instanceof Error ? error.message : String(error) });
  }
}