// constants/kategorieOptionsKontaktpersonen.ts
import { AnsprechpartnerKategorie } from '@prisma/client';

export const kategorieOptionsKontaktpersonen = [
  { label: 'Geschäftsführung', value: AnsprechpartnerKategorie.Geschaeftsfuehrung },
  { label: 'HR Recruiting', value: AnsprechpartnerKategorie.HRRecruiting },
  { label: 'Entscheider', value: AnsprechpartnerKategorie.Entscheider },
  { label: 'Team/Abteilungsleiter', value: AnsprechpartnerKategorie.TeamAbteilungsleiter },
  { label: 'Mitarbeiter', value: AnsprechpartnerKategorie.Mitarbeiter },
];
