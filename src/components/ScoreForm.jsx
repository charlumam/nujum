import React, { useState } from 'react';

export default function ScoreForm({ onSubmit }) {
  const [scores, setScores] = useState({
    penalaranUmum: '',
    kuantitatif: '',
    pemahamanUmum: '',
    bacaanTulis: '',
    bahasaIndonesia: '',
    bahasaInggris: '',
    penalaranMatematika: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numericValue = value.replace(/[^0-9]/g, '');
    setScores(prev => ({ ...prev, [name]: numericValue }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.values(scores).some(v => v === '')) {
      alert('Harap isi semua skor.');
      return;
    }
    const numeric = Object.fromEntries(
      Object.entries(scores).map(([k, v]) => [k, Number(v)])
    );
    onSubmit(numeric);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-semibold text-gray-800">Masukkan Skor SNBT</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Test Potensi Skolastik */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Tes Potensi Skolastik</h3>
          {[
            ['penalaranUmum', 'Kemampuan Penalaran Umum'],
            ['kuantitatif', 'Kemampuan Kuantitatif'],
            ['pemahamanUmum', 'Pengetahuan dan Pemahaman Umum'],
            ['bacaanTulis', 'Kemampuan Memahami Bacaan dan Tulis'],
          ].map(([key, label]) => (
            <label key={key} className="block">
              <span className="text-gray-700">{label}</span>
              <input
                type="text" inputMode="numeric" pattern="[0-9]*"
                name={key} value={scores[key]} onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="0-1000"
              />
            </label>
          ))}
        </div>

        {/* Test Literasi & Matematika */}
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Tes Literasi Bahasa</h3>
            {[
              ['bahasaIndonesia', 'Literasi Bahasa Indonesia'],
              ['bahasaInggris', 'Literasi Bahasa Inggris'],
            ].map(([key, label]) => (
              <label key={key} className="block">
                <span className="text-gray-700">{label}</span>
                <input
                  type="text" inputMode="numeric" pattern="[0-9]*"
                  name={key} value={scores[key]} onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="0-1000"
                />
              </label>
            ))}
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Tes Penalaran Matematika</h3>
            <label className="block">
              <span className="text-gray-700">Skor Penalaran Matematika</span>
              <input
                type="text" inputMode="numeric" pattern="[0-9]*"
                name="penalaranMatematika" value={scores.penalaranMatematika} onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="0-1000"
              />
            </label>
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        Cari Universitas
      </button>
    </form>
  );
}
