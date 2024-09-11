import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import formidable from 'formidable';
import path from 'path';
import fs from 'fs';
import jwt from 'jsonwebtoken';

export const config = {
  api: {
    bodyParser: false, // Deaktiviert den Standard-Body-Parser, um formidable zu verwenden
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const token = req.headers.authorization?.split(' ')[1];
  console.log('Token im Backend:', token); // Überprüfe den Token

  if (!token) {
    return res.status(401).json({ message: 'Authorization header required' });
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    const userId = decoded.userId;

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    console.log('Upload-Verzeichnis:', uploadDir); // Prüfen, ob das Verzeichnis korrekt ist

    if (!fs.existsSync(uploadDir)) {
      console.log('Verzeichnis existiert nicht, erstelle es...');
      fs.mkdirSync(uploadDir, { recursive: true }); // Verzeichnis erstellen, wenn es nicht existiert
    }

    const form = formidable({
      uploadDir: uploadDir,
      keepExtensions: true,
      maxFileSize: 5 * 1024 * 1024, // 5MB
    });

    form.parse(req, async (err: Error, fields, files) => {
      if (err) {
        console.error('Fehler beim Parsen des Formulars:', err);
        return res.status(500).json({ error: 'Could not upload file', details: err.message });
      }

      console.log('Erhaltene Felder:', fields); // Prüfen der Felder
      console.log('Erhaltene Dateien:', files); // Prüfen der hochgeladenen Dateien

      const profilBild = Array.isArray(files.profilBild) ? files.profilBild[0] : files.profilBild;
      if (!profilBild) {
        return res.status(400).json({ error: 'No profile picture uploaded' });
      }

      const profilBildUrl = `/uploads/${path.basename(profilBild.filepath)}`;
      console.log('Profilbild-URL:', profilBildUrl); // Überprüfe die generierte URL

      // Update the user's profile picture in the database
      await prisma.user.update({
        where: { id: userId },
        data: { profilBild: profilBildUrl },
      });

      res.status(200).json({ success: true, profilBildUrl });
    });
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
