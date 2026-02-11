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
  payment: 'transfer' | 'qris' | null;
  proof: File | null;
  preview: string;
  sellerPayment: SellerPayment;
};

const BuyerCheckout: React.FC = () => {
  const navigate = useNavigate();

  const [items, setItems] = useState<CheckoutItem[]>([]);
  const [sellerStates, setSellerStates] = useState<Record<number, SellerCheckoutState>>({});

  /* ===== LOAD CHECKOUT ===== */
  useEffect(() => {
    const data = localStorage.getItem('bookpoint_checkout');
    if (!data) {
      navigate('/buyer/cart');
      return;
    }
    setItems(JSON.parse(data));
  }, [navigate]);

  /* ===== GROUP ITEMS PER SELLER ===== */
  const groupedItems = items.reduce<Record<number, CheckoutItem[]>>((acc, item) => {
    if (!acc[item.seller_id]) acc[item.seller_id] = [];
    acc[item.seller_id].push(item);
    return acc;
  }, {});

  /* ===== LOAD SELLER PAYMENT ===== */
  useEffect(() => {
    Object.keys(groupedItems).forEach(key => {
      const sellerId = Number(key);
      if (sellerStates[sellerId]) return;

      fetch(`http://127.0.0.1:8000/api/seller/${sellerId}`)
        .then(res => res.json())
        .then(data => {
          const hasTransfer = !!data.no_rekening;
          const hasQris = !!data.qris;

          setSellerStates(prev => ({
            ...prev,
            [sellerId]: {
              payment: hasTransfer ? 'transfer' : hasQris ? 'qris' : null,
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
  }, [groupedItems, sellerStates]);

  /* ===== READY CHECK ===== */
  const isReady = Object.keys(groupedItems).every(key => {
    const state = sellerStates[Number(key)];
    return state && state.payment && state.proof;
  });

  /* ===== SUBMIT ===== */
  const handleOrder = async () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.id) {
      alert('User belum login');
      return;
    }

    for (const key of Object.keys(groupedItems)) {
      const sellerId = Number(key);
      const state = sellerStates[sellerId];

      const fd = new FormData();
      fd.append('customer_id', String(user.id));
      fd.append('seller_id', String(sellerId));
      fd.append('payment_method', state.payment!);
      fd.append('proof', state.proof!);
      fd.append(
        'items',
        JSON.stringify(
          groupedItems[sellerId].map(i => ({
            product_id: i.id,
            quantity: i.qty,
            price: i.price,
          }))
        )
      );

      const res = await fetch('http://127.0.0.1:8000/api/orders', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: fd,
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message);
        return;
      }
    }

    localStorage.removeItem('bookpoint_checkout');
    localStorage.removeItem('bookpoint_cart');
    alert('Pesanan berhasil dibuat');
    navigate('/buyer/transactions');
  };

  /* ===== UI ===== */
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Checkout</h1>

      {Object.entries(groupedItems).map(([key, items]) => {
        const sellerId = Number(key);
        const state = sellerStates[sellerId];
        const pay = state?.sellerPayment;

        const total = items.reduce((a, i) => a + i.price * i.qty, 0);

        return (
          <div key={sellerId} className="bg-white p-6 rounded-xl border space-y-4">
            <h2 className="font-bold">Seller #{sellerId}</h2>

            {items.map(i => (
              <div key={i.id} className="flex justify-between text-sm">
                <span>{i.name} x{i.qty}</span>
                <span>Rp {(i.price * i.qty).toLocaleString()}</span>
              </div>
            ))}

            <div className="border-t pt-2 font-bold flex justify-between">
              <span>Total</span>
              <span>Rp {total.toLocaleString()}</span>
            </div>

            {state?.payment && (
              <select
                value={state.payment}
                onChange={e =>
                  setSellerStates(prev => ({
                    ...prev,
                    [sellerId]: { ...prev[sellerId], payment: e.target.value as any },
                  }))
                }
                className="w-full border px-3 py-2 rounded"
              >
                {pay?.no_rekening && <option value="transfer">Transfer</option>}
                {pay?.qris_image && <option value="qris">QRIS</option>}
              </select>
            )}

            {state?.payment === 'transfer' && pay?.no_rekening && (
              <div className="bg-slate-100 p-3 rounded">
                Rekening: {pay.no_rekening}
              </div>
            )}

            {state?.payment === 'qris' && pay?.qris_image && (
              <img
                src={`http://127.0.0.1:8000/storage/${pay.qris_image}`}
                className="max-h-56 object-contain"
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
                    ...prev[sellerId],
                    proof: file,
                    preview: URL.createObjectURL(file),
                  },
                }));
              }}
            />

            {state?.preview && (
              <img src={state.preview} className="h-40 object-cover rounded" />
            )}
          </div>
        );
      })}

      <Button size="lg" disabled={!isReady} onClick={handleOrder}>
        Buat Pesanan
      </Button>
    </div>
  );
};

export default BuyerCheckout;
