import { useEffect, useState, FormEvent } from 'react';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Seller } from '../../types';

const API = 'http://127.0.0.1:8000/api/seller';

const SellerPage = () => {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);

  const [alert, setAlert] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 3000);
  };

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const [nik, setNIK] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [alamat, setAlamat] = useState('');
  const [password, setPassword] = useState('');

  // === TAMBAHAN ===
  const [no_rekening, setNoRekening] = useState('');
  const [foto, setFoto] = useState<File | null>(null);
  const [qris, setQris] = useState<File | null>(null);
  const [previewFoto, setPreviewFoto] = useState<string | null>(null);
  const [previewQris, setPreviewQris] = useState<string | null>(null);


  /* ================= FETCH ================= */
  const fetchSeller = async () => {
    try {
      const res = await fetch(API, {
        headers: { Accept: 'application/json' },
      });
      const data = await res.json();
      setSellers(data);
    } catch {
      showAlert('error', 'Gagal mengambil data seller');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeller();
  }, []);

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const url = editId ? `${API}/${editId}` : API;

    const formData = new FormData();
    formData.append('nik', nik);
    formData.append('name', name);
    formData.append('email', email);
    formData.append('alamat', alamat);
    formData.append('no_rekening', no_rekening);

    if (!editId) {
      formData.append('password', password);
    }

    if (foto) formData.append('foto', foto);
    if (qris) formData.append('qris', qris);

    if (editId) {
      formData.append('_method', 'PUT');
    }

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Gagal menyimpan data');

      showAlert(
        'success',
        editId ? 'Seller berhasil diupdate' : 'Seller berhasil ditambahkan'
      );
      closeForm();
      fetchSeller();
    } catch (err: any) {
      showAlert('error', err.message);
    }
  };

  /* ================= ACTION ================= */
  const openCreate = () => {
    resetForm();
    setShowForm(true);
  };

  const openEdit = (s: Seller) => {
    setEditId(s.id);
    setNIK(s.nik);
    setName(s.name);
    setEmail(s.email);
    setAlamat(s.alamat);
    setPassword('');
    setNoRekening(s.no_rekening || '');
    setShowForm(true);
    setPreviewFoto(s.foto ? `http://127.0.0.1:8000/storage/${s.foto}` : null);
    setPreviewQris(s.qris ? `http://127.0.0.1:8000/storage/${s.qris}` : null);
  };

  const closeForm = () => {
    setShowForm(false);
    resetForm();
  };

  const resetForm = () => {
    setEditId(null);
    setNIK('');
    setName('');
    setEmail('');
    setAlamat('');
    setPassword('');
    setNoRekening('');
    setFoto(null);
    setQris(null);
    setPreviewFoto(null);
    setPreviewQris(null);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus seller ini?')) return;

    try {
      const res = await fetch(`${API}/${id}`, {
        method: 'DELETE',
        headers: { Accept: 'application/json' },
      });

      if (!res.ok) throw new Error();
      showAlert('success', 'Seller berhasil dihapus');
      fetchSeller();
    } catch {
      showAlert('error', 'Gagal menghapus seller');
    }
  };

  return (
    <div className="space-y-6">
      {alert && (
        <div
          className={`fixed top-20 right-5 z-50 px-4 py-3 rounded-xl shadow-lg
          text-white animate-in slide-in-from-top fade-in duration-300
          ${alert.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`}
        >
          {alert.message}
        </div>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-slate-800">Manajemen Seller</h2>
        <Button size="sm" onClick={openCreate}>
          + Tambah Seller
        </Button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sellers.map(s => (
            <div
              key={s.id}
              className="group bg-white border border-slate-200 rounded-2xl p-5
              shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border bg-slate-100">
                    {s.foto ? (
                      <img
                        src={`http://127.0.0.1:8000/storage/${s.foto}`}
                        alt={s.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
                        👤
                      </div>
                    )}
                  </div>
                  <h3 className="font-semibold text-slate-800">{s.name}</h3>
                </div>
                <Badge variant={s.is_active ? 'success' : 'danger'}>
                  {s.is_active ? 'ACTIVE' : 'INACTIVE'}
                </Badge>
              </div>

              <p className="text-sm text-slate-500 mt-1">{s.email}</p>
              <p className="text-sm text-slate-500">{s.alamat}</p>

              <div className="mt-3">
                <Badge variant={s.is_online ? 'success' : 'secondary'}>
                  {s.is_online ? 'ONLINE' : 'OFFLINE'}
                </Badge>
              </div>

              <div className="mt-4 flex gap-4 opacity-0 group-hover:opacity-100 transition">
                <button
                  onClick={() => openEdit(s)}
                  className="text-sm text-indigo-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(s.id)}
                  className="text-sm text-red-600 hover:underline"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={closeForm} />

          <form
            onSubmit={handleSubmit}
            className="relative bg-white rounded-2xl w-full max-w-md
             max-h-[85vh] overflow-y-auto
             p-6 space-y-4"
          >
            <h3 className="font-bold text-slate-800">
              {editId ? 'Edit Seller' : 'Tambah Seller'}
            </h3>

            <div className="space-y-4">

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  NIK
                </label>
                <input
                  className="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Masukkan NIK"
                  value={nik}
                  disabled={!!editId}
                  onChange={e => setNIK(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Nama Seller
                </label>
                <input
                  className="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Masukkan nama"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Email
                </label>
                <input
                  className="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Masukkan email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>

              {!editId && (
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Password
                  </label>
                  <input
                    className="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm
                   focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Masukkan password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Alamat
                </label>
                <textarea
                  className="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Masukkan alamat"
                  value={alamat}
                  onChange={e => setAlamat(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  No Rekening
                </label>
                <input
                  className="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm
                 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Masukkan no rekening"
                  value={no_rekening}
                  onChange={e => setNoRekening(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Foto Profile
                </label>

                {previewFoto && (
                  <img
                    src={previewFoto}
                    alt="Preview Foto"
                    className="mb-2 w-24 h-24 rounded-xl object-cover border"
                  />
                )}

                <input
                  type="file"
                  accept="image/*"
                  className="block w-full text-sm text-slate-600
      file:mr-3 file:rounded-lg file:border-0
      file:bg-slate-100 file:px-4 file:py-2
      file:text-sm file:text-slate-700
      hover:file:bg-slate-200"
                  onChange={e => {
                    const file = e.target.files?.[0] || null;
                    setFoto(file);
                    if (file) setPreviewFoto(URL.createObjectURL(file));
                  }}
                />
              </div>


              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  QRIS
                </label>

                {previewQris && (
                  <img
                    src={previewQris}
                    alt="Preview QRIS"
                    className="mb-2 w-24 h-24 rounded-xl object-cover border"
                  />
                )}

                <input
                  type="file"
                  accept="image/*"
                  className="block w-full text-sm text-slate-600
      file:mr-3 file:rounded-lg file:border-0
      file:bg-slate-100 file:px-4 file:py-2
      file:text-sm file:text-slate-700
      hover:file:bg-slate-200"
                  onChange={e => {
                    const file = e.target.files?.[0] || null;
                    setQris(file);
                    if (file) setPreviewQris(URL.createObjectURL(file));
                  }}
                />
              </div>


            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={closeForm}
                className="text-sm text-slate-500 hover:text-slate-700"
              >
                Batal
              </button>
              <Button size="sm" type="submit">
                Simpan
              </Button>
            </div>


          </form>
        </div>
      )}
    </div>
  );
};

export default SellerPage;
