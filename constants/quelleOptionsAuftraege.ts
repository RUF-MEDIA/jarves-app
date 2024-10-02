// constants/quelleOptionsAuftraege.ts
import { AuftragQuelle } from '@prisma/client';

export const quelleOptionsAuftraege = [
  { label: 'Auftrag per Mail erhalten', value: AuftragQuelle.AuftragPerMailErhalten },
  { label: 'Auftrag telefonisch erhalten', value: AuftragQuelle.AuftragTelefonischErhalten },
  { label: 'Regelmäßige Auftragsliste des Kunden', value: AuftragQuelle.RegelmaessigeAuftragslisteDesKunden },
  { label: 'Auftrag telefonisch akquiriert', value: AuftragQuelle.AuftragTelefonischAkquiriert },
  { label: 'Auftrag bei Kunden erhalten', value: AuftragQuelle.AuftragBeiKundenErhalten },
  // Füge weitere Quelloptionen hinzu, falls vorhanden
];
