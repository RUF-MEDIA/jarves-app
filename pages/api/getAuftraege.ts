// pages/api/getAuftraege.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const auftraege = await prisma.auftrag.findMany();

    const formattedAuftraege = auftraege.map((a) => ({
      id: a.id,
      autogeneratedNr: a.autogeneratedNr,
      unternehmenId: a.unternehmenId,
      affiliateId: a.affiliateId,
      anzahlOffenePositionen: a.anzahlOffenePositionen,
      arbeitszeit: a.arbeitszeit,
      auftragGeschlossenAm: a.auftragGeschlossenAm,
      auftragGeschlossenWeil: a.auftragGeschlossenWeil,
      besetzungAsap: a.besetzungAsap,
      betreuerId: a.betreuerId,
      einsatzort: a.einsatzort,
      erfahrungInJobfield: a.erfahrungInJobfield,
      ergaenzungHomeOffice: a.ergaenzungHomeOffice,
      ergaenzungTeilzeit: a.ergaenzungTeilzeit,
      erstelltAm: a.erstelltAm,
      erstelltVonId: a.erstelltVonId,
      freitextFuerStellenbezogeneExtras: a.freitextFuerStellenbezogeneExtras,
      gehaltObergrenzeBruttoJahr: a.gehaltObergrenzeBruttoJahr,
      grundgehaltBruttoJahr: a.grundgehaltBruttoJahr,
      homeOffice: a.homeOffice,
      jahresbonusBei100ProzentZielerfullung: a.jahresbonusBei100ProzentZielerfullung,
      job: a.job,
      jobfield: a.jobfield,
      jobtitel: a.jobtitel,
      kategorie: a.kategorie,
      letzteAenderungAm: a.letzteAenderungAm,
      letzteAenderungVonId: a.letzteAenderungVonId,
      notizAbsage: a.notizAbsage,
      notizen: a.notizen,
      postleitzahl: a.postleitzahl,
      quelle: a.quelle,
      salesId: a.salesId,
      segment: a.segment,
      spaetestensZuBesetzenBis: a.spaetestensZuBesetzenBis,
      startAb: a.startAb,
      status: a.status,
      stellenbeschreibungId: a.stellenbeschreibungId,
      strasse: a.strasse,
      teilzeitStundenWocheMaximum: a.teilzeitStundenWocheMaximum,
      teilzeitStundenWocheMinimum: a.teilzeitStundenWocheMinimum,
      teilzeitTage: a.teilzeitTage,
      voraussichtlicheVermittlungssumme: a.voraussichtlicheVermittlungssumme,
      zielgehaltObergrenze: a.zielgehaltObergrenze,
      zielgehaltUntergrenze: a.zielgehaltUntergrenze,
      test_field: a.test_field,
    }));

    res.status(200).json(formattedAuftraege);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error instanceof Error ? error.message : String(error) });
  }
}