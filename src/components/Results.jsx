import React, { useState } from 'react';

export default function Results({ universities }) {
  // flatten all university-program entries
  const items = (universities || []).flatMap(u =>
    (u.prodi || []).map(p => ({ uniName: u.name, nama: p.nama }))
  );
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);
  const total = items.length;
  const start = pageIndex * pageSize;
  const end = Math.min(start + pageSize, total);
  const displayed = items.slice(start, end);

  if (!items.length) {
    return (
      <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded-lg shadow-lg text-center text-gray-600">
        <p className="text-lg">Belum ada program studi yang sesuai dengan skor Anda.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-gray-700">
          Tampilkan{' '}
          <select
            value={pageSize}
            onChange={e => { setPageSize(Number(e.target.value)); setPageIndex(0); }}
            className="border rounded px-2 py-1"
          >
            {[10, 20, 50, 100].map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>{' '}
          hasil
        </label>
        {end < total && (
          <button
            onClick={() => setPageIndex(prev => prev + 1)}
            className="bg-indigo-600 text-white px-4 py-2 rounded"
          >
            Next
          </button>
        )}
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {displayed.map((item, idx) => (
          <div
            key={start + idx}
            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-shadow"
          >
            <h3 className="text-lg font-semibold text-indigo-600">{item.uniName}</h3>
            <p className="text-gray-700 mt-2">{item.nama}</p>
          </div>
        ))}
      </div>
    </div>
  );
}