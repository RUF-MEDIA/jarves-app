'use client';

import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FaEdit, FaSave } from 'react-icons/fa';
import { Editor as TinyMCEEditor } from '@tinymce/tinymce-react';
import { Checkbox } from '@/components/ui/checkbox';

interface Benutzer {
  id: string;
  vorname: string;
  name: string;
}

interface Ansprechpartner {
  id: string;
  autogeneratedNr: number;
  anrede: string | null;
  titel: string | null;
  vorname: string | null;
  nachname: string | null;
  positionJobtitel: string | null;
  kategorie: string | null;
  strasse: string | null;
  postleitzahl: string | null;
  stadt: string | null;
  telefon: string | null;
  mobil: string | null;
  telefonPrivat: string | null;
  email: string | null;
  linkedin: string | null;
  xing: string | null;
  status: string | null;
  duAnsprache: boolean;
  hauptansprechpartner: boolean;
  betreuerId: string | null;
  erstelltAm: string;
  erstelltVonId: string | null;
  abgesagtAm: string | null;
  absagegrund: string | null;
  notiz: string | null;
}

interface StammdatenProps {
  kontaktperson: Ansprechpartner;
}

const anreden = ['Herr', 'Frau', 'Divers'];
const statuses = ['aktiv', 'inaktiv', 'pending', 'nicht_kontaktieren'];

const Stammdaten: React.FC<StammdatenProps> = ({ kontaktperson }) => {
  const [formData, setFormData] = useState<Ansprechpartner>({ ...kontaktperson });
  const [isEditing, setIsEditing] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(true);
  const [users, setUsers] = useState<Benutzer[]>([]);
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

    fetchUsers();

    return () => {
      controller.abort();
    };
  }, []);

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

  const handleCheckboxChange = (name: string) => (checked: boolean) => {
    setFormData({ ...formData, [name]: checked });
  };

  const handleEditorChange = (field: string) => (content: string) => {
    setFormData({ ...formData, [field]: content });
  };

  const handleEditSave = async () => {
    if (isEditing) {
      try {
        const response = await fetch('/api/updateKontaktpersonStammdaten', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const result = await response.json();
        if (!response.ok) {
          throw new Error('Fehler beim Aktualisieren der Daten: ' + result.error);
        }
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
          {options.find((option) => option.id === formData[name as keyof typeof formData])?.label || 'Keine Auswahl'}
        </div>
      )}
    </div>
  );

  const renderCheckboxField = (name: string, label: string) => (
    <div className="flex items-center space-x-2" onDoubleClick={() => !isEditing && setIsEditing(true)}>
      {isEditing ? (
        <Checkbox id={name} checked={formData[name as keyof typeof formData] as boolean} onCheckedChange={handleCheckboxChange(name)} />
      ) : (
        <div className="w-4 h-4 border rounded flex items-center justify-center">{formData[name as keyof typeof formData] && '✓'}</div>
      )}
      <Label htmlFor={name}>{label}</Label>
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
            plugins: ['lists', 'link', 'table', 'wordcount'],
            toolbar: 'undo redo | formatselect | bold italic | bullist numlist | link',
          }}
          onEditorChange={handleEditorChange(field)}
        />
      ) : (
        <div
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
                  <Label htmlFor="autogeneratedNr">Kontaktpersonen-Nr.</Label>
                  <Input id="autogeneratedNr" value={kontaktperson.autogeneratedNr} disabled />
                </div>
                {renderSelectField(
                  'anrede',
                  'Anrede',
                  anreden.map((a) => ({ id: a, label: a }))
                )}
                {renderField('titel', 'Titel')}
                {renderField('nachname', 'Nachname')}
                {renderField('vorname', 'Vorname')}
                {renderField('positionJobtitel', 'Position/Jobtitel')}
                {renderField('strasse', 'Adresse')}
                {renderField('postleitzahl', 'Postleitzahl')}
                {renderField('stadt', 'Stadt')}
                {renderField('telefon', 'Telefon', 'tel')}
                {renderField('mobil', 'Mobil', 'tel')}
                {renderField('telefonPrivat', 'Telefon Privat', 'tel')}
                {renderField('email', 'E-Mail', 'email')}
                {renderField('linkedin', 'LinkedIn', 'url')}
                {renderField('xing', 'Xing', 'url')}
              </div>

              {/* Rechte Spalte */}
              <div className="space-y-4">
                {renderSelectField(
                  'status',
                  'Status',
                  statuses.map((s) => ({ id: s, label: s.charAt(0).toUpperCase() + s.slice(1) }))
                )}
                {renderCheckboxField('duAnsprache', 'Du-Ansprache')}
                {renderCheckboxField('hauptansprechpartner', 'Hauptansprechpartner/in')}
                {renderSelectField(
                  'betreuerId',
                  'Betreuer',
                  users.map((u) => ({ id: u.id, label: `${u.vorname} ${u.name}` }))
                )}
                {renderField('erstelltAm', 'Angelegt am')}
                {renderField('erstelltVonId', 'Angelegt von')}
                {renderField('abgesagtAm', 'Abgesagt am')}
                {renderField('absagegrund', 'Absagegrund')}
              </div>
            </div>

            {/* Bereich unter den zwei Spalten */}
            <div className="space-y-4">{renderEditor('notiz', 'Notizen')}</div>
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
