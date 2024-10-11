'use client';

import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FaStar, FaEdit, FaSave } from 'react-icons/fa';
import { Editor as TinyMCEEditor } from '@tinymce/tinymce-react';

interface Benutzer {
  id: string;
  vorname: string;
  name: string;
}

interface Kontakt {
  id: string;
  vorname: string;
  nachname: string;
}

interface Unternehmen {
  id: string;
  autogeneratedNr: number;
  name: string;
  status: string;
  kategorie: number | null;
  strasse: string;
  postleitzahl: string;
  stadt: string;
  umsatzsteuerId: string | null;
  standort: string | null;
  homepage: string | null;
  jobsite: string | null;
  linkedin: string | null;
  xing: string | null;
  zentraleMail: string | null;
  zentralTelefon: string | null;
  vermittlungsprovision: string | null;
  usbBeschreibung: string | null;
  interneNotizen: string | null;
  erstelltAm: string;
  letzteAenderungAm: string | null;
  betreuer: {
    id: string;
    name: string;
  } | null;
  // Weitere Felder...
}

interface StammdatenProps {
  unternehmen: Unternehmen;
}

const statuses = ['inaktiv', 'Zielkunde', 'pending', 'aktiv', 'Rahmenvertragspartner', 'nicht_kontaktieren'];
const standorte = ['Zentrale', 'Zweigstelle'];
const verknuepfungsarten = ['Muttergesellschaft', 'Tochtergesellschaft', 'Schwestergesellschaft'];

