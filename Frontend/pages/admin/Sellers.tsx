import { useEffect, useState, FormEvent } from "react";
import { Badge } from "../../components/Badge";
import { Button } from "../../components/Button";
import { Seller } from "../../types";

const API = "http://127.0.0.1:8000/api/seller";

const SellerPage = () => {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);

  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const showAlert = (type: "success" | "error", message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 3000);
  };

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const [nik, setNIK] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [alamat, setAlamat] = useState("");
  const [password, setPassword] = useState("");
  const [no_rekening, setNoRekening] = useState("");

  const [foto, setFoto] = useState<File | null>(null);
  const [qris, setQris] = useState<File | null>(null);
  const [previewFoto, setPreviewFoto] = useState<string | null>(null);
  const [previewQris, setPreviewQris] = useState<string | null>(null);

  const [showDetail, setShowDetail] = useState(false);
  const [detailSeller, setDetailSeller] = useState<any>(null);

  /* ================= FETCH ================= */
  const fetchSeller = async () => {
    try {
      const res = await fetch(API, { headers: { Accept: "application/json" } });
      const data = await res.json();
      setSellers(data);
    } catch {
      showAlert("error", "Gagal mengambil data seller");
    } finally {
      setLoading(false);
    }
  };

  const fetchSellerDetail = async (id: number) => {
    try {
      setDetailSeller(null);
      setShowDetail(true);
      const res = await fetch(`${API}/detail/${id}`, {
        headers: { Accept: "application/json" },
      });
      const data = await res.json();
      setDetailSeller(data);
    } catch {
      showAlert("error", "Gagal mengambil detail seller");
    }
  };

  useEffect(() => {
    fetchSeller();
  }, []);

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const url = editId ? `${API}/${editId}` : API;
    const formData = new FormData();

    formData.append("nik", nik);
    formData.append("name", name);
    formData.append("email", email);
    formData.append("alamat", alamat);
    formData.append("no_rekening", no_rekening);

    formData.append("password", password);
    if (foto) formData.append("foto", foto);
    if (qris) formData.append("qris", qris);
    if (editId) formData.append("_method", "PUT");

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal menyimpan data");

      showAlert(
        "success",
        editId ? "Seller berhasil diupdate" : "Seller berhasil ditambahkan",
      );
      closeForm();
      fetchSeller();
    } catch (err: any) {
      showAlert("error", err.message);
    }
  };

  /* ================= ACTION ================= */
  const openCreate = () => {
    resetForm();
    setShowForm(true);
  };

  const openEdit = (s: Seller) => {
    setEditId(s.id);
    setNIK(s.nik);
    setName(s.name);
    setEmail(s.email);
    setAlamat(s.alamat);
    setPassword(s.password);
    setNoRekening(s.no_rekening || "");
    setPreviewFoto(s.foto ? `http://127.0.0.1:8000/storage/${s.foto}` : null);
    setPreviewQris(s.qris ? `http://127.0.0.1:8000/storage/${s.qris}` : null);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    resetForm();
  };

  const resetForm = () => {
    setEditId(null);
    setNIK("");
    setName("");
    setEmail("");
    setAlamat("");
    setPassword("");
    setNoRekening("");
    setFoto(null);
    setQris(null);
    setPreviewFoto(null);
    setPreviewQris(null);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus seller ini?")) return;
    try {
      await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: { Accept: "application/json" },
      });
      showAlert("success", "Seller berhasil dihapus");
      fetchSeller();
    } catch {
      showAlert("error", "Gagal menghapus seller");
    }
  };

  return (
    <div className="space-y-6">
      {alert && (
        <div
          className={`fixed top-20 right-5 z-50 px-4 py-3 rounded-xl text-white
          ${alert.type === "success" ? "bg-emerald-500" : "bg-red-500"}`}
        >
          {alert.message}
        </div>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-slate-800">Manajemen Seller</h2>
        <Button size="sm" onClick={openCreate}>
          + Tambah Seller
        </Button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sellers.map((s) => (
            <div
              key={s.id}
              onClick={() => fetchSellerDetail(s.id)}
              className="cursor-pointer bg-white border border-slate-200 rounded-2xl p-5
              shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <img
                  src={
                    s.foto
                      ? `http://127.0.0.1:8000/storage/${s.foto}`
                      : "https://ui-avatars.com/api/?name=Seller"
                  }
                  className="w-14 h-14 rounded-xl object-cover border"
                />

                <div className="flex-1">
                  <h3 className="font-semibold">{s.name}</h3>
                  <p className="text-xs text-slate-500">{s.email}</p>
                  <p className="text-xs text-slate-500">
                    Rek: {s.no_rekening ?? "-"}
                  </p>
                </div>

                <Badge variant={s.is_active ? "success" : "danger"}>
                  {s.is_active ? "ACTIVE" : "INACTIVE"}
                </Badge>
              </div>

              <div className="mt-3">
                <Badge variant={s.is_online ? "success" : "secondary"}>
                  {s.is_online ? "ONLINE" : "OFFLINE"}
                </Badge>
              </div>

              <div className="mt-4 flex gap-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openEdit(s);
                  }}
                  className="text-sm text-indigo-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(s.id);
                  }}
                  className="text-sm text-red-600 hover:underline"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= FORM ================= */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={closeForm} />

          <form
            onSubmit={handleSubmit}
            className="relative bg-white rounded-2xl w-full max-w-md
            max-h-[85vh] overflow-y-auto p-6 space-y-4"
          >
            <h3 className="font-bold">
              {editId ? "Edit Seller" : "Tambah Seller"}
            </h3>

            {[
              ["NIK", nik, setNIK, false],
              ["Nama Seller", name, setName, false],
              ["Email", email, setEmail, false],
            ].map(([label, value, setter, disabled]: any) => (
              <div key={label}>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  {label}
                </label>
                <input
                  disabled={disabled}
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  className="w-full rounded-xl border px-4 py-2 text-sm"
                />
              </div>
            ))}

           
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border px-4 py-2 text-sm"
                />
              </div>
            

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Alamat
              </label>
              <textarea
                value={alamat}
                onChange={(e) => setAlamat(e.target.value)}
                className="w-full rounded-xl border px-4 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                No Rekening
              </label>
              <input
                value={no_rekening}
                onChange={(e) => setNoRekening(e.target.value)}
                className="w-full rounded-xl border px-4 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Foto Profile
              </label>
              {previewFoto && (
                <img
                  src={previewFoto}
                  className="w-20 h-20 rounded-xl object-cover mb-2"
                />
              )}
              <input type="file" onChange={(e) => setFoto(e.target.files?.[0] || null)} />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                QRIS
              </label>
              {previewQris && (
                <img
                  src={previewQris}
                  className="w-20 h-20 rounded-xl object-cover mb-2"
                />
              )}
              <input type="file" onChange={(e) => setQris(e.target.files?.[0] || null)} />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button type="button" onClick={closeForm} className="text-sm">
                Batal
              </button>
              <Button size="sm" type="submit">
                Simpan
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* ================= DETAIL SELLER ================= */}
      {showDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="relative bg-white rounded-3xl w-full max-w-3xl p-8 shadow-2xl">
            {!detailSeller ? (
              <p>Loading...</p>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-xl">{detailSeller.name}</h3>
                  <button onClick={() => setShowDetail(false)}>✕</button>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <Stat label="Produk" value={detailSeller.total_produk} />
                  <Stat label="Terjual" value={detailSeller.total_terjual} />
                  <Stat
                    label="Pendapatan"
                    value={`Rp ${detailSeller.total_pendapatan}`}
                  />
                </div>

                <ul className="space-y-2 max-h-64 overflow-y-auto">
                  {detailSeller.products?.map((p: any) => (
                    <li
                      key={p.id}
                      className="flex justify-between text-sm border-b pb-2"
                    >
                      <span>{p.name}</span>
                      <span className="text-slate-500">
                        {p.terjual} terjual
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const Stat = ({ label, value }: any) => (
  <div className="bg-slate-100 rounded-xl p-4 text-center">
    <p className="text-xs text-slate-500">{label}</p>
    <p className="font-bold text-lg">{value}</p>
  </div>
);

export default SellerPage;
