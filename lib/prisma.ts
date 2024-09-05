import { PrismaClient, Prisma } from '@prisma/client';

const prismaOptions: Prisma.PrismaClientOptions = {
  log: [
    { emit: 'stdout', level: 'query' },
    { emit: 'stdout', level: 'info' },
    { emit: 'stdout', level: 'warn' },
    { emit: 'stdout', level: 'error' },
  ],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
};

class PrismaManager {
  private static instance: PrismaClient;

  static getInstance(): PrismaClient {
    if (!PrismaManager.instance) {
      PrismaManager.instance = new PrismaClient(prismaOptions);
    }
    return PrismaManager.instance;
  }

  static async disconnect() {
    if (PrismaManager.instance) {
      await PrismaManager.instance.$disconnect();
    }
  }
}

const prisma = PrismaManager.getInstance();

// Verbindungstest (Sie können diesen Block entfernen, nachdem Sie die Verbindung getestet haben)
prisma
  .$connect()
  .then(() => console.log('Database connection successful'))
  .catch((e) => console.error('Database connection failed', e));

if (process.env.NODE_ENV !== 'production') {
  (global as any).prisma = prisma;
}

process.on('beforeExit', async () => {
  await PrismaManager.disconnect();
});

export default prisma;
