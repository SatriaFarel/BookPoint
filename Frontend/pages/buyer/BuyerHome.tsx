
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { DUMMY_BOOKS } from '../../constants';
import { User } from '../../types';
import { Button } from '../../components/Button';

interface BuyerHomeProps {
  user: User;
  onLogout: () => void;
}

const BuyerHome: React.FC<BuyerHomeProps> = ({ user, onLogout }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBooks = DUMMY_BOOKS.filter(b => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Lumina</h1>
              <div className="hidden md:flex gap-6">
                 <Link to="/buyer" className="text-blue-600 font-bold">Store</Link>
                 <Link to="/buyer/transactions" className="text-slate-500 hover:text-slate-900 font-medium">History</Link>
              </div>
            </div>
            
            <div className="flex-1 max-w-md mx-8 hidden sm:block">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Cari judul buku atau kategori..." 
                  className="w-full pl-10 pr-4 py-2 rounded-full border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <span className="absolute left-3 top-2.5 text-slate-400">🔍</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Link to="/buyer/cart" className="relative p-2 text-slate-600 hover:text-slate-900 transition-colors">
                <span className="text-2xl">🛒</span>
                <span className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white font-bold">2</span>
              </Link>
              <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>
              <button onClick={onLogout} className="text-sm font-bold text-slate-500 hover:text-red-600 transition-colors">Logout</button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-12">
          <div className="bg-slate-900 rounded-3xl p-10 flex flex-col md:flex-row items-center justify-between text-white overflow-hidden relative">
            <div className="z-10 relative">
              <h2 className="text-4xl font-extrabold mb-4">Temukan Dunia di Balik Kata.</h2>
              <p className="text-slate-400 text-lg mb-8 max-w-lg">Jelajahi ribuan koleksi buku pilihan terbaik hanya untukmu dengan promo spesial hingga 50%!</p>
              <Button variant="secondary" size="lg">Lihat Promo</Button>
            </div>
            <div className="hidden md:block opacity-20 text-[10rem] select-none pointer-events-none">📚</div>
          </div>
        </header>

        <section>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Koleksi Terbaru</h2>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-500 cursor-pointer hover:border-blue-500 hover:text-blue-500 transition-all">Semua</span>
              <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-500 cursor-pointer hover:border-blue-500 hover:text-blue-500 transition-all">Teknologi</span>
              <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-500 cursor-pointer hover:border-blue-500 hover:text-blue-500 transition-all">Fiksi</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {filteredBooks.map(book => (
              <div key={book.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow group">
                <div className="aspect-[3/4] overflow-hidden bg-slate-200">
                  <img src={book.image} alt={book.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-4">
                  <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">{book.category}</p>
                  <h3 className="font-bold text-slate-900 text-sm mb-2 line-clamp-1">{book.name}</h3>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-sm font-black text-slate-900">Rp {book.price.toLocaleString()}</span>
                    <button className="w-8 h-8 rounded-full bg-slate-100 text-slate-900 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-colors">
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default BuyerHome;
