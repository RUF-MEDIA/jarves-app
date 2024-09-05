// pages/api/linkedContacts.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { currentCompanyId } = req.query;

  if (!currentCompanyId || typeof currentCompanyId !== 'string') {
    return res.status(400).json({ error: 'Invalid Company ID' });
  }

  try {
    const contacts = await prisma.ansprechpartner.findMany({
      where: {
        unternehmen: {
          some: {
            id: currentCompanyId,
          },
        },
      },
      select: {
        id: true,
        vorname: true,
        nachname: true,
        email: true,
        mobil: true,
        telefon: true,
      },
    });

    const transformedContacts = contacts.map((contact) => ({
      id: contact.id,
      vorname: contact.vorname || '',
      nachname: contact.nachname || '',
      email: contact.email || null,
      mobil: contact.mobil || null,
      telefon: contact.telefon || null,
    }));

    res.status(200).json(transformedContacts);
  } catch (error) {
    console.error('Error fetching linked contacts:', error);
    res.status(500).json({ error: 'Error fetching linked contacts' });
  }
}
