// app/kunden/page.tsx

import prisma from '@/lib/prisma';
import { KundenTable } from '@/components/kundentable';

export default async function KundenPage() {
  try {
    const allUsers = await prisma.unternehmen.findMany();

    return (
      <div className="bg-white min-w-full px-5 ms-5 pt-10 pb-10">
        <KundenTable allUsers={allUsers} />
      </div>
    );
  } catch (error) {
    console.error('Error fetching users:', error);
    return <div>Ein Fehler ist aufgetreten beim Laden der Daten.</div>;
  }
}
