// app/jobs/page.tsx
import { Suspense } from 'react';
import { AuftrageList } from '@/components/jobs/AuftraegeList';
import { Skeleton } from '@/components/ui/skeleton';

export default function JobsPage() {
  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Jobs</h2>
          <p className="text-muted-foreground">Hier können Sie alle Jobs verwalten und einsehen.</p>
        </div>
      </div>
      <Suspense fallback={<Skeleton className="w-full h-[300px]" />}>
        <AuftrageList />
      </Suspense>
    </div>
  );
}
