// pages/api/getTalenteTest.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    console.log('Initiating talente fetch...');

    const talente = await prisma.bewerber.findMany();

    console.log(`Successfully fetched ${talente.length} talente records`);

    const formattedTalente = await Promise.all(
      talente.map(async (t) => {
        let betreuer = null;
        if (t.betreuerId) {
          const betreuerData = await prisma.user.findUnique({
            where: { id: t.betreuerId },
            select: { id: true, vorname: true, name: true },
          });
          if (betreuerData) {
            betreuer = {
              id: betreuerData.id,
              name: `${betreuerData.vorname} ${betreuerData.name}`,
            };
          }
        }

        return {
          id: t.id,
          autogeneratedNr: t.autogeneratedNr,
          vorname: t.vorname || '',
          nachname: t.nachname,
          email: t.email,
          status: t.status,
          kategorie: t.kategorie,
          jobfield: t.jobfield, // Assuming jobfield is a field on the Bewerber model
          gehaltswunschBruttoJahr: t.gehaltswunschBruttoJahr,
          erstelltAm: t.erstelltAm.toISOString(),
          letzteAenderungAm: t.letzteAenderungAm?.toISOString(),
          betreuer: betreuer,
        };
      })
    );

    console.log('Data formatted successfully');

    res.status(200).json(formattedTalente);
  } catch (error) {
    console.error('Error in getTalenteTest:', error);

    console.error('Full error object:', JSON.stringify(error, Object.getOwnPropertyNames(error)));

    let errorMessage = 'An unexpected error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
      console.error('Error stack:', error.stack);
    }

    res.status(500).json({
      message: 'Internal Server Error',
      error: errorMessage,
      ...(process.env.NODE_ENV === 'development' && { stack: error instanceof Error ? error.stack : undefined }),
    });
  }
}
