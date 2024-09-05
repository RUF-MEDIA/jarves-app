// components/unternehmen/LinkedContacts.tsx
import prisma from '@/lib/prisma';
import Link from 'next/link';

type Contact = {
  id: string;
  vorname: string;
  nachname: string;
  email?: string | null;
  mobil?: string | null;
  telefon?: string | null;
};

async function getLinkedContacts(currentCompanyId: string): Promise<Contact[]> {
  try {
    const contacts = await prisma.ansprechpartner.findMany({
      where: {
        unternehmen: {
          some: {
            id: currentCompanyId,
          },
        },
      },
      select: {
        id: true,
        vorname: true,
        nachname: true,
        email: true,
        mobil: true,
        telefon: true,
      },
    });

    return contacts.map((contact) => ({
      id: contact.id,
      vorname: contact.vorname || '',
      nachname: contact.nachname || '',
      email: contact.email || null,
      mobil: contact.mobil || null,
      telefon: contact.telefon || null,
    }));
  } catch (error) {
    console.error('Error fetching linked contacts:', error);
    return [];
  }
}

const LinkedContacts = async ({ currentCompanyId }: { currentCompanyId: string }) => {
  const contacts: Contact[] = await getLinkedContacts(currentCompanyId);

  return (
    <div className="flex flex-wrap gap-2">
      {contacts.map((contact: Contact) => (
        <Link
          key={contact.id}
          href={`/ansprechpartner/${contact.id}`}
          className="p-2 rounded-lg flex-grow transition-colors duration-200 hover:bg-opacity-80 bg-gray-100 hover:bg-gray-200"
          style={{ minWidth: '150px', maxWidth: 'calc(25% - 0.5rem)' }}
        >
          <h3 className="font-semibold text-sm truncate">
            {contact.vorname} {contact.nachname}
          </h3>
          <p className="text-xs text-gray-600 truncate">
            {contact.mobil ? (
              <a href={`tel:${contact.mobil}`}>{contact.mobil}</a>
            ) : contact.telefon ? (
              <a href={`tel:${contact.telefon}`}>{contact.telefon}</a>
            ) : null}
          </p>
          <p className="text-xs text-gray-600 truncate">{contact.email && <a href={`mailto:${contact.email}`}>{contact.email}</a>}</p>
        </Link>
      ))}
    </div>
  );
};

export default LinkedContacts;
