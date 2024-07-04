-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "auth";

-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('inaktiv', 'Zielkunde', 'pending', 'aktiv', 'Rahmenvertragspartner', 'nicht_kontaktieren');

-- CreateEnum
CREATE TYPE "public"."Standort" AS ENUM ('Zentrale', 'Zweigstelle');

-- CreateEnum
CREATE TYPE "public"."Unternehmensverknuepfung" AS ENUM ('Muttergesellschaft', 'Tochtergesellschaft', 'Schwestergesellschaft');

-- CreateEnum
CREATE TYPE "public"."Anrede" AS ENUM ('Herr', 'Frau');

-- CreateEnum
CREATE TYPE "public"."AnsprechpartnerStatus" AS ENUM ('unbekannt', 'inKontakt', 'nichtKontaktieren', 'ausgeschieden');

-- CreateEnum
CREATE TYPE "public"."AnsprechpartnerKategorie" AS ENUM ('Geschaeftsfuehrung', 'HRRecruiting', 'Entscheider', 'TeamAbteilungsleiter', 'Mitarbeiter');

-- CreateEnum
CREATE TYPE "public"."AuftragStatus" AS ENUM ('Recherche', 'inBetreuung', 'Aktiv', 'onHold', 'besetzt', 'AbsageKunde', 'AbsageTOK');

-- CreateEnum
CREATE TYPE "public"."Jobfield" AS ENUM ('Arbeitnehmerueberlassung', 'Personalvermittlung', 'HRPersonalabteilung', 'FreelanceContracting', 'WerkvertraegeDienstvertraege');

-- CreateEnum
CREATE TYPE "public"."ErfahrungInJobfield" AS ENUM ('Quereinsteiger', 'Anfaenger0bis1Jahr', 'Fortgeschritten1bis3Jahre', 'Erfahren3bis5Jahre', 'ProfessionalUeber5Jahre');

-- CreateEnum
CREATE TYPE "public"."Jobtitel" AS ENUM ('TeamVertriebsAssistentin', 'Mitarbeiterbetreuung', 'Lohnabrechnung', 'Recruitiung', 'Disponent180GradConsultantSales', 'Disponent360GradConsultantSales', 'KeyAccountManagerin', 'Niederlassungsleitung', 'Regionalleitung', 'TeamFachbereichsleitung', 'Geschaeftsfuehrung', 'HRAdvisor', 'HRPersonalreferentin', 'HRBusinesspartnerin', 'HRGeneralistin', 'HRManagerin', 'HRPersonalleitung');

-- CreateEnum
CREATE TYPE "public"."Segment" AS ENUM ('Aviation', 'BankingInsurance', 'EDVITSoftUndHardware', 'Engineering', 'Finance', 'GesundheitPflegeUndSozialesErziehung', 'gewerblich', 'kaufmaennisch', 'legal', 'office', 'Studenten', 'VerkehrLagerLogistik', 'intern', 'Gastro');

-- CreateEnum
CREATE TYPE "public"."HomeOffice" AS ENUM ('Prozent100HomeOffice', 'Prozent100Office', 'MixHybrid');

-- CreateEnum
CREATE TYPE "public"."Arbeitszeit" AS ENUM ('Vollzeit', 'Teilzeit', 'TeilzeitVormittags', 'TeilzeitFlexibel');

-- CreateEnum
CREATE TYPE "public"."TeilzeitTage" AS ENUM ('Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag');

-- CreateEnum
CREATE TYPE "public"."AuftragQuelle" AS ENUM ('AuftragPerMailErhalten', 'AuftragTelefonischErhalten', 'RegelmaessigeAuftragslisteDesKunden', 'AuftragTelefonischAkquiriert', 'AuftragBeiKundenErhalten');

-- CreateEnum
CREATE TYPE "public"."AuftragGeschlossenWeil" AS ENUM ('KundeHatStelleBesetzt', 'KundeHatStelleZurueckgezogen', 'TOKHatStelleBesetzt', 'TOKHatAuftragAbgelehnt', 'KeinFeedbackSonstiges');

-- CreateEnum
CREATE TYPE "public"."Bewerberstatus" AS ENUM ('Idee', 'empfohlen', 'sollEingeladenWerden', 'eingeladen', 'interview', 'onHold', 'eingestellt', 'abgesagtKunde', 'abgesagtBewerber', 'abgesagtTOK');

-- CreateEnum
CREATE TYPE "public"."ProzessGeschlossenWeil" AS ENUM ('durchTOKBesetzt', 'vonTOKAbgelehnt', 'durchKundenBesetzt', 'durchKundenAbgelehnt', 'vonKundenZurueckgezogen', 'KandidatIstZuTeuer', 'KandidatHatAbgelehnt', 'KandidatHatNichtUeberzeugt', 'KandidatHatAnderenJobAngenommen');

-- CreateEnum
CREATE TYPE "public"."BewerberStatus" AS ENUM ('neu', 'aktivMitInterview', 'aktivMitInterviewUndProfil', 'imProzess', 'onHold', 'vermitteltImEinsatz', 'absageBewerber', 'absageTOK', 'spaeterAbzusagen', 'absageDSGVO');

-- CreateEnum
CREATE TYPE "public"."VerfuegbarkeitKuendigungsfrist" AS ENUM ('abSofort', 'kurzfristig2Wochen', 'vierWochenZuMonatmitteUndEnde', 'einMonatZumMonatsende', 'zweiMonateZumMonatsende', 'dreiMonateZumMonatsende', 'sechsWochenZumMonatsende', 'einMonatZumQuartalsende', 'sechsWochenZumQuartalsende', 'sechsMonateZumQuartalsende');

