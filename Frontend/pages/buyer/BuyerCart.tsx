import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, BuyerCartProps, CartItem } from '../../types';
import { Button } from '../../components/Button';

const BuyerCart: React.FC<BuyerCartProps> = ({ user }) => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  /* ===== LOAD CART ===== */
  useEffect(() => {
    const cart = localStorage.getItem('bookpoint_cart');
    if (!cart) return;

    const items = JSON.parse(cart).map((i: any) => ({
      ...i,
      price: Number(i.price),
      selected: true, // default dipilih
    }));

    setCartItems(items);
  }, []);

  /* ===== UPDATE LOCALSTORAGE ===== */
  const syncCart = (items: CartItem[]) => {
    setCartItems(items);
    localStorage.setItem(
      'bookpoint_cart',
      JSON.stringify(items.map(({ selected, ...rest }) => rest))
    );
  };

  /* ===== TOGGLE PILIH ===== */
  const toggleSelect = (id: number) => {
    syncCart(
      cartItems.map(i =>
        i.id === id ? { ...i, selected: !i.selected } : i
      )
    );
  };

  /* ===== HAPUS ITEM ===== */
  const removeItem = (id: number) => {
    syncCart(cartItems.filter(i => i.id !== id));
  };

  /* ===== HITUNG ===== */
  const selectedItems = cartItems.filter(i => i.selected);
  const total = selectedItems.reduce(
    (acc, i) => acc + i.price * i.qty,
    0
  );

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      alert('Pilih minimal 1 produk');
      return;
    }

    localStorage.setItem(
      'bookpoint_checkout',
      JSON.stringify(selectedItems)
    );

    navigate('/buyer/checkout');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b p-4 sticky top-0">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <Link to="/buyer">←</Link>
          <h1 className="text-xl font-bold">Keranjang</h1>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LIST */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map(item => (
            <div key={item.id} className="bg-white p-4 rounded-xl border flex gap-4">
              <input
                type="checkbox"
                checked={item.selected}
                onChange={() => toggleSelect(item.id)}
              />

              <img
                src={`http://127.0.0.1:8000/storage/${item.image}`}
                className="w-20 h-28 object-cover rounded"
              />

              <div className="flex-1">
                <h3 className="font-bold">{item.name}</h3>
                <p className="text-sm">Qty: {item.qty}</p>
                <p className="font-bold">
                  Rp {(item.price * item.qty).toLocaleString()}
                </p>
              </div>

              <button
                onClick={() => removeItem(item.id)}
                className="text-red-500"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>

        {/* SUMMARY */}
        <div className="bg-white p-6 rounded-xl border h-fit">
          <h2 className="font-bold mb-4">Ringkasan</h2>
          <div className="text-sm space-y-2">
            <div className="border-t pt-2 flex justify-between font-bold">
              <span>Total</span>
              <span>Rp {total.toLocaleString()}</span>
            </div>
          </div>

          <Button fullWidth className="mt-6" onClick={handleCheckout}>
            Checkout
          </Button>
        </div>
      </main>
    </div>
  );
};

export default BuyerCart;
