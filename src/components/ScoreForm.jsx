import { useState, useEffect, useMemo } from "react";

const MAX_AVERAGE_SCORE = 859.13;
const MAX_SCORE = 1000;

const INITIAL_SCORES = {
  penalaranUmum: "",
  kuantitatif: "",
  pemahamanUmum: "",
  bacaanTulis: "",
  bahasaIndonesia: "",
  bahasaInggris: "",
  penalaranMatematika: "",
};

const TEST_SECTIONS = [
  {
    title: "Tes Potensi Skolastik",
    fields: [
      ["penalaranUmum", "Penalaran Umum"],
      ["pengetahuanUmum", "Pengetahuan dan Pemahaman Umum"],
      ["bacaTulis", "Pemahaman Bacaan dan Menulis"],
      ["pengetahuanKuantitatif", "Pengetahuan Kuantitatif"],
    ],
  },
  {
    title: "Tes Literasi",
    fields: [
      ["bahasaIndonesia", "Literasi Bahasa Indonesia"],
      ["bahasaInggris", "Literasi Bahasa Inggris"],
      ["penalaranMatematika", "Penalaran Matematika"],
    ],
  },
];

const INPUT_CLASS =
  "mt-1 max-w-80 mx-auto block w-full bg-stone-50 text-base sm:text-lg text-stone-700 px-2 py-1.5 sm:px-3 sm:py-2 border border-stone-300 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder:text-center text-center placeholder:text-stone-500";

const isValidScore = (value) => value !== "" && !isNaN(parseFloat(value));

const ScoreInput = ({ name, label, value, onChange }) => (
  <label className="block">
    <span className="text-sm sm:text-base text-stone-700 font-medium">
      {label}
    </span>
    <input
      type="text"
      inputMode="numeric"
      name={name}
      value={value}
      onChange={onChange}
      className={INPUT_CLASS}
      placeholder="0 - 1000"
    />
  </label>
);

const TestSection = ({ title, fields, scores, onChange }) => (
  <div className="space-y-3">
    <h3 className="text-base sm:text-lg md:text-xl font-bold text-stone-600 border-b-2 border-blue-100 pb-1 sm:pb-2">
      {title}
    </h3>
    {fields.map(([key, label]) => (
      <ScoreInput
        key={key}
        name={key}
        label={label}
        value={scores[key]}
        onChange={onChange}
      />
    ))}
  </div>
);

export default function ScoreForm({
  onSubmit,
  finalScore: propFinalScore,
  totalEligible,
  totalPrograms,
  savedScores,
}) {
  const [scores, setScores] = useState(INITIAL_SCORES);
  const [viewAllMode, setViewAllMode] = useState(false);

  useEffect(() => {
    if (savedScores) {
      const formattedScores = Object.fromEntries(
        Object.entries(savedScores).map(([key, value]) => [key, String(value)])
      );
      setScores(formattedScores);
      setViewAllMode(Object.values(savedScores).every((s) => s === MAX_SCORE));
    }
  }, [savedScores]);

  const { allInputsFilled, anyInputFilled, allMaxScores, localFinalScore } =
    useMemo(() => {
      const scoreValues = Object.values(scores);
      const filledScores = scoreValues.filter(isValidScore);
      const allFilled = scoreValues.every(isValidScore);
      const anyFilled = filledScores.length > 0;
      const allMax =
        allFilled && scoreValues.every((v) => parseFloat(v) === MAX_SCORE);

      let avgScore = null;
      if (anyFilled) {
        const sum = filledScores.reduce((acc, v) => acc + parseFloat(v), 0);
        avgScore = (sum / filledScores.length).toFixed(2);
      }

      return {
        allInputsFilled: allFilled,
        anyInputFilled: anyFilled,
        allMaxScores: allMax,
        localFinalScore: avgScore,
      };
    }, [scores]);

  const percentage = useMemo(() => {
    if (propFinalScore === null) return 0;
    const clamped = Math.min(propFinalScore, MAX_AVERAGE_SCORE);
    return Math.max(0, (1 - clamped / MAX_AVERAGE_SCORE) * 100).toFixed(1);
  }, [propFinalScore]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const regex = /^[0-9]*(\.[0-9]{0,2})?$/;

    if (value === "" || regex.test(value)) {
      if (value === "1000.") return;

      const numericString =
        value !== "" && parseFloat(value) > MAX_SCORE ? "1000" : value;
      setScores((prev) => ({ ...prev, [name]: numericString }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (viewAllMode && allMaxScores) return;

    if (!allInputsFilled) {
      const allProgramsScores = Object.fromEntries(
        Object.keys(scores).map((key) => [key, MAX_SCORE])
      );
      setViewAllMode(true);
      onSubmit(allProgramsScores);
      return;
    }

    setViewAllMode(false);
    const numeric = Object.fromEntries(
      Object.entries(scores).map(([k, v]) => [k, Number(v)])
    );
    onSubmit(numeric);
  };

  const isButtonDisabled = viewAllMode && allMaxScores;
  const buttonText =
    allMaxScores || !allInputsFilled
      ? "Lihat Semua Passing Grade"
      : "Prediksi Kelulusan UTBK-SNBT";

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-full mx-auto bg-white shadow-lg rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6"
    >
      <div className="flex items-center gap-2 sm:gap-3 mb-4">
        <img
          src="/favicon.svg"
          alt="Logo Nujum."
          className="h-10 sm:h-12 md:h-14"
        />
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-blue-700">
          Nujum
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
        {TEST_SECTIONS.map((section) => (
          <TestSection
            key={section.title}
            title={section.title}
            fields={section.fields}
            scores={scores}
            onChange={handleChange}
          />
        ))}
      </div>

      {propFinalScore !== null && !viewAllMode && (
        <div className="text-center mt-3 mb-3 p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200 space-y-1 sm:space-y-2">
          <div>
            <p className="text-base sm:text-lg font-medium text-stone-700">
              Dengan nilai rata-rata:
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-blue-600">
              {propFinalScore}
            </p>
          </div>

          <div className="pt-1 sm:pt-2 border-t border-blue-100">
            {totalEligible > 0 ? (
              <>
                <p className="text-sm sm:text-base font-semibold text-blue-600">
                  Kamu berpeluang besar masuk di{" "}
                  <span className="font-bold underline">{totalEligible}</span>{" "}
                  program studi.
                </p>
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

      {propFinalScore === null && anyInputFilled && !viewAllMode && (
        <div className="text-center mt-3 mb-3 p-2 sm:p-3 bg-stone-50 rounded-lg border border-stone-200">
          <p className="text-sm sm:text-md font-medium text-stone-600">
            Nilai rata-rata sementara:
          </p>
          <p className="text-lg sm:text-xl font-bold text-stone-700">
            {localFinalScore}
          </p>
        </div>
      )}

      {viewAllMode && propFinalScore !== null && (
        <div className="text-center mt-3 mb-3 p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm sm:text-base font-medium text-blue-600">
            Menampilkan {totalPrograms} program studi.
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={isButtonDisabled}
        className={`mb-4 mt-4 w-full py-2 sm:py-3 border-b-4 border-blue-800 bg-linear-to-t from-blue-500 to-blue-700 text-white text-base sm:text-lg font-semibold rounded-lg shadow-lg hover:opacity-70 active:translate-y-0.5 active:shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-all duration-100 ease-in-out ${
          isButtonDisabled ? "opacity-70 cursor-not-allowed" : ""
        }`}
      >
        {buttonText}
      </button>
    </form>
  );
}
