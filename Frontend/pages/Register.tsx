import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Button } from '../components/Button';

const API = 'http://127.0.0.1:8000/api/auth/register';

const Register = () => {
  const [form, setForm] = useState({
    nik: '',
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

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
      const res = await fetch(API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registrasi gagal');

      setSuccess('Registrasi berhasil, silakan login');
      setForm({
        nik: '',
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Buat Akun Baru</h2>

        {error && <p className="text-red-600 mb-4">{error}</p>}
        {success && <p className="text-green-600 mb-4">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="nik" placeholder="NIK" value={form.nik} onChange={handleChange} className="w-full border px-4 py-2 rounded" />
          <input name="name" placeholder="Nama Lengkap" value={form.name} onChange={handleChange} className="w-full border px-4 py-2 rounded" />
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} className="w-full border px-4 py-2 rounded" />
          <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} className="w-full border px-4 py-2 rounded" />
          <input name="password_confirmation" type="password" placeholder="Konfirmasi Password" value={form.password_confirmation} onChange={handleChange} className="w-full border px-4 py-2 rounded" />

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
