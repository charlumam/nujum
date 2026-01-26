import { useState, useEffect, useCallback } from "react";
import Practice from "./Practice.jsx";
import PracticeResults from "./PracticeResults.jsx";
import {
  saveSession,
  getRecentSessions,
  getFormattedStats,
  clearCurrentSession,
} from "../utils/practiceStorage.js";

// Subtests available for practice
const SUBTESTS = [
  {
    id: "pu",
    name: "Penalaran Umum",
    description: "Logika, analisis, dan penalaran",
  },
  {
    id: "ppu",
    name: "Pengetahuan Umum",
    description: "Wawasan kebangsaan dan sosial",
  },
  {
    id: "pbm",
    name: "Pemahaman Bacaan & Menulis",
    description: "Membaca dan menulis efektif",
  },
  {
    id: "pk",
    name: "Pengetahuan Kuantitatif",
    description: "Matematika dasar dan terapan",
  },
  {
    id: "lbi",
    name: "Literasi Bahasa Indonesia",
    description: "Pemahaman teks bahasa Indonesia",
  },
  {
    id: "lbe",
    name: "Literasi Bahasa Inggris",
    description: "Pemahaman teks bahasa Inggris",
  },
  {
    id: "pm",
    name: "Penalaran Matematika",
    description: "Logika dan pemecahan masalah matematika",
  },
];

// Duration options
const DURATION_OPTIONS = [
  { id: "short", label: "Singkat", minutes: 15, questions: "~20 soal" },
  { id: "medium", label: "Sedang", minutes: 30, questions: "~40 soal" },
  { id: "long", label: "Panjang", minutes: 45, questions: "~60 soal" },
  { id: "full", label: "Penuh", minutes: 60, questions: "~70 soal" },
];

const MOCK_RECENT_SESSIONS = [];

const MOCK_STATS = {
  totalQuestions: 0,
  accuracy: 0,
  totalTime: 0, // in minutes
  sessionsCompleted: 0,
};

// Icons as simple SVG components
const BookIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
    />
  </svg>
);

const CheckIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const PlayIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const ClockIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const GridIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
    />
  </svg>
);

const TargetIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
    />
  </svg>
);

const TrendingUpIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
    />
  </svg>
);

const DocumentIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

const TimerIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

// Duration Button Component
const DurationButton = ({ option, selected, onClick }) => (
  <button
    onClick={() => onClick(option.id)}
    className={`flex-1 p-3 rounded-lg border-2 transition-all ${
      selected
        ? "border-blue-500 bg-blue-50 text-blue-700"
        : "border-stone-200 bg-white hover:border-stone-300 text-stone-600"
    }`}
  >
    <div className="text-lg font-bold">{option.minutes}'</div>
    <div className="text-xs opacity-75">{option.label}</div>
  </button>
);

// Subtest Menu Item Component
const SubtestMenuItem = ({ subtest, selected, onClick }) => (
  <button
    onClick={() => onClick(subtest.id)}
    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
      selected
        ? "border-blue-500 bg-blue-50"
        : "border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50"
    }`}
  >
    <div className="flex items-center justify-between">
      <div>
        <h4
          className={`font-medium ${selected ? "text-blue-700" : "text-stone-700"}`}
        >
          {subtest.name}
        </h4>
        <p className="text-xs text-stone-500 mt-0.5">{subtest.description}</p>
      </div>
      {selected && (
        <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
          <svg
            className="w-3 h-3 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}
    </div>
  </button>
);

// Recent Session Row Component
const RecentSession = ({ session }) => {
  const subtestLabel =
    session.subtests.length > 1
      ? `${session.subtests[0]} +${session.subtests.length - 1}`
      : session.subtests[0];

  return (
    <div className="flex items-center gap-3 py-3 border-b border-stone-100 last:border-0">
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold ${
          session.score >= 80
            ? "bg-green-100 text-green-700"
            : session.score >= 60
              ? "bg-yellow-100 text-yellow-700"
              : "bg-red-100 text-red-600"
        }`}
      >
        {session.score}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-stone-700 truncate">
          {subtestLabel}
        </p>
        <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
          {new Date(session.date).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
          })}
          <span className="mx-1">•</span>
          {session.duration}'<span className="mx-1">•</span>
          {session.questions} soal
        </p>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ icon, label, value, subValue }) => (
  <div className="bg-white rounded-xl p-4 shadow-sm">
    <div className="flex items-center gap-2 text-stone-500 mb-1">
      {icon}
      <span className="text-xs font-medium uppercase tracking-wide">
        {label}
      </span>
    </div>
    <p className="text-2xl font-bold text-stone-700">{value}</p>
    {subValue && <p className="text-xs text-stone-500 mt-0.5">{subValue}</p>}
  </div>
);

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center py-12">
    <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
    <p className="text-stone-500">Memuat soal...</p>
  </div>
);

