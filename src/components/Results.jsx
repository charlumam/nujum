import React, { useState, useMemo } from 'react';

// Accept totalEligible prop
export default function Results({ universities, totalEligible }) {
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' for Low to High, 'desc' for High to Low
  const [filterUniName, setFilterUniName] = useState('');
  const [filterCity, setFilterCity] = useState('');

  // flatten all university-program entries, filter, and sort based on state
  const items = useMemo(() => {
    let flatItems = (universities || []).flatMap(u =>
      (u.prodi || []).map(p => ({
        uniName: u.name,
        city: u.city, // Include city
        nama: p.nama,
        admissionRate: p.admissionRate // Include admissionRate
      }))
    );

    // Apply filters
    if (filterUniName) {
      flatItems = flatItems.filter(item =>
        item.uniName.toLowerCase().includes(filterUniName.toLowerCase())
      );
    }
    if (filterCity) {
      flatItems = flatItems.filter(item =>
        item.city?.toLowerCase().includes(filterCity.toLowerCase()) // Use optional chaining for city
      );
    }

    // Sort based on sortOrder state
    flatItems.sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.admissionRate - b.admissionRate; // Low to High (most competitive first)
      } else {
        return b.admissionRate - a.admissionRate; // High to Low (least competitive first)
      }
    });
    return flatItems;
  }, [universities, sortOrder, filterUniName, filterCity]); // Recalculate when data or filters change

  // Calculate total based on filtered items
  const total = items.length;
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);

  // Reset page index when filters change
  React.useEffect(() => {
    setPageIndex(0);
  }, [filterUniName, filterCity, pageSize]);

  const start = pageIndex * pageSize;
  const end = Math.min(start + pageSize, total);
  const displayed = items.slice(start, end);

  if (universities === null) return null; // Don't render if initial state

  if (!items.length && (filterUniName || filterCity)) {
    return (
      <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded-lg shadow-lg text-center text-gray-600">
        <p className="text-lg">Tidak ada hasil yang cocok dengan filter Anda.</p>
      </div>
    );
  }

  if (!items.length && !filterUniName && !filterCity) {
    return (
      <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded-lg shadow-lg text-center text-gray-600">
        <p className="text-lg">Belum ada program studi yang sesuai dengan skor Anda.</p>
      </div>
    );
  }


  return (
    <div className="max-w-4xl mx-auto mt-6 space-y-3">
      {/* Filter Row */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
        <input
          type="text"
          placeholder="Filter Nama Universitas..."
          value={filterUniName}
          onChange={e => setFilterUniName(e.target.value)}
          className="border rounded px-3 py-1.5 flex-grow"
        />
        <input
          type="text"
          placeholder="Filter Kab/Kota..."
          value={filterCity}
          onChange={e => setFilterCity(e.target.value)}
          className="border rounded px-3 py-1.5 flex-grow"
        />
      </div>

      {/* Control Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
        {/* Left side: Page Size & Total */}
        <div className="flex items-center gap-2">
           <label className="text-gray-700 flex items-center gap-1">
            Tampilkan
            <select
              value={pageSize}
              onChange={e => {
                const newSize = Number(e.target.value);
                setPageSize(newSize);
                // setPageIndex(0); // Handled by useEffect
              }}
              className="border rounded px-2 py-1"
            >
              {[10, 50, 100, total > 100 ? total : null].filter(Boolean).map(n => ( // Only show 'Semua' if total > 100
                <option key={n} value={n}>
                  {n === total ? 'Semua' : n}
                </option>
              ))}
            </select>
            hasil
          </label>
        </div>

        {/* Right side: Sort */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
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

          {/* Pagination Info Removed from here */}
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {displayed.map((item, idx) => {
          const admissionPercentage = item.admissionRate * 100;
          let textColorClass = 'text-green-600';
          if (admissionPercentage <= 10) {
            textColorClass = 'text-red-600';
          } else if (admissionPercentage <= 30) {
            textColorClass = 'text-orange-500';
          }

          return (
            <div
              key={start + idx} // Use index relative to the full filtered list if possible, or ensure unique key
              className="bg-white rounded-lg p-4 shadow-md hover:shadow-xl transition-shadow relative"
            >
              <h3 className="font-semibold text-indigo-600">{item.uniName}</h3>
              <p className="text-sm text-gray-500 mb-1">{item.city}</p> {/* Display City */}
              <p className="text-gray-700 mt-1 mb-2">{item.nama}</p>
              <div className="absolute bottom-2 right-2 text-right">
                <span className="text-xs font-medium text-gray-500">Tingkat Penerimaan:</span>
                <span className={`text-xs font-bold ${textColorClass} ml-1`}>
                  {admissionPercentage.toFixed(2)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
       {/* Pagination Buttons (Bottom) */}
       {total > pageSize && (
         <div className="flex justify-center items-center gap-2 mt-4">
            {pageIndex > 0 && (
              <button
                onClick={() => setPageIndex(prev => prev - 1)}
                className="bg-gray-300 text-gray-700 px-3 py-1.5 rounded font-semibold hover:bg-gray-400"
              >
                &lt; Sebelumnya
              </button>
            )}
             <span className="text-gray-600 text-sm">
              Halaman {pageIndex + 1} dari {Math.ceil(total / pageSize)}
            </span>
            {end < total && (
              <button
                onClick={() => setPageIndex(prev => prev + 1)}
                className="bg-indigo-600 text-white px-3 py-1.5 rounded font-semibold hover:bg-indigo-700"
              >
                Berikutnya &gt;
              </button>
            )}
          </div>
       )}
    </div>
  );
}