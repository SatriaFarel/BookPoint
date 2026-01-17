import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { DUMMY_ORDERS } from '../../constants';
import { User } from '../../types';
import { Button } from '../../components/Button';

interface BuyerInvoiceProps {
  user: User;
  onLogout: () => void;
}

const BuyerInvoice: React.FC<BuyerInvoiceProps> = ({ user, onLogout }) => {
  const { id } = useParams<{ id: string }>();
  const order = DUMMY_ORDERS.find(o => o.id === id) || DUMMY_ORDERS[0];

  

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-3xl mx-auto no-print mb-6">
         <Link to="/buyer/transactions" className="text-slate-500 hover:text-slate-900 font-bold">← Kembali ke Riwayat</Link>
      </div>

      <div className="max-w-3xl mx-auto bg-white shadow-2xl rounded-2xl p-10 print:shadow-none print:rounded-none">
        <div className="flex justify-between items-start mb-12">
          <div>
            <h1 className="text-3xl font-black text-slate-900 mb-2">LUMINA.</h1>
            <p className="text-slate-500 text-sm">PT Lumina Media Group<br />Jl. Literasi No. 42, Jakarta Selatan</p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tighter">Invoice</h2>
            <p className="text-slate-500 font-mono text-sm">{order.id}</p>
            <p className="text-slate-400 text-xs mt-1">{order.date}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-12 mb-12">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase mb-3">Ditujukan Untuk</h3>
            <p className="font-bold text-slate-900 text-lg">{order.buyerName}</p>
            <p className="text-slate-500 text-sm mt-1">Pembeli Setia Lumina<br />Indonesia</p>
          </div>
          <div className="text-right">
            <h3 className="text-xs font-bold text-slate-400 uppercase mb-3">Status Pembayaran</h3>
            <div className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold ${order.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'}`}>
               {order.status === 'APPROVED' ? 'LUNAS' : 'MENUNGGU VERIFIKASI'}
            </div>
          </div>
        </div>

        <table className="w-full text-left mb-12">
          <thead>
            <tr className="border-b-2 border-slate-900">
              <th className="py-4 font-black text-slate-900">Deskripsi Produk</th>
              <th className="py-4 text-center font-black text-slate-900">Qty</th>
              <th className="py-4 text-right font-black text-slate-900">Harga Satuan</th>
              <th className="py-4 text-right font-black text-slate-900">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {order.items.map((item, idx) => (
              <tr key={idx}>
                <td className="py-6 font-medium text-slate-800">{item.bookName}</td>
                <td className="py-6 text-center text-slate-600">{item.quantity}</td>
                <td className="py-6 text-right text-slate-600">Rp {item.price.toLocaleString()}</td>
                <td className="py-6 text-right font-bold text-slate-900">Rp {(item.price * item.quantity).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end">
          <div className="w-64 space-y-3">
            <div className="flex justify-between text-slate-500 text-sm">
              <span>Subtotal</span>
              <span>Rp {order.total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-500 text-sm">
              <span>Pajak (0%)</span>
              <span>Rp 0</span>
            </div>
            <div className="flex justify-between text-slate-900 font-black text-xl border-t-2 border-slate-100 pt-3">
              <span>TOTAL</span>
              <span>Rp {order.total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="mt-24 pt-8 border-t border-slate-100 text-center">
           <p className="text-slate-400 text-xs italic">Terima kasih telah berbelanja di Lumina BookStore. Faktur ini sah tanpa tanda tangan fisik.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto flex justify-center mt-12 no-print">
         <Button size="lg" className="px-12" onClick={handlePrint}>Cetak Invoice (PDF)</Button>
      </div>
    </div>
  );
};

export default BuyerInvoice;
