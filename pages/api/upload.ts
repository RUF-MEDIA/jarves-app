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
    maxFileSize: 20 * 1024 * 1024, // 20MB
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

    // Überprüfe, ob es sich um einen Upload für ein Unternehmen oder eine Kontaktperson handelt
    const unternehmenId = Array.isArray(fields.unternehmenId) ? fields.unternehmenId[0] : fields.unternehmenId;
    const kontaktpersonId = Array.isArray(fields.kontaktpersonId) ? fields.kontaktpersonId[0] : fields.kontaktpersonId;

    // Hole die gemeinsamen Felder
    const titel = Array.isArray(fields.titel) ? fields.titel[0] : fields.titel;
    const artKunde = Array.isArray(fields.artKunde) ? fields.artKunde[0] : fields.artKunde;
    const individuelleBezeichnung = Array.isArray(fields.individuelleBezeichnung)
      ? fields.individuelleBezeichnung[0]
      : fields.individuelleBezeichnung;
    const erstellerId = Array.isArray(fields.erstellerId) ? fields.erstellerId[0] : fields.erstellerId;

    if ((!unternehmenId && !kontaktpersonId) || !titel || !artKunde || !erstellerId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const fileUrl = `/uploads/${path.basename(file.filepath)}`;

    try {
      console.log('Creating document in database');
      const document = await prisma.dokument.create({
        data: {
          // Bedingte Felder basierend auf dem Dokumenttyp
          ...(unternehmenId ? { unternehmenId } : {}),
          ...(kontaktpersonId ? { kontaktpersonId } : {}),

          // Gemeinsame Felder
          titel: titel,
          artKunde: artKunde as 'RAHMENVERTRAG' | 'MITSCHRIFT_GESPRAECH' | 'SONSTIGE_DOKUMENTE',
          link: fileUrl,
          typ: 'PDF', // You could set this dynamically based on the file type
          bezeichnung: file.originalFilename || '',
          individuelleBezeichnung: individuelleBezeichnung || undefined,
          erstellerId: erstellerId,
        },
      });

      console.log('Document created successfully');
      return res.status(200).json({ success: true, document });
    } catch (error) {
      console.error('Error saving to database:', error);
      if (error instanceof Error) {
        return res.status(500).json({ error: 'Error saving document to database', details: error.message });
      } else {
        return res.status(500).json({ error: 'Unknown error occurred' });
      }
    }
  });
}
