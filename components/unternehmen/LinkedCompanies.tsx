// components/unternehmen/LinkedCompanies.tsx
import prisma from '@/lib/prisma';
import Link from 'next/link';

async function getLinkedCompanies(currentCompanyId: string) {
  try {
    const currentCompany = await prisma.unternehmen.findUnique({
      where: { id: currentCompanyId },
    });

    if (!currentCompany || !currentCompany.unternehmensverknuepfungZu) return [currentCompany];

    const linkedCompanies = await prisma.unternehmen.findMany({
      where: {
        id: {
          in: currentCompany.unternehmensverknuepfungZu,
        },
      },
    });

    return [currentCompany, ...linkedCompanies];
  } catch (error) {
    console.error('Error fetching linked companies:', error);
    return [];
  }
}

const LinkedCompanies = async ({ currentCompanyId }: { currentCompanyId: string }) => {
  const companies = await getLinkedCompanies(currentCompanyId);

  return (
    <div className="flex flex-wrap gap-2">
      {companies.map(
        (company) =>
          company && (
            <Link
              key={company.id}
              href={`/kunden/${company.id}`}
              className={`p-2 rounded-lg flex-grow transition-colors duration-200 hover:bg-opacity-80 ${
                company.id === currentCompanyId ? 'bg-blue-100 hover:bg-blue-200' : 'bg-gray-100 hover:bg-gray-200'
              }`}
              style={{ minWidth: '150px', maxWidth: 'calc(25% - 0.5rem)' }}
            >
              <h3 className="font-semibold text-sm truncate">{company.name}</h3>
              <p className="text-xs text-gray-600 truncate">{company.unternehmensverknuepfung || 'Keine Verknüpfung'}</p>
            </Link>
          )
      )}
    </div>
  );
};

export default LinkedCompanies;
