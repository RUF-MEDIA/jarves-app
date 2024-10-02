// constants/statusOptionsAuftraege.ts
import { AuftragStatus } from '@prisma/client';

export const statusOptionsAuftraege = [
  { label: 'Recherche', value: AuftragStatus.Recherche },
  { label: 'In Betreuung', value: AuftragStatus.In_Bebtreuung },
  { label: 'Aktiv', value: AuftragStatus.Aktiv },
  { label: 'On Hold', value: AuftragStatus.on_hold },
  { label: 'Besetzt', value: AuftragStatus.besetzt },
  { label: 'Absage Kunde', value: AuftragStatus.Absage_Kunde },
  { label: 'Absage TOK', value: AuftragStatus.Absage_TOK },
  // Füge weitere Statusoptionen hinzu, falls vorhanden
];
