import React, { useEffect, useState } from 'react';
import { Badge } from '../../components/Badge';
import { Product } from '../../types';

const SellerDashboard: React.FC = () => {
  const API = 'http://127.0.0.1:8000/api/seller/dashboard';
  const seller = JSON.parse(localStorage.getItem('user') || '{}');

  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!seller.id) return;

    fetch(`${API}/${seller.id}`)
      .then(res => res.json())
      .then(data => setStats(data))
      .finally(() => setLoading(false));
  }, [seller.id]);

  if (loading) return <p className="text-slate-500">Loading...</p>;
  if (!stats) return <p>Data tidak tersedia</p>;

  return (
    <div className="space-y-8">
      {/* SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border">
          <p className="text-sm text-slate-500 uppercase">Total Pendapatan</p>
          <h3 className="text-2xl font-bold mt-2">
            Rp {stats.total_sales.toLocaleString()}
          </h3>
        </div>

        <div className="bg-white p-6 rounded-xl border">
          <p className="text-sm text-slate-500 uppercase">Pesanan Baru</p>
          <h3 className="text-2xl font-bold text-blue-600 mt-2">
            {stats.pending_count}
          </h3>
        </div>

        <div className="bg-white p-6 rounded-xl border">
          <p className="text-sm text-slate-500 uppercase">Total Produk</p>
          <h3 className="text-2xl font-bold mt-2">
            {stats.products_count}
          </h3>
        </div>
      </div>

      {/* PESANAN TERBARU */}
      <section className="bg-white rounded-xl border">
        <div className="p-6 border-b">
          <h2 className="text-lg font-bold">Pesanan Terbaru</h2>
        </div>
        <div className="p-4 space-y-2">
          {stats.latest_orders.map((order: any) => (
            <div
              key={order.id}
              className="flex justify-between p-3 rounded-lg hover:bg-slate-50"
            >
              <div>
                <p className="font-semibold">{order.buyer}</p>
                <p className="text-xs text-slate-500">
                  #{order.id} • {order.date}
                </p>
              </div>

              <Badge
                variant={
                  order.status === 'approved'
                    ? 'success'
                    : order.status === 'pending'
                    ? 'warning'
                    : 'danger'
                }
              >
                {order.status}
              </Badge>
            </div>
          ))}
        </div>
      </section>

      {/* STOK MENIPIS */}
      <section className="bg-white rounded-xl border">
        <div className="p-6 border-b">
          <h2 className="text-lg font-bold">Stok Menipis</h2>
        </div>
        <div className="p-4 space-y-2">
          {stats.low_stock.map((book: Product) => (
            <div
              key={book.id}
              className="flex justify-between p-3 rounded-lg hover:bg-slate-50"
            >
              <div>
                <p className="font-semibold">{book.name}</p>
                <p className="text-xs text-slate-500">{book.category_name}</p>
              </div>
              <span
                className={`font-bold ${
                  book.stock === 0 ? 'text-red-600' : 'text-amber-600'
                }`}
              >
                Stok: {book.stock}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default SellerDashboard;
