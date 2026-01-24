import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, OrderStatus } from '../../types';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';

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
};

const BuyerTransactions: React.FC<BuyerTransactionsProps> = ({ user }) => {
  const API = 'http://127.0.0.1:8000/api';
  const navigate = useNavigate();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  /* ===== LOAD TRANSACTIONS ===== */
  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API}/orders?customer_id=${user.id}`);
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch {
      alert('Gagal mengambil transaksi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  /* ===== START CHAT WITH SELLER ===== */
  const startChat = async (sellerId: number) => {
    try {
      const res = await fetch(`${API}/chats`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyer_id: user.id,
          seller_id: sellerId,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }

      const chat = await res.json();

      // ⬇️ PINDAH KE MENU CHAT TANPA RELOAD
      navigate(`/buyer/chat/${chat.id}`);
    } catch (err) {
      console.error(err);
      alert('Gagal memulai chat');
    }
  };

  if (loading) {
    return <p className="p-6 text-slate-500">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* NAVBAR */}
      <nav className="bg-white border-b sticky top-0 z-20 px-4 py-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <Link to="/buyer" className="text-xl font-bold">Lumina</Link>
          <div className="flex gap-6">
            <Link to="/buyer" className="text-slate-500">Store</Link>
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
          {orders.map(order => (
            <div
              key={order.id}
              className="bg-white p-6 rounded-xl border flex flex-col md:flex-row justify-between gap-6"
            >
              {/* INFO */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm text-slate-400">
                    #{order.id}
                  </span>
                  <Badge
                    variant={
                      order.status === OrderStatus.APPROVED
                        ? 'success'
                        : order.status === OrderStatus.PENDING
                        ? 'warning'
                        : 'danger'
                    }
                  >
                    {order.status}
                  </Badge>
                </div>

                <h3 className="font-bold">
                  {order.items.map(i => i.name).join(', ')}
                </h3>

                <p className="text-xs text-slate-400">
                  {order.created_at} • Rp {order.total_price.toLocaleString()}
                </p>
              </div>

              {/* ACTION */}
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => startChat(order.seller_id)}
                >
                  Chat Penjual
                </Button>

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
