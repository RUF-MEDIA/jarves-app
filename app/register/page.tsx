// app/register/page.tsx

'use client';
import { useState } from 'react';

export default function Register() {
  const [vorname, setVorname] = useState('');
  const [nachname, setNachname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vorname, nachname, email, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      setError(data.message || 'Registration failed');
    } else {
      setSuccess('Registration successful! You can now log in.');
      setVorname('');
      setNachname('');
      setEmail('');
      setPassword('');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-2xl font-bold">Register</h1>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <input
          type="text"
          placeholder="Vorname"
          value={vorname}
          onChange={(e) => setVorname(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
        <input
          type="text"
          placeholder="Nachname"
          value={nachname}
          onChange={(e) => setNachname(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg">
          Register
        </button>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}
      {success && <p className="text-green-500 mt-4">{success}</p>}
    </div>
  );
}
