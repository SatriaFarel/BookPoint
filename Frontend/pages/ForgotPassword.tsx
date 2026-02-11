import React, { useState } from 'react';
import { Button } from '../components/Button';
import { useNavigate } from 'react-router-dom';

const API = 'http://127.0.0.1:8000/api';

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  /* ================= KIRIM OTP ================= */
  const sendOtp = async () => {
    if (!email) {
      setMsg('Email wajib diisi');
      return;
    }

    setLoading(true);
    setMsg('');

    try {
      const res = await fetch(`${API}/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      setLoading(false);

      setMsg(data.message);

      // ✅ HANYA PINDAH STEP JIKA OTP BENAR-BENAR DIKIRIM
      if (data.message === 'OTP berhasil dikirim ke email') {
        setStep(2);
      }
    } catch {
      setLoading(false);
      setMsg('Terjadi kesalahan, coba lagi');
    }
  };

  /* ================= RESET PASSWORD ================= */
  const resetPassword = async () => {
    if (!otp || !password || !confirm) {
      setMsg('Semua field wajib diisi');
      return;
    }

    if (password !== confirm) {
      setMsg('Konfirmasi password tidak cocok');
      return;
    }

    setLoading(true);
    setMsg('');

    try {
      const res = await fetch(`${API}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          otp,
          password,
          password_confirmation: confirm,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setMsg(data.message);
        return;
      }

      alert('Password berhasil direset');
      navigate('/login');
    } catch {
      setLoading(false);
      setMsg('Server error, coba lagi nanti');
    }
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="bg-white w-full max-w-md p-8 rounded-xl shadow space-y-6">
        <h2 className="text-xl font-bold text-center">
          {step === 1 ? 'Forgot Password' : 'Reset Password'}
        </h2>

        {msg && (
          <p className="text-sm text-center text-red-600">
            {msg}
          </p>
        )}

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <input
              type="email"
              placeholder="Masukkan email"
              className="w-full border p-3 rounded"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />

            <Button onClick={sendOtp} disabled={loading} fullWidth>
              {loading ? 'Mengirim...' : 'Kirim OTP'}
            </Button>

            <p className="text-xs text-center text-slate-500">
              Jika email terdaftar, OTP akan dikirim
            </p>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            {/* email dikunci */}
            <input
              value={email}
              disabled
              className="w-full border p-3 rounded bg-slate-100 text-slate-500"
            />

            <input
              type="number"
              placeholder="OTP"
              className="w-full border p-3 rounded"
              value={otp}
              onChange={e => setOtp(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password baru"
              className="w-full border p-3 rounded"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />

            <input
              type="password"
              placeholder="Konfirmasi password"
              className="w-full border p-3 rounded"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
            />

            <Button onClick={resetPassword} disabled={loading} fullWidth>
              {loading ? 'Memproses...' : 'Reset Password'}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
