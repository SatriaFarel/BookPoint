
import React from 'react';

const SellerHelp: React.FC = () => {
  const faqs = [
    { q: 'Bagaimana cara upload produk?', a: 'Pergi ke menu Produk, klik tombol Tambah Produk, lalu lengkapi detail buku dan klik simpan.' },
    { q: 'Kapan dana penjualan cair?', a: 'Dana akan diteruskan ke saldo penjual maksimal 1x24 jam setelah pembeli mengkonfirmasi pesanan diterima.' },
    { q: 'Bagaimana cara input resi pengiriman?', a: 'Buka menu Pesanan, cari pesanan yang disetujui, masukkan nomor resi di kolom yang tersedia.' },
    { q: 'Mengapa pesanan saya ditolak?', a: 'Pesanan dapat ditolak jika stok barang habis atau ada masalah dengan bukti pembayaran pembeli.' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900">Bantuan & Panduan</h1>
        <p className="text-slate-500 mt-2">Temukan jawaban atas pertanyaan Anda mengenai penggunaan platform Lumina.</p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center">
              <span className="text-blue-600 mr-2 text-xl font-black">Q:</span> {faq.q}
            </h3>
            <p className="text-slate-600 ml-7 leading-relaxed">
               {faq.a}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-blue-600 p-8 rounded-2xl text-white text-center">
        <h2 className="text-xl font-bold mb-2">Masih butuh bantuan?</h2>
        <p className="opacity-90 mb-6">Hubungi Customer Service kami yang tersedia 24/7 untuk membantu Anda.</p>
        <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-bold hover:bg-slate-50 transition-colors">
          Chat Support
        </button>
      </div>
    </div>
  );
};

export default SellerHelp;
