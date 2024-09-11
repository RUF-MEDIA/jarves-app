// pages/api/upload.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import formidable from 'formidable';
import fs from 'fs/promises';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  console.log('Received upload request');

  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  console.log('Upload directory:', uploadDir);

  const form = formidable({
    uploadDir: uploadDir,
    keepExtensions: true,
    maxFileSize: 20 * 1024 * 1024, // 10MB
  });

  form.parse(req, async (err: Error, fields, files) => {
    if (err) {
      console.error('Error parsing form:', err);
      return res.status(500).json({ error: 'Could not upload file', details: err.message });
    }

    console.log('Fields:', fields);
    console.log('Files:', files);

    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const unternehmenId = Array.isArray(fields.unternehmenId) ? fields.unternehmenId[0] : fields.unternehmenId;
    const titel = Array.isArray(fields.titel) ? fields.titel[0] : fields.titel;
    const artKunde = Array.isArray(fields.artKunde) ? fields.artKunde[0] : fields.artKunde;
    const individuelleBezeichnung = Array.isArray(fields.individuelleBezeichnung)
      ? fields.individuelleBezeichnung[0]
      : fields.individuelleBezeichnung;

    if (!unternehmenId || !titel || !artKunde) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const fileUrl = `/uploads/${path.basename(file.filepath)}`;

    try {
      console.log('Creating document in database');
      const document = await prisma.dokument.create({
        data: {
          unternehmenId: unternehmenId,
          titel: titel,
          artKunde: artKunde as 'RAHMENVERTRAG' | 'MITSCHRIFT_GESPRAECH' | 'SONSTIGE_DOKUMENTE',
          link: fileUrl,
          typ: 'PDF', // Sie könnten dies basierend auf dem Dateityp dynamisch setzen
          bezeichnung: file.originalFilename || '',
          individuelleBezeichnung: individuelleBezeichnung || undefined,
        },
      });

      console.log('Document created successfully');
      res.status(200).json({ success: true, document });
    } catch (error) {
      console.error('Error saving to database:', error);
      if (error instanceof Error) {
        res.status(500).json({ error: 'Error saving document to database', details: error.message });
      } else {
        res.status(500).json({ error: 'Unknown error occurred' });
      }
    }
  });
}
