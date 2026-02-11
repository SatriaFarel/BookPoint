import React from 'react';

const Help: React.FC = () => {
  const faqs = [
    {
      q: 'Apa tugas utama Super Admin?',
      a: 'Super Admin bertugas mengelola seluruh sistem, termasuk manajemen user, seller, transaksi, dan pengawasan aktivitas platform.'
    },
    {
      q: 'Bagaimana cara mengelola akun seller?',
      a: 'Masuk ke menu Manajemen Seller, lalu Anda dapat melihat detail seller, mengedit data, atau menonaktifkan akun jika diperlukan.'
    },
    {
      q: 'Bagaimana proses verifikasi transaksi?',
      a: 'Super Admin dapat memantau seluruh transaksi melalui menu Transaksi untuk memastikan alur pembayaran dan pengiriman berjalan dengan benar.'
    },
    {
      q: 'Apa yang harus dilakukan jika terjadi sengketa transaksi?',
      a: 'Super Admin dapat meninjau bukti pembayaran, status pesanan, dan riwayat chat untuk mengambil keputusan yang adil.'
    },
    {
      q: 'Bagaimana menangani laporan dari pengguna?',
      a: 'Laporan dapat ditangani melalui menu Laporan dengan meninjau detail masalah dan mengambil tindakan sesuai kebijakan platform.'
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900">
          Bantuan & Panduan Super Admin
        </h1>
        <p className="text-slate-500 mt-2">
          Panduan penggunaan sistem untuk Super Admin dalam mengelola platform Lumina.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-xl shadow-sm border border-slate-100"
          >
            <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center">
              <span className="text-purple-600 mr-2 text-xl font-black">Q:</span>
              {faq.q}
            </h3>
            <p className="text-slate-600 ml-7 leading-relaxed">
              {faq.a}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-purple-600 p-8 rounded-2xl text-white text-center">
        <h2 className="text-xl font-bold mb-2">
          Butuh bantuan lanjutan?
        </h2>
        <p className="opacity-90 mb-6">
          Hubungi tim teknis atau developer untuk penanganan sistem lebih lanjut.
        </p>
        <button className="bg-white text-purple-600 px-8 py-3 rounded-full font-bold hover:bg-slate-50 transition-colors">
          Hubungi Tim Teknis
        </button>
      </div>
    </div>
  );
};

export default Help;
