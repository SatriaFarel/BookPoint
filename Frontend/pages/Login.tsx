
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { User, UserRole } from '../types';
import { DUMMY_USERS } from '../constants';
import { Button } from '../components/Button';

interface LoginProps {
  onLogin: (user: User) => void;
  user: User | null;
}

const Login: React.FC<LoginProps> = ({ onLogin, user }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (user) {
    const path = user.role === UserRole.SUPER_ADMIN ? '/admin' : user.role === UserRole.SELLER ? '/seller' : '/buyer';
    return <Navigate to={path} />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const foundUser = DUMMY_USERS.find(u => u.email === email);
    if (foundUser) {
      onLogin(foundUser);
    } else {
      setError('Email atau password salah (Gunakan: admin@lumina.com, gramedia@seller.com, atau john@buyer.com)');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-900 rounded-2xl mb-4 shadow-lg">
            <span className="text-white text-3xl">📚</span>
          </div>
          <h2 className="text-3xl font-bold text-slate-900">Lumina BookStore</h2>
          <p className="text-slate-500 mt-2">Selamat datang kembali! Silakan login.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Alamat Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all"
              placeholder="nama@email.com"
              required
            />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-semibold text-slate-700">Password</label>
              <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">Lupa password?</a>
            </div>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          <Button type="submit" fullWidth size="lg">Login ke Akun</Button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-sm text-slate-500 italic">
            Hint: Admin (admin@lumina.com), Seller (gramedia@seller.com), Buyer (john@buyer.com)
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
