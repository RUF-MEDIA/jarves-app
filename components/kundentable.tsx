'use client';

import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, TableHeader } from '@/components/ui/table';
import Link from 'next/link';
import { Input } from '@/components/ui/input';

export function KundenTable({ allUsers }: { allUsers: Array<any> }) {
  const [filter, setFilter] = useState('');
  const [filteredUsers, setFilteredUsers] = useState(allUsers);

  useEffect(() => {
    setFilteredUsers(
      allUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(filter.toLowerCase()) ||
          user.email.toLowerCase().includes(filter.toLowerCase()) ||
          user.telefon.toLowerCase().includes(filter.toLowerCase())
      )
    );
  }, [filter, allUsers]);

  return (
    <div className="">
      <Input
        type="text"
        placeholder="Suche..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded"
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Telefon</TableHead>
            <TableHead>Editieren</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.map((unternehmen) => (
            <TableRow key={unternehmen.id}>
              <TableCell>{unternehmen.id}</TableCell>
              <TableCell>{unternehmen.name}</TableCell>
              <TableCell>{unternehmen.email}</TableCell>
              <TableCell>{unternehmen.telefon}</TableCell>
              <TableCell>
                <Link href={`/kunden/${unternehmen.id}`}>
                  <button className="bg-green-700 hover:bg-green-900 text-white font-bold py-2 px-4 rounded">Editieren</button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
