// app/kunden/page.tsx

import prisma from '@/lib/prisma';
import KundenTable from '@/components/KundenTable'; // Achten Sie auf die korrekte Groß-/Kleinschreibung

export default async function KundenPage() {
  try {
    // Liste aller Betreuer abrufen
    const betreuerList = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    return (
      <div className="bg-white min-w-full px-5 ms-5 pt-10 pb-10">
        {/* Übergabe der Betreuer-Liste an die KundenTable-Komponente */}
        <KundenTable betreuerList={betreuerList} />
      </div>
    );
  } catch (error) {
    console.error('Fehler beim Abrufen der Betreuer:', error);
    return <div>Ein Fehler ist aufgetreten beim Laden der Daten.</div>;
  }
}
