// app/kontaktperson/[id]/page.tsx

import prisma from '@/lib/prisma';
import Switchdocs from '@/components/kontaktperson/switchdocs';

const Kontaktperson = async ({ params }: { params: { id: string } }) => {
  console.log('Fetching contact with ID:', params.id);
  try {
    const contact = await prisma.ansprechpartner.findUnique({
      where: { id: params.id },
    });

    console.log('Contact fetched:', contact);

    if (!contact) {
      console.log('Contact not found');
      return <div>Kontaktperson nicht gefunden</div>;
    }

    return (
      <div>
        <div className="flex gap-4 mb-10 pb-10">
          <div className="flex-grow ms-5 pt-5 pb-5" style={{ flexBasis: '30%' }}>
            <Switchdocs kontaktperson={contact} documents={[]} />
          </div>
          <div id="meineSidebar" className="bg-white px-5 ms-5 pt-5 pb-5 sidebar block" style={{ flexBasis: '40%' }}></div>
        </div>
      </div>
    );
  } catch (error: any) {
    console.error('Error fetching contact:', error);
    let errorMessage = 'Ein Fehler ist aufgetreten';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return <div>{errorMessage}</div>;
  }
};

export default Kontaktperson;
