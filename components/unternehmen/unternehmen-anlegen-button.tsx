'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLoadScript } from '@react-google-maps/api';

const libraries = ['places'];

export default function UnternehmenAnlegenButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    strasse: '',
    postleitzahl: '',
    stadt: '',
    standort: '',
    status: '',
    kategorie: 0,
    zentraleMail: '',
    zentralTelefon: '',
    homepage: '',
    jobsite: '',
    linkedin: '',
    xing: '',
    umsatzsteuerId: '',
  });

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: libraries as any,
  });

  const autocompleteRefStrasse = useRef<google.maps.places.Autocomplete | null>(null);
  const autocompleteRefPostleitzahl = useRef<google.maps.places.Autocomplete | null>(null);
  const autocompleteRefStadt = useRef<google.maps.places.Autocomplete | null>(null);
  const strasseInputRef = useRef<HTMLInputElement>(null);
  const postleitzahlInputRef = useRef<HTMLInputElement>(null);
  const stadtInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isLoaded && isOpen && strasseInputRef.current && postleitzahlInputRef.current && stadtInputRef.current) {
      const initAutocomplete = () => {
        if (!autocompleteRefStrasse.current) {
          const autocompleteStrasse = new google.maps.places.Autocomplete(strasseInputRef.current!, {
            types: ['geocode'],
            componentRestrictions: { country: 'de' },
            fields: ['address_components', 'formatted_address', 'name'],
          });
          autocompleteStrasse.addListener('place_changed', () => {
            const place = autocompleteStrasse.getPlace();
            handlePlaceSelect(place, 'strasse');
          });
          autocompleteRefStrasse.current = autocompleteStrasse;
        }

        if (!autocompleteRefPostleitzahl.current) {
          const autocompletePostleitzahl = new google.maps.places.Autocomplete(postleitzahlInputRef.current!, {
            types: ['(regions)'],
            componentRestrictions: { country: 'de' },
            fields: ['address_components', 'formatted_address'],
          });
          autocompletePostleitzahl.addListener('place_changed', () => {
            const place = autocompletePostleitzahl.getPlace();
            handlePlaceSelect(place, 'postleitzahl');
          });
          autocompleteRefPostleitzahl.current = autocompletePostleitzahl;
        }

        if (!autocompleteRefStadt.current) {
          const autocompleteStadt = new google.maps.places.Autocomplete(stadtInputRef.current!, {
            types: ['(cities)'],
            componentRestrictions: { country: 'de' },
            fields: ['address_components', 'formatted_address'],
          });
          autocompleteStadt.addListener('place_changed', () => {
            const place = autocompleteStadt.getPlace();
            handlePlaceSelect(place, 'stadt');
          });
          autocompleteRefStadt.current = autocompleteStadt;
        }
      };

      initAutocomplete();
    }
  }, [isLoaded, isOpen, strasseInputRef.current, postleitzahlInputRef.current, stadtInputRef.current]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string) => (value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handlePlaceSelect = (place: google.maps.places.PlaceResult, field: 'strasse' | 'postleitzahl' | 'stadt') => {
    console.log('handlePlaceSelect aufgerufen mit field:', field);
    console.log('Place Objekt:', place);

    if (!place.address_components) {
      console.error('Keine Adresskomponenten gefunden');
      return;
    }

    const address = {
      street_number: '',
      route: '',
      locality: '',
      postal_code: '',
    };

    for (const component of place.address_components) {
      const componentType = component.types[0];

      switch (componentType) {
        case 'street_number':
          address.street_number = component.long_name;
          break;
        case 'route':
          address.route = component.long_name;
          break;
        case 'postal_code':
          address.postal_code = component.long_name;
          break;
        case 'locality':
          address.locality = component.long_name;
          break;
        case 'postal_town':
          address.locality = component.long_name;
          break;
        // Weitere Fälle hinzufügen, falls nötig
      }
    }

    setFormData((prev) => {
      const newData = { ...prev };
      if (field === 'strasse') {
        newData.strasse = `${address.route} ${address.street_number}`.trim();
        if (strasseInputRef.current) {
          strasseInputRef.current.value = newData.strasse;
        }
        if (address.postal_code) {
          newData.postleitzahl = address.postal_code;
          if (postleitzahlInputRef.current) {
            postleitzahlInputRef.current.value = newData.postleitzahl;
          }
        }
        if (address.locality) {
          newData.stadt = address.locality;
          if (stadtInputRef.current) {
            stadtInputRef.current.value = newData.stadt;
          }
        }
      }
      if (field === 'postleitzahl') {
        newData.postleitzahl = address.postal_code;
        if (postleitzahlInputRef.current) {
          postleitzahlInputRef.current.value = newData.postleitzahl;
        }
      }
      if (field === 'stadt') {
        newData.stadt = address.locality;
        if (stadtInputRef.current) {
          stadtInputRef.current.value = newData.stadt;
        }
      }
      console.log('Aktualisierte Formulardaten:', newData);
      return newData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Unternehmen anlegen:', formData);
    setIsOpen(false);
  };

  if (loadError) return <div>Error loading maps: {loadError.message}</div>;
  if (!isLoaded) return <div>Loading maps...</div>;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(true);
          }}
        >
          Unternehmen anlegen
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Neues Unternehmen anlegen</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Kundenname</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="strasse">Straße</Label>
              <Input id="strasse" name="strasse" value={formData.strasse} onChange={handleChange} ref={strasseInputRef} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postleitzahl">Postleitzahl</Label>
              <Input id="postleitzahl" name="postleitzahl" value={formData.postleitzahl} onChange={handleChange} ref={postleitzahlInputRef} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stadt">Stadt</Label>
              <Input id="stadt" name="stadt" value={formData.stadt} onChange={handleChange} ref={stadtInputRef} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="standort">Standort</Label>
              <Select onValueChange={handleSelectChange('standort')} value={formData.standort}>
                <SelectTrigger>
                  <SelectValue placeholder="Wählen Sie einen Standort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Zentrale">Zentrale</SelectItem>
                  <SelectItem value="Zweigstelle">Zweigstelle</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select onValueChange={handleSelectChange('status')} value={formData.status}>
                <SelectTrigger>
                  <SelectValue placeholder="Wählen Sie einen Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inaktiv">inaktiv</SelectItem>
                  <SelectItem value="Zielkunde">Zielkunde</SelectItem>
                  <SelectItem value="pending">pending</SelectItem>
                  <SelectItem value="aktiv">aktiv</SelectItem>
                  <SelectItem value="Rahmenvertragspartner">Rahmenvertragspartner</SelectItem>
                  <SelectItem value="nicht_kontaktieren">nicht kontaktieren</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="zentraleMail">Zentrale Mail</Label>
              <Input id="zentraleMail" name="zentraleMail" value={formData.zentraleMail} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zentralTelefon">Zentrale Telefonnummer</Label>
              <Input id="zentralTelefon" name="zentralTelefon" value={formData.zentralTelefon} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="homepage">Homepage</Label>
              <Input id="homepage" name="homepage" value={formData.homepage} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="jobsite">Jobpage</Label>
              <Input id="jobsite" name="jobsite" value={formData.jobsite} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input id="linkedin" name="linkedin" value={formData.linkedin} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="xing">Xing</Label>
              <Input id="xing" name="xing" value={formData.xing} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="umsatzsteuerId">Umsatzsteuer ID</Label>
              <Input id="umsatzsteuerId" name="umsatzsteuerId" value={formData.umsatzsteuerId} onChange={handleChange} />
            </div>
          </div>
          <Button type="submit" className="w-full">
            Unternehmen anlegen
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
