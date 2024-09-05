// middleware/prisma.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

prisma.$use(async (params, next) => {
  try {
    return await next(params);
  } catch (error: any) {
    console.error('Prisma Middleware Error:', error);
    throw error;
  }
});

export default prisma;
