import React, { useState, useMemo } from 'react';

// Accept totalEligible prop
export default function Results({ universities, totalEligible }) {
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' for Low to High, 'desc' for High to Low
  const [filterUniName, setFilterUniName] = useState('');
  const [filterCity, setFilterCity] = useState('');
  const [filterProdiName, setFilterProdiName] = useState(''); // Add state for Prodi filter

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
      const keywords = filterUniName.toLowerCase().split(',').map(k => k.trim()).filter(Boolean);
      flatItems = flatItems.filter(item =>
        keywords.every(k => item.uniName.toLowerCase().includes(k))
      );
    }
    if (filterCity) {
      const keywords = filterCity.toLowerCase().split(',').map(k => k.trim()).filter(Boolean);
      flatItems = flatItems.filter(item =>
        keywords.every(k => item.city?.toLowerCase().includes(k))
      );
    }
    if (filterProdiName) {
      const keywords = filterProdiName.toLowerCase().split(',').map(k => k.trim()).filter(Boolean);
      flatItems = flatItems.filter(item =>
        keywords.every(k => item.nama.toLowerCase().includes(k))
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
  }, [universities, sortOrder, filterUniName, filterCity, filterProdiName]); // Add filterProdiName dependency

  // Calculate total based on filtered items
  const total = items.length;
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);

  // Reset page index when filters change
  React.useEffect(() => {
    setPageIndex(0);
  }, [filterUniName, filterCity, filterProdiName, pageSize]); // Add filterProdiName dependency

  const start = pageIndex * pageSize;
  const end = Math.min(start + pageSize, total);
  const displayed = items.slice(start, end);

  if (universities === null) return null; // Don't render if initial state

  // Always render filters and controls if universities data is present
  return (
    <div className="h-full space-y-2 sm:space-y-3">
      {/* Filter Row */}
      <div className="flex flex-col gap-2">
        <input
          type="text"
          placeholder="Filter Nama Universitas..."
          value={filterUniName}
          onChange={e => setFilterUniName(e.target.value)}
          className="border rounded px-2 py-1.5 text-sm"
        />
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Filter Kab/Kota..."
            value={filterCity}
            onChange={e => setFilterCity(e.target.value)}
            className="border rounded px-2 py-1.5 text-sm flex-1"
          />
          <input
            type="text"
            placeholder="Filter Program Studi..."
            value={filterProdiName}
            onChange={e => setFilterProdiName(e.target.value)}
            className="border rounded px-2 py-1.5 text-sm flex-1"
          />
        </div>
      </div>

      {/* Control Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        {/* Left side: Page Size & Total */}
        <div className="flex items-center gap-1">
          <label className="text-gray-700 text-sm flex items-center gap-1">
            Tampilkan
            <select
              value={pageSize}
              onChange={e => {
                const newSize = Number(e.target.value);
                setPageSize(newSize);
              }}
              className="border rounded px-2 py-0.5 text-sm"
            >
              {[10, 25, 50].map(n => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            hasil
          </label>
        </div>

        {/* Right side: Sort */}
        <div className="flex items-center">
          {/* Sort Dropdown */}
          <label className="text-gray-700 text-sm flex items-center gap-1">
            Tingkat Penerimaan
            <select
              value={sortOrder}
              onChange={e => setSortOrder(e.target.value)}
              className="border rounded px-2 py-0.5 text-sm"
            >
              <option value="asc">Rendah ke Tinggi</option>
              <option value="desc">Tinggi ke Rendah</option>
            </select>
          </label>
        </div>
      </div>

      {/* Conditional Rendering for Results or No Results Message */}
      {!items.length ? (
        <div className="max-w-md mx-auto mt-6 p-4 bg-white rounded-lg shadow-lg text-center text-gray-600">
          {filterUniName || filterCity || filterProdiName ? (
            <p className="text-base">Tidak ada hasil yang cocok dengan filter Anda.</p>
          ) : (
            <p className="text-base">Belum ada program studi yang sesuai dengan skor Anda.</p>
          )}
        </div>
      ) : (
        <>
          {/* Results Grid */}
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
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
                  key={start + idx}
                  className="bg-white rounded-lg p-3 shadow-md hover:shadow-lg transition-shadow relative"
                >
                  <h3 className="font-semibold text-indigo-600 text-sm sm:text-base">{item.uniName}</h3>
                  <p className="text-xs text-gray-500">{item.city}</p>
                  <p className="text-xs sm:text-sm text-gray-700 mt-1 mb-6">{item.nama}</p>
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
            <div className="flex justify-center items-center gap-2 mt-3">
              {pageIndex > 0 && (
                <button
                  onClick={() => setPageIndex(prev => prev - 1)}
                  className="bg-gray-300 text-gray-700 px-2 py-1 text-xs sm:text-sm rounded font-semibold hover:bg-gray-400"
                >
                  Sebelumnya
                </button>
              )}
              <span className="text-gray-600 text-xs">
                Halaman {pageIndex + 1} dari {Math.ceil(total / pageSize)}
              </span>
              {end < total && (
                <button
                  onClick={() => setPageIndex(prev => prev + 1)}
                  className="bg-indigo-600 text-white px-2 py-1 text-xs sm:text-sm rounded font-semibold hover:bg-indigo-700"
                >
                  Berikutnya
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}