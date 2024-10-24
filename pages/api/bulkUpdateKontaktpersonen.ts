// pages/api/bulkUpdateKontaktpersonen.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, AnsprechpartnerStatus, AnsprechpartnerKategorie } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Received bulk update request:', req.body);

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { ids, updates } = req.body;

  try {
    if (!Array.isArray(ids) || ids.length === 0) {
      console.log('No IDs provided');
      return res.status(400).json({ error: 'No IDs provided' });
    }

    const updateData: any = {};

    if (updates.status) {
      if (!Object.values(AnsprechpartnerStatus).includes(updates.status)) {
        console.log('Invalid status value:', updates.status);
        return res.status(400).json({ error: 'Invalid status value' });
      }
      updateData.status = updates.status;
    }

    if (updates.kategorie) {
      if (!Object.values(AnsprechpartnerKategorie).includes(updates.kategorie)) {
        console.log('Invalid category value:', updates.kategorie);
        return res.status(400).json({ error: 'Invalid category value' });
      }
      updateData.kategorie = updates.kategorie;
    }

    if (updates.betreuerId) {
      const betreuerExists = await prisma.user.findUnique({ where: { id: updates.betreuerId } });
      if (!betreuerExists) {
        console.log('Invalid betreuer ID:', updates.betreuerId);
        return res.status(400).json({ error: 'Invalid betreuer ID' });
      }
      updateData.betreuerId = updates.betreuerId;
    }

    console.log('Updating contact persons with data:', updateData);

    const updateResult = await prisma.ansprechpartner.updateMany({
      where: { id: { in: ids } },
      data: updateData,
    });

    console.log('Update result:', updateResult);

    res.status(200).json({ message: 'Contact persons updated successfully', updatedCount: updateResult.count });
  } catch (error) {
    console.error('Error updating contact persons:', error);
    res.status(500).json({ error: 'Error updating contact persons' });
  }
}
