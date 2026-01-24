import React, { useState } from 'react';
import { Button } from './Button';

const Profile = () => {
  const raw = localStorage.getItem('user');
  const user = raw ? JSON.parse(raw) : null;

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    alamat: user?.alamat || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/user/profile/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          id: user.id,
          ...form,
        }),
      });

      if (!res.ok) {
        alert('Gagal update profil');
        return;
      }

      const data = await res.json();

      // update localStorage
      localStorage.setItem('user', JSON.stringify(data.user));
      alert('Profil berhasil diperbarui');

    } catch {
      alert('Server error');
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-6">Profil Saya</h2>

      <div className="space-y-4">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Nama"
          className="w-full border p-2 rounded"
        />

        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full border p-2 rounded"
        />

        <input
          name="alamat"
          value={form.alamat}
          onChange={handleChange}
          placeholder="Alamat"
          className="w-full border p-2 rounded"
        />

        <div className="text-xs text-slate-500">
          <p>NIK: {user?.nik}</p>
          <p>Status Online: {user?.is_online ? 'Online' : 'Offline'}</p>
          <p>Status Akun: {user?.is_active ? 'Aktif' : 'Nonaktif'}</p>
        </div>

        <Button onClick={handleSave}>Simpan Perubahan</Button>
      </div>
    </div>
  );
};

export default Profile;
