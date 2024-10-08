// pages/api/getUnternehmen.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const unternehmen = await prisma.unternehmen.findMany({
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

    const formattedUnternehmen = unternehmen.map((unternehmen) => ({
      id: unternehmen.id,
      name: unternehmen.name,
      status: unternehmen.status,
      kategorie: unternehmen.kategorie,
      strasse: unternehmen.strasse,
      postleitzahl: unternehmen.postleitzahl,
      stadt: unternehmen.stadt,
      umsatzsteuerId: unternehmen.umsatzsteuerId,
      standort: unternehmen.standort,
      homepage: unternehmen.homepage,
      jobsite: unternehmen.jobsite,
      linkedin: unternehmen.linkedin,
      xing: unternehmen.xing,
      zentraleMail: unternehmen.zentraleMail,
      zentralTelefon: unternehmen.zentralTelefon,
      vermittlungsprovision: unternehmen.vermittlungsprovision,
      usbBeschreibung: unternehmen.usbBeschreibung,
      interneNotizen: unternehmen.interneNotizen,
      erstelltAm: unternehmen.erstelltAm.toISOString(),
      letzteAenderungAm: unternehmen.letzteAenderungAm?.toISOString(),
      autogeneratedNr: unternehmen.autogeneratedNr,
      unternehmensverknuepfung: unternehmen.unternehmensverknuepfung,
      betreuer: unternehmen.betreuer
        ? {
            id: unternehmen.betreuer.id,
            name: `${unternehmen.betreuer.vorname} ${unternehmen.betreuer.name}`,
          }
        : null,
    }));

    res.status(200).json(formattedUnternehmen);
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
