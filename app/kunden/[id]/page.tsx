// app/kunden/[id]/page.tsx

import prisma from '@/lib/prisma';
import Switchdocs from '@/components/unternehmen/switchdocs';
import LinkedCompanies from '@/components/unternehmen/LinkedCompanies';
import LinkedContacts from '@/components/unternehmen/LinkedContacts';

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
        <h2 className="ms-5 mb-1 text-base font-semibold">Verknüpfte Unternehmen</h2>
        <div className="flex-grow ms-5 pt-3 pb-2 mb-5" style={{ flexBasis: '30%' }}>
          <LinkedCompanies currentCompanyId={user.id} />
        </div>
        <h2 className="ms-5 mb-1 text-base font-semibold">Kontaktpersonen</h2>
        <div className="flex-grow ms-5 pb-3 mb-5" style={{ flexBasis: '30%' }}>
          <LinkedContacts currentCompanyId={user.id} />
        </div>
        <div className="flex gap-4 mb-10 pb-10">
          <div className="flex-grow ms-5 pt-5 pb-5" style={{ flexBasis: '30%' }}>
            <Switchdocs unternehmen={user} documents={[]} />
          </div>
          <div id="meineSidebar" className="bg-white px-5 ms-5 pt-5 pb-5 sidebar block" style={{ flexBasis: '40%' }}></div>
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
