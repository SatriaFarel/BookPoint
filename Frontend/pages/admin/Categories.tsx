import { useEffect, useState, FormEvent } from "react";
import { Category } from "../../types";

const CategoryPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const showAlert = (type: "success" | "error", message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 10000);
  };

  /* ================= FETCH ================= */
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/categories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
        setLoading(false);
      });
  }, []);

  /* ================= CREATE / UPDATE ================= */
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const url = editId
      ? `http://127.0.0.1:8000/api/categories/${editId}`
      : "http://127.0.0.1:8000/api/categories";

    const method = editId ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    })
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Terjadi kesalahan");
        }

        return data;
      })
      .then((data) => {
        if (editId) {
          setCategories((prev) =>
            prev.map((c) => (c.id === editId ? data : c)),
          );
          showAlert("success", "Kategori berhasil diupdate");
        } else {
          setCategories((prev) => [...prev, data]);
          showAlert("success", "Kategori berhasil ditambahkan");
        }

        setName("");
        setEditId(null);
      })
      .catch((err) => {
        showAlert("error", err.message);
      });
  };

  /* ================= DELETE ================= */
  const handleDelete = (id: number) => {
    if (!confirm("Hapus kategori ini?")) return;

    fetch(`http://127.0.0.1:8000/api/categories/${id}`, {
      method: "DELETE",
    })
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Gagal hapus");
        }

        setCategories((prev) => prev.filter((c) => c.id !== id));
        showAlert("success", "Kategori berhasil dihapus");
      })
      .catch((err) => {
        showAlert("error", err.message);
      });
  };

  /* ================= EDIT ================= */
  const handleEdit = (category: Category) => {
    setName(category.name);
    setEditId(category.id);
  };

  return (
    <div className="bg-white rounded-xl border p-6 space-y-6">
      {alert && (
        <div
          className={`fixed top-20 right-5 z-50 px-4 py-3 rounded-xl shadow-lg
          text-white animate-in slide-in-from-top duration-300
          ${alert.type === "success" ? "bg-emerald-500" : "bg-red-500"}`}
        >
          {alert.message}
        </div>
      )}
      <h2 className="text-lg font-bold">Manajemen Kategori</h2>

      {/* ===== FORM ===== */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          placeholder="Nama kategori"
          className="border rounded-lg px-3 py-2 w-full"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 rounded-lg"
        >
          {editId ? "Update" : "Tambah"}
        </button>
      </form>

      {/* ===== TABLE ===== */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-slate-500">
              <th>Nama</th>
              <th className="w-32">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="py-2">{c.name}</td>
                <td className="space-x-2">
                  <button
                    onClick={() => handleEdit(c)}
                    className="text-blue-600 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="text-red-600 text-sm"
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
  );
};

export default CategoryPage;
