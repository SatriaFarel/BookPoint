import React, { useEffect, useState } from 'react';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';

/* ================= TYPE ================= */
type OrderStatus = 'diperiksa' | 'disetujui' | 'dikirim' | 'ditolak' | 'selesai';

type Order = {
  id: number;
  buyer_name: string;
  product_name: string;
  quantity: number;
  total_price: number;
  status: OrderStatus;
  proof: string;
  resi?: string;
  expedition?: string;
};

/* ================= EXPEDISI DUMMY ================= */
const expeditions = [
  { code: 'JNE', name: 'JNE Express' },
  { code: 'JNT', name: 'J&T Express' },
  { code: 'SICEPAT', name: 'SiCepat' },
];

const generateResi = (prefix: string) =>
  `${prefix}-${Math.floor(100000000 + Math.random() * 900000000)}`;

const SellerOrders: React.FC = () => {
  const seller = JSON.parse(localStorage.getItem('user') || '{}');
  const API = 'http://127.0.0.1:8000/api';

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // ===== PAGINATION =====
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  /* ===== MODAL ===== */
  const [previewProof, setPreviewProof] = useState<string | null>(null);
  const [showResiModal, setShowResiModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedExpedition, setSelectedExpedition] = useState('');
  const [resi, setResi] = useState('');

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 3000);
  };

  /* ================= FETCH ================= */
  const fetchOrders = async (pageNumber = 1) => {
    try {
      const res = await fetch(
        `${API}/seller/orders/${seller.id}?page=${pageNumber}`
      );
      const data = await res.json();

      setOrders(data.data || []);
      setPage(data.current_page);
      setLastPage(data.last_page);
    } catch {
      showAlert('error', 'Gagal mengambil pesanan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!seller.id) return;

    // fetch awal data
    fetchOrders();

    // trigger auto update tiap 1 menit
    const intervalId = setInterval(() => {
      fetch('http://127.0.0.1:8000/api/update-orders', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
      }).catch(() => {
        // diamkan saja, ini background task
      });
    }, 10000); // 10 detik

    return () => clearInterval(intervalId);
  }, [seller.id]);

  /* ================= ACTION ================= */
  const handleApprove = async (id: number) => {
    try {
      const res = await fetch(`${API}/seller/orders/${id}/approve`, {
        method: 'PATCH',
        headers: { Accept: 'application/json' },
      });
      const data = await res.json();
      if (!res.ok) return showAlert('error', data.message || 'Gagal menyetujui');

      showAlert('success', 'Pesanan disetujui, silakan input resi');
      fetchOrders(page);
    } catch {
      showAlert('error', 'Server error');
    }
  };

  const handleReject = async (id: number) => {
    if (!confirm('Yakin menolak pesanan ini?')) return;

    try {
      const res = await fetch(`${API}/seller/orders/${id}/reject`, {
        method: 'PATCH',
        headers: { Accept: 'application/json' },
      });
      const data = await res.json();
      if (!res.ok) return showAlert('error', data.message || 'Gagal menolak');

      showAlert('error', 'Pesanan ditolak');
      fetchOrders(page);
    } catch {
      showAlert('error', 'Server error');
    }
  };

  /* ================= RESI ================= */
  const openResiModal = (order: Order) => {
    setSelectedOrder(order);
    setSelectedExpedition('');
    setResi('');
    setShowResiModal(true);
  };

  const saveResi = async () => {
    if (!selectedOrder || !selectedExpedition) return;

    try {
      const res = await fetch(`${API}/seller/orders/${selectedOrder.id}/resi`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          expedition: selectedExpedition,
          resi,
        }),
      });

      const data = await res.json();
      if (!res.ok) return showAlert('error', data.message || 'Gagal simpan resi');

      showAlert('success', 'Resi berhasil disimpan');
      setShowResiModal(false);
      fetchOrders(page);
    } catch {
      showAlert('error', 'Server error');
    }
  };

  if (loading) return <p className="text-slate-500">Loading...</p>;

  return (
    <div className="space-y-6">

      {/* ALERT */}
      {alert && (
        <div
          className={`fixed top-20 right-5 z-50 px-4 py-3 rounded-xl text-white
          ${alert.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`}
        >
          {alert.message}
        </div>
      )}

      <h1 className="text-2xl font-bold">Kelola Pesanan</h1>

      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-xs uppercase font-bold">
            <tr>
              <th className="px-6 py-4">No</th>
              <th className="px-6 py-4">Pembeli</th>
              <th className="px-6 py-4">Produk</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4">Bukti</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Aksi</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {orders.map((order, index) => (
              <tr key={order.id}>
                <td className="px-6 py-4 text-xs font-mono">
                  {(page - 1) * 10 + index + 1}
                </td>

                <td className="px-6 py-4">{order.buyer_name}</td>

                <td className="px-6 py-4 text-sm">
                  {order.product_name} (x{order.quantity})
                </td>

                <td className="px-6 py-4 font-bold">
                  Rp {order.total_price.toLocaleString()}
                </td>

                <td className="px-6 py-4">
                  <button
                    onClick={() =>
                      setPreviewProof(`http://127.0.0.1:8000/storage/${order.proof}`)
                    }
                    className="text-blue-600 text-xs font-bold"
                  >
                    Lihat
                  </button>
                </td>

                <td className="px-6 py-4">
                  <Badge
                    variant={
                      order.status === 'approved'
                        ? 'warning'
                        : order.status === 'dikirim'
                          ? 'success'
                          : order.status === 'rejected'
                            ? 'danger'
                            : 'info'
                    }
                  >
                    {order.status}
                  </Badge>
                </td>

                <td className="px-6 py-4">
                  {order.status === 'diperiksa' && (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleApprove(order.id)}>
                        Setujui
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => handleReject(order.id)}>
                        Tolak
                      </Button>
                    </div>
                  )}

                  {order.status === 'disetujui' && (
                    <Button size="sm" onClick={() => openResiModal(order)}>
                      Input Resi
                    </Button>
                  )}

                  {order.status === 'dikirim' && (
                    <span className="text-xs font-bold text-emerald-600">
                      {order.expedition} • {order.resi}
                    </span>
                  )}

                  {order.status === 'ditolak' && (
                    <span className="text-xs text-red-600 font-bold">
                      Refund diproses
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ===== PAGINATION ===== */}
      <div className="flex justify-end items-center gap-3">
        <Button
          size="sm"
          variant="outline"
          disabled={page === 1}
          onClick={() => fetchOrders(page - 1)}
        >
          Prev
        </Button>

        <span className="text-sm font-medium">
          Page {page} / {lastPage}
        </span>

        <Button
          size="sm"
          variant="outline"
          disabled={page === lastPage}
          onClick={() => fetchOrders(page + 1)}
        >
          Next
        </Button>
      </div>

      {/* ===== MODAL BUKTI ===== */}
      {previewProof && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setPreviewProof(null)}
        >
          <div className="bg-white p-4 rounded-xl" onClick={e => e.stopPropagation()}>
            <img src={previewProof} className="max-h-[70vh] object-contain" />
          </div>
        </div>
      )}

      {/* ===== MODAL RESI ===== */}
      {showResiModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md space-y-4">
            <h3 className="font-bold text-lg">
              Input Resi Pesanan #{selectedOrder.id}
            </h3>

            <select
              className="w-full border p-2 rounded"
              value={selectedExpedition}
              onChange={e => {
                setSelectedExpedition(e.target.value);
                setResi(generateResi(e.target.value));
              }}
            >
              <option value="">-- Pilih Ekspedisi --</option>
              {expeditions.map(e => (
                <option key={e.code} value={e.code}>
                  {e.name}
                </option>
              ))}
            </select>

            {resi && (
              <input
                value={resi}
                readOnly
                className="w-full border p-2 rounded bg-slate-100"
              />
            )}

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowResiModal(false)}>
                Batal
              </Button>
              <Button disabled={!resi} onClick={saveResi}>
                Simpan
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerOrders;
