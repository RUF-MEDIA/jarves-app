// constants/statusOptionsKontaktpersonen.ts
import { AnsprechpartnerStatus } from '@prisma/client';

export const statusOptionsKontaktpersonen = [
  { label: 'Unbekannt', value: AnsprechpartnerStatus.unbekannt },
  { label: 'In Kontakt', value: AnsprechpartnerStatus.inKontakt },
  { label: 'Nicht kontaktieren', value: AnsprechpartnerStatus.nichtKontaktieren },
  { label: 'Ausgeschieden', value: AnsprechpartnerStatus.ausgeschieden },
];
