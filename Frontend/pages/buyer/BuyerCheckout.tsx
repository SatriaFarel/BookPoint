import React, { useEffect, useState } from 'react';
import { Button } from '../../components/Button';
import { useNavigate } from 'react-router-dom';

type CheckoutItem = {
  id: number;
  name: string;
  price: number;
  qty: number;
  seller_id: number;
};

type SellerPayment = {
  no_rekening: string | null;
  qris_image: string | null;
};

const BuyerCheckout: React.FC = () => {
  const navigate = useNavigate();

  const [items, setItems] = useState<CheckoutItem[]>([]);
  const [payment, setPayment] = useState<'transfer' | 'qris'>('transfer');
  const [proof, setProof] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [sellerPayment, setSellerPayment] = useState<SellerPayment | null>(null);

  /* ================= LOAD CHECKOUT ================= */
  useEffect(() => {
    const data = localStorage.getItem('bookpoint_checkout');
    if (!data) {
      navigate('/buyer/cart');
      return;
    }
    setItems(JSON.parse(data));
  }, [navigate]);

  /* ================= LOAD SELLER PAYMENT ================= */
  useEffect(() => {
    if (items.length === 0) return;

    const sellerId = items[0].seller_id; // ✅ FIX

    fetch(`http://127.0.0.1:8000/api/seller/${sellerId}`)
      .then(res => res.json())
      .then(data => {
        setSellerPayment({
          no_rekening: data.no_rekening ?? null,
          qris_image: data.qris ?? null,
        });
      })
      .catch(() => {
        alert('Gagal mengambil data pembayaran seller');
      });
  }, [items]);

  const total = items.reduce((a, i) => a + i.price * i.qty, 0);

  /* ================= SUBMIT ORDER ================= */
  const handleOrder = async () => {
    if (!proof) {
      alert('Bukti pembayaran wajib diupload');
      return;
    }

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.id) {
      alert('User belum login');
      return;
    }

    if (payment === 'transfer' && !sellerPayment?.no_rekening) {
      alert('Nomor rekening penjual tidak tersedia');
      return;
    }

    if (payment === 'qris' && !sellerPayment?.qris_image) {
      alert('Penjual tidak menyediakan QRIS');
      return;
    }

    const formData = new FormData();
    formData.append('customer_id', String(user.id));
    formData.append('seller_id', String(items[0].seller_id));
    formData.append('payment_method', payment);
    formData.append('proof', proof);

    formData.append(
      'items',
      JSON.stringify(
        items.map(i => ({
          product_id: i.id,
          quantity: i.qty,
          price: i.price,
        }))
      )
    );

    try {
      const res = await fetch('http://127.0.0.1:8000/api/orders', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || 'Gagal membuat pesanan');
        return;
      }

      localStorage.removeItem('bookpoint_checkout');
      localStorage.removeItem('bookpoint_cart');
      alert('Pesanan berhasil dibuat');
      navigate('/buyer/transactions');
    } catch {
      alert('Server error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Checkout</h1>

      {/* DETAIL PESANAN */}
      <div className="bg-white p-6 rounded-xl border space-y-2">
        {items.map(i => (
          <div key={i.id} className="flex justify-between text-sm">
            <span>{i.name} x{i.qty}</span>
            <span>Rp {(i.price * i.qty).toLocaleString()}</span>
          </div>
        ))}
        <div className="border-t pt-3 font-bold flex justify-between">
          <span>Total</span>
          <span>Rp {total.toLocaleString()}</span>
        </div>
      </div>

      {/* PEMBAYARAN */}
      <div className="bg-white p-6 rounded-xl border space-y-4">
        <div>
          <label className="text-sm font-bold">Metode Pembayaran</label>
          <select
            value={payment}
            onChange={e => setPayment(e.target.value as any)}
            className="w-full border px-3 py-2 rounded mt-1"
          >
            <option value="transfer">Transfer Bank</option>
            <option value="qris">QRIS</option>
          </select>
        </div>

        {payment === 'transfer' && (
          <div className="bg-slate-100 p-4 rounded">
            <p className="text-sm font-semibold">Nomor Rekening</p>
            {sellerPayment?.no_rekening || 'Tidak tersedia'}
          </div>
        )}

        {payment === 'qris' && (
          <div className="bg-slate-100 p-4 rounded">
            {sellerPayment?.qris_image ? (
              <img
                src={`http://127.0.0.1:8000/storage/${sellerPayment.qris_image}`}
                className="w-full max-h-64 object-contain"
              />
            ) : (
              <p className="text-red-600 text-sm">QRIS tidak tersedia</p>
            )}
          </div>
        )}

        <div>
          <label className="text-sm font-bold">Bukti Pembayaran</label>
          <input
            type="file"
            accept="image/*"
            onChange={e => {
              const file = e.target.files?.[0];
              if (!file) return;
              setProof(file);
              setPreview(URL.createObjectURL(file));
            }}
          />
        </div>

        {preview && (
          <img src={preview} className="w-full h-48 object-cover rounded" />
        )}
      </div>

      <Button size="lg" onClick={handleOrder}>
        Buat Pesanan
      </Button>
    </div>
  );
};

export default BuyerCheckout;
