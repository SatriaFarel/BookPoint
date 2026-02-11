import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '../../components/Button';

const BuyerInvoice: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const API = `http://127.0.0.1:8000/api/orders/${id}/invoice`;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API)
      .then(res => res.json())
      .then(data => setOrder(data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="p-6">Loading invoice...</p>;
  if (!order?.id) return <p className="p-6">Invoice tidak ditemukan</p>;

  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-3xl mx-auto no-print mb-6">
        <Link to="/buyer/transactions" className="font-bold text-slate-500">
          ← Kembali ke Riwayat
        </Link>
      </div>

      <div className="max-w-3xl mx-auto bg-white rounded-2xl p-10">
        <div className="flex justify-between mb-12">
          <div>
            <h1 className="text-3xl font-black">BookStore.</h1>
            <p className="text-sm text-slate-500">PT Book Media Group</p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold">Invoice</h2>
            <p className="font-mono text-sm">{order.id}</p>
            <p className="text-xs text-slate-400">{order.date}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-12 mb-12">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase">
              Ditujukan Untuk
            </h3>
            <p className="font-bold text-lg">{order.buyer.name}</p>
          </div>
          <div className="text-right">
            <span className={`px-4 py-1 rounded-full text-xs font-bold
              ${order.status === 'approved'
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-slate-100 text-slate-800'}`}>
              {order.status.toUpperCase()}
            </span>
          </div>
        </div>

        <table className="w-full mb-12">
          <thead>
            <tr className="border-b-2">
              <th>Produk</th>
              <th className="text-center">Qty</th>
              <th className="text-right">Harga</th>
              <th className="text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item: any, i: number) => (
              <tr key={i} className="border-b">
                <td className="py-4">{item.name}</td>
                <td className="text-center">{item.quantity}</td>
                <td className="text-right">
                  Rp {item.price.toLocaleString()}
                </td>
                <td className="text-right font-bold">
                  Rp {(item.price * item.quantity).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end">
          <div className="w-64">
            <div className="flex justify-between font-black text-xl">
              <span>TOTAL</span>
              <span>Rp {order.total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-12 no-print">
        <Button size="lg" onClick={handlePrint}>
          Cetak Invoice
        </Button>
      </div>
    </div>
  );
};

export default BuyerInvoice;
