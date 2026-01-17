import React, { useState, useEffect, FormEvent } from 'react';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { Product } from '../../types';

const API = 'http://127.0.0.1:8000/api/products';

/* ================= HELPER ================= */
const getFinalPrice = (price: number, discount?: number | null) => {
  if (!discount || discount <= 0) return price;
  return Math.round(price - (price * discount / 100));
};

const SellerProducts: React.FC = () => {
  /* ================= STATE ================= */
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const [alert, setAlert] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  // PRODUCT FORM
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');

  /* ================= ALERT ================= */
  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 3000);
  };

  /* ================= FETCH ================= */
  const fetchProducts = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();
      setProducts(data);
    } catch {
      showAlert('error', 'Gagal mengambil produk');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  /* ================= FILTER ================= */
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  /* ================= FORM ================= */
  const resetForm = () => {
    setEditId(null);
    setName('');
    setCategoryId(0);
    setPrice(0);
    setStock(0);
    setDiscount(0);
    setDescription('');
    setImage('');
  };

  const openCreate = () => {
    resetForm();
    setShowForm(true);
  };

  const openEdit = (p: Product) => {
    setEditId(p.id);
    setName(p.name);
    setCategoryId(p.category_id);
    setPrice(p.price);
    setStock(p.stock);
    setDiscount(p.discount_percent || 0);
    setDescription(p.description || '');
    setImage(p.image || '');
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    resetForm();
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const payload = {
      name,
      category_id: categoryId,
      price,
      stock,
      discount_percent: discount || null,
      description,
      image,
    };

    try {
      const res = await fetch(editId ? `${API}/${editId}` : API, {
        method: editId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error();

      showAlert('success', editId ? 'Produk diupdate' : 'Produk ditambahkan');
      closeForm();
      fetchProducts();
    } catch {
      showAlert('error', 'Gagal menyimpan produk');
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id: number) => {
    if (!confirm('Hapus produk ini?')) return;

    try {
      await fetch(`${API}/${id}`, { method: 'DELETE' });
      showAlert('success', 'Produk dihapus');
      fetchProducts();
    } catch {
      showAlert('error', 'Gagal menghapus produk');
    }
  };

  if (loading) return <p className="text-slate-500">Loading...</p>;

  return (
    <div className="space-y-6">
      {/* ALERT */}
      {alert && (
        <div className={`fixed top-20 right-5 px-4 py-3 rounded-xl text-white
          ${alert.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`}>
          {alert.message}
        </div>
      )}

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manajemen Produk</h1>
        <Button variant="secondary" onClick={openCreate}>
          + Tambah Produk
        </Button>
      </div>

      {/* SEARCH */}
      <input
        placeholder="Cari produk..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full md:w-1/3 px-4 py-2 border rounded-lg text-sm"
      />

      {/* CARD */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map(p => (
          <div key={p.id} className="bg-white rounded-xl border overflow-hidden">
            <img
              src={p.image ? `http://127.0.0.1:8000/${p.image}` : '/images/placeholder.png'}
              className="w-full h-48 object-cover"
            />

            <div className="p-4 space-y-2">
              <h3 className="font-semibold">{p.name}</h3>

              <div className="flex justify-between items-center">
                <div>
                  {p.discount_percent ? (
                    <>
                      <p className="line-through text-sm text-slate-400">
                        Rp {p.price.toLocaleString()}
                      </p>
                      <p className="font-bold text-red-600">
                        Rp {getFinalPrice(p.price, p.discount_percent).toLocaleString()}
                      </p>
                    </>
                  ) : (
                    <p className="font-bold">
                      Rp {p.price.toLocaleString()}
                    </p>
                  )}
                </div>

                <Badge variant={p.stock > 0 ? 'success' : 'danger'}>
                  {p.stock > 0 ? 'Tersedia' : 'Habis'}
                </Badge>
              </div>

              <div className="flex gap-3">
                <button onClick={() => openEdit(p)} className="text-blue-600 text-sm">
                  Edit
                </button>
                <button onClick={() => handleDelete(p.id)} className="text-red-600 text-sm">
                  Hapus
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl w-full max-w-md space-y-3">
            <h3 className="font-bold">{editId ? 'Edit Produk' : 'Tambah Produk'}</h3>

            <input placeholder="Nama produk" value={name} onChange={e => setName(e.target.value)} />
            <input type="number" placeholder="Category ID" value={categoryId} onChange={e => setCategoryId(+e.target.value)} />
            <input type="number" placeholder="Harga" value={price} onChange={e => setPrice(+e.target.value)} />
            <input type="number" placeholder="Stok" value={stock} onChange={e => setStock(+e.target.value)} />
            <input type="number" placeholder="Diskon (%)" value={discount} onChange={e => setDiscount(+e.target.value)} />
            <textarea placeholder="Deskripsi" value={description} onChange={e => setDescription(e.target.value)} />
            <input placeholder="Image path / URL" value={image} onChange={e => setImage(e.target.value)} />

            <div className="flex justify-end gap-3">
              <button type="button" onClick={closeForm}>Batal</button>
              <Button type="submit">Simpan</Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default SellerProducts;
