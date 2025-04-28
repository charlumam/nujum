import React, { useState, useEffect } from 'react';

// Accept finalScore, totalEligible, totalPrograms and savedScores as props
export default function ScoreForm({ onSubmit, finalScore: propFinalScore, totalEligible, totalPrograms, savedScores }) {
  const [scores, setScores] = useState({
    penalaranUmum: '',
    kuantitatif: '',
    pemahamanUmum: '',
    bacaanTulis: '',
    bahasaIndonesia: '',
    bahasaInggris: '',
    penalaranMatematika: '',
  });
  // Local score state for immediate feedback *before* submission
  const [localFinalScore, setLocalFinalScore] = useState(null);

  // Use savedScores if available when component mounts or when savedScores changes
  useEffect(() => {
    if (savedScores) {
      const formattedScores = Object.fromEntries(
        Object.entries(savedScores).map(([key, value]) => [key, String(value)]),
      );
      setScores(formattedScores);
    }
  }, [savedScores]);

  // Calculate local final score whenever scores change
  useEffect(() => {
    const scoreValues = Object.values(scores);
    if (scoreValues.every((v) => v !== '' && !isNaN(parseFloat(v)))) {
      const numericScores = scoreValues.map((v) => parseFloat(v));
      const sum = numericScores.reduce((acc, curr) => acc + curr, 0);
      const average = sum / numericScores.length;
      setLocalFinalScore(average.toFixed(2));
    } else {
      setLocalFinalScore(null);
    }
  }, [scores]);

  // Calculate percentage rank based on 2024 max average score (859.13). Clamped to top 0%
  const MAX_AVERAGE_SCORE = 859.13;
  const percentage =
    propFinalScore !== null
      ? Math.max(
          0,
          (1 - Math.min(propFinalScore, MAX_AVERAGE_SCORE) / MAX_AVERAGE_SCORE) * 100,
        ).toFixed(1)
      : 0;

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Allow digits, optional comma, and up to two decimal digits
    const regex = /^[0-9]*(\.[0-9]{0,2})?$/;

    if (value === '' || regex.test(value)) {
      let numericString = value;

      // Prevent "1000." or values strictly greater than 1000
      if (numericString !== '') {
        // Special case: prevent "1000."
        if (numericString === '1000.') {
          // Don't update state if input is exactly "1000."
          return;
        }

        const num = parseFloat(numericString);
        if (num > 1000) {
          // If number is > 1000, cap it at 1000
          numericString = '1000';
        }
      }
      setScores((prev) => ({ ...prev, [name]: numericString }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.values(scores).some((v) => v === '')) {
      alert('Harap isi semua skor.');
      return;
    }
    const numeric = Object.fromEntries(
      Object.entries(scores).map(([k, v]) => [k, Number(v)]),
    );
    onSubmit(numeric);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-full mx-auto bg-white shadow-lg rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6"
    >
      {/* Add mb-1 to reduce space below this heading */}
        <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-700 mb-1">
          Nujum | Passing Grade UTBK-SNBT
        </h1>
        <h2 className="italic text-base font-semibold text-gray-700">Edisi 2025</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          {/* Test Potensi Skolastik */}
          <div className="space-y-3">
            <h3 className="text-base sm:text-lg md:text-xl font-semibold text-blue-600 border-b-2 border-blue-100 pb-1 sm:pb-2">
          Tes Potensi Skolastik
            </h3>
            {[
          ['penalaranUmum', 'Kemampuan Penalaran Umum'],
          ['kuantitatif', 'Kemampuan Kuantitatif'],
          ['pemahamanUmum', 'Pengetahuan dan Pemahaman Umum'],
          ['bacaanTulis', 'Kemampuan Memahami Bacaan dan Tulis'],
            ].map(([key, label]) => (
          <label key={key} className="block">
            <span className="text-sm sm:text-base text-gray-700 font-medium">
              {label}
            </span>
            <input
              type="text"
              inputMode="numeric"
              name={key}
              value={scores[key]}
              onChange={handleChange}
              className="mt-1 max-w-80 mx-auto block w-full bg-gray-50 text-base sm:text-lg text-gray-700 px-2 py-1.5 sm:px-3 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder:text-center text-center"
              placeholder="0 - 1000"
            />
          </label>
            ))}
          </div>

          {/* Test Literasi & Matematika */}
          <div className="space-y-3 sm:space-y-4">
            <div className="space-y-3">
          <h3 className="text-base sm:text-lg md:text-xl font-semibold text-blue-600 border-b-2 border-blue-100 pb-1 sm:pb-2">
            Tes Literasi Bahasa
          </h3>
          {[
            ['bahasaIndonesia', 'Literasi Bahasa Indonesia'],
            ['bahasaInggris', 'Literasi Bahasa Inggris'],
          ].map(([key, label]) => (
            <label key={key} className="block">
              <span className="text-sm sm:text-base text-gray-700 font-medium">
            {label}
              </span>
              <input
            type="text"
            inputMode="numeric"
            name={key}
            value={scores[key]}
            onChange={handleChange}
            className="mt-1 max-w-80 mx-auto block w-full bg-gray-50 text-base sm:text-lg text-gray-700 px-2 py-1.5 sm:px-3 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder:text-center text-center"
            placeholder="0 - 1000"
              />
            </label>
          ))}
            </div>

            <div className="space-y-3">
          <h3 className="text-base sm:text-lg md:text-xl font-semibold text-blue-600 border-b-2 border-blue-100 pb-1 sm:pb-2">
            Tes Penalaran Matematika
          </h3>
          <label className="block">
            <span className="text-sm sm:text-base text-gray-700 font-medium">
              Penalaran Matematika
            </span>
            <input
              type="text"
              inputMode="numeric"
              name="penalaranMatematika"
              value={scores.penalaranMatematika}
              onChange={handleChange}
              className="mt-1 max-w-80 mx-auto block w-full bg-gray-50 text-base sm:text-lg text-gray-700 px-2 py-1.5 sm:px-3 sm:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder:text-center text-center"
              placeholder="0 - 1000"
            />
          </label>
            </div>
          </div>
        </div>

        {/* Display Final Score and Eligibility Info ONLY AFTER submission */}
      {propFinalScore !== null && (
        <div className="text-center mt-3 mb-3 p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200 space-y-1 sm:space-y-2">
          {/* Display the final score passed from App.jsx */}
          <div>
            <p className="text-base sm:text-lg font-medium text-gray-700">
              Dengan nilai rata-rata:
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-blue-600">
              {propFinalScore}
            </p>
          </div>

          {/* Display eligibility text based on totalEligible */}
          <div className="pt-1 sm:pt-2 border-t border-blue-100">
            {totalEligible > 0 ? (
              <>
                <p className="text-sm sm:text-base font-semibold text-blue-600">
                  Kamu berpeluang besar masuk di{' '}
                  <span className="font-bold underline">{totalEligible}</span>{' '}
                  program studi.
                </p>
                {/* Added mt-1 for spacing */}
                <p className="text-xs sm:text-sm text-blue-600 mt-1 sm:mt-2">
                  Nilai kamu termasuk dalam {' '}
                  <span className="font-bold underline">{percentage}%</span> teratas!
                </p>
              </>
            ) : (
              <p className="text-sm sm:text-base font-semibold text-blue-600">
                Sayangnya, belum ada program studi yang sesuai dengan nilai kamu.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Display local score calculation *before* submission for feedback */}
      {propFinalScore === null && localFinalScore !== null && (
        <div className="text-center mt-3 mb-3 p-2 sm:p-3 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm sm:text-md font-medium text-gray-600">
            Nilai rata-rata sementara:
          </p>
          <p className="text-lg sm:text-xl font-bold text-gray-700">
            {localFinalScore}
          </p>
        </div>
      )}

      <button
        type="submit"
        className="w-full py-2 sm:py-3 bg-blue-600 border-b-4 border-blue-800 text-white text-base sm:text-lg font-semibold rounded-lg hover:bg-blue-500 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-b-0"
      >
        Cek Passing Grade
      </button>
    </form>
  );
}
