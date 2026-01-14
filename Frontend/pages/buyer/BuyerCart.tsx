
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DUMMY_BOOKS } from '../../constants';
import { User } from '../../types';
import { Button } from '../../components/Button';

interface BuyerCartProps {
  user: User;
  onLogout: () => void;
}

const BuyerCart: React.FC<BuyerCartProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([
    { ...DUMMY_BOOKS[0], quantity: 1 },
    { ...DUMMY_BOOKS[1], quantity: 2 },
  ]);

  const subtotal = cartItems.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
  const tax = subtotal * 0.11;
  const total = subtotal + tax;

  const handleCheckout = () => {
    alert('Pesanan berhasil dibuat! Silakan upload bukti pembayaran di halaman transaksi.');
    navigate('/buyer/transactions');
  };

  return (
    <div className="min-h-screen bg-slate-50">
       <nav className="bg-white border-b border-slate-200 p-4 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
           <Link to="/buyer" className="p-2 hover:bg-slate-100 rounded-full transition-all">←</Link>
           <h1 className="text-xl font-bold text-slate-900">Keranjang Belanja</h1>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto p-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map(item => (
            <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex gap-4">
              <img src={item.image} alt={item.name} className="w-20 h-28 object-cover rounded shadow-sm" />
              <div className="flex-1">
                <h3 className="font-bold text-slate-900">{item.name}</h3>
                <p className="text-xs text-slate-400 mb-4">{item.category}</p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Rp {item.price.toLocaleString()}</span>
                  <div className="flex items-center gap-3 border border-slate-200 rounded-lg p-1">
                    <button className="w-6 h-6 flex items-center justify-center bg-slate-50 rounded">-</button>
                    <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                    <button className="w-6 h-6 flex items-center justify-center bg-slate-50 rounded">+</button>
                  </div>
                </div>
              </div>
              <button className="text-red-400 hover:text-red-600">🗑️</button>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 mb-6">Ringkasan Pesanan</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span>Rp {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>PPN (11%)</span>
                <span>Rp {tax.toLocaleString()}</span>
              </div>
              <div className="border-t border-slate-100 pt-3 flex justify-between font-bold text-slate-900 text-lg">
                <span>Total</span>
                <span>Rp {total.toLocaleString()}</span>
              </div>
            </div>
            <Button fullWidth size="lg" className="mt-8" onClick={handleCheckout}>Checkout Sekarang</Button>
          </div>

          <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
            <h3 className="font-bold text-blue-900 text-sm mb-2">Metode Pembayaran</h3>
            <p className="text-xs text-blue-800 leading-relaxed mb-4">Transfer Bank Central Lumina (BCL) 0987-1234-5678 a/n PT Lumina Books.</p>
            <div className="text-[10px] text-blue-500 font-bold uppercase tracking-widest">Wajib Upload Bukti Transfer</div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BuyerCart;
