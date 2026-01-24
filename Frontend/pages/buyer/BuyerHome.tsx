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
              <Link to="/buyer/cart" className="relative p-2">
                <span className="text-2xl">🛒</span>
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-blue-600 text-white
                    text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                    {cartCount}
                  </span>
                )}
              </Link>
              <button onClick={onLogout} className="text-sm text-slate-500">
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

      {/* ===== MODAL DETAIL ===== */}
      {selectedProduct && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="bg-white rounded-xl p-6 w-full max-w-md space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <img
              src={`http://127.0.0.1:8000/storage/${selectedProduct.image}`}
              className="w-full h-64 object-cover rounded-lg"
            />

            <h3 className="text-xl font-bold">{selectedProduct.name}</h3>
            <p className="text-sm text-slate-500">{selectedProduct.category}</p>

            <p className="font-bold text-lg">
              Rp {getFinalPrice(
                selectedProduct.price,
                selectedProduct.discount_percent
              ).toLocaleString()}
            </p>

            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => addToCart(selectedProduct)}>
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
