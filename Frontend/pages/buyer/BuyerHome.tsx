import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Seller, Product } from '../../types';
import { Button } from '../../components/Button';

interface BuyerHomeProps {
  user: User;
  onLogout: () => void;
}

/* ================= HELPER ================= */
const getFinalPrice = (price: number, discount?: number | null) => {
  if (!discount || discount <= 0) return price;
  return Math.round(price - (price * discount / 100));
};

const CART_KEY = 'bookpoint_cart';

const BuyerHome: React.FC<BuyerHomeProps> = ({ user, onLogout }) => {
  const API = 'http://127.0.0.1:8000/api/products';

  const [searchTerm, setSearchTerm] = useState('');
  const [seller, setSeller] = useState<Seller | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('Semua');

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔹 tambahan minimal
  const [cartCount, setCartCount] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  /* ================= CART ================= */
  const getCart = () => JSON.parse(localStorage.getItem(CART_KEY) || '[]');

  const updateCartCount = () => {
    const cart = getCart();
    const total = cart.reduce((sum: number, i: any) => sum + i.qty, 0);
    setCartCount(total);
  };

  const addToCart = (product: Product) => {
    const cart = getCart();
    const finalPrice = getFinalPrice(product.price, product.discount_percent);

    const existing = cart.find((i: any) => i.id === product.id);

    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({
        id: product.id,
        seller_id: Number(product.seller_id),
        name: product.name,
        price: finalPrice, // ✅ HARGA SETELAH DISKON
        original_price: product.price, // opsional (buat history)
        discount_percent: product.discount_percent,
        image: product.image,
        qty: 1,
      });
    }

    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartCount();
  };

  /* ================= FETCH ================= */
  const fetchProducts = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    updateCartCount();
  }, []);

  useEffect(() => {
    const fetchSeller = async () => {
      if (!selectedProduct) return;

      try {
        const res = await fetch(
          `http://127.0.0.1:8000/api/seller/${selectedProduct.seller_id}`,
          {
            headers: {
              Accept: 'application/json',
            },
          }
        );

        const data = await res.json();
        setSeller(data);
      } catch {
        setSeller(null);
      }
    };

    fetchSeller();
  }, [selectedProduct]);


  /* ================= FILTER ================= */
  const filteredBooks = products.filter(b => {
    const matchSearch =
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.category?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchCategory =
      activeCategory === 'Semua' || b.category === activeCategory;

    return matchSearch && matchCategory;
  });

  if (loading) return <p className="text-slate-500">Loading...</p>;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ===== NAV ===== */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                BookPoint
              </h1>
              <div className="hidden md:flex gap-6">
                <Link to="/buyer" className="text-blue-600 font-bold">
                  Store
                </Link>
                <Link to="/buyer/transactions" className="text-slate-500">
                  History
                </Link>
              </div>
            </div>

            <div className="flex-1 max-w-md mx-8 hidden sm:block">
              <div className="relative">
                <input
                  placeholder="Cari judul buku atau kategori..."
                  className="w-full pl-10 pr-4 py-2 rounded-full border"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
                <span className="absolute left-3 top-2.5">🔍</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* PROFILE */}
              <Link
                to="/buyer/profile"
                className="flex items-center gap-1 text-slate-600 hover:text-slate-900"
                title="Profil Saya"
              >
                <span className="text-xl">👤</span>
              </Link>

              {/* CART */}
              <Link to="/buyer/cart" className="relative p-2">
                <span className="text-2xl">🛒</span>
                {cartCount > 0 && (
                  <span
                    className="absolute top-0 right-0 bg-blue-600 text-white
        text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold"
                  >
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* HELP */}
              <Link
                to="/buyer/help"
                className="text-sm text-slate-500 hover:text-blue-600 font-medium"
              >
                Bantuan
              </Link>


              {/* LOGOUT */}
              <button
                onClick={onLogout}
                className="text-sm text-slate-500 hover:text-red-500"
              >
                Logout
              </button>
            </div>

          </div>
        </div>
      </nav>

      <header className="mb-12"> <div className="bg-slate-900 rounded-3xl p-10 flex flex-col md:flex-row items-center justify-between text-white overflow-hidden relative"> <div className="z-10 relative"> <h2 className="text-4xl font-extrabold mb-4">Temukan Dunia di Balik Kata.</h2> <p className="text-slate-400 text-lg mb-8 max-w-lg">Jelajahi ribuan koleksi buku pilihan terbaik hanya untukmu dengan promo spesial hingga 50%!</p> <Button variant="secondary" size="lg">Lihat Promo</Button> </div> <div className="hidden md:block opacity-20 text-[10rem] select-none pointer-events-none">📚</div> </div> </header>

      {/* ===== CONTENT ===== */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {filteredBooks.map(book => {
            const finalPrice = getFinalPrice(book.price, book.discount_percent);

            return (
              <div
                key={book.id}
                onClick={() => setSelectedProduct(book)}
                className="bg-white rounded-xl border overflow-hidden cursor-pointer hover:shadow-md"
              >
                {/* IMAGE + DISKON */}
                <div className="relative aspect-[3/4]">
                  <img
                    src={`http://127.0.0.1:8000/storage/${book.image}`}
                    className="w-full h-full object-cover"
                  />

                  {book.discount_percent && book.discount_percent > 0 && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white
                      text-xs font-bold px-2 py-1 rounded">
                      -{book.discount_percent}%
                    </span>
                  )}
                </div>

                <div className="p-4 space-y-1">
                  <p className="text-[10px] font-bold text-blue-600 uppercase">
                    {book.category}
                  </p>
                  <h3 className="font-bold text-sm line-clamp-1">
                    {book.name}
                  </h3>

                  {/* PRICE */}
                  {book.discount_percent && book.discount_percent > 0 && (
                    <p className="text-xs line-through text-slate-400">
                      Rp {book.price.toLocaleString()}
                    </p>
                  )}
                  <p className="font-bold text-sm text-red-600">
                    Rp {finalPrice.toLocaleString()}
                  </p>

                  <button
                    onClick={e => {
                      e.stopPropagation();
                      addToCart(book);
                    }}
                    className="mt-2 w-full text-xs py-2 rounded bg-slate-900 text-white"
                  >
                    + Keranjang
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* ================= MODAL DETAIL ================= */}
      {selectedProduct && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            {/* SCROLL AREA */}
            <div className="p-6 overflow-y-auto space-y-4">
              <img
                src={`http://127.0.0.1:8000/storage/${selectedProduct.image}`}
                className="w-full h-72 object-cover rounded-xl"
              />

              <p className="text-xs uppercase font-bold text-blue-600">
                {selectedProduct.category}
              </p>

              <h2 className="text-2xl font-bold">{selectedProduct.name}</h2>

              <p className="text-xl font-bold text-red-600">
                Rp {getFinalPrice(
                  selectedProduct.price,
                  selectedProduct.discount_percent
                ).toLocaleString()}
              </p>

              <p className="text-sm">
                Stok:{' '}
                <span className={`font-bold ${selectedProduct.stock > 0
                  ? 'text-green-600'
                  : 'text-red-600'
                  }`}>
                  {selectedProduct.stock}
                </span>
              </p>

              {/* DESKRIPSI */}
              <div>
                <p className="font-semibold mb-1">Deskripsi</p>
                <p className="text-sm text-slate-600">
                  {selectedProduct.description || '-'}
                </p>
              </div>

              {/* SELLER CARD */}
              {seller && (
                <div className="pt-3 border-t">
                  <p className="text-sm font-semibold mb-2">Penjual</p>

                  <Link
                    to={`/seller/${seller.id}`}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50"
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden border">
                      {seller.foto ? (
                        <img
                          src={`http://127.0.0.1:8000/storage/${seller.foto}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                          🏪
                        </div>
                      )}
                    </div>

                    <div>
                      <p className="font-bold text-sm">
                        {seller.name}
                      </p>
                      <p className="text-xs text-slate-400">
                        Lihat profil penjual →
                      </p>
                    </div>
                  </Link>
                </div>
              )}

            </div>

            {/* ACTION (STICKY) */}
            <div className="border-t p-4 flex justify-end gap-3">
              <Button
                variant="secondary"
                onClick={() => addToCart(selectedProduct)}
                disabled={selectedProduct.stock <= 0}
              >
                + Keranjang
              </Button>
              <Button onClick={() => setSelectedProduct(null)}>Tutup</Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default BuyerHome;
