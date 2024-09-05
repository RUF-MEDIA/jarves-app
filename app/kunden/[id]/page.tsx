// app/kunden/[id]/page.tsx

import prisma from '@/lib/prisma';
import Switchdocs from '@/components/unternehmen/switchdocs';
import LinkedCompanies from '@/components/unternehmen/LinkedCompanies';
import LinkedContacts from '@/components/unternehmen/LinkedContacts';
import Stammdaten from '@/components/unternehmen/stammdaten';

const Kunde = async ({ params }: { params: { id: string } }) => {
  console.log('Fetching user with ID:', params.id);
  try {
    const user = await prisma.unternehmen.findUnique({
      where: { id: params.id },
    });

    console.log('User fetched:', user);

    if (!user) {
      console.log('User not found');
      return <div>Unternehmen nicht gefunden</div>;
    }

    return (
      <div>
        <div className="flex-grow bg-white px-5 ms-5 pt-5 pb-5 mb-5" style={{ flexBasis: '30%' }}>
          <LinkedCompanies currentCompanyId={user.id} />
        </div>
        <div className="flex-grow bg-white px-5 ms-5 pt-5 pb-5 mb-5" style={{ flexBasis: '30%' }}>
          <LinkedContacts currentCompanyId={user.id} />
        </div>
        <div className="flex gap-4">
          <div className="flex-grow bg-white px-5 ms-5 pt-5 pb-5" style={{ flexBasis: '30%' }}>
            <Stammdaten unternehmen={user} />
            <Switchdocs unternehmen={user} documents={[]} />
          </div>
          <div className="bg-white px-5 ms-5 pt-5 pb-5" style={{ flexBasis: '40%' }}></div>
        </div>
      </div>
    );
  } catch (error: any) {
    console.error('Error fetching user:', error);
    let errorMessage = 'Ein Fehler ist aufgetreten';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return <div>{errorMessage}</div>;
  }
};

export default Kunde;
test;
