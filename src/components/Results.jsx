import React, { useState, useMemo } from 'react';

export default function Results({ universities }) {
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' for Low to High, 'desc' for High to Low

  // flatten all university-program entries and sort based on sortOrder
  const items = useMemo(() => {
    const flatItems = (universities || []).flatMap(u =>
      (u.prodi || []).map(p => ({
        uniName: u.name,
        nama: p.nama,
        admissionRate: p.admissionRate // Include admissionRate
      }))
    );

    // Sort based on sortOrder state
    flatItems.sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.admissionRate - b.admissionRate; // Low to High (most competitive first)
      } else {
        return b.admissionRate - a.admissionRate; // High to Low (least competitive first)
      }
    });
    return flatItems;
  }, [universities, sortOrder]); // Recalculate when universities or sortOrder change

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
      {/* Control Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        {/* Left side: Total and Page Size */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-gray-700">{total} Total.</span>
          <label className="text-gray-700 flex items-center gap-1">
            Tampilkan
            <select
              value={pageSize}
              onChange={e => {
                const newSize = Number(e.target.value);
                setPageSize(newSize);
                setPageIndex(0);
              }}
              className="border rounded px-2 py-1"
            >
              {[10, 50, 100, total].map(n => (
                <option key={n} value={n}>
                  {n === total ? 'Semua' : n}
                </option>
              ))}
            </select>
            hasil
          </label>
        </div>

        {/* Right side: Sort and Pagination */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {/* Sort Dropdown */}
          <label className="text-gray-700 flex items-center gap-1">
            Tingkat Penerimaan
            <select
              value={sortOrder}
              onChange={e => setSortOrder(e.target.value)}
              className="border rounded px-2 py-1"
            >
              <option value="asc">Rendah ke Tinggi</option>
              <option value="desc">Tinggi ke Rendah</option>
            </select>
          </label>

          {/* Pagination Buttons */}
          <div className="flex items-center gap-2">
            {pageIndex > 0 && (
              <button
                onClick={() => setPageIndex(prev => prev - 1)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded font-black hover:bg-gray-400"
              >
                &lt;
              </button>
            )}
            {end < total && (
              <button
                onClick={() => setPageIndex(prev => prev + 1)}
                className="bg-indigo-600 text-white px-4 py-2 rounded font-black hover:bg-indigo-700"
              >
                &gt;
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {displayed.map((item, idx) => {
          // Calculate admission rate percentage
          const admissionPercentage = item.admissionRate * 100;

          // Determine color based on admission rate
          let textColorClass = 'text-green-600'; // Default to green
          if (admissionPercentage <= 10) {
            textColorClass = 'text-red-600'; // Red for very competitive
          } else if (admissionPercentage <= 30) {
            textColorClass = 'text-orange-500'; // Orange for moderately competitive
          }

          return (
            <div
              key={start + idx}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-shadow relative" // Add relative positioning
            >
              <h3 className="text-lg font-semibold text-indigo-600">{item.uniName}</h3>
              <p className="text-gray-700 mt-2 mb-4">{item.nama}</p> {/* Add margin-bottom */}
              {/* Display Admission Rate */}
              <div className="absolute bottom-2 right-3 text-right"> {/* Position bottom right */}
                <span className="text-sm font-medium text-gray-500">Tingkat Penerimaan:</span>
                {/* Apply dynamic text color */}
                <span className={`text-sm font-bold ${textColorClass} ml-1`}>
                  {admissionPercentage.toFixed(2)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}