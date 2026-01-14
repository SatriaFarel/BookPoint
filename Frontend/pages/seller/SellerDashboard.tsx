
import React from 'react';
import { Badge } from '../../components/Badge';
import { DUMMY_ORDERS, DUMMY_BOOKS } from '../../constants';
import { OrderStatus } from '../../types';

const SellerDashboard: React.FC = () => {
  const pendingOrders = DUMMY_ORDERS.filter(o => o.status === OrderStatus.PENDING);
  const totalSales = DUMMY_ORDERS.filter(o => o.status === OrderStatus.APPROVED).reduce((acc, curr) => acc + curr.total, 0);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <p className="text-sm font-medium text-slate-500 uppercase">Total Pendapatan</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-2">Rp {totalSales.toLocaleString()}</h3>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <p className="text-sm font-medium text-slate-500 uppercase">Pesanan Baru</p>
          <h3 className="text-2xl font-bold text-blue-600 mt-2">{pendingOrders.length}</h3>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <p className="text-sm font-medium text-slate-500 uppercase">Total Produk</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-2">{DUMMY_BOOKS.length}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900">Pesanan Terbaru</h2>
          </div>
          <div className="p-4">
            {DUMMY_ORDERS.slice(0, 3).map(order => (
               <div key={order.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-100 transition-all mb-2 last:mb-0">
                  <div>
                    <p className="font-semibold text-slate-800">{order.buyerName}</p>
                    <p className="text-xs text-slate-500">{order.id} • {order.date}</p>
                  </div>
                  <Badge variant={order.status === OrderStatus.APPROVED ? 'success' : order.status === OrderStatus.PENDING ? 'warning' : 'danger'}>
                    {order.status}
                  </Badge>
               </div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900">Stok Menipis</h2>
          </div>
          <div className="p-4">
            {DUMMY_BOOKS.filter(b => b.stock <= 5).map(book => (
               <div key={book.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-100 transition-all mb-2 last:mb-0">
                  <div>
                    <p className="font-semibold text-slate-800">{book.name}</p>
                    <p className="text-xs text-slate-500">{book.category}</p>
                  </div>
                  <span className={`text-sm font-bold ${book.stock === 0 ? 'text-red-600' : 'text-amber-600'}`}>
                    Stok: {book.stock}
                  </span>
               </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default SellerDashboard;
