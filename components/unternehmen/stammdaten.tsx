// components/unternehmen/stammdaten.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { FaStar, FaEdit, FaSave } from 'react-icons/fa';

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
    status: unternehmen.status || '',
    kategorie: unternehmen.kategorie || '',
    zentraleMail: unternehmen.zentraleMail || '',
    zentralTelefon: unternehmen.zentralTelefon || '',
    hauptansprechpartner: unternehmen.hauptansprechpartner || '', // Hauptansprechpartner
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
  const [users, setUsers] = useState<any[]>([]); // Liste der Benutzer
  const [contacts, setContacts] = useState<any[]>([]); // Liste der verknüpften Kontakte

  useEffect(() => {
    // API-Aufruf, um alle Benutzer zu laden
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
      <div style={{ display: 'flex', gap: '2px' }}>
        {Array.from({ length: 5 }, (_, i) => (
          <FaStar
            key={i}
            color={i < rating ? 'gold' : 'gray'}
            onClick={() => isEditing && handleStarClick(i)}
            style={{ cursor: isEditing ? 'pointer' : 'default' }}
          />
        ))}
      </div>
    );
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={handleEditSave} className="bg-gray-500 hover:bg-gray-600 text-white">
          {isEditing ? <FaSave /> : <FaEdit />} {isEditing ? 'Speichern' : 'Bearbeiten'}
        </Button>
      </div>
      {/* Hinweis für den Bearbeitungsmodus */}
      {isEditing && (
        <div className="bg-blue-100 border border-blue-500 text-blue-700 p-2 rounded mb-4">
          <strong>Hinweis:</strong> Sie befinden sich im Bearbeitungsmodus.
        </div>
      )}
      <form onSubmit={(e) => e.preventDefault()} className="grid grid-cols-1 gap-6 w-full p-4 text-sm">
        <div className="grid grid-cols-2 gap-6">
          {/* Linke Spalte */}
          <div className="space-y-4">
            <div>
              <label htmlFor="autogeneratedNr" className="block text-gray-700 font-bold mb-2">
                Kundennummer
              </label>
              <div className="bg-gray-100 p-2 rounded min-h-10 flex items-center w-full">{unternehmen.autogeneratedNr}</div>
            </div>
            <div>
              <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
                Kundenname
              </label>
              <input
                id="name"
                name="name"
                className="bg-gray-100 p-2 rounded min-h-10 flex items-center w-full"
                value={formData.name}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
            <div>
              <label htmlFor="strasse" className="block text-gray-700 font-bold mb-2">
                Straße
              </label>
              <input
                id="strasse"
                name="strasse"
                className="bg-gray-100 p-2 rounded min-h-10 flex items-center w-full"
                value={formData.strasse}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
            <div>
              <label htmlFor="postleitzahl" className="block text-gray-700 font-bold mb-2">
                Postleitzahl
              </label>
              <input
                id="postleitzahl"
                name="postleitzahl"
                className="bg-gray-100 p-2 rounded min-h-10 flex items-center w-full"
                value={formData.postleitzahl}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
            <div>
              <label htmlFor="stadt" className="block text-gray-700 font-bold mb-2">
                Stadt
              </label>
              <input
                id="stadt"
                name="stadt"
                className="bg-gray-100 p-2 rounded min-h-10 flex items-center w-full"
                value={formData.stadt}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
            <div>
              <label htmlFor="standort" className="block text-gray-700 font-bold mb-2">
                Standort
              </label>
              <select
                id="standort"
                name="standort"
                className="bg-gray-100 p-2 rounded min-h-10 flex items-center w-full"
                value={formData.standort}
                onChange={handleChange}
                disabled={!isEditing}
              >
                {standorte.map((standort) => (
                  <option key={standort} value={standort}>
                    {standort}
                  </option>
                ))}
              </select>
            </div>
            <div className="h-20"></div> {/* Spacer */}
            <div>
              <label htmlFor="homepage" className="block text-gray-700 font-bold mb-2">
                Homepage
              </label>
              <input
                id="homepage"
                name="homepage"
                className="bg-gray-100 p-2 rounded min-h-10 flex items-center w-full"
                value={formData.homepage}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
            <div>
              <label htmlFor="jobsite" className="block text-gray-700 font-bold mb-2">
                Jobpage
              </label>
              <input
                id="jobsite"
                name="jobsite"
                className="bg-gray-100 p-2 rounded min-h-10 flex items-center w-full"
                value={formData.jobsite}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
            <div>
              <label htmlFor="linkedin" className="block text-gray-700 font-bold mb-2">
                LinkedIn
              </label>
              <input
                id="linkedin"
                name="linkedin"
                className="bg-gray-100 p-2 rounded min-h-10 flex items-center w-full"
                value={formData.linkedin}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
            <div>
              <label htmlFor="xing" className="block text-gray-700 font-bold mb-2">
                Xing
              </label>
              <input
                id="xing"
                name="xing"
                className="bg-gray-100 p-2 rounded min-h-10 flex items-center w-full"
                value={formData.xing}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
          </div>
          {/* Rechte Spalte */}
          <div className="space-y-4">
            <div>
              <label htmlFor="status" className="block text-gray-700 font-bold mb-2">
                Status
              </label>
              <select
                id="status"
                name="status"
                className="bg-gray-100 p-2 rounded min-h-10 flex items-center w-full"
                value={formData.status}
                onChange={handleChange}
                disabled={!isEditing}
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="kategorie" className="block text-gray-700 font-bold mb-2">
                Kategorie
              </label>
              <div className="min-h-10 flex items-center">{renderStars(formData.kategorie)}</div>
            </div>
            <div>
              <label htmlFor="unternehmensverknuepfung" className="block text-gray-700 font-bold mb-2">
                Unternehmensverknüpfung
              </label>
              <select
                id="unternehmensverknuepfung"
                name="unternehmensverknuepfung"
                className="bg-gray-100 p-2 rounded min-h-10 flex items-center w-full"
                value={formData.unternehmensverknuepfung}
                onChange={handleChange}
                disabled={!isEditing}
              >
                <option value="">Keine Verknüpfung</option>
                {verknuepfungsarten.map((art) => (
                  <option key={art} value={art}>
                    {art}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="zentraleMail" className="block text-gray-700 font-bold mb-2">
                Zentrale Mail
              </label>
              <input
                id="zentraleMail"
                name="zentraleMail"
                className="bg-gray-100 p-2 rounded min-h-10 flex items-center w-full"
                value={formData.zentraleMail}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
            <div>
              <label htmlFor="zentralTelefon" className="block text-gray-700 font-bold mb-2">
                Zentrale Telefonnummer
              </label>
              <input
                id="zentralTelefon"
                name="zentralTelefon"
                className="bg-gray-100 p-2 rounded min-h-10 flex items-center w-full"
                value={formData.zentralTelefon}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
            <div>
              <label htmlFor="hauptansprechpartner" className="block text-gray-700 font-bold mb-2">
                Hauptansprechpartner
              </label>
              <select
                id="hauptansprechpartner"
                name="hauptansprechpartner"
                className="bg-gray-100 p-2 rounded min-h-10 flex items-center w-full"
                value={formData.hauptansprechpartner || ''} // Sicherstellen, dass der Wert niemals null ist
                onChange={(e) => setFormData({ ...formData, hauptansprechpartner: e.target.value })} // Den richtigen Wert speichern
                disabled={!isEditing}
              >
                <option value="">Kein Ansprechpartner ausgewählt</option>
                {contacts.map((contact) => (
                  <option key={contact.id} value={contact.id}>
                    {contact.vorname} {contact.nachname}
                  </option>
                ))}
              </select>
            </div>
            <div className="h-20"></div> {/* Spacer */}
            <div>
              <label htmlFor="vermittlungsprovision" className="block text-gray-700 font-bold mb-2">
                Vermittlungsprovision %
              </label>
              <input
                id="vermittlungsprovision"
                name="vermittlungsprovision"
                className="bg-gray-100 p-2 rounded min-h-10 flex items-center w-full"
                value={formData.vermittlungsprovision}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
            <div>
              <label htmlFor="vermittlungsprovisionIntervall" className="block text-gray-700 font-bold mb-2">
                Vermittlungsprovision Auszahlungsintervall
              </label>
              <input
                id="vermittlungsprovisionIntervall"
                name="vermittlungsprovisionIntervall"
                className="bg-gray-100 p-2 rounded min-h-10 flex items-center w-full"
                value={formData.vermittlungsprovisionIntervall}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="internerBetreuer" className="block text-gray-700 font-bold mb-2">
                  Interner Betreuer
                </label>
                <select
                  id="internerBetreuer"
                  name="betreuerId"
                  className="bg-gray-100 p-2 rounded min-h-10 flex items-center w-full"
                  value={formData.betreuerId}
                  onChange={handleChange}
                  disabled={!isEditing}
                >
                  <option value="">Kein Betreuer ausgewählt</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.vorname} {user.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="affiliate" className="block text-gray-700 font-bold mb-2">
                  Affiliate
                </label>
                <input
                  id="affiliate"
                  name="affiliate"
                  className="bg-gray-100 p-2 rounded min-h-10 flex items-center w-full"
                  value={formData.affiliate}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label htmlFor="angelegtAm" className="block text-gray-700 font-bold mb-2">
                  Angelegt am
                </label>
                <input
                  id="angelegtAm"
                  name="angelegtAm"
                  className="bg-gray-100 p-2 rounded min-h-10 flex items-center w-full"
                  value={formData.angelegtAm}
                  onChange={handleChange}
                  disabled
                />
              </div>
              <div>
                <label htmlFor="angelegtVon" className="block text-gray-700 font-bold mb-2">
                  Angelegt von
                </label>
                <input
                  id="angelegtVon"
                  name="angelegtVon"
                  className="bg-gray-100 p-2 rounded min-h-10 flex items-center w-full"
                  value={formData.angelegtVon}
                  onChange={handleChange}
                  disabled
                />
              </div>
            </div>
          </div>
        </div>
        {/* Bereich unter den zwei Spalten */}
        <div>
          <label htmlFor="usbBeschreibung" className="block text-gray-700 font-bold mb-2">
            USPs
          </label>
          <Textarea
            id="usbBeschreibung"
            name="usbBeschreibung"
            className="w-full h-40 bg-gray-100"
            value={formData.usbBeschreibung}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>
        <div>
          <label htmlFor="interneNotizen" className="block text-gray-700 font-bold mb-2">
            Sonstige Notizen zum Unternehmen
          </label>
          <Textarea
            id="interneNotizen"
            name="interneNotizen"
            className="w-full h-40 bg-gray-100"
            value={formData.interneNotizen}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>
      </form>
    </div>
  );
};

export default Stammdaten;
