import React, { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';
import { Button } from '../../components/Button';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/* ================= EXPEDITION DUMMY ================= */
const expeditions = [
  {
    code: 'JNE',
    name: 'JNE Express',
    prefix: 'JNE',
    website: 'https://www.jne.co.id',
  },
  {
    code: 'JNT',
    name: 'J&T Express',
    prefix: 'JNT',
    website: 'https://www.jet.co.id',
  },
  {
    code: 'SICEPAT',
    name: 'SiCepat',
    prefix: 'SCP',
    website: 'https://www.sicepat.com',
  },
];

/* ================= HELPER ================= */
const generateResi = (prefix: string) => {
  const random = Math.floor(100000000 + Math.random() * 900000000);
  return `${prefix}-${random}`;
};

const SellerReports: React.FC = () => {
  const seller = JSON.parse(localStorage.getItem('user') || '{}');
  const API = `http://127.0.0.1:8000/api/seller/reports/${seller.id}`;

  const [chartData, setChartData] = useState<any[]>([]);
  const [tableData, setTableData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  /* ===== MODAL STATE ===== */
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [selectedExpedition, setSelectedExpedition] = useState<any>(null);
  const [generatedResi, setGeneratedResi] = useState('');

  useEffect(() => {
    if (!seller.id) return;

    fetch(API)
      .then(res => res.json())
      .then(data => {
        setChartData(data.chart || []);
        setTableData(data.table || []);
      })
      .finally(() => setLoading(false));
  }, []);

  /* ================= PDF ================= */
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text('Laporan Penjualan', 14, 16);

    autoTable(doc, {
      startY: 22,
      head: [['ID', 'Tanggal', 'Total', 'Status']],
      body: tableData.map(r => [
        r.id,
        r.date,
        `Rp ${r.total.toLocaleString()}`,
        r.status,
      ]),
    });

    doc.save('laporan-penjualan.pdf');
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Laporan Penjualan</h1>
        <Button variant="outline" onClick={exportPDF}>
          Download PDF
        </Button>
      </div>

      {/* CHART */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* MARGIN */}
        <div className="bg-white p-6 rounded-xl border">
          <h3 className="font-bold mb-4">Margin Penjualan</h3>
          <div className="h-72">
            <ResponsiveContainer>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line dataKey="margin" stroke="#3b82f6" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PROFIT */}
        <div className="bg-white p-6 rounded-xl border">
          <h3 className="font-bold mb-4">Keuntungan Bersih</h3>
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="profit" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-xs uppercase font-bold">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Tanggal</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {tableData.map(row => (
              <tr key={row.id}>
                <td className="px-6 py-3 font-mono text-xs">{row.id}</td>
                <td className="px-6 py-3">{row.date}</td>
                <td className="px-6 py-3 font-bold">
                  Rp {row.total.toLocaleString()}
                </td>
                <td className="px-6 py-3">{row.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ===== MODAL INPUT RESI ===== */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white w-full max-w-md rounded-xl p-6 space-y-4">

            <h3 className="text-lg font-bold">
              Input Resi Pesanan #{selectedOrder?.id}
            </h3>

            {/* EKSPEDISI */}
            <div>
              <label className="text-sm font-medium">Ekspedisi</label>
              <select
                className="w-full border rounded-lg p-2 mt-1"
                value={selectedExpedition?.code || ''}
                onChange={e => {
                  const exp = expeditions.find(x => x.code === e.target.value);
                  setSelectedExpedition(exp);
                  if (exp) {
                    setGeneratedResi(generateResi(exp.prefix));
                  }
                }}
              >
                <option value="">-- Pilih Ekspedisi --</option>
                {expeditions.map(exp => (
                  <option key={exp.code} value={exp.code}>
                    {exp.name}
                  </option>
                ))}
              </select>
            </div>

            {/* RESI */}
            {generatedResi && (
              <div>
                <label className="text-sm font-medium">Nomor Resi</label>
                <input
                  value={generatedResi}
                  readOnly
                  className="w-full border rounded-lg p-2 mt-1 bg-slate-100"
                />
              </div>
            )}

            {/* LINK EKSPEDISI */}
            {selectedExpedition && (
              <a
                href={selectedExpedition.website}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-blue-600 underline"
              >
                Kunjungi website {selectedExpedition.name}
              </a>
            )}

            {/* ACTION */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowModal(false)}
              >
                Batal
              </Button>
              <Button
                disabled={!generatedResi}
                onClick={() => {
                  alert(`Resi ${generatedResi} berhasil disimpan (dummy)`);
                  setShowModal(false);
                }}
              >
                Simpan
              </Button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default SellerReports;