const Stammdaten: React.FC<StammdatenProps> = ({ unternehmen }) => {
  const [formData, setFormData] = useState<Unternehmen>({ ...unternehmen });
  const [isEditing, setIsEditing] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(true);
  const [users, setUsers] = useState<Benutzer[]>([]);
  const [contacts, setContacts] = useState<Kontakt[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users', { signal: controller.signal });
        if (!response.ok) {
          throw new Error('Fehler beim Laden der Benutzerliste');
        }
        const data: Benutzer[] = await response.json();
        setUsers(data);
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error(error);
        }
      }
    };

    const fetchContacts = async () => {
      try {
        const response = await fetch(`/api/linkedContacts?currentCompanyId=${unternehmen.id}`, { signal: controller.signal });
        if (!response.ok) {
          throw new Error('Fehler beim Laden der Kontakte');
        }
        const data: Kontakt[] = await response.json();
        setContacts(data);
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error('Fehler beim Laden der verknüpften Kontakte:', error);
        }
      }
    };

    fetchUsers();
    fetchContacts();

    return () => {
      controller.abort();
    };
  }, [unternehmen.id]);

  useEffect(() => {
    const handleScroll = () => {
      if (buttonRef.current && isEditing) {
        const rect = buttonRef.current.getBoundingClientRect();
        setIsButtonVisible(rect.top >= 0 && rect.bottom <= window.innerHeight);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string) => (value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleEditorChange = (field: string) => (content: string) => {
    setFormData({ ...formData, [field]: content });
  };

  const handleEditSave = async () => {
    if (isEditing) {
      try {
        const response = await fetch('/api/updateStammdaten', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const result = await response.json();
        if (!response.ok) {
          throw new Error('Fehler beim Aktualisieren der Daten: ' + result.error);
        }
        console.log('Daten erfolgreich aktualisiert:', result);
        setSuccessMessage('Daten erfolgreich aktualisiert.');
        setErrorMessage(null);
      } catch (error: any) {
        console.error('Update fehlgeschlagen:', error);
        setErrorMessage('Aktualisierung fehlgeschlagen. Bitte versuchen Sie es erneut.');
        setSuccessMessage(null);
      }
    }
    setIsEditing(!isEditing);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter' && isEditing) {
      e.preventDefault();
      handleEditSave();
    }
  };

  const renderStars = (rating: number | null) => {
    const handleStarClick = (index: number) => {
      setFormData({ ...formData, kategorie: index + 1 });
    };

    if (rating === null) rating = 0;

    return (
      <div className="flex gap-1">
        {Array.from({ length: 5 }, (_, i) => (
          <FaStar
            key={i}
            className={`text-2xl ${i < rating ? 'text-yellow-400' : 'text-gray-300'} ${isEditing ? 'cursor-pointer' : ''}`}
            onClick={() => isEditing && handleStarClick(i)}
          />
        ))}
      </div>
    );
  };

  const renderField = (name: string, label: string, type: string = 'text') => (
    <div className="space-y-2" onDoubleClick={() => !isEditing && setIsEditing(true)}>
      <Label htmlFor={name}>{label}</Label>
      {isEditing ? (
        <Input type={type} id={name} name={name} value={formData[name as keyof typeof formData] as string} onChange={handleChange} />
      ) : (
        <div className="p-2 bg-gray-100 rounded min-h-[38px] flex items-center">
          {type === 'url' ? (
            <a
              href={formData[name as keyof typeof formData] as string}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {formData[name as keyof typeof formData] as string}
            </a>
          ) : (
            (formData[name as keyof typeof formData] as string) || 'Nicht verfügbar'
          )}
        </div>
      )}
    </div>
  );

  const renderSelectField = (name: string, label: string, options: { id: string; label: string }[]) => (
    <div className="space-y-2" onDoubleClick={() => !isEditing && setIsEditing(true)}>
      <Label htmlFor={name}>{label}</Label>
      {isEditing ? (
        <Select onValueChange={handleSelectChange(name)} value={formData[name as keyof typeof formData] as string}>
          <SelectTrigger>
            <SelectValue placeholder={`Wählen Sie ${label}`} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.id} value={option.id}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <div className="p-2 bg-gray-100 rounded min-h-[38px] flex items-center">
          {options.find((option) => option.id === formData[name as keyof typeof formData])?.label || 'Keine Zuordnung'}
        </div>
      )}
    </div>
  );

  const renderEditor = (field: string, label: string) => (
    <div className="space-y-2" onDoubleClick={() => !isEditing && setIsEditing(true)}>
      <Label htmlFor={field}>{label}</Label>
      {isEditing ? (
        <TinyMCEEditor
          apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
          value={formData[field as keyof typeof formData] as string}
          init={{
            height: 200,
            menubar: false,
            plugins: [
              'anchor',
              'autolink',
              'charmap',
              'codesample',
              'emoticons',
              'image',
              'link',
              'lists',
              'media',
              'searchreplace',
              'table',
              'visualblocks',
              'wordcount',
              'fontselect',
              'fontsizeselect',
            ],
            toolbar:
              'undo redo | formatselect | bold italic backcolor | ' +
              'alignleft aligncenter alignright alignjustify | ' +
              'bullist numlist outdent indent | removeformat | fontselect fontsizeselect | help',
          }}
          onEditorChange={(content) => handleEditorChange(field)(content)}
        />
      ) : (
        <div
          id={field}
          className="prose p-2 bg-gray-100 rounded min-h-[200px] overflow-auto"
          dangerouslySetInnerHTML={{ __html: formData[field as keyof typeof formData] as string }}
        ></div>
      )}
    </div>
  );

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Stammdaten</CardTitle>
          <Button ref={buttonRef} onClick={handleEditSave} variant="outline">
            {isEditing ? <FaSave className="mr-2 h-4 w-4" /> : <FaEdit className="mr-2 h-4 w-4" />}
            {isEditing ? 'Speichern' : 'Bearbeiten'}
          </Button>
        </CardHeader>
        <CardContent>
          {successMessage && <div className="bg-green-100 border border-green-500 text-green-700 p-2 rounded mb-4">{successMessage}</div>}
          {errorMessage && <div className="bg-red-100 border border-red-500 text-red-700 p-2 rounded mb-4">{errorMessage}</div>}
          {isEditing && (
            <div className="bg-blue-100 border border-blue-500 text-blue-700 p-2 rounded mb-4">
              <strong>Hinweis:</strong> Sie befinden sich im Bearbeitungsmodus. Drücken Sie Enter zum Speichern.
            </div>
          )}
          <form ref={formRef} onSubmit={(e) => e.preventDefault()} onKeyDown={handleKeyDown} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Linke Spalte */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="autogeneratedNr">Kundennummer</Label>
                  <Input id="autogeneratedNr" value={unternehmen.autogeneratedNr} disabled />
                </div>
                {renderField('name', 'Kundenname')}
                {renderField('strasse', 'Straße')}
                {renderField('postleitzahl', 'Postleitzahl')}
                {renderField('stadt', 'Stadt')}
                {renderSelectField(
                  'standort',
                  'Standort',
                  standorte.map((s) => ({ id: s, label: s }))
                )}
                <div className="h-8" />
                {renderField('homepage', 'Homepage', 'url')}
                {renderField('jobsite', 'Jobpage', 'url')}
                {renderField('linkedin', 'LinkedIn', 'url')}
                {renderField('xing', 'Xing', 'url')}
                {renderField('umsatzsteuerId', 'Umsatzsteuer ID')}
              </div>
              {/* Rechte Spalte */}
              <div className="space-y-4">
                {renderSelectField(
                  'status',
                  'Status',
                  statuses.map((status) => ({ id: status, label: status.charAt(0).toUpperCase() + status.slice(1) }))
                )}
                <div className="space-y-2" onDoubleClick={() => !isEditing && setIsEditing(true)}>
                  <Label htmlFor="kategorie">Kategorie</Label>
                  <div className="min-h-[38px] flex items-center">{renderStars(formData.kategorie)}</div>
                </div>
                {renderSelectField(
                  'unternehmensverknuepfung',
                  'Unternehmensverknüpfung',
                  verknuepfungsarten.map((v) => ({ id: v, label: v }))
                )}
                {renderField('zentraleMail', 'Zentrale Mail', 'email')}
                {renderField('zentralTelefon', 'Zentrale Telefonnummer', 'tel')}
                {renderSelectField(
                  'hauptansprechpartner',
                  'Hauptansprechpartner',
                  contacts.map((c) => ({ id: c.id, label: `${c.vorname} ${c.nachname}` }))
                )}
                <div className="h-8" />
                {renderField('vermittlungsprovision', 'Vermittlungsprovision %')}
                {renderField('vermittlungsprovisionIntervall', 'Vermittlungsprovision Auszahlungsintervall')}
                {renderSelectField(
                  'betreuerId',
                  'Interner Betreuer',
                  users.map((u) => ({ id: u.id, label: `${u.vorname} ${u.name}` }))
                )}
                {renderField('affiliate', 'Affiliate')}
                {renderField('angelegtAm', 'Angelegt am')}
                {renderField('angelegtVon', 'Angelegt von')}
              </div>
            </div>
            {/* Bereich unter den zwei Spalten */}
            <div className="space-y-4">
              {renderEditor('usbBeschreibung', 'USPs')}
              {renderEditor('interneNotizen', 'Sonstige Notizen zum Unternehmen')}
            </div>
          </form>
        </CardContent>
      </Card>
      {isEditing && !isButtonVisible && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Button onClick={handleEditSave} className="w-full">
              <FaSave className="mr-2 h-4 w-4" />
              Speichern
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default Stammdaten;
