import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, OrderStatus } from "../../types";
import { Badge } from "../../components/Badge";
import { Button } from "../../components/Button";

interface BuyerTransactionsProps {
  user: User;
}

type OrderItem = {
  name: string;
};

type Order = {
  id: number;
  status: OrderStatus;
  total_price: number;
  created_at: string;
  seller_id: number;
  resi?: string | null;
  items: OrderItem[];

  // TAMBAHAN UNTUK REFUND
  seller_address?: string;
  refund_duration?: string;
};

const BuyerTransactions: React.FC<BuyerTransactionsProps> = ({ user }) => {
  const API = "http://127.0.0.1:8000/api";
  const navigate = useNavigate();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  /* ===== HELPER: BADGE VARIANT ===== */
  const getBadgeVariant = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.APPROVED:
        return "success";
      case OrderStatus.PENDING:
        return "warning";
      case OrderStatus.SHIPPED:
        return "info";
      case OrderStatus.REJECTED:
        return "danger";
      case OrderStatus.DONE:
        return "primary";
      default:
        return "secondary";
    }
  };

  /* ===== LOAD TRANSACTIONS ===== */
  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API}/orders?customer_id=${user.id}`, {
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch {
      alert("Gagal mengambil transaksi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  /* ===== KONFIRMASI TERIMA ===== */
  const confirmReceived = async (orderId: number) => {
    if (!confirm("Yakin pesanan sudah diterima?")) return;

    try {
      const res = await fetch(`${API}/orders/${orderId}/confirm`, {
        method: "POST",
        headers: { Accept: "application/json" },
      });

      if (!res.ok) throw new Error();
      fetchOrders();
    } catch {
      alert("Gagal konfirmasi pesanan");
    }
  };

  const startChat = async (sellerId: number) => {
    if (!user.id || !sellerId) {
      alert("User tidak valid");
      return;
    }

    try {
      const res = await fetch(`${API}/chats`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          buyer_id: user.id,
          seller_id: sellerId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.log(data);
        alert(data.message || "Gagal memulai chat");
        return;
      }

      // pastikan id ada
      if (!data.id) {
        alert("Chat tidak valid");
        return;
      }

      navigate(`/buyer/chat/${data.id}`);
    } catch {
      alert("Server error");
    }
  };

  if (loading) return <p className="p-6 text-slate-500">Loading...</p>;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* NAVBAR */}
      <nav className="bg-white border-b sticky top-0 z-20 px-4 py-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <Link to="/buyer" className="text-xl font-bold">
            BookStore
          </Link>
          <div className="flex gap-6">
            <Link to="/buyer" className="text-slate-500">
              Store
            </Link>
            <Link to="/buyer/transactions" className="text-blue-600 font-bold">
              History
            </Link>
          </div>
        </div>
      </nav>

      {/* CONTENT */}
      <main className="max-w-5xl mx-auto p-4 py-8 space-y-8">
        <h1 className="text-2xl font-bold">Riwayat Transaksi</h1>

        {orders.length === 0 && (
          <p className="text-slate-500">Belum ada transaksi</p>
        )}

        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white p-6 rounded-xl border space-y-4"
            >
              {/* INFO */}
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm text-slate-400">
                      #{order.id}
                    </span>
                    <Badge variant={getBadgeVariant(order.status)}>
                      {order.status}
                    </Badge>
                  </div>

                  <h3 className="font-bold">
                    {order.items.map((i) => i.name).join(", ")}
                  </h3>

                  <p className="text-xs text-slate-400">
                    {order.created_at} • Rp {order.total_price.toLocaleString()}
                  </p>
                </div>

                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => startChat(order.seller_id)}
                >
                  Chat Penjual
                </Button>
              </div>

              {/* KONDISIONAL STATUS */}
              {order.status === OrderStatus.SHIPPED && (
                <div className="bg-blue-50 p-4 rounded-xl flex justify-between items-center">
                  <span className="text-sm text-blue-700">
                    Pesanan sudah dikirim. Silakan konfirmasi jika sudah
                    diterima.
                  </span>
                  <Button size="sm" onClick={() => confirmReceived(order.id)}>
                    Konfirmasi Terima
                  </Button>
                </div>
              )}

              {order.status === OrderStatus.REJECTED && (
                <div className="bg-red-50 p-4 rounded-xl space-y-2">
                  <p className="text-sm text-red-700 font-medium">
                    Pesanan ditolak. Silakan lakukan refund ke toko.
                  </p>
                  <p className="text-sm">
                    <b>Alamat Toko:</b>{" "}
                    {order.seller_address || "Tidak tersedia"}
                  </p>
                  <p className="text-sm">
                    <b>Estimasi Refund:</b>{" "}
                    {order.refund_duration || "3–5 hari kerja"}
                  </p>
                </div>
              )}

              <div className="flex justify-end">
                <Link to={`/buyer/invoice/${order.id}`}>
                  <Button size="sm" variant="outline">
                    Invoice
                  </Button>
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
