import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';

const API = 'http://127.0.0.1:8000/api/auth/register';

const Register = () => {
  const [role, setRole] = useState<'customer' | 'seller'>('customer');

  const [form, setForm] = useState({
    nik: '',
    name: '',
    email: '',
    alamat: '',
    password: '',
    password_confirmation: '',
    no_rekening: '',
  });

  const [foto, setFoto] = useState<File | null>(null);
  const [qris, setQris] = useState<File | null>(null);

  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (!foto) {
        throw new Error('Foto profil wajib diisi');
      }

      const formData = new FormData();
      formData.append('role', role);
      formData.append('foto', foto);

      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });

      if (role === 'seller' && qris) {
        formData.append('qris_image', qris);
      }

      const res = await fetch(API, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registrasi gagal');

      setSuccess('Registrasi berhasil, silakan login');
      setForm({
        nik: '',
        name: '',
        email: '',
        alamat: '',
        password: '',
        password_confirmation: '',
        no_rekening: '',
      });
      setFoto(null);
      setQris(null);
      setRole('customer');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-center mb-6">
          Buat Akun Baru
        </h2>

        {/* ROLE SELECT */}
        <div className="flex gap-2 mb-6">
          <button
            type="button"
            onClick={() => setRole('customer')}
            className={`flex-1 py-2 rounded ${
              role === 'customer'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-200'
            }`}
          >
            Customer
          </button>
          <button
            type="button"
            onClick={() => setRole('seller')}
            className={`flex-1 py-2 rounded ${
              role === 'seller'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-200'
            }`}
          >
            Seller
          </button>
        </div>

        {error && <p className="text-red-600 mb-4">{error}</p>}
        {success && <p className="text-green-600 mb-4">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* FOTO PROFIL */}
          <div>
            <label className="block text-sm text-slate-600 mb-1">
              Foto Profil
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={e => setFoto(e.target.files?.[0] || null)}
              className="w-full text-sm"
              required
            />
          </div>

          <input
            name="nik"
            placeholder="NIK"
            value={form.nik}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
          />

          <input
            name="name"
            placeholder="Nama Lengkap"
            value={form.name}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
          />

          <input
            name="alamat"
            type="text"
            placeholder="Alamat"
            value={form.alamat}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
          />

          <input
            name="password_confirmation"
            type="password"
            placeholder="Konfirmasi Password"
            value={form.password_confirmation}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
          />

          {/* SELLER ONLY */}
          {role === 'seller' && (
            <>
              <input
                name="no_rekening"
                placeholder="Nomor Rekening"
                value={form.no_rekening}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded"
                required
              />

              <div>
                <label className="block text-sm text-slate-600 mb-1">
                  QRIS (Opsional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => setQris(e.target.files?.[0] || null)}
                  className="w-full text-sm"
                />
              </div>
            </>
          )}

          <Button type="submit" fullWidth disabled={loading}>
            {loading ? 'Loading...' : 'Daftar'}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          Sudah punya akun?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
