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

type SellerCheckoutState = {
  payment: 'transfer' | 'qris';
  proof: File | null;
  preview: string;
  sellerPayment: SellerPayment | null;
};

const BuyerCheckout: React.FC = () => {
  const navigate = useNavigate();

  const [items, setItems] = useState<CheckoutItem[]>([]);
  const [sellerStates, setSellerStates] = useState<Record<number, SellerCheckoutState>>({});

  /* ================= LOAD CHECKOUT ================= */
  useEffect(() => {
    const data = localStorage.getItem('bookpoint_checkout');
    if (!data) {
      navigate('/buyer/cart');
      return;
    }
    setItems(JSON.parse(data));
  }, [navigate]);

  /* ================= GROUP ITEMS PER SELLER ================= */
  const groupedItems = items.reduce((acc: Record<number, CheckoutItem[]>, item) => {
    if (!acc[item.seller_id]) acc[item.seller_id] = [];
    acc[item.seller_id].push(item);
    return acc;
  }, {});

  /* ================= LOAD SELLER PAYMENT ================= */
  useEffect(() => {
    Object.keys(groupedItems).forEach(sellerId => {
      fetch(`http://127.0.0.1:8000/api/seller/${sellerId}`)
        .then(res => res.json())
        .then(data => {
          setSellerStates(prev => ({
            ...prev,
            [sellerId]: {
              payment: 'transfer',
              proof: null,
              preview: '',
              sellerPayment: {
                no_rekening: data.no_rekening ?? null,
                qris_image: data.qris ?? null,
              },
            },
          }));
        });
    });
  }, [items]);

  /* ================= SUBMIT ORDER ================= */
  const handleOrder = async () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.id) {
      alert('User belum login');
      return;
    }

    for (const sellerId of Object.keys(groupedItems)) {
      const state = sellerStates[Number(sellerId)];

      if (!state?.proof) {
        alert(`Bukti pembayaran seller ${sellerId} wajib diupload`);
        return;
      }

      if (state.payment === 'transfer' && !state.sellerPayment?.no_rekening) {
        alert(`Rekening seller ${sellerId} tidak tersedia`);
        return;
      }

      if (state.payment === 'qris' && !state.sellerPayment?.qris_image) {
        alert(`QRIS seller ${sellerId} tidak tersedia`);
        return;
      }

      const formData = new FormData();
      formData.append('customer_id', String(user.id));
      formData.append('seller_id', sellerId);
      formData.append('payment_method', state.payment);
      formData.append('proof', state.proof);

      formData.append(
        'items',
        JSON.stringify(
          groupedItems[Number(sellerId)].map(i => ({
            product_id: i.id,
            quantity: i.qty,
            price: i.price,
          }))
        )
      );

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
    }

    localStorage.removeItem('bookpoint_checkout');
    localStorage.removeItem('bookpoint_cart');
    alert('Semua pesanan berhasil dibuat');
    navigate('/buyer/transactions');
  };

  /* ================= UI ================= */
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Checkout</h1>

      {Object.entries(groupedItems).map(([sellerId, sellerItems]) => {
        const state = sellerStates[Number(sellerId)];

        const total = sellerItems.reduce(
          (a, i) => a + i.price * i.qty,
          0
        );

        return (
          <div key={sellerId} className="bg-white p-6 rounded-xl border space-y-4">
            <h2 className="font-bold">Seller #{sellerId}</h2>

            {sellerItems.map(i => (
              <div key={i.id} className="flex justify-between text-sm">
                <span>{i.name} x{i.qty}</span>
                <span>Rp {(i.price * i.qty).toLocaleString()}</span>
              </div>
            ))}

            <div className="border-t pt-2 font-bold flex justify-between">
              <span>Total</span>
              <span>Rp {total.toLocaleString()}</span>
            </div>

            <select
              value={state?.payment}
              onChange={e =>
                setSellerStates(prev => ({
                  ...prev,
                  [sellerId]: {
                    ...prev[Number(sellerId)],
                    payment: e.target.value as any,
                  },
                }))
              }
              className="w-full border px-3 py-2 rounded"
            >
              <option value="transfer">Transfer</option>
              <option value="qris">QRIS</option>
            </select>

            {state?.payment === 'transfer' && (
              <div className="bg-slate-100 p-3 rounded">
                {state.sellerPayment?.no_rekening || 'Tidak tersedia'}
              </div>
            )}

            {state?.payment === 'qris' && state.sellerPayment?.qris_image && (
              <img
                src={`http://127.0.0.1:8000/storage/${state.sellerPayment.qris_image}`}
                className="w-full max-h-60 object-contain"
              />
            )}

            <input
              type="file"
              accept="image/*"
              onChange={e => {
                const file = e.target.files?.[0];
                if (!file) return;
                setSellerStates(prev => ({
                  ...prev,
                  [sellerId]: {
                    ...prev[Number(sellerId)],
                    proof: file,
                    preview: URL.createObjectURL(file),
                  },
                }));
              }}
            />

            {state?.preview && (
              <img src={state.preview} className="w-full h-40 object-cover rounded" />
            )}
          </div>
        );
      })}

      <Button size="lg" onClick={handleOrder}>
        Buat Pesanan
      </Button>
    </div>
  );
};

export default BuyerCheckout;
