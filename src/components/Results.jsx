import React, { useState, useMemo } from "react";

// Accept totalEligible prop
export default function Results({ universities, totalEligible }) {
  const [sortOrder, setSortOrder] = useState("asc"); // 'asc' for Low to High, 'desc' for High to Low
  const [filterUniName, setFilterUniName] = useState("");
  const [filterCity, setFilterCity] = useState("");
  const [filterProdiName, setFilterProdiName] = useState(""); // Add state for Prodi filter
  const [selectedTypes, setSelectedTypes] = useState([
    "akademik",
    "kin",
    "vokasi",
  ]);
  const [selectedJenjang, setSelectedJenjang] = useState([
    "Sarjana",
    "Sarjana Terapan",
    "Diploma Tiga",
  ]); // Add state for Jenjang filter
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [jenjangDropdownOpen, setJenjangDropdownOpen] = useState(false); // Add state for Jenjang dropdown
  const typeLabels = { akademik: "Akademik", kin: "KIN", vokasi: "Vokasi" };
  const jenjangLabels = {
    Sarjana: "Sarjana",
    "Sarjana Terapan": "Sarjana Terapan",
    "Diploma Tiga": "Diploma Tiga",
  };

  // flatten all university-program entries, filter, and sort based on state
  const items = useMemo(() => {
    let flatItems = (universities || []).flatMap((u) =>
      (u.prodi || []).map((p) => ({
        uniName: u.name,
        city: u.city, // Include city
        nama: p.nama,
        jenjang: p.jenjang, // Include jenjang (degree level)
        admissionRate: p.admissionRate, // Include admissionRate
        cutoffScore: p.cutoffScore, // Include cutoffScore
        universityType: u.universityType, // <-- add type for filtering
      }))
    );

    // University type filter
    flatItems = flatItems.filter((item) =>
      selectedTypes.includes(item.universityType)
    );

    // Jenjang filter
    flatItems = flatItems.filter((item) =>
      selectedJenjang.includes(item.jenjang)
    );

    // Apply filters
    if (filterUniName) {
      const keywords = filterUniName
        .toLowerCase()
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean);
      flatItems = flatItems.filter((item) =>
        keywords.some((k) => item.uniName.toLowerCase().includes(k))
      );
    }
    if (filterCity) {
      const keywords = filterCity
        .toLowerCase()
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean);
      flatItems = flatItems.filter((item) =>
        keywords.some((k) => item.city?.toLowerCase().includes(k))
      );
    }
    if (filterProdiName) {
      const keywords = filterProdiName
        .toLowerCase()
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean);
      flatItems = flatItems.filter((item) =>
        keywords.some((k) => item.nama.toLowerCase().includes(k))
      );
    }

    // Sort based on sortOrder state
    flatItems.sort((a, b) => {
      if (sortOrder === "asc") {
        return a.admissionRate - b.admissionRate; // Low to High (most competitive first)
      } else {
        return b.admissionRate - a.admissionRate; // High to Low (least competitive first)
      }
    });
    return flatItems;
  }, [
    universities,
    sortOrder,
    filterUniName,
    filterCity,
    filterProdiName,
    selectedTypes,
    selectedJenjang,
  ]); // Add filterProdiName and selectedJenjang dependency

  // Calculate total based on filtered items
  const total = items.length;
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);

  // Reset page index when filters change
  React.useEffect(() => {
    setPageIndex(0);
  }, [filterUniName, filterCity, filterProdiName, pageSize, selectedJenjang]); // Add filterProdiName and selectedJenjang dependency

  const start = pageIndex * pageSize;
  const end = Math.min(start + pageSize, total);
  const displayed = items.slice(start, end);

  if (universities === null) return null; // Don't render if initial state

  // Modified click handlers to ensure only one dropdown is open at a time
  const handleTypeDropdownClick = () => {
    setJenjangDropdownOpen(false); // Close the other dropdown first
    setDropdownOpen((v) => !v);
  };

  const handleJenjangDropdownClick = () => {
    setDropdownOpen(false); // Close the other dropdown first
    setJenjangDropdownOpen((v) => !v);
  };

  // Always render filters and controls if universities data is present
  return (
    <div className="h-full space-y-2 sm:space-y-3">
      {/* Filter Row */}
      <div className="flex flex-col gap-1">
        {/* University Type and Jenjang Dropdowns - displayed inline with Jenjang aligned right */}
        <div className="flex flex-wrap justify-between gap-2">
          {/* University Type Dropdown Filter */}
          <div className="relative">
            <button
              type="button"
              className="border rounded px-2 py-1.5 text-sm bg-stone-50 border-stone-300 focus:outline-none focus:ring-2 focus:ring-blue-600 flex items-baseline gap-2 hover:bg-blue-50 transition"
              onClick={handleTypeDropdownClick}
              aria-haspopup="listbox"
              aria-expanded={dropdownOpen}
            >
              <span className="flex items-center gap-2">
                <span className="font-medium text-stone-700">
                  Tipe Perguruan Tinggi
                </span>
                <svg
                  className={`w-4 h-4 text-stone-700 transition-transform ${
                    dropdownOpen ? "rotate-180 duration-200" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </span>
              <span className="text-xs text-stone-500">
                {selectedTypes.length === 3
                  ? "Semua"
                  : selectedTypes.map((t) => typeLabels[t]).join(", ")}
              </span>
            </button>
            {dropdownOpen && (
              <div className="absolute z-20 mt-1 bg-white border border-stone-300 rounded shadow-lg p-2 flex flex-col gap-1 min-w-[180px] animate-fade-in">
                {Object.entries(typeLabels).map(([type, label]) => (
                  <label
                    key={type}
                    className="flex items-center gap-2 text-sm px-2 py-1 rounded hover:bg-blue-50 cursor-pointer transition"
                  >
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes(type)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedTypes((prev) => [...prev, type]);
                        } else {
                          setSelectedTypes((prev) =>
                            prev.filter((t) => t !== type)
                          );
                        }
                      }}
                      className="accent-blue-600 focus:ring-2 focus:ring-blue-400"
                    />
                    <span className="text-stone-700">{label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Jenjang Dropdown Filter - aligned to the right */}
          <div className="relative">
            <button
              type="button"
              className="border rounded px-2 py-1.5 text-sm bg-stone-50 border-stone-300 focus:outline-none focus:ring-2 focus:ring-blue-600 flex items-baseline gap-2 hover:bg-blue-50 transition"
              onClick={handleJenjangDropdownClick}
              aria-haspopup="listbox"
              aria-expanded={jenjangDropdownOpen}
            >
              <span className="flex items-center gap-2">
                <span className="font-medium text-stone-700">Jenjang</span>
                <svg
                  className={`w-4 h-4 text-stone-700 transition-transform ${
                    jenjangDropdownOpen ? "rotate-180 duration-200" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </span>
              <span className="text-xs text-stone-500">
                {selectedJenjang.length === 3
                  ? "Semua"
                  : selectedJenjang.map((t) => jenjangLabels[t]).join(", ")}
              </span>
            </button>
            {jenjangDropdownOpen && (
              <div className="absolute right-0 z-20 mt-1 bg-white border border-stone-300 rounded shadow-lg p-2 flex flex-col gap-1 min-w-[180px] animate-fade-in">
                {Object.entries(jenjangLabels).map(([jenjang, label]) => (
                  <label
                    key={jenjang}
                    className="flex items-center gap-2 text-sm px-2 py-1 rounded hover:bg-blue-50 cursor-pointer transition"
                  >
                    <input
                      type="checkbox"
                      checked={selectedJenjang.includes(jenjang)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedJenjang((prev) => [...prev, jenjang]);
                        } else {
                          setSelectedJenjang((prev) =>
                            prev.filter((t) => t !== jenjang)
                          );
                        }
                      }}
                      className="accent-blue-600 focus:ring-2 focus:ring-blue-400"
                    />
                    <span className="text-stone-700">{label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        <input
          type="text"
          placeholder="Filter Nama Universitas..."
          value={filterUniName}
          onChange={(e) => setFilterUniName(e.target.value)}
          className="border rounded px-2 py-1.5 text-sm flex-1 border-stone-300 bg-stone-50 text-stone-700 focus:outline-none focus:ring-2 focus:ring-blue-600 hover:bg-blue-50 placeholder:text-stone-500"
        />
        <div className="flex flex-col gap-1">
          <input
            type="text"
            placeholder="Filter Kab/Kota..."
            value={filterCity}
            onChange={(e) => setFilterCity(e.target.value)}
            className="border rounded px-2 py-1.5 text-sm flex-1 border-stone-300 bg-stone-50 text-stone-700 focus:outline-none focus:ring-2 focus:ring-blue-600 hover:bg-blue-50 placeholder:text-stone-500"
          />
          <input
            type="text"
            placeholder="Filter Program Studi..."
            value={filterProdiName}
            onChange={(e) => setFilterProdiName(e.target.value)}
            className="border rounded px-2 py-1.5 text-sm flex-1 border-stone-300 bg-stone-50 text-stone-700 focus:outline-none focus:ring-2 focus:ring-blue-600 hover:bg-blue-50 placeholder:text-stone-500"
          />
        </div>
      </div>

      {/* Control Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        {/* Left side: Page Size & Total */}
        <div className="flex items-center gap-1">
          <label className="text-stone-700 text-sm flex items-center gap-1 relative">
            Tampilkan
            <span className="relative inline-block">
              <select
                value={pageSize}
                onChange={(e) => {
                  const newSize = Number(e.target.value);
                  setPageSize(newSize);
                }}
                className="border rounded px-2 py-0.5 text-sm border-stone-300 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-blue-600 appearance-none pr-6 peer hover:bg-blue-50 shadow-none"
              >
                {[10, 20, 50].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              {/* Arrow icon overlay, animated on focus */}
              <svg
                className="w-4 h-4 text-stone-700 pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 transition-transform duration-200 peer-focus:rotate-180"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </span>
            hasil
          </label>
        </div>

        {/* Right side: Sort */}
        <div className="flex items-center">
          {/* Sort Dropdown */}
          <label className="text-stone-700 text-sm flex items-center gap-1 relative">
            Persentase Diterima
            <span className="relative inline-block">
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="border rounded px-2 py-0.5 text-sm border-stone-300 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-blue-600 appearance-none pr-6 peer hover:bg-blue-50 shadow-none"
              >
                <option value="asc">Rendah ke Tinggi</option>
                <option value="desc">Tinggi ke Rendah</option>
              </select>
              {/* Arrow icon overlay, animated on focus */}
              <svg
                className="w-4 h-4 text-stone-700 pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 transition-transform duration-200 peer-focus:rotate-180"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </span>
          </label>
        </div>
      </div>

      {/* Conditional Rendering for Results or No Results Message */}
      {!items.length ? (
        <div className="max-w-md mx-auto mt-6 p-4 bg-white rounded-lg shadow-lg text-center text-stone-600">
          {filterUniName || filterCity || filterProdiName ? (
            <p className="text-base">
              Tidak ada hasil yang cocok dengan filter Anda.
            </p>
          ) : (
            <p className="text-base">
              Belum ada program studi yang sesuai dengan kriteria Anda.
            </p>
          )}
        </div>
      ) : (
        <>
          {/* Results Grid - Wrapped for Scrolling */}
          {/* Adjusted height to match ScoreForm */}
          <div className="overflow-y-auto min-w-50 max-h-[85vh] border bg-stone-50 border-stone-300 rounded-lg p-2 scrollbar-thin scrollbar-thumb-stone-200 scrollbar-track-stone-100 shadow-md">
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
              {displayed.map((item, idx) => {
                const admissionPercentage = item.admissionRate * 100;
                const cutoffScore = item.cutoffScore; // get cutoffScore
                let textColorClass = "text-green-600";
                if (admissionPercentage <= 10) {
                  textColorClass = "text-red-600";
                } else if (admissionPercentage <= 30) {
                  textColorClass = "text-orange-500";
                }

                return (
                  <div
                    key={start + idx}
                    className="bg-white rounded-lg p-3 relative border px-2 border-stone-300 hover:bg-blue-50"
                  >
                    <h3 className="font-semibold text-stone-700 text-sm sm:text-base">
                      {item.uniName}
                    </h3>
                    <p className="text-xs text-stone-500">{item.city}</p>
                    <p className="text-xs sm:text-sm text-stone-700 mt-1 mb-10">
                      {item.nama}
                    </p>
                    <div className="absolute bottom-2 left-3 text-left">
                      {item.jenjang && (
                        <span className="text-xs text-stone-500">
                          {item.jenjang}
                        </span>
                      )}
                    </div>
                    <div className="absolute bottom-2 right-2 text-right">
                      <span className="text-xs font-medium text-stone-500">
                        Passing Grade:
                      </span>
                      <span
                        className={`text-xs font-bold underline ${textColorClass} ml-1`}
                      >
                        {cutoffScore}
                      </span>
                      <br />
                      <span className="text-xs font-medium text-stone-500">
                        Persentase Diterima:
                      </span>
                      <span
                        className={`text-xs font-bold underline ${textColorClass} ml-1`}
                      >
                        {admissionPercentage.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {/* Pagination Buttons (Bottom) */}
          {total > pageSize && (
            <div className="flex justify-center items-center gap-2 mt-3">
              {pageIndex > 0 && (
                <button
                  onClick={() => setPageIndex((prev) => prev - 1)}
                  className="px-2 py-1 text-xs sm:text-sm border-b-4 border-stone-800 bg-gradient-to-t from-stone-500 to-stone-700 text-white font-semibold rounded-md shadow-md hover:opacity-70 active:translate-y-0.5 active:shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-all duration-100 ease-in-out"
                >
                  Sebelumnya
                </button>
              )}
              <span className="text-stone-600 text-xs">
                Halaman {pageIndex + 1} dari {Math.ceil(total / pageSize)}
              </span>
              {end < total && (
                <button
                  onClick={() => setPageIndex((prev) => prev + 1)}
                  className="px-2 py-1 text-xs sm:text-sm border-b-4 border-blue-800 bg-gradient-to-t from-blue-500 to-blue-700 text-white font-semibold rounded-md shadow-md hover:opacity-70 active:translate-y-0.5 active:shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-all duration-100 ease-in-out"
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
