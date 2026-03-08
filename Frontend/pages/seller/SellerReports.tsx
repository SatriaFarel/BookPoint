import React, { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';
import { Button } from '../../components/Button';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const SellerReports: React.FC = () => {

  const seller = JSON.parse(localStorage.getItem('user') || '{}');
  const API = `http://127.0.0.1:8000/api/seller/reports/${seller.id}`;

  const [chartData, setChartData] = useState<any[]>([]);
  const [tableData, setTableData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [filterMonth, setFilterMonth] = useState('');
  const [filterYear, setFilterYear] = useState('');

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
      head: [['ID','Tanggal','Total','Status']],
      body: tableData.map(r => [
        r.id,
        r.date,
        `Rp ${r.total.toLocaleString()}`,
        r.status
      ])
    });

    doc.save('laporan-penjualan.pdf');
  };

  /* ================= FILTER TABLE ================= */

  const filteredTableData = tableData.filter((row) => {

    const date = new Date(row.date);

    const month = String(date.getMonth()+1).padStart(2,'0');
    const year = String(date.getFullYear());

    if(filterMonth && month !== filterMonth) return false;
    if(filterYear && year !== filterYear) return false;

    return true;

  });

  /* ================= FILTER CHART ================= */

  const filteredChartData = chartData.filter((row) => {

    const year = row.month.slice(0,4);
    const month = row.month.slice(5,7);

    if(filterMonth && month !== filterMonth) return false;
    if(filterYear && year !== filterYear) return false;

    return true;

  });

  if(loading) return <p>Loading...</p>;

  return (

  <div className="space-y-8">

    {/* HEADER */}

    <div className="flex justify-between items-center">

      <h1 className="text-2xl font-bold">
        Laporan Penjualan
      </h1>

      <div className="flex gap-3">

        <Button variant="outline" onClick={exportPDF}>
          Download PDF
        </Button>

        <select
          className="border rounded-lg px-3 py-2 text-sm"
          value={filterMonth}
          onChange={(e)=>setFilterMonth(e.target.value)}
        >
          <option value="">Semua Bulan</option>
          <option value="01">Jan</option>
          <option value="02">Feb</option>
          <option value="03">Mar</option>
          <option value="04">Apr</option>
          <option value="05">Mei</option>
          <option value="06">Jun</option>
          <option value="07">Jul</option>
          <option value="08">Agu</option>
          <option value="09">Sep</option>
          <option value="10">Okt</option>
          <option value="11">Nov</option>
          <option value="12">Des</option>
        </select>

        <select
          className="border rounded-lg px-3 py-2 text-sm"
          value={filterYear}
          onChange={(e)=>setFilterYear(e.target.value)}
        >
          <option value="">Semua Tahun</option>
          <option value="2023">2023</option>
          <option value="2024">2024</option>
          <option value="2025">2025</option>
          <option value="2026">2026</option>
        </select>

      </div>

    </div>

    {/* ================= CHART ================= */}

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

      {/* MARGIN */}

      <div className="bg-white p-6 rounded-xl border">

        <h3 className="font-bold mb-4">
          Margin Penjualan
        </h3>

        <div className="h-72">

          <ResponsiveContainer>

            <LineChart data={filteredChartData}>

              <CartesianGrid strokeDasharray="3 3"/>

              <XAxis dataKey="label"/>

              <YAxis/>

              <Tooltip/>

              <Line
                type="monotone"
                dataKey="margin"
                stroke="#3b82f6"
                strokeWidth={3}
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

      </div>

      {/* PROFIT */}

      <div className="bg-white p-6 rounded-xl border">

        <h3 className="font-bold mb-4">
          Keuntungan Bersih
        </h3>

        <div className="h-72">

          <ResponsiveContainer>

            <BarChart data={filteredChartData}>

              <CartesianGrid strokeDasharray="3 3"/>

              <XAxis dataKey="label"/>

              <YAxis/>

              <Tooltip/>

              <Legend/>

              <Bar
                dataKey="profit"
                fill="#10b981"
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>

    </div>

    {/* ================= TABLE ================= */}

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

          {filteredTableData.map(row => (

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

  </div>

  );
};

export default SellerReports;