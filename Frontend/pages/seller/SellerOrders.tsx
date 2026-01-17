
import React, {useState, useEffect} from 'react';
import { DUMMY_ORDERS } from '../../constants';
import { OrderStatus } from '../../types';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';

const SellerOrders: React.FC = () => {

  const API = 'http://127.0.0.1:8000/api/orders';

  const [order, setOrders] = useState('');
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(true);


  /* ================= ALERT ================= */
  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 3000);
  };

  /* ================= FETCH ================= */
  const fetchProducts = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();
      setOrders(data);
    } catch {
      showAlert('error', 'Gagal mengambil produk');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="space-y-6">

      {/* ===== ALERT ===== */}
      {alert && (
        <div
          className={`fixed top-20 right-5 z-50 px-4 py-3 rounded-xl shadow-lg
          text-white animate-in slide-in-from-top fade-in duration-300
          ${alert.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`}
        >
          {alert.message}
        </div>
      )}

      <h1 className="text-2xl font-bold text-slate-900">Kelola Pesanan</h1>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
            <tr>
              <th className="px-6 py-4">ID Pesanan</th>
              <th className="px-6 py-4">Pembeli</th>
              <th className="px-6 py-4">Produk</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4">Bukti</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {order.map((order) => (
              <tr key={order.id} className="hover:bg-slate-50/50">
                <td className="px-6 py-4 font-mono text-xs text-slate-600">{order.id}</td>
                <td className="px-6 py-4 font-medium text-slate-900">{order.buyerName}</td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {order.items.map(i => `${i.bookName} (x${i.quantity})`).join(', ')}
                </td>
                <td className="px-6 py-4 font-bold text-slate-900 text-sm">Rp {order.total.toLocaleString()}</td>
                <td className="px-6 py-4">
                  {order.paymentProof ? (
                    <a href={order.paymentProof} target="_blank" className="text-blue-600 text-xs font-bold hover:underline">Lihat Bukti</a>
                  ) : <span className="text-slate-400 text-xs italic">Belum bayar</span>}
                </td>
                <td className="px-6 py-4">
                  <Badge variant={order.status === OrderStatus.APPROVED ? 'success' : order.status === OrderStatus.PENDING ? 'warning' : 'danger'}>
                    {order.status}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  {order.status === OrderStatus.PENDING ? (
                    <div className="flex gap-2">
                      <Button size="sm" variant="success">Setuju</Button>
                      <Button size="sm" variant="danger">Tolak</Button>
                    </div>
                  ) : order.status === OrderStatus.APPROVED ? (
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Resi</span>
                      <input type="text" placeholder="Input Resi" className="border border-slate-200 px-2 py-1 text-xs rounded focus:outline-none focus:ring-1 focus:ring-blue-500" value={order.resi || ''} />
                    </div>
                  ) : (
                    <span className="text-slate-400 text-xs">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SellerOrders;
