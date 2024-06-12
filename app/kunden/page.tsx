import { PrismaClient } from '@prisma/client';
import { KundenTable } from '@/components/kundentable';

const db = new PrismaClient();

export default async function KundenPage() {
  const allUsers = await db.unternehmen.findMany();

  return (
    <div className="bg-white min-w-full px-5 ms-5 pt-10 pb-10">
      <KundenTable allUsers={allUsers} />
    </div>
  );
}
