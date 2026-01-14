
import React from 'react';
import { Link } from 'react-router-dom';
import { DUMMY_ORDERS } from '../../constants';
import { User, OrderStatus } from '../../types';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';

interface BuyerTransactionsProps {
  user: User;
  onLogout: () => void;
}

const BuyerTransactions: React.FC<BuyerTransactionsProps> = ({ user, onLogout }) => {
  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-20 px-4 py-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <Link to="/buyer" className="text-xl font-bold text-slate-900">Lumina</Link>
          <div className="flex gap-6">
             <Link to="/buyer" className="text-slate-500 font-medium">Store</Link>
             <Link to="/buyer/transactions" className="text-blue-600 font-bold">History</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto p-4 py-8 space-y-8">
        <h1 className="text-2xl font-bold text-slate-900">Riwayat Transaksi</h1>

        <div className="space-y-4">
          {DUMMY_ORDERS.map(order => (
            <div key={order.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-bold text-slate-400">{order.id}</span>
                  <Badge variant={order.status === OrderStatus.APPROVED ? 'success' : order.status === OrderStatus.PENDING ? 'warning' : 'danger'}>
                    {order.status}
                  </Badge>
                </div>
                <h3 className="font-bold text-slate-800">
                   {order.items.map(i => i.bookName).join(', ')}
                </h3>
                <p className="text-xs text-slate-400">{order.date} • Rp {order.total.toLocaleString()}</p>
              </div>

              <div className="flex flex-wrap gap-3">
                {order.status === OrderStatus.PENDING && (
                  <div className="flex flex-col gap-2">
                     <span className="text-[10px] text-slate-400 font-bold uppercase">Upload Bukti</span>
                     <input type="file" className="text-xs text-slate-500 file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                  </div>
                )}
                {order.status === OrderStatus.APPROVED && (
                  <div className="flex flex-col">
                    <span className="text-[10px] text-emerald-600 font-bold uppercase">Nomor Resi</span>
                    <span className="font-mono font-bold text-slate-900">{order.resi || 'Diproses'}</span>
                  </div>
                )}
                <Link to={`/buyer/invoice/${order.id}`}>
                   <Button variant="outline" size="sm">Lihat Invoice</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default BuyerTransactions;
