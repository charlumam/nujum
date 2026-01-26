import { useState } from "react";

// Subtests available for practice
const SUBTESTS = [
  { id: "pu", name: "Penalaran Umum", description: "Logika, analisis, dan penalaran" },
  { id: "ppu", name: "Pengetahuan Umum", description: "Wawasan kebangsaan dan sosial" },
  { id: "pbm", name: "Pemahaman Bacaan & Menulis", description: "Membaca dan menulis efektif" },
  { id: "pk", name: "Pengetahuan Kuantitatif", description: "Matematika dasar dan terapan" },
  { id: "lbi", name: "Literasi Bahasa Indonesia", description: "Pemahaman teks bahasa Indonesia" },
  { id: "lbe", name: "Literasi Bahasa Inggris", description: "Pemahaman teks bahasa Inggris" },
  { id: "pm", name: "Penalaran Matematika", description: "Logika dan pemecahan masalah matematika" },
];

// Duration options
const DURATION_OPTIONS = [
  { id: "short", label: "Singkat", minutes: 45, questions: "~40 soal" },
  { id: "medium", label: "Sedang", minutes: 90, questions: "~80 soal" },
  { id: "long", label: "Panjang", minutes: 140, questions: "~120 soal" },
  { id: "full", label: "Penuh", minutes: 190, questions: "~160 soal" },
];

const MOCK_RECENT_SESSIONS = [
  {
    id: 1,
    subtests: ["Penalaran Umum"],
    score: 85,
    date: "2026-01-25",
    duration: 90,
    questions: 80,
  },
  {
    id: 2,
    subtests: ["Literasi Bahasa Inggris", "Literasi Bahasa Indonesia"],
    score: 72,
    date: "2026-01-24",
    duration: 140,
    questions: 120,
  },
  {
    id: 3,
    subtests: ["Penalaran Matematika"],
    score: 90,
    date: "2026-01-23",
    duration: 45,
    questions: 40,
  },
];

const MOCK_STATS = {
  totalQuestions: 245,
  accuracy: 78,
  totalTime: 420, // in minutes
  sessionsCompleted: 12,
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
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const TrendingUpIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const DocumentIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const TimerIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
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
        <h4 className={`font-medium ${selected ? "text-blue-700" : "text-stone-700"}`}>
          {subtest.name}
        </h4>
        <p className="text-xs text-stone-500 mt-0.5">{subtest.description}</p>
      </div>
      {selected && (
        <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </div>
  </button>
);

// Recent Session Row Component
const RecentSession = ({ session }) => {
  const subtestLabel = session.subtests.length > 1 
    ? `${session.subtests[0]} +${session.subtests.length - 1}` 
    : session.subtests[0];
  
  return (
    <div className="flex items-center gap-3 py-3 border-b border-stone-100 last:border-0">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold ${
        session.score >= 80 ? "bg-green-100 text-green-700" : 
        session.score >= 60 ? "bg-yellow-100 text-yellow-700" : 
        "bg-red-100 text-red-600"
      }`}>
        {session.score}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-stone-700 truncate">{subtestLabel}</p>
        <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
          {new Date(session.date).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
          })}
          <span className="mx-1">•</span>
          {session.duration}'
          <span className="mx-1">•</span>
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
      <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
    </div>
    <p className="text-2xl font-bold text-stone-700">{value}</p>
    {subValue && <p className="text-xs text-stone-500 mt-0.5">{subValue}</p>}
  </div>
);

export default function PrepDashboard() {
  const [selectedSubtests, setSelectedSubtests] = useState([]);
  const [selectedDuration, setSelectedDuration] = useState("medium");

  const handleSubtestToggle = (subtestId) => {
    setSelectedSubtests((prev) =>
      prev.includes(subtestId)
        ? prev.filter((id) => id !== subtestId)
        : [...prev, subtestId]
    );
  };

  const handleSelectAll = () => {
    if (selectedSubtests.length === SUBTESTS.length) {
      setSelectedSubtests([]);
    } else {
      setSelectedSubtests(SUBTESTS.map((s) => s.id));
    }
  };

  const handleStartPractice = () => {
    const duration = DURATION_OPTIONS.find((d) => d.id === selectedDuration);
    console.log("Starting practice:", {
      subtests: selectedSubtests,
      duration: duration?.minutes,
    });
    // Placeholder for navigation/action
  };

  const allSelected = selectedSubtests.length === SUBTESTS.length;
  const canStart = selectedSubtests.length > 0;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-stone-700 mb-2">
          Latihan Persiapan SNBT
        </h1>
        <p className="text-stone-500">
          Pilih subtes dan durasi latihan yang kamu inginkan
        </p>
      </div>

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
            <h3 className="text-lg font-bold text-stone-700 mb-4">Durasi Latihan</h3>
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
              {DURATION_OPTIONS.find((d) => d.id === selectedDuration)?.questions}
            </p>
          </div>

          {/* Start Button */}
          <button
            onClick={handleStartPractice}
            disabled={!canStart}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3 ${
              canStart
                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200"
                : "bg-stone-200 text-stone-400 cursor-not-allowed"
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
            {MOCK_RECENT_SESSIONS.length > 0 ? (
              <div>
                {MOCK_RECENT_SESSIONS.map((session) => (
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
          value={MOCK_STATS.totalQuestions}
          subValue="soal dikerjakan"
        />
        <StatCard
          icon={<TargetIcon />}
          label="Akurasi"
          value={`${MOCK_STATS.accuracy}%`}
          subValue="jawaban benar"
        />
        <StatCard
          icon={<TimerIcon />}
          label="Waktu Latihan"
          value={`${Math.floor(MOCK_STATS.totalTime / 60)}j ${MOCK_STATS.totalTime % 60}m`}
          subValue="total durasi"
        />
        <StatCard
          icon={<TrendingUpIcon />}
          label="Sesi Selesai"
          value={MOCK_STATS.sessionsCompleted}
          subValue="latihan"
        />
      </div>
    </div>
  );
}
