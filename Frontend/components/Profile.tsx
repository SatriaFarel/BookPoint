import React, { useEffect, useState } from 'react';
import { Button } from './Button';

const Profile: React.FC = () => {
  /* ===== AUTH ===== */
  const authRaw = localStorage.getItem('user');
  const auth = authRaw ? JSON.parse(authRaw) : null;

  if (!auth) return <p className="text-center">User tidak ditemukan</p>;

  const userId = auth.id;
  const role = auth.role; // SUPER_ADMIN | SELLER | CUSTOMER

  const isSeller = role === 'SELLER';
  const isCustomer = role === 'CUSTOMER';

  /* ===== STATE ===== */
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    nik: '',
    alamat: '',
    no_rekening: '',
  });

  const [foto, setFoto] = useState<File | null>(null);
  const [qris, setQris] = useState<File | null>(null);

  const [profileFoto, setProfileFoto] = useState<string | null>(null);
  const [qrisPreview, setQrisPreview] = useState<string | null>(null);

  const [alert, setAlert] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  /* ===== FETCH PROFILE ===== */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/api/user/profile/${userId}`,
          { headers: { Accept: 'application/json' } }
        );

        const data = await res.json();

        setForm({
          name: data.user.name || '',
          email: data.user.email || '',
          password: '',
          nik: data.user.nik || '',
          alamat: data.user.alamat || '',
          no_rekening: data.user.no_rekening || '',
        });

        setProfileFoto(data.user.foto ?? null);
        setQrisPreview(data.user.qris ?? null);

        setLoading(false);
      } catch {
        setAlert({ type: 'error', message: 'Gagal mengambil data profil' });
      }
    };

    fetchProfile();
  }, [userId]);

  /* ===== HANDLER ===== */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setAlert(null);

    const fd = new FormData();
    fd.append('id', userId);
    fd.append('name', form.name);
    fd.append('email', form.email);

    if (form.password) fd.append('password', form.password);
    if (foto) fd.append('foto', foto);

    if (isSeller || isCustomer) {
      fd.append('nik', form.nik);
      fd.append('alamat', form.alamat);
    }

    if (isSeller) {
      fd.append('no_rekening', form.no_rekening);
      if (qris) fd.append('qris', qris);
    }

    try {
      const res = await fetch(
        'http://127.0.0.1:8000/api/user/profile/update',
        {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: fd,
        }
      );

      const data = await res.json();

      if (!res.ok || data.success === false) {
        setAlert({
          type: 'error',
          message: data.message || 'Gagal memperbarui profil',
        });
        return;
      }

      // ⬅️ INI KUNCI: JANGAN TIMPA AUTH
      const oldUser = JSON.parse(localStorage.getItem('user')!);
      localStorage.setItem(
        'user',
        JSON.stringify({
          ...oldUser,
          ...data.user,
        })
      );

      setAlert({
        type: 'success',
        message: data.message || 'Profil berhasil diperbarui',
      });
    } catch {
      setAlert({
        type: 'error',
        message: 'Server error, coba lagi nanti',
      });
    }
  };

  if (loading) return <p className="text-center">Loading...</p>;

  /* ===== UI ===== */
  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow space-y-6">
      <h2 className="text-xl font-bold">Profil Saya</h2>

      {alert && (
        <div
          className={`p-3 rounded text-sm ${
            alert.type === 'success'
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {alert.message}
        </div>
      )}

      {/* FOTO */}
      <div className="flex items-center gap-4">
        <div className="w-24 h-24 rounded-full overflow-hidden border">
          {profileFoto ? (
            <img
              src={`http://127.0.0.1:8000/storage/${profileFoto}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-sm text-slate-400">
              No Foto
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Ganti Foto Profil
          </label>
          <input
            type="file"
            onChange={(e) => setFoto(e.target.files?.[0] || null)}
          />
        </div>
      </div>

      {/* FORM */}
      <div className="space-y-4">
        <Field label="Nama">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </Field>

        <Field label="Email">
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </Field>

        <Field label="Password Baru">
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Kosongkan jika tidak diubah"
            className="w-full border rounded p-2"
          />
        </Field>

        {(isSeller || isCustomer) && (
          <>
            <Field label="NIK">
              <input
                name="nik"
                value={form.nik}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </Field>

            <Field label="Alamat">
              <input
                name="alamat"
                value={form.alamat}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </Field>
          </>
        )}

        {isSeller && (
          <>
            <Field label="No Rekening">
              <input
                name="no_rekening"
                value={form.no_rekening}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </Field>

            <div>
              <label className="block text-sm font-medium mb-2">QRIS</label>
              {qrisPreview && (
                <img
                  src={`http://127.0.0.1:8000/storage/${qrisPreview}`}
                  className="w-40 mb-2 border rounded"
                />
              )}
              <input
                type="file"
                onChange={(e) => setQris(e.target.files?.[0] || null)}
              />
            </div>
          </>
        )}
      </div>

      <Button onClick={handleSave}>Simpan Perubahan</Button>
    </div>
  );
};

/* ===== HELPER ===== */
const Field: React.FC<{ label: string; children: React.ReactNode }> = ({
  label,
  children,
}) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    {children}
  </div>
);

export default Profile;
