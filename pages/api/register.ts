// pages/api/register.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma'; // Prisma Client
import bcrypt from 'bcryptjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { vorname, nachname, email, password } = req.body;

  if (!vorname || !nachname || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Konvertiere die E-Mail in Kleinbuchstaben
  const normalizedEmail = email.toLowerCase();

  try {
    // Prüfe, ob der Benutzer bereits existiert
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // Passwort hashen
    const hashedPassword = await bcrypt.hash(password, 10);

    // Erstelle neuen Benutzer und speichere das gehashte Passwort im `password`-Feld
    const newUser = await prisma.user.create({
      data: {
        vorname,
        name: nachname,
        email: normalizedEmail, // Gespeicherte E-Mail in Kleinbuchstaben
        password: hashedPassword, // Gespeichertes, gehashtes Passwort
      },
    });

    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    console.error('Error registering user:', error.message);
    res.status(500).json({ message: `Internal Server Error: ${error.message}` });
  }
}
