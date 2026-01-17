import React, { useEffect, useState } from 'react';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Customer, Seller } from '../../types';



const SuperAdminDashboard: React.FC = () => {
  /**
   * STATE
   * sellers  : data penjual dari backend
   * buyers   : sementara kosong (belum ada API)
   * loading  : status loading data
   */
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  /**
   * FETCH DATA SELLER DARI LARAVEL
   * Jalan sekali saat component pertama kali render
   */
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/seller')
      .then(res => res.json())
      .then(data => {
        setSellers(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Gagal ambil seller:', err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/customer')
      .then(res => res.json())
      .then(data => {
        setCustomers(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Gagal ambil seller:', err);
        setLoading(false);
      });
  }, []);

  /**
   * HAPUS SELLER
   */
  const handleDeleteSeller = (id: number) => {
    if (!confirm('Yakin mau hapus seller ini?')) return;

    fetch(`http://127.0.0.1:8000/api/seller/${id}`, {
      method: 'DELETE',
    }).then(() => {
      setSellers(prev => prev.filter(s => s.id !== id));
    });
  };

  return (
    <div className="space-y-8">
      {/* ================= SUMMARY CARD ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">
              Total Penjual
            </p>
            <h3 className="text-3xl font-bold text-slate-900 mt-1">
              {sellers.length}
            </h3>
          </div>
          <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-2xl">
            🏪
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">
              Total Pembeli
            </p>
            <h3 className="text-3xl font-bold text-slate-900 mt-1">
              {customers.length}
            </h3>
          </div>
          <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center text-2xl">
            👤
          </div>
        </div>
      </div>

      {/* ================= SELLER TABLE ================= */}
      <section className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-900">Manajemen Penjual</h2>
          <Button size="sm" variant="secondary">+ Tambah Penjual</Button>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <p className="p-6 text-slate-500">Loading data...</p>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
                <tr>
                  <th className="px-6 py-4">Nama Toko</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Aksi</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {sellers.map(seller => (
                  <tr key={seller.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {seller.name}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {seller.email}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={seller.is_active ? 'success' : 'danger'}>
                        {seller.is_active ? 'ACTIVE' : 'INACTIVE'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <button className="text-blue-600 hover:underline text-sm font-medium">
                        Edit
                      </button>
                      <button
                        className="text-red-600 hover:underline text-sm font-medium"
                        onClick={() => handleDeleteSeller(seller.id)}
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
};

export default SuperAdminDashboard;
