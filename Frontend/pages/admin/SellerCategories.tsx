
import React from 'react';
import { DUMMY_CATEGORIES } from '../../constants';
import { Button } from '../../components/Button';

const SellerCategories: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Manajemen Kategori</h1>
        <Button variant="secondary">+ Tambah Kategori</Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
            <tr>
              <th className="px-6 py-4">No</th>
              <th className="px-6 py-4">Nama Kategori</th>
              <th className="px-6 py-4">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {DUMMY_CATEGORIES.map((cat, idx) => (
              <tr key={cat.id} className="hover:bg-slate-50/50">
                <td className="px-6 py-4 text-slate-500">{idx + 1}</td>
                <td className="px-6 py-4 font-medium text-slate-900">{cat.name}</td>
                <td className="px-6 py-4 flex gap-4">
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Edit</button>
                  <button className="text-red-600 hover:text-red-800 text-sm font-medium">Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SellerCategories;