// Helper function to shuffle array
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Fetch questions for selected subtests
async function fetchQuestions(subtestIds, questionsPerSubtest = 10) {
  const allQuestions = [];

  for (const subtestId of subtestIds) {
    try {
      // Dynamic import of JSON files
      const module = await import(`../data/soal/${subtestId}.json`);
      const data = module.default;

      // Shuffle and limit questions per subtest
      const shuffledQuestions = shuffleArray(data.questions);
      const limitedQuestions = shuffledQuestions.slice(0, questionsPerSubtest);

      // Add subtest info to each question
      const questionsWithSubtest = limitedQuestions.map((q) => ({
        ...q,
        subtestId: data.subtest.id,
        subtest: data.subtest,
      }));

      allQuestions.push(...questionsWithSubtest);
    } catch (error) {
      console.error(
        `Failed to load questions for subtest ${subtestId}:`,
        error,
      );
    }
  }

  // Shuffle all questions together
  return shuffleArray(allQuestions);
}

export default function PrepDashboard() {
  const [selectedSubtests, setSelectedSubtests] = useState([]);
  const [selectedDuration, setSelectedDuration] = useState("medium");

  // Practice mode states
  const [mode, setMode] = useState("setup"); // "setup" | "loading" | "practice" | "results"
  const [questions, setQuestions] = useState([]);
  const [practiceResults, setPracticeResults] = useState(null);

  // Data from storage
  const [recentSessions, setRecentSessions] = useState(MOCK_RECENT_SESSIONS);
  const [stats, setStats] = useState(MOCK_STATS);

  // Load data from storage on mount
  useEffect(() => {
    const loadStorageData = async () => {
      try {
        const [sessions, formattedStats] = await Promise.all([
          getRecentSessions(3),
          getFormattedStats(),
        ]);
        setRecentSessions(sessions);
        setStats(formattedStats);
      } catch (error) {
        console.error("Failed to load storage data:", error);
      }
    };

    loadStorageData();
  }, []);

  const handleSubtestToggle = (subtestId) => {
    setSelectedSubtests((prev) =>
      prev.includes(subtestId)
        ? prev.filter((id) => id !== subtestId)
        : [...prev, subtestId],
    );
  };

  const handleSelectAll = () => {
    if (selectedSubtests.length === SUBTESTS.length) {
      setSelectedSubtests([]);
    } else {
      setSelectedSubtests(SUBTESTS.map((s) => s.id));
    }
  };

  const handleStartPractice = async () => {
    const duration = DURATION_OPTIONS.find((d) => d.id === selectedDuration);

    // Calculate questions per subtest based on duration
    // Roughly 2 questions per minute, distributed across subtests
    const totalQuestions = Math.floor(duration.minutes * 1.5);
    const questionsPerSubtest = Math.ceil(
      totalQuestions / selectedSubtests.length,
    );

    setMode("loading");

    try {
      const loadedQuestions = await fetchQuestions(
        selectedSubtests,
        questionsPerSubtest,
      );

      if (loadedQuestions.length === 0) {
        alert("Tidak ada soal yang tersedia untuk subtes yang dipilih.");
        setMode("setup");
        return;
      }

      setQuestions(loadedQuestions);
      setMode("practice");
    } catch (error) {
      console.error("Failed to load questions:", error);
      alert("Gagal memuat soal. Silakan coba lagi.");
      setMode("setup");
    }
  };

  const handleFinishPractice = useCallback(
    async ({ answers, flagged, totalTime, autoSubmit }) => {
      // Calculate results
      const correct = questions.filter(
        (q) => answers[q.id] === q.correctAnswer,
      ).length;
      const score = Math.round((correct / questions.length) * 100);

      // Get subtest names
      const subtestNames = selectedSubtests.map(
        (id) => SUBTESTS.find((s) => s.id === id)?.name || id,
      );

      const duration = DURATION_OPTIONS.find((d) => d.id === selectedDuration);

      // Save session to storage
      try {
        await saveSession({
          subtests: selectedSubtests,
          subtestNames,
          duration: duration?.minutes || 0,
          answers,
          score,
          correct,
          total: questions.length,
          totalTime,
          autoSubmit,
        });

        // Clear any saved current session
        await clearCurrentSession();

        // Refresh stats
        const [sessions, formattedStats] = await Promise.all([
          getRecentSessions(3),
          getFormattedStats(),
        ]);
        setRecentSessions(sessions);
        setStats(formattedStats);
      } catch (error) {
        console.error("Failed to save session:", error);
      }

      // Set results and switch to results mode
      setPracticeResults({
        questions,
        answers,
        totalTime,
        subtestNames,
        autoSubmit,
      });
      setMode("results");
    },
    [questions, selectedSubtests, selectedDuration],
  );

  const handleExitPractice = useCallback(() => {
    if (confirm("Yakin ingin keluar? Progres latihan akan hilang.")) {
      setMode("setup");
      setQuestions([]);
    }
  }, []);

  const handleRetry = useCallback(() => {
    setMode("setup");
    setQuestions([]);
    setPracticeResults(null);
  }, []);

  const handleBackFromResults = useCallback(() => {
    setMode("setup");
    setQuestions([]);
    setPracticeResults(null);
  }, []);

  const allSelected = selectedSubtests.length === SUBTESTS.length;
  const canStart = selectedSubtests.length > 0;

  // Get subtest names for practice component
  const selectedSubtestNames = selectedSubtests.map(
    (id) => SUBTESTS.find((s) => s.id === id)?.name || id,
  );

  const duration = DURATION_OPTIONS.find((d) => d.id === selectedDuration);

  // Render Practice component when in practice mode
  if (mode === "practice") {
    return (
      <Practice
        questions={questions}
        durationMinutes={duration?.minutes || 30}
        subtestNames={selectedSubtestNames}
        onFinish={handleFinishPractice}
        onExit={handleExitPractice}
      />
    );
  }

  // Render Results component when in results mode
  if (mode === "results" && practiceResults) {
    return (
      <PracticeResults
        questions={practiceResults.questions}
        answers={practiceResults.answers}
        totalTime={practiceResults.totalTime}
        subtestNames={practiceResults.subtestNames}
        autoSubmit={practiceResults.autoSubmit}
        onRetry={handleRetry}
        onBack={handleBackFromResults}
      />
    );
  }

  // Render loading state
  if (mode === "loading") {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-700 mb-2">
            Latihan Persiapan SNBT
          </h1>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-8">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  // Render setup mode (default dashboard)
  return (
    <div className="space-y-6" style={{ fontFamily: '"Nunito Sans Variable", sans-serif' }}>
      {/* Main Practice Setup */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Subtest Selection */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-stone-700">Pilih Subtes</h3>
            <button
              onClick={handleSelectAll}
              className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2 ${
                allSelected
                  ? "bg-blue-100 text-blue-700"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              <GridIcon />
              {allSelected ? "Batalkan Semua" : "Pilih Semua"}
            </button>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {SUBTESTS.map((subtest) => (
              <SubtestMenuItem
                key={subtest.id}
                subtest={subtest}
                selected={selectedSubtests.includes(subtest.id)}
                onClick={handleSubtestToggle}
              />
            ))}
          </div>

          {selectedSubtests.length > 0 && (
            <p className="text-sm text-stone-500 mt-4 text-center">
              {selectedSubtests.length} subtes dipilih
            </p>
          )}
        </div>

        {/* Duration & Start */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm p-5">
            <h3 className="text-lg font-bold text-stone-700 mb-4">
              Durasi Latihan
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {DURATION_OPTIONS.map((option) => (
                <DurationButton
                  key={option.id}
                  option={option}
                  selected={selectedDuration === option.id}
                  onClick={setSelectedDuration}
                />
              ))}
            </div>
            <p className="text-xs text-stone-500 mt-3 text-center">
              {
                DURATION_OPTIONS.find((d) => d.id === selectedDuration)
                  ?.questions
              }
            </p>
          </div>

          {/* Start Button */}
          <button
            onClick={handleStartPractice}
            disabled={!canStart}
            className={`mb-4 mt-4 w-full py-2 sm:py-3 border-b-4 border-blue-800 bg-linear-to-t from-blue-500 to-blue-700 text-white text-base sm:text-lg font-semibold rounded-lg shadow-lg hover:opacity-70 active:translate-y-0.5 active:shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-all duration-100 ease-in-out flex items-center justify-center gap-3 ${
              !canStart ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            <PlayIcon />
            Mulai Latihan
          </button>

          {/* Recent Sessions */}
          <div className="bg-white rounded-xl shadow-sm p-5">
            <h3 className="text-lg font-bold text-stone-700 mb-3">
              Latihan Terakhir
            </h3>
            {recentSessions.length > 0 ? (
              <div>
                {recentSessions.map((session) => (
                  <RecentSession key={session.id} session={session} />
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-stone-400">
                <DocumentIcon />
                <p className="mt-2 text-sm">Belum ada latihan</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          icon={<DocumentIcon />}
          label="Total Soal"
          value={stats.totalQuestions}
          subValue="soal dikerjakan"
        />
        <StatCard
          icon={<TargetIcon />}
          label="Akurasi"
          value={`${stats.accuracy}%`}
          subValue="jawaban benar"
        />
        <StatCard
          icon={<TimerIcon />}
          label="Waktu Latihan"
          value={`${Math.floor(stats.totalTime / 60)}j ${stats.totalTime % 60}m`}
          subValue="total durasi"
        />
        <StatCard
          icon={<TrendingUpIcon />}
          label="Sesi Selesai"
          value={stats.sessionsCompleted}
          subValue="latihan"
        />
      </div>
    </div>
  );
}
