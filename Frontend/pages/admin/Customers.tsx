import { useEffect, useState, FormEvent } from 'react';
import { Button } from '../../components/Button';
import { Customer } from '../../types';

const API = 'http://127.0.0.1:8000/api/customer';

const CustomerPage = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  const [alert, setAlert] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 10000);
  };

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const [nik, setNik] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [alamat, setAlamat] = useState('');
  const [password, setPassword] = useState('');

  // === FOTO ===
  const [foto, setFoto] = useState<File | null>(null);
  const [previewFoto, setPreviewFoto] = useState<string | null>(null);

  /* ================= FETCH ================= */
  const fetchCustomers = async () => {
    try {
      const res = await fetch(API, {
        headers: { Accept: 'application/json' },
      });
      const data = await res.json();
      setCustomers(data);
    } catch {
      showAlert('error', 'Gagal mengambil data customer');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
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

    if (!editId) {
      formData.append('password', password);
    }

    if (foto) {
      formData.append('foto', foto);
    }

    if (editId) {
      formData.append('_method', 'PUT');
    }

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Gagal menyimpan data');

      showAlert(
        'success',
        editId ? 'Customer berhasil diupdate' : 'Customer berhasil ditambahkan'
      );
      closeForm();
      fetchCustomers();
    } catch (err: any) {
      showAlert('error', err.message);
    }
  };

  /* ================= ACTION ================= */
  const openCreate = () => {
    resetForm();
    setShowForm(true);
  };

  const openEdit = (c: Customer) => {
    setEditId(c.id);
    setNik(c.nik);
    setName(c.name);
    setEmail(c.email);
    setAlamat(c.alamat);
    setPassword('');

    setPreviewFoto(
      c.foto ? `http://127.0.0.1:8000/storage/${c.foto}` : null
    );

    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    resetForm();
  };

  const resetForm = () => {
    setEditId(null);
    setNik('');
    setName('');
    setEmail('');
    setAlamat('');
    setPassword('');
    setFoto(null);
    setPreviewFoto(null);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus customer ini?')) return;

    try {
      const res = await fetch(`${API}/${id}`, {
        method: 'DELETE',
        headers: { Accept: 'application/json' },
      });

      if (!res.ok) throw new Error();
      showAlert('success', 'Customer berhasil dihapus');
      fetchCustomers();
    } catch {
      showAlert('error', 'Gagal menghapus customer');
    }
  };

  return (
    <div className="space-y-6">
      {alert && (
        <div
          className={`fixed top-20 right-5 z-50 px-4 py-3 rounded-xl shadow-lg
          text-white animate-in slide-in-from-top duration-300
          ${alert.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`}
        >
          {alert.message}
        </div>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-slate-800">Manajemen Customer</h2>
        {/* <Button size="sm" onClick={openCreate}>
          + Tambah Customer
        </Button> */}
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {customers.map(c => (
            <div
              key={c.id}
              className="group bg-white border border-slate-200 rounded-2xl p-5
                         shadow-sm hover:shadow-xl hover:-translate-y-1
                         transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border bg-slate-100">
                  {c.foto ? (
                    <img
                      src={`http://127.0.0.1:8000/storage/${c.foto}`}
                      alt={c.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
                      👤
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="font-semibold text-slate-800">{c.name}</h3>
                  <p className="text-sm text-slate-500">{c.email}</p>
                </div>
              </div>

              <div className="mt-3 text-sm text-slate-600 space-y-1">
                <p><span className="font-medium">NIK:</span> {c.nik}</p>
                <p><span className="font-medium">Alamat:</span> {c.alamat}</p>
              </div>

              <div className="mt-4 flex gap-4 opacity-0 group-hover:opacity-100 transition">
                <button
                  onClick={() => openEdit(c)}
                  className="text-sm text-indigo-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="text-sm text-red-600 hover:underline"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}

          {customers.length === 0 && (
            <p className="text-slate-400">Data customer kosong</p>
          )}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeForm}
          />

          <form
            onSubmit={handleSubmit}
            className="relative bg-white rounded-2xl w-full max-w-md
                       max-h-[85vh] overflow-y-auto
                       p-6 space-y-4 shadow-xl"
          >
            <h3 className="font-bold text-slate-800">
              {editId ? 'Edit Customer' : 'Tambah Customer'}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">NIK</label>
                <input
                  className="w-full rounded-xl border px-4 py-2 text-sm"
                  value={nik}
                  disabled={!!editId}
                  onChange={e => setNik(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Nama</label>
                <input
                  className="w-full rounded-xl border px-4 py-2 text-sm"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Email</label>
                <input
                  className="w-full rounded-xl border px-4 py-2 text-sm"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Alamat</label>
                <textarea
                  className="w-full rounded-xl border px-4 py-2 text-sm"
                  value={alamat}
                  onChange={e => setAlamat(e.target.value)}
                />
              </div>

              {!editId && (
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Password</label>
                  <input
                    type="password"
                    className="w-full rounded-xl border px-4 py-2 text-sm"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Foto Profile
                </label>

                {previewFoto && (
                  <img
                    src={previewFoto}
                    alt="Preview"
                    className="mb-2 w-24 h-24 rounded-xl object-cover border"
                  />
                )}

                <input
                  type="file"
                  accept="image/*"
                  onChange={e => {
                    const file = e.target.files?.[0] || null;
                    setFoto(file);
                    if (file) setPreviewFoto(URL.createObjectURL(file));
                  }}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={closeForm}
                className="text-sm text-slate-500"
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

export default CustomerPage;
