
import React from 'react';
import { DUMMY_BOOKS } from '../../constants';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';

const SellerProducts: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Manajemen Produk</h1>
        <Button variant="secondary">+ Tambah Produk</Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
            <tr>
              <th className="px-6 py-4">Buku</th>
              <th className="px-6 py-4">Kategori</th>
              <th className="px-6 py-4">Harga</th>
              <th className="px-6 py-4">Stok</th>
              <th className="px-6 py-4">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {DUMMY_BOOKS.map((book) => (
              <tr key={book.id} className="hover:bg-slate-50/50">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <img src={book.image} alt={book.name} className="w-10 h-14 object-cover rounded shadow-sm mr-4" />
                    <span className="font-medium text-slate-900">{book.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-600">{book.category}</td>
                <td className="px-6 py-4 font-medium text-slate-900">Rp {book.price.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <Badge variant={book.stock > 0 ? 'success' : 'danger'}>
                    {book.stock > 0 ? `${book.stock} Tersedia` : 'Habis'}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                   <div className="flex gap-4">
                    <button className="text-blue-600 hover:underline text-sm font-medium">Edit</button>
                    <button className="text-red-600 hover:underline text-sm font-medium">Hapus</button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SellerProducts;
