'use client';
import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FaStar, FaEdit, FaSave } from 'react-icons/fa';
import { IAllProps } from '@tinymce/tinymce-react';

// Dynamischer Import des TinyMCE Editors ohne Typ-Cast
const Editor = dynamic(() => import('@tinymce/tinymce-react').then((mod) => mod.Editor), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
}) as React.ComponentType<IAllProps>;

const statuses = ['inaktiv', 'Zielkunde', 'pending', 'aktiv', 'Rahmenvertragspartner', 'nicht_kontaktieren'];
const standorte = ['Zentrale', 'Zweigstelle'];
const verknuepfungsarten = ['Muttergesellschaft', 'Tochtergesellschaft', 'Schwestergesellschaft'];

const Stammdaten: React.FC<{ unternehmen: any }> = ({ unternehmen }) => {
  const [formData, setFormData] = useState({
    ...unternehmen,
    name: unternehmen.name || '',
    betreuerId: unternehmen.betreuerId || '',
    strasse: unternehmen.strasse || '',
    postleitzahl: unternehmen.postleitzahl || '',
    stadt: unternehmen.stadt || '',
    standort: unternehmen.standort || '',
    homepage: unternehmen.homepage || '',
    jobsite: unternehmen.jobsite || '',
    linkedin: unternehmen.linkedin || '',
    xing: unternehmen.xing || '',
    umsatzsteuerId: unternehmen.umsatzsteuerId || '',
    status: unternehmen.status || '',
    kategorie: unternehmen.kategorie || 0,
    unternehmensverknuepfung: unternehmen.unternehmensverknuepfung || '',
    zentraleMail: unternehmen.zentraleMail || '',
    zentralTelefon: unternehmen.zentralTelefon || '',
    hauptansprechpartner: unternehmen.hauptansprechpartner || '',
    vermittlungsprovision: unternehmen.vermittlungsprovision || '',
    vermittlungsprovisionIntervall: unternehmen.vermittlungsprovisionIntervall || '',
    internerBetreuer: unternehmen.internerBetreuer || '',
    affiliate: unternehmen.affiliate || '',
    angelegtAm: unternehmen.angelegtAm || '',
    angelegtVon: unternehmen.angelegtVon || '',
    usbBeschreibung: unternehmen.usbBeschreibung || '',
    interneNotizen: unternehmen.interneNotizen || '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [isButtonVisible, setIsButtonVisible] = useState(true);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        if (!response.ok) {
          throw new Error('Fehler beim Laden der Benutzerliste');
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchContacts = async () => {
      try {
        const response = await fetch(`/api/linkedContacts?currentCompanyId=${unternehmen.id}`);
        if (!response.ok) {
          throw new Error('Fehler beim Laden der Kontakte');
        }
        const data = await response.json();
        setContacts(data);
      } catch (error) {
        console.error('Fehler beim Laden der verknüpften Kontakte:', error);
      }
    };

    fetchUsers();
    fetchContacts();
  }, [unternehmen.id]);

  useEffect(() => {
    const handleScroll = () => {
      if (formRef.current) {
        const rect = formRef.current.getBoundingClientRect();
        setIsButtonVisible(rect.bottom > window.innerHeight);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      } catch (error) {
        console.error('Update fehlgeschlagen:', error);
      }
    }
    setIsEditing(!isEditing);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleEditSave();
    }
  };

  const renderField = (name: string, label: string, type: string = 'text') => (
    <div className="space-y-2" onDoubleClick={() => setIsEditing(true)}>
      <Label htmlFor={name}>{label}</Label>
      {isEditing ? (
        <Input
          type={type}
          id={name}
          name={name}
          value={formData[name as keyof typeof formData] as string}
          onChange={handleChange}
          className="min-h-[38px]"
        />
      ) : (
        <div className="p-2 bg-gray-100 rounded min-h-[38px]">{formData[name as keyof typeof formData] as string}</div>
      )}
    </div>
  );

  const renderSelectField = (name: string, label: string, options: string[]) => (
    <div className="space-y-2" onDoubleClick={() => setIsEditing(true)}>
      <Label htmlFor={name}>{label}</Label>
      {isEditing ? (
        <Select onValueChange={handleSelectChange(name)} value={formData[name as keyof typeof formData] as string} className="min-h-[38px]">
          <SelectTrigger className="min-h-[38px]">
            <SelectValue placeholder={`Wählen Sie ${label}`} />
          </SelectTrigger>
          <SelectContent className="min-h-[38px]">
            {options.map((option) => (
              <SelectItem key={option} value={option || ' '}>
                {option || 'Keine Auswahl'}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <div className="p-2 bg-gray-100 rounded min-h-[38px]">{formData[name as keyof typeof formData] as string}</div>
      )}
    </div>
  );

  const renderStars = (rating: number) => {
    const handleStarClick = (index: number) => {
      setFormData({ ...formData, kategorie: index + 1 });
    };

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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Stammdaten</CardTitle>
        <Button onClick={handleEditSave} variant="outline" onDoubleClick={(e) => e.stopPropagation()}>
          {isEditing ? <FaSave className="mr-2 h-4 w-4" /> : <FaEdit className="mr-2 h-4 w-4" />}
          {isEditing ? 'Speichern' : 'Bearbeiten'}
        </Button>
      </CardHeader>
      <CardContent>
        {isEditing && (
          <div className="bg-blue-100 border border-blue-500 text-blue-700 p-2 rounded mb-4">
            <strong>Hinweis:</strong> Sie befinden sich im Bearbeitungsmodus.
          </div>
        )}
        <form ref={formRef} onSubmit={(e) => e.preventDefault()} className="space-y-6" onKeyDown={handleKeyDown}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="autogeneratedNr">Kundennummer</Label>
                <div className="p-2 bg-gray-100 rounded min-h-[38px]">{unternehmen.autogeneratedNr}</div>
              </div>
              {renderField('name', 'Kundenname')}
              {renderField('strasse', 'Straße')}
              {renderField('postleitzahl', 'Postleitzahl')}
              {renderField('stadt', 'Stadt')}
              {renderSelectField('standort', 'Standort', standorte)}
              <div className="h-8" />
              {renderField('homepage', 'Homepage')}
              {renderField('jobsite', 'Jobpage')}
              {renderField('linkedin', 'LinkedIn')}
              {renderField('xing', 'Xing')}
              {renderField('umsatzsteuerId', 'Umsatzsteuer ID')}
            </div>
            {/* Right Column */}
            <div className="space-y-4">
              {renderSelectField('status', 'Status', statuses)}
              <div className="space-y-2" onDoubleClick={() => setIsEditing(true)}>
                <Label htmlFor="kategorie">Kategorie</Label>
                <div className="min-h-10 flex items-center">{renderStars(formData.kategorie)}</div>
              </div>
              {renderSelectField('unternehmensverknuepfung', 'Unternehmensverknüpfung', ['', ...verknuepfungsarten])}
              {renderField('zentraleMail', 'Zentrale Mail')}
              {renderField('zentralTelefon', 'Zentrale Telefonnummer')}
              <div className="space-y-2" onDoubleClick={() => setIsEditing(true)}>
                <Label htmlFor="hauptansprechpartner">Hauptansprechpartner</Label>
                {isEditing ? (
                  <Select onValueChange={handleSelectChange('hauptansprechpartner')} value={formData.hauptansprechpartner} className="min-h-[38px]">
                    <SelectTrigger className="min-h-[38px]">
                      <SelectValue placeholder="Wählen Sie einen Ansprechpartner" />
                    </SelectTrigger>
                    <SelectContent className="min-h-[38px]">
                      <SelectItem value=" ">Kein Ansprechpartner ausgewählt</SelectItem>
                      {contacts.map((contact) => (
                        <SelectItem key={contact.id} value={contact.id}>
                          {contact.vorname} {contact.nachname}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="p-2 bg-gray-100 rounded min-h-[38px]">
                    {contacts.find((c) => c.id === formData.hauptansprechpartner)?.vorname}{' '}
                    {contacts.find((c) => c.id === formData.hauptansprechpartner)?.nachname}
                  </div>
                )}
              </div>
              <div className="h-8" />
              {renderField('vermittlungsprovision', 'Vermittlungsprovision %')}
              {renderField('vermittlungsprovisionIntervall', 'Vermittlungsprovision Auszahlungsintervall')}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2" onDoubleClick={() => setIsEditing(true)}>
                  <Label htmlFor="internerBetreuer">Interner Betreuer</Label>
                  {isEditing ? (
                    <Select onValueChange={handleSelectChange('betreuerId')} value={formData.betreuerId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Wählen Sie einen Betreuer" />
                      </SelectTrigger>
                      <SelectContent className="min-h-[38px]">
                        <SelectItem value=" ">Kein Betreuer ausgewählt</SelectItem>
                        {users.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.vorname} {user.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="p-2 bg-gray-100 rounded min-h-[38px]">
                      {users.find((u) => u.id === formData.betreuerId)?.vorname} {users.find((u) => u.id === formData.betreuerId)?.name}
                    </div>
                  )}
                </div>
                {renderField('affiliate', 'Affiliate')}
              </div>
              {renderField('angelegtAm', 'Angelegt am')}
              {renderField('angelegtVon', 'Angelegt von')}
            </div>
          </div>
          {/* Area unter den beiden Spalten */}
          <div className="space-y-4">
            {/* USPs */}
            <div className="space-y-2" onDoubleClick={() => setIsEditing(true)}>
              <Label htmlFor="usbBeschreibung">USPs</Label>
              {isEditing ? (
                <Editor
                  apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
                  value={formData.usbBeschreibung}
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
                  onEditorChange={(content) => handleEditorChange('usbBeschreibung')(content)}
                  className="min-h-[38px]"
                />
              ) : (
                <div className="p-2 bg-gray-100 rounded prose min-h-[38px]" dangerouslySetInnerHTML={{ __html: formData.usbBeschreibung }}></div>
              )}
            </div>
            {/* Interne Notizen */}
            <div className="space-y-2" onDoubleClick={() => setIsEditing(true)}>
              <Label htmlFor="interneNotizen">Sonstige Notizen zum Unternehmen</Label>
              {isEditing ? (
                <Editor
                  apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
                  value={formData.interneNotizen}
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
                  onEditorChange={(content) => handleEditorChange('interneNotizen')(content)}
                  className="min-h-[38px]"
                />
              ) : (
                <div className="p-2 bg-gray-100 rounded prose min-h-[38px]" dangerouslySetInnerHTML={{ __html: formData.interneNotizen }}></div>
              )}
            </div>
          </div>
        </form>
      </CardContent>
      {isEditing && !isButtonVisible && (
        <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-md z-50">
          <Button onClick={handleEditSave} variant="outline" className="w-full">
            <FaSave className="mr-2 h-4 w-4" />
            Speichern
          </Button>
        </div>
      )}
    </Card>
  );
};

export default Stammdaten;
