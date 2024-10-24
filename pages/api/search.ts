// pages/api/search.ts
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { q } = req.query;

  if (typeof q !== 'string') {
    return res.status(400).json({ error: 'Search query is required' });
  }

  try {
    const results = await Promise.all([
      prisma.unternehmen.findMany({
        where: {
          OR: [{ name: { contains: q, mode: 'insensitive' } }, { stadt: { contains: q, mode: 'insensitive' } }],
        },
        take: 5,
        select: { id: true, name: true, stadt: true },
      }),
      prisma.bewerber.findMany({
        where: {
          OR: [{ vorname: { contains: q, mode: 'insensitive' } }, { nachname: { contains: q, mode: 'insensitive' } }],
        },
        take: 5,
        select: { id: true, vorname: true, nachname: true, jobfield: true },
      }),
      prisma.auftrag.findMany({
        where: {
          OR: [{ job: { contains: q, mode: 'insensitive' } }, { einsatzort: { contains: q, mode: 'insensitive' } }],
        },
        take: 5,
        select: { id: true, job: true, einsatzort: true },
      }),
      prisma.sales.findMany({
        where: {
          OR: [{ kurzbeschreibungStelle: { contains: q, mode: 'insensitive' } }, { unternehmen: { name: { contains: q, mode: 'insensitive' } } }],
        },
        take: 5,
        select: { id: true, kurzbeschreibungStelle: true, unternehmen: { select: { name: true } } },
      }),
    ]);

    const [unternehmen, bewerber, auftraege, sales] = results;

    const formattedResults = [
      ...unternehmen.map((u) => ({ id: u.id, type: 'unternehmen', name: u.name, details: u.stadt })),
      ...bewerber.map((b) => ({ id: b.id, type: 'bewerber', name: `${b.vorname} ${b.nachname}`, details: b.jobfield.join(', ') })),
      ...auftraege.map((a) => ({ id: a.id, type: 'auftrag', name: a.job, details: a.einsatzort })),
      ...sales.map((s) => ({ id: s.id, type: 'sales', name: s.kurzbeschreibungStelle, details: s.unternehmen?.name || '' })),
    ];

    res.status(200).json(formattedResults);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'An error occurred while searching' });
  }
}
