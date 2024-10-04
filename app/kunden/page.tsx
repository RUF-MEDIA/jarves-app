import { Suspense } from 'react';
import { ContactList } from '@/components/unternehmen/UnternehmenList';
import { Skeleton } from '@/components/ui/skeleton';
import UnternehmenAnlegenButton from '@/components/unternehmen/unternehmen-anlegen-button';

export default function KundenPage() {
  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Kunden</h2>
          <p className="text-muted-foreground">Hier können Sie alle Kunden verwalten und einsehen.</p>
        </div>
        <UnternehmenAnlegenButton />
      </div>
      <Suspense fallback={<Skeleton className="w-full h-[300px]" />}>
        <ContactList />
      </Suspense>
    </div>
  );
}
