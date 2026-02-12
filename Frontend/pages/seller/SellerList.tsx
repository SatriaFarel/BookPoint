import React, { useEffect, useState } from "react";

const API = "http://127.0.0.1:8000/api";

type Seller = {
  id: number;
  name: string;
  foto: string | null;
  alamat: string;
};

const getSellerId = (): number | null => {
  const raw = localStorage.getItem("user");
  if (!raw) return null;

  try {
    const user = JSON.parse(raw);
    return user?.id ?? null;
  } catch {
    return null;
  }
};

const SellerList: React.FC = () => {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);

  const myId = getSellerId();

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const res = await fetch(
          `${API}/seller/list?id=${myId}`
        );
        const data = await res.json();
        setSellers(Array.isArray(data) ? data : []);
      } catch {
        setSellers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSellers();
  }, [myId]);

  if (loading) return <p className="text-slate-500">Loading...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Daftar Seller</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {sellers.map(seller => (
          <div
            key={seller.id}
            className="bg-white rounded-xl border overflow-hidden
                       transition-all hover:-translate-y-1 hover:shadow-xl"
          >
            <img
              src={
                seller.foto
                  ? `http://127.0.0.1:8000/storage/${seller.foto}`
                  : "/images/placeholder.png"
              }
              className="w-full h-48 object-cover"
            />

            <div className="p-4 space-y-2">
              <h3 className="font-semibold">{seller.name}</h3>
              <p className="text-sm text-slate-500">
                {seller.alamat}
              </p>
            </div>
          </div>
        ))}

        {sellers.length === 0 && (
          <p className="text-slate-400 col-span-full">
            Tidak ada seller lain.
          </p>
        )}
      </div>
    </div>
  );
};

export default SellerList;
