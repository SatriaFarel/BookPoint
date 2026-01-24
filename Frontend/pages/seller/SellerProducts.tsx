import React, { useState, useEffect, FormEvent } from 'react';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { Product } from '../../types';

const API = 'http://127.0.0.1:8000/api';

/* ================= HELPER ================= */
const getFinalPrice = (price: number, discount?: number | null) => {
  if (!discount || discount <= 0) return price;
  return Math.round(price - (price * discount) / 100);
};

type Category = {
  id: number;
  name: string;
};

/* ================= AMBIL SELLER ID ================= */
const getSellerId = (): number | null => {
  const raw = localStorage.getItem('user');
  if (!raw) return null;

  try {
    const user = JSON.parse(raw);
    return user?.id ?? null;
  } catch {
    return null;
  }
};

const SellerProducts: React.FC = () => {
  /* ================= STATE ================= */
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState(0);

  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const [alert, setAlert] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  // FORM
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [preview, setPreview] = useState('');

  /* ================= ALERT ================= */
  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 4000);
  };

  /* ================= FETCH ================= */
  const fetchProducts = async () => {
    const sellerId = getSellerId();
    if (!sellerId) {
      showAlert('error', 'User belum login');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API}/products?seller_id=${sellerId}`);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch {
      showAlert('error', 'Gagal mengambil produk');
    } finally {
      setLoading(false);
    }
  };


  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API}/categories`);
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch {
      setCategories([]);
      showAlert('error', 'Gagal mengambil kategori');
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  /* ================= FORM ================= */
  const resetForm = () => {
    setEditId(null);
    setName('');
    setCategoryId(0);
    setPrice(0);
    setStock(0);
    setDiscount(0);
    setDescription('');
    setImage(null);
    setPreview('');
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
    setPreview(p.image ? `http://127.0.0.1:8000/storage/${p.image}` : '');
    setImage(null);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    resetForm();
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const sellerId = getSellerId();
    if (!sellerId) {
      showAlert('error', 'User belum login');
      return;
    }

    if (!name.trim()) {
      showAlert('error', 'Nama produk wajib diisi');
      return;
    }

    if (categoryId === 0) {
      showAlert('error', 'Kategori wajib dipilih');
      return;
    }

    const formData = new FormData();
    formData.append('seller_id', String(sellerId));
    formData.append('name', name);
    formData.append('category_id', String(categoryId));
    formData.append('price', String(price));
    formData.append('stock', String(stock));
    formData.append(
      'discount_percent',
      discount > 0 ? String(discount) : ''
    );
    formData.append('description', description);

    if (image) formData.append('image', image);

    try {
      if (editId) formData.append('_method', 'PUT');

      const res = await fetch(
        editId ? `${API}/products/${editId}` : `${API}/products`,
        {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: formData,
        }
      );

      if (!res.ok) {
        const err = await res.json();
        showAlert('error', err.message || 'Gagal menyimpan produk');
        return;
      }

      showAlert(
        'success',
        editId ? 'Produk berhasil diperbarui' : 'Produk berhasil ditambahkan'
      );
      closeForm();
      fetchProducts();
    } catch {
      showAlert('error', 'Server bermasalah');
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id: number) => {
    if (!confirm('Hapus produk ini?')) return;

    try {
      await fetch(`${API}/products/${id}`, { method: 'DELETE' });
      showAlert('success', 'Produk berhasil dihapus');
      fetchProducts();
    } catch {
      showAlert('error', 'Gagal menghapus produk');
    }
  };

  if (loading) return <p className="text-slate-500">Loading...</p>;

  return (
    <div className="space-y-6">

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

      {/* CARD LIST */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products
          .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
          .map(p => (
            <div
              key={p.id}
              onClick={() => setDetailProduct(p)}
              className="bg-white rounded-xl border overflow-hidden cursor-pointer
                         transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              {/* IMAGE + DISCOUNT */}
              <div className="relative">
                <img
                  src={p.image ? `http://127.0.0.1:8000/storage/${p.image}` : '/images/placeholder.png'}
                  className="w-full h-48 object-cover"
                />
                {p.discount_percent && p.discount_percent > 0 && (
                  <span className="absolute top-2 left-2 bg-red-500 text-white
                                   text-xs font-bold px-2 py-1 rounded-lg">
                    -{p.discount_percent}%
                  </span>
                )}
              </div>

              <div className="p-4 space-y-2">
                <h3 className="font-semibold">{p.name}</h3>

                <div className="flex justify-between items-center">
                  <div>
                    {p.discount_percent && p.discount_percent > 0 && (
                      <p className="text-xs line-through text-slate-400">
                        Rp {p.price.toLocaleString()}
                      </p>
                    )}
                    <p className="font-bold text-red-600">
                      Rp {getFinalPrice(p.price, p.discount_percent).toLocaleString()}
                    </p>
                  </div>
                  <Badge variant={p.stock > 0 ? 'success' : 'danger'}>
                    {p.stock > 0 ? 'Tersedia' : 'Habis'}
                  </Badge>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={e => { e.stopPropagation(); openEdit(p); }}
                    className="text-blue-600 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={e => { e.stopPropagation(); handleDelete(p.id); }}
                    className="text-red-600 text-sm"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* MODAL DETAIL */}
      {detailProduct && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setDetailProduct(null)}
        >
          <div
            onClick={e => e.stopPropagation()}
            className="bg-white rounded-xl w-full max-w-md p-6 space-y-4"
          >
            <img
              src={`http://127.0.0.1:8000/storage/${detailProduct.image}`}
              className="w-full h-56 object-cover rounded-lg"
            />

            <h3 className="text-xl font-bold">{detailProduct.name}</h3>
            <p className="text-sm text-slate-500">
              {detailProduct.description || '-'}
            </p>

            <div className="flex justify-between items-center">
              <div>
                {detailProduct.discount_percent && detailProduct.discount_percent > 0 && (
                  <p className="text-sm line-through text-slate-400">
                    Rp {detailProduct.price.toLocaleString()}
                  </p>
                )}
                <p className="font-bold text-lg text-red-600">
                  Rp {getFinalPrice(
                    detailProduct.price,
                    detailProduct.discount_percent
                  ).toLocaleString()}
                </p>
              </div>

              <Badge variant={detailProduct.stock > 0 ? 'success' : 'danger'}>
                Stok: {detailProduct.stock}
              </Badge>
            </div>

            {detailProduct.discount_percent > 0 && (
              <Badge variant="danger">
                Diskon {detailProduct.discount_percent}%
              </Badge>
            )}

            <div className="flex justify-end gap-3">
              <Button
                variant="secondary"
                onClick={() => {
                  setDetailProduct(null);
                  openEdit(detailProduct);
                }}
              >
                Edit
              </Button>
              <Button onClick={() => setDetailProduct(null)}>Tutup</Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL FORM */}
      {showForm && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={closeForm}
        >
          <form
            onSubmit={handleSubmit}
            onClick={e => e.stopPropagation()}
            className="bg-white p-6 rounded-xl w-full max-w-md
                 max-h-[90vh] overflow-y-auto space-y-4"
          >
            <h3 className="font-bold text-lg">
              {editId ? 'Edit Produk' : 'Tambah Produk'}
            </h3>

            {/* NAMA PRODUK */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">
                Nama Produk
              </label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Masukkan nama produk"
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            {/* KATEGORI */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">
                Kategori
              </label>
              <select
                value={categoryId}
                onChange={e => setCategoryId(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value={0}>-- Pilih kategori --</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* HARGA */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">
                Harga
              </label>
              <input
                type="number"
                value={price}
                onChange={e => setPrice(Number(e.target.value) || 0)}
                placeholder="Harga produk"
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            {/* STOK */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">
                Stok
              </label>
              <input
                type="number"
                value={stock}
                onChange={e => setStock(Number(e.target.value) || 0)}
                placeholder="Jumlah stok"
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            {/* DISKON */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">
                Diskon (%)
              </label>
              <input
                type="number"
                value={discount}
                onChange={e =>
                  setDiscount(Math.min(100, Number(e.target.value) || 0))
                }
                placeholder="0 - 100"
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            {/* DESKRIPSI */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">
                Deskripsi Produk
              </label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Deskripsi singkat produk"
                className="w-full px-3 py-2 border rounded-lg"
                rows={3}
              />
            </div>

            {/* GAMBAR */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">
                Gambar Produk
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setImage(file);
                  setPreview(URL.createObjectURL(file));
                }}
              />
            </div>

            {preview && (
              <img
                src={preview}
                className="w-full h-40 object-cover rounded-lg border"
              />
            )}

            {/* ACTION */}
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={closeForm}>
                Batal
              </button>
              <Button type="submit">Simpan</Button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};

export default SellerProducts;
