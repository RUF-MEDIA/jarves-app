'use client';

import dynamic from 'next/dynamic';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FaStar, FaEdit, FaSave } from 'react-icons/fa';

// Dynamically import the Editor component
const Editor = dynamic(() => import('@tinymce/tinymce-react').then((mod) => mod.Editor), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});

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

  const renderField = (name: string, label: string, type: string = 'text') => (
    <div className="space-y-2" onDoubleClick={() => setIsEditing(true)}>
      <Label htmlFor={name}>{label}</Label>
      <Input
        type={type}
        id={name}
        name={name}
        value={formData[name as keyof typeof formData] as string}
        onChange={handleChange}
        disabled={!isEditing}
      />
    </div>
  );

  const renderSelectField = (name: string, label: string, options: string[]) => (
    <div className="space-y-2" onDoubleClick={() => setIsEditing(true)}>
      <Label htmlFor={name}>{label}</Label>
      <Select disabled={!isEditing} onValueChange={handleSelectChange(name)} value={formData[name as keyof typeof formData] as string}>
        <SelectTrigger>
          <SelectValue placeholder={`Wählen Sie ${label}`} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option || ' '}>
              {option || 'Keine Auswahl'}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

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
        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
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
              {renderSelectField('standort', 'Standort', standorte)}
              <div className="h-8" />
              {renderField('homepage', 'Homepage')}
              {renderField('jobsite', 'Jobpage')}
              {renderField('linkedin', 'LinkedIn')}
              {renderField('xing', 'Xing')}
              {isEditing ? (
                <div className="space-y-2">
                  <Label htmlFor="umsatzsteuerId">Umsatzsteuer ID</Label>
                  <Input type="text" id="umsatzsteuerId" name="umsatzsteuerId" value={formData.umsatzsteuerId} onChange={handleChange} />
                </div>
              ) : (
                <div className="space-y-2" onDoubleClick={() => setIsEditing(true)}>
                  <Label htmlFor="umsatzsteuerId">Umsatzsteuer ID</Label>
                  <div id="umsatzsteuerId">{formData.umsatzsteuerId}</div>
                </div>
              )}
            </div>
            {/* Rechte Spalte */}
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
                <Select disabled={!isEditing} onValueChange={handleSelectChange('hauptansprechpartner')} value={formData.hauptansprechpartner}>
                  <SelectTrigger>
                    <SelectValue placeholder="Wählen Sie einen Ansprechpartner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value=" ">Kein Ansprechpartner ausgewählt</SelectItem>
                    {contacts.map((contact) => (
                      <SelectItem key={contact.id} value={contact.id}>
                        {contact.vorname} {contact.nachname}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="h-8" />
              {renderField('vermittlungsprovision', 'Vermittlungsprovision %')}
              {renderField('vermittlungsprovisionIntervall', 'Vermittlungsprovision Auszahlungsintervall')}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2" onDoubleClick={() => setIsEditing(true)}>
                  <Label htmlFor="internerBetreuer">Interner Betreuer</Label>
                  <Select disabled={!isEditing} onValueChange={handleSelectChange('betreuerId')} value={formData.betreuerId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Wählen Sie einen Betreuer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value=" ">Kein Betreuer ausgewählt</SelectItem>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.vorname} {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {renderField('affiliate', 'Affiliate')}
              </div>
              {renderField('angelegtAm', 'Angelegt am')}
              {renderField('angelegtVon', 'Angelegt von')}
            </div>
          </div>
          {/* Bereich unter den zwei Spalten */}
          <div className="space-y-4">
            {/* USPs */}
            <div className="space-y-2" onDoubleClick={() => setIsEditing(true)}>
              <Label htmlFor="usbBeschreibung">USPs</Label>
              {isEditing ? (
                <Editor
                  apiKey="plcdfq5rvjodoybphuo0a3qc0o5003vld3m6w0ylsddiylr6"
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
                />
              ) : (
                <div id="usbBeschreibung" className="prose" dangerouslySetInnerHTML={{ __html: formData.usbBeschreibung }}></div>
              )}
            </div>
            {/* Interne Notizen */}
            <div className="space-y-2" onDoubleClick={() => setIsEditing(true)}>
              <Label htmlFor="interneNotizen">Sonstige Notizen zum Unternehmen</Label>
              {isEditing ? (
                <Editor
                  apiKey="plcdfq5rvjodoybphuo0a3qc0o5003vld3m6w0ylsddiylr6"
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
                />
              ) : (
                <div id="interneNotizen" className="prose" dangerouslySetInnerHTML={{ __html: formData.interneNotizen }}></div>
              )}
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default Stammdaten;
