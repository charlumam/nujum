import React, { useState } from 'react';

export default function Results({ universities }) {
  // flatten all university-program entries
  const items = (universities || []).flatMap(u =>
    (u.prodi || []).map(p => ({ uniName: u.name, nama: p.nama }))
  );
  const total = items.length;
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);
  
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
      {/* Apply flex-col on mobile and flex-row on sm screens and up */}
      {/* Add gap for spacing when stacked */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <label className="text-gray-700">
          <span className="font-bold mr-2">{total} Total.</span>Tampilkan{' '}
          <select
            value={pageSize}
            onChange={e => { 
              const newSize = Number(e.target.value);
              setPageSize(newSize);
              // Reset to first page when page size changes
              setPageIndex(0); 
            }}
            className="border rounded px-2 py-1 ml-1 mr-1"
          >
            {[10, 50, 100, total].map(n => (
              <option key={n} value={n}>
                {n === total ? 'Semua' : n}
              </option>
            ))}
          </select>{' '}
          hasil
        </label>
        {/* Add margin-top on mobile, remove on sm screens */}
        <div className="mt-4 sm:mt-0 space-x-2">
          {pageIndex > 0 && (
            <button
              onClick={() => setPageIndex(prev => prev - 1)}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
            >
              &lt;
            </button>
          )}
          {end < total && (
            <button
              onClick={() => setPageIndex(prev => prev + 1)}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              &gt;
            </button>
          )}
        </div>
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