-- CreateEnum
CREATE TYPE "public"."AbsageWeil" AS ENUM ('bewerberHatNeuenJob', 'absageDurchTOK', 'nichtMehrErreicht', 'absageDSGVO', 'bewerberMoechteNichtMehrMitUnsArbeiten', 'matchStelleBesetzt');

-- CreateEnum
CREATE TYPE "public"."DokumentTyp" AS ENUM ('PDF', 'DOC', 'DOCX', 'XLS', 'XLSX', 'PPT', 'PPTX', 'TXT', 'JPG', 'PNG');

-- CreateEnum
CREATE TYPE "public"."DokumentArtTalent" AS ENUM ('ANSCHREIBEN', 'GESAMTE_BEWERBUNG', 'LEBENSLAUF', 'SONSTIGE_DOKUMENTE', 'ZEUGNISSE', 'AUSWEIS_AUFENTHALTSGENEHMIGUNG', 'PROFIL_OFFEN', 'PROFIL_ANONYM', 'BILD');

-- CreateEnum
CREATE TYPE "public"."DokumentArtKunde" AS ENUM ('RAHMENVERTRAG', 'MITSCHRIFT_GESPRAECH', 'SONSTIGE_DOKUMENTE');

-- CreateEnum
CREATE TYPE "public"."DokumentArtTOK" AS ENUM ('leer');

-- CreateEnum
CREATE TYPE "auth"."aal_level" AS ENUM ('aal1', 'aal2', 'aal3');

-- CreateEnum
CREATE TYPE "auth"."code_challenge_method" AS ENUM ('s256', 'plain');

-- CreateEnum
CREATE TYPE "auth"."factor_status" AS ENUM ('unverified', 'verified');

-- CreateEnum
CREATE TYPE "auth"."factor_type" AS ENUM ('totp', 'webauthn');

-- CreateEnum
CREATE TYPE "auth"."one_time_token_type" AS ENUM ('confirmation_token', 'reauthentication_token', 'recovery_token', 'email_change_token_new', 'email_change_token_current', 'phone_change_token');

