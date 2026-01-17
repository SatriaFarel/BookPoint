import { useEffect, useState, FormEvent } from 'react';
import { Button } from '../../components/Button';
import { Customer } from '../../types';



const API = 'http://127.0.0.1:8000/api/customer';

const CustomerPage = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  // ===== ALERT =====
  const [alert, setAlert] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 3000);
  };

  // ===== FORM STATE =====
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const [nik, setNik] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [alamat, setAlamat] = useState('');
  const [password, setPassword] = useState('');

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
    const method = editId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ nik, name, email, alamat, password }),
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

      {/* ===== ALERT ===== */}
      {alert && (
        <div
          className={`fixed top-20 right-5 z-50 px-4 py-3 rounded-xl shadow-lg
          text-white animate-in slide-in-from-top duration-300
          ${alert.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`}
        >
          {alert.message}
        </div>
      )}

      {/* ===== HEADER ===== */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-slate-800">Manajemen Customer</h2>
        <Button size="sm" onClick={openCreate}>
          + Tambah Customer
        </Button>
      </div>

      {/* ===== CARD LIST ===== */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {customers.map(c => (
            <div
              key={c.id}
              className="bg-white border border-slate-200 rounded-2xl p-5
                         shadow-sm hover:shadow-xl hover:-translate-y-1
                         transition-all duration-300"
            >
              <h3 className="font-semibold text-slate-800">{c.name}</h3>

              <div className="mt-2 space-y-1 text-sm text-slate-600">
                <p><span className="font-medium">NIK:</span> {c.nik}</p>
                <p><span className="font-medium">Email:</span> {c.email}</p>
                <p><span className="font-medium">Alamat:</span> {c.alamat}</p>
                <p>
                  <span className="font-medium">Password:</span>{' '}
                  <span className="tracking-widest">••••••••</span>
                </p>
              </div>

              <div className="mt-4 flex gap-4">
                <button
                  onClick={() => openEdit(c)}
                  className="text-indigo-600 text-sm hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="text-red-600 text-sm hover:underline"
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

      {/* ===== MODAL ===== */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeForm}
          />

          <form
            onSubmit={handleSubmit}
            className="relative bg-white rounded-2xl w-full max-w-md p-6
                       shadow-xl animate-in zoom-in duration-200 space-y-4"
          >
            <h3 className="font-bold text-slate-800">
              {editId ? 'Edit Customer' : 'Tambah Customer'}
            </h3>

            <input
              className="w-full rounded-xl border px-4 py-2"
              placeholder="NIK"
              value={nik}
              onChange={e => setNik(e.target.value)}
              disabled={!!editId}
            />

            <input
              className="w-full rounded-xl border px-4 py-2"
              placeholder="Nama"
              value={name}
              onChange={e => setName(e.target.value)}
            />

            <input
              className="w-full rounded-xl border px-4 py-2"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />

            <textarea
              className="w-full rounded-xl border px-4 py-2"
              placeholder="Alamat"
              value={alamat}
              onChange={e => setAlamat(e.target.value)}
            />

            {!editId && (
              <input
                className="w-full rounded-xl border px-4 py-2"
                placeholder="Password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={closeForm} className="text-sm">
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
