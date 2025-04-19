import React, { useState, useEffect } from 'react';

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
  const [finalScore, setFinalScore] = useState(null);

  // Calculate final score whenever scores change
  useEffect(() => {
    const scoreValues = Object.values(scores);
    if (scoreValues.every(v => v !== '' && !isNaN(parseFloat(v.replace(',', '.'))))) {
      const numericScores = scoreValues.map(v => parseFloat(v.replace(',', '.')));
      const sum = numericScores.reduce((acc, curr) => acc + curr, 0);
      const average = sum / numericScores.length;
      setFinalScore(average.toFixed(2)); // Format to 2 decimal places
    } else {
      setFinalScore(null); // Reset if not all scores are valid numbers
    }
  }, [scores]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Allow digits, optional comma, and up to two decimal digits
    const regex = /^[0-9]*(,[0-9]{0,2})?$/;

    if (value === '' || regex.test(value)) {
      let numericString = value;

      // Prevent "1000," or values strictly greater than 1000
      if (numericString !== '') {
        // Special case: prevent "1000,"
        if (numericString === '1000,') {
           // Don't update state if input is exactly "1000,"
           return;
        }

        const num = parseFloat(numericString.replace(',', '.'));
        if (num > 1000) {
          // If number is > 1000, cap it at 1000
          numericString = '1000';
        }
      }
      setScores(prev => ({ ...prev, [name]: numericString }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.values(scores).some(v => v === '')) {
      alert('Harap isi semua skor.');
      return;
    }
    const numeric = Object.fromEntries(
      // Replace comma with dot before converting to Number
      Object.entries(scores).map(([k, v]) => [k, Number(v.replace(',', '.'))])
    );
    onSubmit(numeric);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white shadow-lg rounded-xl p-8 space-y-8">
      <h2 className="text-2xl font-semibold text-gray-800">Masukkan Skor SNBT</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Test Potensi Skolastik */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-indigo-600 border-b-2 border-indigo-100 pb-2">Tes Potensi Skolastik</h3>
          {[
            ['penalaranUmum', 'Kemampuan Penalaran Umum'],
            ['kuantitatif', 'Kemampuan Kuantitatif'],
            ['pemahamanUmum', 'Pengetahuan dan Pemahaman Umum'],
            ['bacaanTulis', 'Kemampuan Memahami Bacaan dan Tulis'],
          ].map(([key, label]) => (
            <label key={key} className="block">
              <span className="text-gray-700 font-medium">{label}</span>
              <input
                type="text"
                inputMode="numeric"
                name={key} value={scores[key]} onChange={handleChange}
                className="mt-1 block w-full bg-gray-50 text-lg px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </label>
          ))}
        </div>

        {/* Test Literasi & Matematika */}
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-indigo-600 border-b-2 border-indigo-100 pb-2">Tes Literasi Bahasa</h3>
            {[
              ['bahasaIndonesia', 'Literasi Bahasa Indonesia'],
              ['bahasaInggris', 'Literasi Bahasa Inggris'],
            ].map(([key, label]) => (
              <label key={key} className="block">
                <span className="text-gray-700 font-medium">{label}</span>
                <input
                  type="text"
                  inputMode="numeric"
                  name={key} value={scores[key]} onChange={handleChange}
                  className="mt-1 block w-full bg-gray-50 text-lg px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </label>
            ))}
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-indigo-600 border-b-2 border-indigo-100 pb-2">Tes Penalaran Matematika</h3>
            <label className="block">
              <span className="text-gray-700 font-medium">Skor Penalaran Matematika</span>
              <input
                type="text"
                inputMode="numeric"
                name="penalaranMatematika" value={scores.penalaranMatematika} onChange={handleChange}
                className="mt-1 block w-full bg-gray-50 text-lg px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Display Final Score */}
      {finalScore !== null && (
        <div className="text-center mt-6 mb-4 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
          <p className="text-lg font-medium text-gray-700">Skor Rata-rata Anda:</p>
          <p className="text-3xl font-bold text-indigo-600">{finalScore}</p>
        </div>
      )}

      <button
        type="submit"
        className="w-full py-3 bg-indigo-600 text-white text-lg font-semibold rounded-lg hover:bg-indigo-700 transition-shadow shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        Cari Universitas
      </button>
    </form>
  );
}
