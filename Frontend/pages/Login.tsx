import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, UserRole } from '../types';
import { Button } from '../components/Button';

interface LoginProps {
  onLogin: (user: User) => void;
  user: User | null;
}

const API = 'http://127.0.0.1:8000/api/auth/login';

const Login: React.FC<LoginProps> = ({ onLogin, user }) => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  /* ================= REDIRECT JIKA SUDAH LOGIN ================= */
  useEffect(() => {
    if (!user) return;
    if (!user.role) return;

    let path = '/login';

    if (user.role === UserRole.SUPER_ADMIN) path = '/admin';
    else if (user.role === UserRole.SELLER) path = '/seller';
    else if (user.role === UserRole.CUSTOMER) path = '/buyer';

    navigate(path, { replace: true });
  }, [user, navigate]);

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        // bersihin local kalau gagal
        localStorage.removeItem('user');
        throw new Error(data.message || 'Login gagal');
      }

      // ✅ SIMPAN USER DARI DB (TERMAsuk FOTO)
      localStorage.setItem('user', JSON.stringify(data.user));

      // kirim ke state global
      onLogin(data.user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-900 rounded-2xl mb-4 shadow-lg">
            <span className="text-white text-3xl">📚</span>
          </div>
          <h2 className="text-3xl font-bold text-slate-900">BookPoint</h2>
          <p className="text-slate-500 mt-2">Silakan login ke akun Anda</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-slate-500"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-slate-500"
            required
          />

          <div className="text-right">
            <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
              Lupa password?
            </Link>
          </div>

          <Button type="submit" fullWidth size="lg" disabled={loading}>
            {loading ? 'Loading...' : 'Login'}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-500">
          Belum punya akun?{' '}
          <Link to="/register" className="text-blue-600 hover:underline">
            Daftar sekarang
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
