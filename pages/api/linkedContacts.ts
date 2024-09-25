//pages/api/linkedContacts.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { currentCompanyId } = req.query;

  if (!currentCompanyId || typeof currentCompanyId !== 'string') {
    return res.status(400).json({ message: 'Invalid currentCompanyId' });
  }

  try {
    // Abfrage des Unternehmens und der verknüpften Ansprechpartner
    const companyWithContacts = await prisma.unternehmen.findUnique({
      where: { id: currentCompanyId },
      include: {
        ansprechpartner: {
          select: {
            id: true,
            vorname: true,
            nachname: true,
            email: true, // E-Mail-Adresse auswählen
            telefon: true, // Telefonnummer auswählen
          },
        },
      },
    });

    if (!companyWithContacts) {
      return res.status(404).json({ message: 'Company not found' });
    }

    // Liste der Ansprechpartner extrahieren
    const linkedContacts = companyWithContacts.ansprechpartner.map((contact) => ({
      id: contact.id,
      vorname: contact.vorname,
      nachname: contact.nachname,
      email: contact.email, // E-Mail-Adresse hinzufügen
      telefon: contact.telefon, // Telefonnummer hinzufügen
    }));

    res.status(200).json(linkedContacts);
  } catch (error) {
    console.error('Error fetching linked contacts:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
