// app/kontaktperson/page.tsx
import { Suspense } from 'react';
import { KontaktpersonenList } from '@/components/kontaktperson/KontaktpersonenList';
import { Skeleton } from '@/components/ui/skeleton';

export default function KontaktpersonPage() {
  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Kontaktpersonen</h2>
          <p className="text-muted-foreground">Hier können Sie alle Kontaktpersonen verwalten und einsehen.</p>
        </div>
      </div>
      <Suspense fallback={<Skeleton className="w-full h-[300px]" />}>
        <KontaktpersonenList />
      </Suspense>
    </div>
  );
}
