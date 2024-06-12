import { PrismaClient } from '@prisma/client';
import Switchdocs from '@/components/unternehmen/switchdocs';

const db = new PrismaClient();

export default async function Kunde({ params }: any) {
  const user = await db.unternehmen.findUnique({
    where: { id: params.id },
  });

  return (
    <div className="bg-white min-w-full px-5 ms-5 pt-10 pb-10">
      <Switchdocs unternehmen={user} />
    </div>
  );
}
