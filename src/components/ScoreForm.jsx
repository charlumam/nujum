import React, { useState, useEffect } from "react";

// Accept finalScore, totalEligible, totalPrograms and savedScores as props
export default function ScoreForm({
  onSubmit,
  finalScore: propFinalScore,
  totalEligible,
  totalPrograms,
  savedScores,
}) {
  const [scores, setScores] = useState({
    penalaranUmum: "",
    kuantitatif: "",
    pemahamanUmum: "",
    bacaanTulis: "",
    bahasaIndonesia: "",
    bahasaInggris: "",
    penalaranMatematika: "",
  });
  // Local score state for immediate feedback *before* submission
  const [localFinalScore, setLocalFinalScore] = useState(null);

  // New state to track if all inputs are filled
  const [allInputsFilled, setAllInputsFilled] = useState(false);

  // New state to track if any inputs are filled
  const [anyInputFilled, setAnyInputFilled] = useState(false);

  // New state to track if we're in "view all" mode
  const [viewAllMode, setViewAllMode] = useState(false);

  // New state to track if all scores are set to maximum (1000)
  const [allMaxScores, setAllMaxScores] = useState(false);

  // Use savedScores if available when component mounts or when savedScores changes
  useEffect(() => {
    if (savedScores) {
      const formattedScores = Object.fromEntries(
        Object.entries(savedScores).map(([key, value]) => [key, String(value)])
      );
      setScores(formattedScores);

      // Check if we're in view all mode by seeing if all scores are 1000
      const isViewAllMode = Object.values(savedScores).every(
        (score) => score === 1000
      );
      setViewAllMode(isViewAllMode);
    }
  }, [savedScores]);

  // Calculate local final score whenever scores change
  useEffect(() => {
    const scoreValues = Object.values(scores);
    const areAllFilled = scoreValues.every(
      (v) => v !== "" && !isNaN(parseFloat(v))
    );
    const areAnyFilled = scoreValues.some(
      (v) => v !== "" && !isNaN(parseFloat(v))
    );

    // Check if all scores are set to 1000
    const areAllMax =
      areAllFilled && scoreValues.every((v) => parseFloat(v) === 1000);
    setAllMaxScores(areAllMax);

    setAllInputsFilled(areAllFilled);
    setAnyInputFilled(areAnyFilled);

    if (areAnyFilled) {
      // Filter out empty values and calculate average based on filled inputs only
      const filledScores = scoreValues.filter(
        (v) => v !== "" && !isNaN(parseFloat(v))
      );
      const numericScores = filledScores.map((v) => parseFloat(v));
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
          (1 -
            Math.min(propFinalScore, MAX_AVERAGE_SCORE) / MAX_AVERAGE_SCORE) *
            100
        ).toFixed(1)
      : 0;

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Allow digits, optional comma, and up to two decimal digits
    const regex = /^[0-9]*(\.[0-9]{0,2})?$/;

    if (value === "" || regex.test(value)) {
      let numericString = value;

      // Prevent "1000." or values strictly greater than 1000
      if (numericString !== "") {
        // Special case: prevent "1000."
        if (numericString === "1000.") {
          // Don't update state if input is exactly "1000."
          return;
        }

        const num = parseFloat(numericString);
        if (num > 1000) {
          // If number is > 1000, cap it at 1000
          numericString = "1000";
        }
      }
      setScores((prev) => ({ ...prev, [name]: numericString }));
    }
  };

  const handleSubmit = (e) => {
    // prevent submission when "view all" results are shown and inputs are all max
    if (viewAllMode && allMaxScores) {
      e.preventDefault();
      return;
    }
    e.preventDefault();

    // If inputs are not all filled, submit with empty values to show all programs
    if (!allInputsFilled) {
      // Create an object with all scores set to a high value to ensure all programs are returned
      const allProgramsScores = Object.keys(scores).reduce((obj, key) => {
        obj[key] = 1000; // Use high score to ensure all programs are returned
        return obj;
      }, {});

      setViewAllMode(true); // Set view all mode to true
      onSubmit(allProgramsScores);
      return;
    }

    // Original behavior for when all inputs are filled
    setViewAllMode(false); // Ensure view all mode is false
    const numeric = Object.fromEntries(
      Object.entries(scores).map(([k, v]) => [k, Number(v)])
    );
    onSubmit(numeric);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-full mx-auto bg-white shadow-lg rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6"
    >
      {/* Add mb-1 to reduce space below this heading */}
      <h1 className="text-md sm:text-lg md:text-lg font-bold text-stone-700 mb-1">
        Nujum | Passing Grade & Kelulusan UTBK-SNBT
      </h1>
      <h2 className="text-sm sm:text-md md:text-base italic text-base text-stone-700">
        Edisi 2025
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
        {/* Test Potensi Skolastik */}
        <div className="space-y-3">
          <h3 className="text-base sm:text-lg md:text-xl font-semibold text-blue-600 border-b-2 border-blue-100 pb-1 sm:pb-2">
            Tes Potensi Skolastik
          </h3>
          {[
            ["penalaranUmum", "Kemampuan Penalaran Umum"],
            ["kuantitatif", "Kemampuan Kuantitatif"],
            ["pemahamanUmum", "Pengetahuan dan Pemahaman Umum"],
            ["bacaanTulis", "Kemampuan Memahami Bacaan dan Tulis"],
          ].map(([key, label]) => (
            <label key={key} className="block">
              <span className="text-sm sm:text-base text-stone-700 font-medium">
                {label}
              </span>
              <input
                type="text"
                inputMode="numeric"
                name={key}
                value={scores[key]}
                onChange={handleChange}
                className="mt-1 max-w-80 mx-auto block w-full bg-stone-50 text-base sm:text-lg text-stone-700 px-2 py-1.5 sm:px-3 sm:py-2 border border-stone-300 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder:text-center text-center placeholder:text-stone-500"
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
              ["bahasaIndonesia", "Literasi Bahasa Indonesia"],
              ["bahasaInggris", "Literasi Bahasa Inggris"],
            ].map(([key, label]) => (
              <label key={key} className="block">
                <span className="text-sm sm:text-base text-stone-700 font-medium">
                  {label}
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  name={key}
                  value={scores[key]}
                  onChange={handleChange}
                  className="mt-1 max-w-80 mx-auto block w-full bg-stone-50 text-base sm:text-lg text-stone-700 px-2 py-1.5 sm:px-3 sm:py-2 border border-stone-300 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder:text-center text-center placeholder:text-stone-500"
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
              <span className="text-sm sm:text-base text-stone-700 font-medium">
                Penalaran Matematika
              </span>
              <input
                type="text"
                inputMode="numeric"
                name="penalaranMatematika"
                value={scores.penalaranMatematika}
                onChange={handleChange}
                className="mt-1 max-w-80 mx-auto block w-full bg-stone-50 text-base sm:text-lg text-stone-700 px-2 py-1.5 sm:px-3 sm:py-2 border border-stone-300 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder:text-center text-center placeholder:text-stone-500"
                placeholder="0 - 1000"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Display Final Score and Eligibility Info ONLY AFTER submission and NOT in view all mode */}
      {propFinalScore !== null && !viewAllMode && (
        <div className="text-center mt-3 mb-3 p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200 space-y-1 sm:space-y-2">
          {/* Display the final score passed from App.jsx */}
          <div>
            <p className="text-base sm:text-lg font-medium text-stone-700">
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
                  Kamu berpeluang besar masuk di{" "}
                  <span className="font-bold underline">{totalEligible}</span>{" "}
                  program studi.
                </p>
                {/* Added mt-1 for spacing */}
                <p className="text-xs sm:text-sm text-blue-600 mt-1 sm:mt-2">
                  Nilai kamu termasuk dalam{" "}
                  <span className="font-bold underline">{percentage}%</span>{" "}
                  teratas!
                </p>
              </>
            ) : (
              <p className="text-sm sm:text-base font-semibold text-blue-600">
                Sayangnya, belum ada program studi yang sesuai dengan nilai
                kamu.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Display local score calculation *before* submission for feedback - only when not in view all mode */}
      {propFinalScore === null &&
        localFinalScore !== null &&
        anyInputFilled &&
        !viewAllMode && (
          <div className="text-center mt-3 mb-3 p-2 sm:p-3 bg-stone-50 rounded-lg border border-stone-200">
            <p className="text-sm sm:text-md font-medium text-stone-600">
              Nilai rata-rata sementara:
            </p>
            <p className="text-lg sm:text-xl font-bold text-stone-700">
              {localFinalScore}
            </p>
          </div>
        )}

      {/* When in view all mode and results are shown, display info message */}
      {viewAllMode && propFinalScore !== null && (
        <div className="text-center mt-3 mb-3 p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm sm:text-base font-medium text-blue-600">
            Menampilkan {totalPrograms} program studi.
          </p>
        </div>
      )}

      {/* Apply 3D effect using shadow, transform, and transition */}
      <button
        type="submit"
        disabled={viewAllMode && allMaxScores}
        className={`mb-4 mt-4 w-full py-2 sm:py-3 border-b-4 border-blue-800 bg-gradient-to-t from-blue-500 to-blue-700 text-white text-base sm:text-lg font-semibold rounded-lg shadow-lg hover:opacity-70 active:translate-y-0.5 active:shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-all duration-100 ease-in-out ${viewAllMode && allMaxScores ? 'opacity-70 cursor-not-allowed' : ''}`}
      >
        {allMaxScores
          ? "Lihat Semua Passing Grade"
          : allInputsFilled
          ? "Cek Kelulusan UTBK-SNBT"
          : "Lihat Semua Passing Grade"}
      </button>
    </form>
  );
}
