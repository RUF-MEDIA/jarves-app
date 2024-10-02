// pages/api/getSales.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const sales = await prisma.sales.findMany({
      include: {
        unternehmen: {
          select: {
            name: true,
          },
        },
        ansprechpartner: {
          select: {
            vorname: true,
            nachname: true,
          },
        },
        erstelltVon: {
          select: {
            name: true,
          },
        },
        letzteAenderungVon: {
          select: {
            name: true,
          },
        },
      },
    });

    const formattedSales = sales.map((s) => ({
      id: s.id,
      autogeneratedNr: s.autogeneratedNr,
      unternehmenId: s.unternehmenId,
      unternehmenName: s.unternehmen?.name,
      ansprechpartnerId: s.ansprechpartnerId,
      ansprechpartnerName: s.ansprechpartner ? `${s.ansprechpartner.vorname} ${s.ansprechpartner.nachname}` : null,
      bewerberstatus: s.bewerberstatus,
      erstelltAm: s.erstelltAm,
      erstelltVonId: s.erstelltVonId,
      erstelltVonName: s.erstelltVon?.name,
      interview1: s.interview1,
      interview2: s.interview2,
      interview3: s.interview3,
      kurzbeschreibungStelle: s.kurzbeschreibungStelle,
      letzteAenderungAm: s.letzteAenderungAm,
      letzteAenderungVonId: s.letzteAenderungVonId,
      letzteAenderungVonName: s.letzteAenderungVon?.name,
      notizen: s.notizen,
      prozessGeschlossenWeil: s.prozessGeschlossenWeil,
      startdatum: s.startdatum,
      vertragsgespraech: s.vertragsgespraech,
      vorgestelltAm: s.vorgestelltAm,
      absage: s.absage,
    }));

    res.status(200).json(formattedSales);
  } catch (error) {
    console.error('Error fetching sales:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error instanceof Error ? error.message : String(error) });
  }
}