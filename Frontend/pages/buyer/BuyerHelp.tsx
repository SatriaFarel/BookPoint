import React from 'react';

const BuyerHelp: React.FC = () => {
  const faqs = [
    { 
      q: 'Bagaimana cara membeli produk?', 
      a: 'Pilih buku yang ingin dibeli, klik tombol Beli Sekarang atau Tambah ke Keranjang, lalu lanjutkan ke proses checkout dan lakukan pembayaran.' 
    },
    { 
      q: 'Bagaimana cara melakukan pembayaran?', 
      a: 'Setelah checkout, pilih metode pembayaran yang tersedia dan ikuti instruksi yang diberikan hingga pembayaran berhasil.' 
    },
    { 
      q: 'Bagaimana cara melacak pesanan saya?', 
      a: 'Masuk ke menu Pesanan Saya, pilih pesanan yang ingin dilihat, dan Anda dapat melihat status serta nomor resi pengiriman.' 
    },
    { 
      q: 'Apa yang harus dilakukan jika barang tidak sesuai?', 
      a: 'Anda dapat mengajukan komplain melalui menu Pesanan Saya dengan menyertakan bukti foto dalam waktu maksimal 1x24 jam setelah barang diterima.' 
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900">Bantuan & Panduan Pembeli</h1>
        <p className="text-slate-500 mt-2">
          Temukan jawaban atas pertanyaan Anda mengenai proses pembelian di platform Lumina.
        </p>
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
        <p className="opacity-90 mb-6">
          Hubungi Customer Service kami yang siap membantu Anda terkait pesanan dan pembayaran.
        </p>
        <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-bold hover:bg-slate-50 transition-colors">
          Chat Support
        </button>
      </div>
    </div>
  );
};

export default BuyerHelp;