-- CreateTable
CREATE TABLE "public"."Unternehmen" (
    "id" TEXT NOT NULL,
    "betreuerId" TEXT,
    "name" TEXT NOT NULL DEFAULT '',
    "status" "public"."Status" NOT NULL DEFAULT 'inaktiv',
    "kategorie" INTEGER,
    "strasse" TEXT NOT NULL DEFAULT '',
    "postleitzahl" TEXT NOT NULL DEFAULT '',
    "stadt" TEXT NOT NULL DEFAULT '',
    "umsatzsteuerId" TEXT DEFAULT '',
    "standort" "public"."Standort" NOT NULL DEFAULT 'Zentrale',
    "unternehmensverknuepfungZu" TEXT[],
    "homepage" TEXT,
    "jobsite" TEXT,
    "linkedin" TEXT,
    "xing" TEXT,
    "zentraleMail" TEXT,
    "zentralTelefon" TEXT,
    "vermittlungsprovision" TEXT,
    "usbBeschreibung" TEXT,
    "interneNotizen" TEXT,
    "erstelltVonId" TEXT,
    "erstelltAm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "letzteAenderungVonId" TEXT,
    "letzteAenderungAm" TIMESTAMP(3),
    "autogeneratedNr" SERIAL NOT NULL,
    "unternehmensverknuepfung" "public"."Unternehmensverknuepfung",

    CONSTRAINT "Unternehmen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "vorname" TEXT NOT NULL DEFAULT '',
    "name" TEXT NOT NULL DEFAULT '',
    "email" TEXT DEFAULT '',
    "autogeneratedNr" SERIAL NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Auftrag" (
    "id" TEXT NOT NULL,
    "unternehmenId" TEXT NOT NULL,
    "affiliateId" TEXT,
    "anzahlOffenePositionen" TEXT,
    "arbeitszeit" "public"."Arbeitszeit"[],
    "auftragGeschlossenAm" TIMESTAMP(3),
    "auftragGeschlossenWeil" "public"."AuftragGeschlossenWeil",
    "besetzungAsap" BOOLEAN NOT NULL DEFAULT false,
    "betreuerId" TEXT,
    "einsatzort" TEXT,
    "erfahrungInJobfield" "public"."ErfahrungInJobfield"[],
    "ergaenzungHomeOffice" TEXT,
    "ergaenzungTeilzeit" TEXT,
    "erstelltAm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "erstelltVonId" TEXT,
    "freitextFuerStellenbezogeneExtras" TEXT,
    "gehaltObergrenzeBruttoJahr" INTEGER,
    "grundgehaltBruttoJahr" INTEGER,
    "homeOffice" "public"."HomeOffice"[],
    "jahresbonusBei100ProzentZielerfullung" INTEGER,
    "job" TEXT,
    "jobfield" "public"."Jobfield"[],
    "jobtitel" "public"."Jobtitel"[],
    "kategorie" INTEGER,
    "letzteAenderungAm" TIMESTAMP(3) NOT NULL,
    "letzteAenderungVonId" TEXT,
    "notizAbsage" TEXT,
    "notizen" TEXT,
    "postleitzahl" TEXT,
    "quelle" "public"."AuftragQuelle" NOT NULL DEFAULT 'AuftragPerMailErhalten',
    "salesId" TEXT,
    "segment" "public"."Segment"[],
    "spaetestensZuBesetzenBis" TIMESTAMP(3),
    "startAb" TIMESTAMP(3),
    "status" "public"."AuftragStatus" NOT NULL DEFAULT 'Recherche',
    "stellenbeschreibungId" TEXT,
    "strasse" TEXT,
    "teilzeitStundenWocheMaximum" INTEGER,
    "teilzeitStundenWocheMinimum" INTEGER,
    "teilzeitTage" "public"."TeilzeitTage"[],
    "voraussichtlicheVermittlungssumme" INTEGER,
    "zielgehaltObergrenze" INTEGER,
    "zielgehaltUntergrenze" INTEGER,
    "autogeneratedNr" SERIAL NOT NULL,

    CONSTRAINT "Auftrag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Sales" (
    "id" TEXT NOT NULL,
    "unternehmenId" TEXT NOT NULL,
    "absage" TIMESTAMP(3),
    "ansprechpartnerId" TEXT,
    "bewerberstatus" "public"."Bewerberstatus" NOT NULL DEFAULT 'Idee',
    "erstelltAm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "erstelltVonId" TEXT,
    "interview1" TIMESTAMP(3),
    "interview2" TIMESTAMP(3),
    "interview3" TIMESTAMP(3),
    "kurzbeschreibungStelle" TEXT,
    "letzteAenderungAm" TIMESTAMP(3) NOT NULL,
    "letzteAenderungVonId" TEXT,
    "notizen" TEXT,
    "prozessGeschlossenWeil" "public"."ProzessGeschlossenWeil",
    "startdatum" TIMESTAMP(3),
    "vertragsgespraech" TIMESTAMP(3),
    "vorgestelltAm" TIMESTAMP(3),
    "autogeneratedNr" SERIAL NOT NULL,

    CONSTRAINT "Sales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Ansprechpartner" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "anrede" "public"."Anrede" DEFAULT 'Herr',
    "betreuerId" TEXT,
    "duAnsprache" BOOLEAN DEFAULT false,
    "erstelltAm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "erstelltVonId" TEXT,
    "kategorie" "public"."AnsprechpartnerKategorie" DEFAULT 'Geschaeftsfuehrung',
    "letzteAenderungAm" TIMESTAMP(3),
    "letzteAenderungVonId" TEXT,
    "linkedin" TEXT,
    "mobil" TEXT,
    "nachname" TEXT DEFAULT '',
    "notiz" TEXT,
    "positionJobtitel" TEXT,
    "status" "public"."AnsprechpartnerStatus" DEFAULT 'unbekannt',
    "telefon" TEXT,
    "titel" TEXT,
    "vorname" TEXT DEFAULT '',
    "xing" TEXT,
    "autogeneratedNr" SERIAL NOT NULL,
    "unternehmen_ids" TEXT[],

    CONSTRAINT "Ansprechpartner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."EdvKenntnisse" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "EdvKenntnisse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Sprachkenntnisse" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Sprachkenntnisse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Affiliate" (
    "id" TEXT NOT NULL,

    CONSTRAINT "Affiliate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Stellenbeschreibung" (
    "id" TEXT NOT NULL,

    CONSTRAINT "Stellenbeschreibung_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Bewerber" (
    "id" TEXT NOT NULL,
    "absageAm" TIMESTAMP(3),
    "absageNotiz" TEXT,
    "absageWeil" "public"."AbsageWeil",
    "adresse" TEXT,
    "affiliat" BOOLEAN NOT NULL DEFAULT false,
    "affiliateId" TEXT,
    "ansprache" "public"."Anrede" NOT NULL DEFAULT 'Herr',
    "arbeitserlaubnisBefristetBis" TIMESTAMP(3),
    "arbeitserlaubnisNotwendig" BOOLEAN NOT NULL DEFAULT false,
    "arbeitserlaubnisUnbefristet" BOOLEAN NOT NULL DEFAULT false,
    "arbeitszeit" "public"."Arbeitszeit" NOT NULL DEFAULT 'Vollzeit',
    "auto" BOOLEAN NOT NULL DEFAULT false,
    "behinderung" BOOLEAN NOT NULL DEFAULT false,
    "behinderungsgrad" TEXT,
    "betreuerId" TEXT,
    "beworbenAm" TIMESTAMP(3),
    "du" BOOLEAN NOT NULL DEFAULT false,
    "email" TEXT,
    "empfohlenVonId" TEXT,
    "erfahrungInJobfield" "public"."ErfahrungInJobfield"[],
    "ergaenzungHomeOffice" TEXT,
    "erstelltAm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "erstelltVonId" TEXT,
    "freitextFuerZusatzinfos" TEXT,
    "fuehrerschein" BOOLEAN NOT NULL DEFAULT false,
    "geburtsdatum" TIMESTAMP(3),
    "gehaltswunschBruttoJahr" INTEGER,
    "handy" TEXT,
    "homeOffice" "public"."HomeOffice"[],
    "interview" TIMESTAMP(3),
    "jobfield" "public"."Jobfield"[],
    "jobtitelBisherigeErfahrung" "public"."Jobtitel"[],
    "jobtitelWunsch" "public"."Jobtitel"[],
    "kategorie" INTEGER,
    "letzteAenderungAm" TIMESTAMP(3) NOT NULL,
    "letzteAenderungVonId" TEXT,
    "linkedin" TEXT,
    "nachname" TEXT NOT NULL DEFAULT '',
    "nichtZuSchonBei" TEXT,
    "oeffentlicheVerkehrsmittel" BOOLEAN NOT NULL DEFAULT false,
    "personalfuehrungExtern" INTEGER,
    "personalfuehrungIntern" INTEGER,
    "personalfuehrungMustHave" BOOLEAN NOT NULL DEFAULT false,
    "postleitzahl" TEXT,
    "rahmendaten" TEXT,
    "region" TEXT,
    "regionUmkreisInKm" INTEGER,
    "staatsangehoerigkeit" TEXT,
    "stadt" TEXT,
    "startdatumVermittlung" TIMESTAMP(3),
    "status" "public"."BewerberStatus" NOT NULL DEFAULT 'neu',
    "teilzeitNotizen" TEXT,
    "teilzeitStundenWoche" TEXT,
    "teilzeitTage" "public"."TeilzeitTage"[],
    "telefon" TEXT,
    "telefonGeschaeftlich" TEXT,
    "titel" TEXT,
    "untergrenzeGehaltBruttoJahr" INTEGER,
    "verfuegbarkeitKuendigungsfrist" "public"."VerfuegbarkeitKuendigungsfrist" NOT NULL DEFAULT 'abSofort',
    "vermittlungssumme" INTEGER,
    "vorherigeAbspracheNotwendig" BOOLEAN NOT NULL DEFAULT false,
    "vorname" TEXT NOT NULL DEFAULT '',
    "wechselMitTeam" BOOLEAN NOT NULL DEFAULT false,
    "wechselmoitivation" TEXT,
    "weitereNotizen" TEXT,
    "xing" TEXT,
    "autogeneratedNr" SERIAL NOT NULL,

    CONSTRAINT "Bewerber_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Stellenausschreibung" (
    "id" TEXT NOT NULL,

    CONSTRAINT "Stellenausschreibung_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Dokument" (
    "id" SERIAL NOT NULL,
    "unternehmenId" TEXT,
    "ansprechpartnerId" TEXT,
    "artKunde" "public"."DokumentArtKunde",
    "artTOK" "public"."DokumentArtTOK",
    "artTalent" "public"."DokumentArtTalent",
    "auftragId" TEXT,
    "bewerberId" TEXT,
    "bezeichnung" TEXT NOT NULL DEFAULT '',
    "erstellerId" TEXT,
    "erstelltAm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "individuelleBezeichnung" TEXT,
    "inhalt" TEXT NOT NULL DEFAULT '',
    "letzteAenderungAm" TIMESTAMP(3) NOT NULL,
    "link" TEXT,
    "salesId" TEXT,
    "titel" TEXT,
    "typ" "public"."DokumentTyp" NOT NULL DEFAULT 'PDF',
    "autogeneratedNr" SERIAL NOT NULL,

    CONSTRAINT "Dokument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Todo" (
    "id" SERIAL NOT NULL,
    "titel" TEXT NOT NULL DEFAULT '',
    "beschreibung" TEXT,
    "faelligAm" TIMESTAMP(3),
    "erstelltAm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "erstelltVonId" TEXT,
    "zustaendigId" TEXT,
    "erledigt" BOOLEAN NOT NULL DEFAULT false,
    "erledigtAm" TIMESTAMP(3),
    "unternehmenId" TEXT,
    "auftragId" TEXT,
    "salesId" TEXT,
    "ansprechpartnerId" TEXT,
    "bewerberId" TEXT,

    CONSTRAINT "Todo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth"."audit_log_entries" (
    "instance_id" UUID,
    "id" UUID NOT NULL,
    "payload" JSON,
    "created_at" TIMESTAMPTZ(6),
    "ip_address" VARCHAR(64) NOT NULL DEFAULT '',

    CONSTRAINT "audit_log_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth"."flow_state" (
    "id" UUID NOT NULL,
    "user_id" UUID,
    "auth_code" TEXT NOT NULL,
    "code_challenge_method" "auth"."code_challenge_method" NOT NULL,
    "code_challenge" TEXT NOT NULL,
    "provider_type" TEXT NOT NULL,
    "provider_access_token" TEXT,
    "provider_refresh_token" TEXT,
    "created_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),
    "authentication_method" TEXT NOT NULL,
    "auth_code_issued_at" TIMESTAMPTZ(6),

    CONSTRAINT "flow_state_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth"."identities" (
    "provider_id" TEXT NOT NULL,
    "user_id" UUID NOT NULL,
    "identity_data" JSONB NOT NULL,
    "provider" TEXT NOT NULL,
    "last_sign_in_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),
    "email" TEXT,
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),

    CONSTRAINT "identities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth"."instances" (
    "id" UUID NOT NULL,
    "uuid" UUID,
    "raw_base_config" TEXT,
    "created_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),

    CONSTRAINT "instances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth"."mfa_amr_claims" (
    "session_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "authentication_method" TEXT NOT NULL,
    "id" UUID NOT NULL,

    CONSTRAINT "amr_id_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth"."mfa_challenges" (
    "id" UUID NOT NULL,
    "factor_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL,
    "verified_at" TIMESTAMPTZ(6),
    "ip_address" INET NOT NULL,

    CONSTRAINT "mfa_challenges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth"."mfa_factors" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "friendly_name" TEXT,
    "factor_type" "auth"."factor_type" NOT NULL,
    "status" "auth"."factor_status" NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "secret" TEXT,

    CONSTRAINT "mfa_factors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth"."one_time_tokens" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "token_type" "auth"."one_time_token_type" NOT NULL,
    "token_hash" TEXT NOT NULL,
    "relates_to" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "one_time_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth"."refresh_tokens" (
    "instance_id" UUID,
    "id" BIGSERIAL NOT NULL,
    "token" VARCHAR(255),
    "user_id" VARCHAR(255),
    "revoked" BOOLEAN,
    "created_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),
    "parent" VARCHAR(255),
    "session_id" UUID,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth"."saml_providers" (
    "id" UUID NOT NULL,
    "sso_provider_id" UUID NOT NULL,
    "entity_id" TEXT NOT NULL,
    "metadata_xml" TEXT NOT NULL,
    "metadata_url" TEXT,
    "attribute_mapping" JSONB,
    "created_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),
    "name_id_format" TEXT,

    CONSTRAINT "saml_providers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth"."saml_relay_states" (
    "id" UUID NOT NULL,
    "sso_provider_id" UUID NOT NULL,
    "request_id" TEXT NOT NULL,
    "for_email" TEXT,
    "redirect_to" TEXT,
    "created_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),
    "flow_state_id" UUID,

    CONSTRAINT "saml_relay_states_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth"."schema_migrations" (
    "version" VARCHAR(255) NOT NULL,

    CONSTRAINT "schema_migrations_pkey" PRIMARY KEY ("version")
);

-- CreateTable
CREATE TABLE "auth"."sessions" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),
    "factor_id" UUID,
    "aal" "auth"."aal_level",
    "not_after" TIMESTAMPTZ(6),
    "refreshed_at" TIMESTAMP(6),
    "user_agent" TEXT,
    "ip" INET,
    "tag" TEXT,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth"."sso_domains" (
    "id" UUID NOT NULL,
    "sso_provider_id" UUID NOT NULL,
    "domain" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),

    CONSTRAINT "sso_domains_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth"."sso_providers" (
    "id" UUID NOT NULL,
    "resource_id" TEXT,
    "created_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),

    CONSTRAINT "sso_providers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth"."users" (
    "instance_id" UUID,
    "id" UUID NOT NULL,
    "aud" VARCHAR(255),
    "role" VARCHAR(255),
    "email" VARCHAR(255),
    "encrypted_password" VARCHAR(255),
    "email_confirmed_at" TIMESTAMPTZ(6),
    "invited_at" TIMESTAMPTZ(6),
    "confirmation_token" VARCHAR(255),
    "confirmation_sent_at" TIMESTAMPTZ(6),
    "recovery_token" VARCHAR(255),
    "recovery_sent_at" TIMESTAMPTZ(6),
    "email_change_token_new" VARCHAR(255),
    "email_change" VARCHAR(255),
    "email_change_sent_at" TIMESTAMPTZ(6),
    "last_sign_in_at" TIMESTAMPTZ(6),
    "raw_app_meta_data" JSONB,
    "raw_user_meta_data" JSONB,
    "is_super_admin" BOOLEAN,
    "created_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),
    "phone" TEXT,
    "phone_confirmed_at" TIMESTAMPTZ(6),
    "phone_change" TEXT DEFAULT '',
    "phone_change_token" VARCHAR(255) DEFAULT '',
    "phone_change_sent_at" TIMESTAMPTZ(6),
    "confirmed_at" TIMESTAMP(3),
    "email_change_token_current" VARCHAR(255) DEFAULT '',
    "email_change_confirm_status" SMALLINT DEFAULT 0,
    "banned_until" TIMESTAMPTZ(6),
    "reauthentication_token" VARCHAR(255) DEFAULT '',
    "reauthentication_sent_at" TIMESTAMPTZ(6),
    "is_sso_user" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMPTZ(6),
    "is_anonymous" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."profiles" (
    "id" UUID NOT NULL,
    "first_name" TEXT,
    "last_name" TEXT,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_UnternehmensVerknuepfung" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "public"."_AuftragToBewerber" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "public"."_AuftragToEdvKenntnisse" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "public"."_AuftragToSprachkenntnisse" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "public"."_AnsprechpartnerToAuftrag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "public"."_AnsprechpartnerToUnternehmen" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "public"."_BewerberToEdvKenntnisse" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "public"."_BewerberToSales" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "public"."_BewerberToSprachkenntnisse" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "public"."_BewerberToStellenausschreibung" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "public"."_ZusaetzlichWechselndeKollegen" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE INDEX "audit_logs_instance_id_idx" ON "auth"."audit_log_entries"("instance_id");

-- CreateIndex
CREATE INDEX "flow_state_created_at_idx" ON "auth"."flow_state"("created_at" DESC);

-- CreateIndex
CREATE INDEX "idx_auth_code" ON "auth"."flow_state"("auth_code");

-- CreateIndex
CREATE INDEX "idx_user_id_auth_method" ON "auth"."flow_state"("user_id", "authentication_method");

-- CreateIndex
CREATE INDEX "identities_email_idx" ON "auth"."identities"("email");

-- CreateIndex
CREATE INDEX "identities_user_id_idx" ON "auth"."identities"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "identities_provider_id_provider_unique" ON "auth"."identities"("provider_id", "provider");

-- CreateIndex
CREATE UNIQUE INDEX "mfa_amr_claims_session_id_authentication_method_pkey" ON "auth"."mfa_amr_claims"("session_id", "authentication_method");

-- CreateIndex
CREATE INDEX "mfa_challenge_created_at_idx" ON "auth"."mfa_challenges"("created_at" DESC);

-- CreateIndex
CREATE INDEX "factor_id_created_at_idx" ON "auth"."mfa_factors"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "mfa_factors_user_id_idx" ON "auth"."mfa_factors"("user_id");

-- CreateIndex
CREATE INDEX "one_time_tokens_relates_to_hash_idx" ON "auth"."one_time_tokens" USING HASH ("relates_to");

-- CreateIndex
CREATE INDEX "one_time_tokens_token_hash_hash_idx" ON "auth"."one_time_tokens" USING HASH ("token_hash");

-- CreateIndex
CREATE UNIQUE INDEX "one_time_tokens_user_id_token_type_key" ON "auth"."one_time_tokens"("user_id", "token_type");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_token_unique" ON "auth"."refresh_tokens"("token");

-- CreateIndex
CREATE INDEX "refresh_tokens_instance_id_idx" ON "auth"."refresh_tokens"("instance_id");

-- CreateIndex
CREATE INDEX "refresh_tokens_instance_id_user_id_idx" ON "auth"."refresh_tokens"("instance_id", "user_id");

-- CreateIndex
CREATE INDEX "refresh_tokens_parent_idx" ON "auth"."refresh_tokens"("parent");

-- CreateIndex
CREATE INDEX "refresh_tokens_session_id_revoked_idx" ON "auth"."refresh_tokens"("session_id", "revoked");

-- CreateIndex
CREATE INDEX "refresh_tokens_updated_at_idx" ON "auth"."refresh_tokens"("updated_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "saml_providers_entity_id_key" ON "auth"."saml_providers"("entity_id");

-- CreateIndex
CREATE INDEX "saml_providers_sso_provider_id_idx" ON "auth"."saml_providers"("sso_provider_id");

-- CreateIndex
CREATE INDEX "saml_relay_states_created_at_idx" ON "auth"."saml_relay_states"("created_at" DESC);

-- CreateIndex
CREATE INDEX "saml_relay_states_for_email_idx" ON "auth"."saml_relay_states"("for_email");

-- CreateIndex
CREATE INDEX "saml_relay_states_sso_provider_id_idx" ON "auth"."saml_relay_states"("sso_provider_id");

-- CreateIndex
CREATE INDEX "sessions_not_after_idx" ON "auth"."sessions"("not_after" DESC);

-- CreateIndex
CREATE INDEX "sessions_user_id_idx" ON "auth"."sessions"("user_id");

-- CreateIndex
CREATE INDEX "user_id_created_at_idx" ON "auth"."sessions"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "sso_domains_sso_provider_id_idx" ON "auth"."sso_domains"("sso_provider_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "auth"."users"("phone");

-- CreateIndex
CREATE INDEX "users_instance_id_idx" ON "auth"."users"("instance_id");

-- CreateIndex
CREATE INDEX "users_is_anonymous_idx" ON "auth"."users"("is_anonymous");

-- CreateIndex
CREATE UNIQUE INDEX "_UnternehmensVerknuepfung_AB_unique" ON "public"."_UnternehmensVerknuepfung"("A", "B");

-- CreateIndex
CREATE INDEX "_UnternehmensVerknuepfung_B_index" ON "public"."_UnternehmensVerknuepfung"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_AuftragToBewerber_AB_unique" ON "public"."_AuftragToBewerber"("A", "B");

-- CreateIndex
CREATE INDEX "_AuftragToBewerber_B_index" ON "public"."_AuftragToBewerber"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_AuftragToEdvKenntnisse_AB_unique" ON "public"."_AuftragToEdvKenntnisse"("A", "B");

-- CreateIndex
CREATE INDEX "_AuftragToEdvKenntnisse_B_index" ON "public"."_AuftragToEdvKenntnisse"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_AuftragToSprachkenntnisse_AB_unique" ON "public"."_AuftragToSprachkenntnisse"("A", "B");

-- CreateIndex
CREATE INDEX "_AuftragToSprachkenntnisse_B_index" ON "public"."_AuftragToSprachkenntnisse"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_AnsprechpartnerToAuftrag_AB_unique" ON "public"."_AnsprechpartnerToAuftrag"("A", "B");

-- CreateIndex
CREATE INDEX "_AnsprechpartnerToAuftrag_B_index" ON "public"."_AnsprechpartnerToAuftrag"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_AnsprechpartnerToUnternehmen_AB_unique" ON "public"."_AnsprechpartnerToUnternehmen"("A", "B");

-- CreateIndex
CREATE INDEX "_AnsprechpartnerToUnternehmen_B_index" ON "public"."_AnsprechpartnerToUnternehmen"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_BewerberToEdvKenntnisse_AB_unique" ON "public"."_BewerberToEdvKenntnisse"("A", "B");

-- CreateIndex
CREATE INDEX "_BewerberToEdvKenntnisse_B_index" ON "public"."_BewerberToEdvKenntnisse"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_BewerberToSales_AB_unique" ON "public"."_BewerberToSales"("A", "B");

-- CreateIndex
CREATE INDEX "_BewerberToSales_B_index" ON "public"."_BewerberToSales"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_BewerberToSprachkenntnisse_AB_unique" ON "public"."_BewerberToSprachkenntnisse"("A", "B");

-- CreateIndex
CREATE INDEX "_BewerberToSprachkenntnisse_B_index" ON "public"."_BewerberToSprachkenntnisse"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_BewerberToStellenausschreibung_AB_unique" ON "public"."_BewerberToStellenausschreibung"("A", "B");

-- CreateIndex
CREATE INDEX "_BewerberToStellenausschreibung_B_index" ON "public"."_BewerberToStellenausschreibung"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ZusaetzlichWechselndeKollegen_AB_unique" ON "public"."_ZusaetzlichWechselndeKollegen"("A", "B");

-- CreateIndex
CREATE INDEX "_ZusaetzlichWechselndeKollegen_B_index" ON "public"."_ZusaetzlichWechselndeKollegen"("B");

-- AddForeignKey
ALTER TABLE "public"."Unternehmen" ADD CONSTRAINT "Unternehmen_betreuerId_fkey" FOREIGN KEY ("betreuerId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Unternehmen" ADD CONSTRAINT "Unternehmen_erstelltVonId_fkey" FOREIGN KEY ("erstelltVonId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Unternehmen" ADD CONSTRAINT "Unternehmen_letzteAenderungVonId_fkey" FOREIGN KEY ("letzteAenderungVonId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Auftrag" ADD CONSTRAINT "Auftrag_affiliateId_fkey" FOREIGN KEY ("affiliateId") REFERENCES "public"."Affiliate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Auftrag" ADD CONSTRAINT "Auftrag_betreuerId_fkey" FOREIGN KEY ("betreuerId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Auftrag" ADD CONSTRAINT "Auftrag_erstelltVonId_fkey" FOREIGN KEY ("erstelltVonId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Auftrag" ADD CONSTRAINT "Auftrag_letzteAenderungVonId_fkey" FOREIGN KEY ("letzteAenderungVonId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Auftrag" ADD CONSTRAINT "Auftrag_salesId_fkey" FOREIGN KEY ("salesId") REFERENCES "public"."Sales"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Auftrag" ADD CONSTRAINT "Auftrag_stellenbeschreibungId_fkey" FOREIGN KEY ("stellenbeschreibungId") REFERENCES "public"."Stellenbeschreibung"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Auftrag" ADD CONSTRAINT "Auftrag_unternehmenId_fkey" FOREIGN KEY ("unternehmenId") REFERENCES "public"."Unternehmen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Sales" ADD CONSTRAINT "Sales_ansprechpartnerId_fkey" FOREIGN KEY ("ansprechpartnerId") REFERENCES "public"."Ansprechpartner"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Sales" ADD CONSTRAINT "Sales_erstelltVonId_fkey" FOREIGN KEY ("erstelltVonId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Sales" ADD CONSTRAINT "Sales_letzteAenderungVonId_fkey" FOREIGN KEY ("letzteAenderungVonId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Sales" ADD CONSTRAINT "Sales_unternehmenId_fkey" FOREIGN KEY ("unternehmenId") REFERENCES "public"."Unternehmen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Ansprechpartner" ADD CONSTRAINT "Ansprechpartner_betreuerId_fkey" FOREIGN KEY ("betreuerId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Ansprechpartner" ADD CONSTRAINT "Ansprechpartner_erstelltVonId_fkey" FOREIGN KEY ("erstelltVonId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Ansprechpartner" ADD CONSTRAINT "Ansprechpartner_letzteAenderungVonId_fkey" FOREIGN KEY ("letzteAenderungVonId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Bewerber" ADD CONSTRAINT "Bewerber_affiliateId_fkey" FOREIGN KEY ("affiliateId") REFERENCES "public"."Affiliate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Bewerber" ADD CONSTRAINT "Bewerber_betreuerId_fkey" FOREIGN KEY ("betreuerId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Bewerber" ADD CONSTRAINT "Bewerber_empfohlenVonId_fkey" FOREIGN KEY ("empfohlenVonId") REFERENCES "public"."Bewerber"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Bewerber" ADD CONSTRAINT "Bewerber_erstelltVonId_fkey" FOREIGN KEY ("erstelltVonId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Bewerber" ADD CONSTRAINT "Bewerber_letzteAenderungVonId_fkey" FOREIGN KEY ("letzteAenderungVonId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Dokument" ADD CONSTRAINT "Dokument_ansprechpartnerId_fkey" FOREIGN KEY ("ansprechpartnerId") REFERENCES "public"."Ansprechpartner"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Dokument" ADD CONSTRAINT "Dokument_auftragId_fkey" FOREIGN KEY ("auftragId") REFERENCES "public"."Auftrag"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Dokument" ADD CONSTRAINT "Dokument_bewerberId_fkey" FOREIGN KEY ("bewerberId") REFERENCES "public"."Bewerber"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Dokument" ADD CONSTRAINT "Dokument_erstellerId_fkey" FOREIGN KEY ("erstellerId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Dokument" ADD CONSTRAINT "Dokument_salesId_fkey" FOREIGN KEY ("salesId") REFERENCES "public"."Sales"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Dokument" ADD CONSTRAINT "Dokument_unternehmenId_fkey" FOREIGN KEY ("unternehmenId") REFERENCES "public"."Unternehmen"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Todo" ADD CONSTRAINT "Todo_ansprechpartnerId_fkey" FOREIGN KEY ("ansprechpartnerId") REFERENCES "public"."Ansprechpartner"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Todo" ADD CONSTRAINT "Todo_auftragId_fkey" FOREIGN KEY ("auftragId") REFERENCES "public"."Auftrag"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Todo" ADD CONSTRAINT "Todo_bewerberId_fkey" FOREIGN KEY ("bewerberId") REFERENCES "public"."Bewerber"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Todo" ADD CONSTRAINT "Todo_erstelltVonId_fkey" FOREIGN KEY ("erstelltVonId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Todo" ADD CONSTRAINT "Todo_salesId_fkey" FOREIGN KEY ("salesId") REFERENCES "public"."Sales"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Todo" ADD CONSTRAINT "Todo_unternehmenId_fkey" FOREIGN KEY ("unternehmenId") REFERENCES "public"."Unternehmen"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Todo" ADD CONSTRAINT "Todo_zustaendigId_fkey" FOREIGN KEY ("zustaendigId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth"."identities" ADD CONSTRAINT "identities_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "auth"."mfa_amr_claims" ADD CONSTRAINT "mfa_amr_claims_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "auth"."sessions"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "auth"."mfa_challenges" ADD CONSTRAINT "mfa_challenges_auth_factor_id_fkey" FOREIGN KEY ("factor_id") REFERENCES "auth"."mfa_factors"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "auth"."mfa_factors" ADD CONSTRAINT "mfa_factors_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "auth"."one_time_tokens" ADD CONSTRAINT "one_time_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "auth"."refresh_tokens" ADD CONSTRAINT "refresh_tokens_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "auth"."sessions"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "auth"."saml_providers" ADD CONSTRAINT "saml_providers_sso_provider_id_fkey" FOREIGN KEY ("sso_provider_id") REFERENCES "auth"."sso_providers"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "auth"."saml_relay_states" ADD CONSTRAINT "saml_relay_states_flow_state_id_fkey" FOREIGN KEY ("flow_state_id") REFERENCES "auth"."flow_state"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "auth"."saml_relay_states" ADD CONSTRAINT "saml_relay_states_sso_provider_id_fkey" FOREIGN KEY ("sso_provider_id") REFERENCES "auth"."sso_providers"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "auth"."sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "auth"."sso_domains" ADD CONSTRAINT "sso_domains_sso_provider_id_fkey" FOREIGN KEY ("sso_provider_id") REFERENCES "auth"."sso_providers"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."profiles" ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."_UnternehmensVerknuepfung" ADD CONSTRAINT "_UnternehmensVerknuepfung_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Unternehmen"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_UnternehmensVerknuepfung" ADD CONSTRAINT "_UnternehmensVerknuepfung_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Unternehmen"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_AuftragToBewerber" ADD CONSTRAINT "_AuftragToBewerber_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Auftrag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_AuftragToBewerber" ADD CONSTRAINT "_AuftragToBewerber_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Bewerber"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_AuftragToEdvKenntnisse" ADD CONSTRAINT "_AuftragToEdvKenntnisse_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Auftrag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_AuftragToEdvKenntnisse" ADD CONSTRAINT "_AuftragToEdvKenntnisse_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."EdvKenntnisse"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_AuftragToSprachkenntnisse" ADD CONSTRAINT "_AuftragToSprachkenntnisse_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Auftrag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_AuftragToSprachkenntnisse" ADD CONSTRAINT "_AuftragToSprachkenntnisse_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Sprachkenntnisse"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_AnsprechpartnerToAuftrag" ADD CONSTRAINT "_AnsprechpartnerToAuftrag_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Ansprechpartner"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_AnsprechpartnerToAuftrag" ADD CONSTRAINT "_AnsprechpartnerToAuftrag_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Auftrag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_AnsprechpartnerToUnternehmen" ADD CONSTRAINT "_AnsprechpartnerToUnternehmen_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Ansprechpartner"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_AnsprechpartnerToUnternehmen" ADD CONSTRAINT "_AnsprechpartnerToUnternehmen_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Unternehmen"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_BewerberToEdvKenntnisse" ADD CONSTRAINT "_BewerberToEdvKenntnisse_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Bewerber"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_BewerberToEdvKenntnisse" ADD CONSTRAINT "_BewerberToEdvKenntnisse_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."EdvKenntnisse"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_BewerberToSales" ADD CONSTRAINT "_BewerberToSales_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Bewerber"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_BewerberToSales" ADD CONSTRAINT "_BewerberToSales_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Sales"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_BewerberToSprachkenntnisse" ADD CONSTRAINT "_BewerberToSprachkenntnisse_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Bewerber"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_BewerberToSprachkenntnisse" ADD CONSTRAINT "_BewerberToSprachkenntnisse_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Sprachkenntnisse"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_BewerberToStellenausschreibung" ADD CONSTRAINT "_BewerberToStellenausschreibung_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Bewerber"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_BewerberToStellenausschreibung" ADD CONSTRAINT "_BewerberToStellenausschreibung_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Stellenausschreibung"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_ZusaetzlichWechselndeKollegen" ADD CONSTRAINT "_ZusaetzlichWechselndeKollegen_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Bewerber"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_ZusaetzlichWechselndeKollegen" ADD CONSTRAINT "_ZusaetzlichWechselndeKollegen_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Bewerber"("id") ON DELETE CASCADE ON UPDATE CASCADE;
