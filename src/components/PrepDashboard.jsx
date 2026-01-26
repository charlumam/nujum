import { useState } from "react";

// Mock data for the prototype
const MOCK_PROGRESS = {
  totalSessions: 12,
  completedSessions: 5,
  totalQuestions: 180,
  answeredCorrectly: 127,
  currentStreak: 3,
  bestStreak: 7,
};

const MOCK_SUBJECTS = [
  { id: "pu", name: "Penalaran Umum", progress: 65, total: 30, completed: 19 },
  {
    id: "ppu",
    name: "Pengetahuan Umum",
    progress: 40,
    total: 25,
    completed: 10,
  },
  {
    id: "pbm",
    name: "Bacaan & Menulis",
    progress: 80,
    total: 20,
    completed: 16,
  },
  {
    id: "pk",
    name: "Pengetahuan Kuantitatif",
    progress: 55,
    total: 25,
    completed: 14,
  },
  {
    id: "lbi",
    name: "Literasi Bahasa Indonesia",
    progress: 70,
    total: 30,
    completed: 21,
  },
  {
    id: "lbe",
    name: "Literasi Bahasa Inggris",
    progress: 45,
    total: 25,
    completed: 11,
  },
  {
    id: "pm",
    name: "Penalaran Matematika",
    progress: 30,
    total: 25,
    completed: 8,
  },
];

const MOCK_RECENT_SESSIONS = [
  {
    id: 1,
    subject: "Penalaran Umum",
    score: 85,
    date: "2026-01-25",
    questions: 20,
  },
  {
    id: 2,
    subject: "Literasi Bahasa Inggris",
    score: 72,
    date: "2026-01-24",
    questions: 15,
  },
  {
    id: 3,
    subject: "Penalaran Matematika",
    score: 90,
    date: "2026-01-23",
    questions: 20,
  },
];

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

const FireIcon = () => (
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
      d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
    />
  </svg>
);

const ChartIcon = () => (
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
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
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

// Stat Card Component
const StatCard = ({ icon, label, value, subValue, accent = false }) => (
  <div
    className={`p-4 rounded-lg ${accent ? "bg-blue-50 border border-blue-100" : "bg-stone-50"}`}
  >
    <div
      className={`flex items-center gap-2 mb-1 ${accent ? "text-blue-600" : "text-stone-500"}`}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </div>
    <p
      className={`text-2xl font-bold ${accent ? "text-blue-700" : "text-stone-700"}`}
    >
      {value}
    </p>
    {subValue && <p className="text-xs text-stone-500 mt-0.5">{subValue}</p>}
  </div>
);

// Progress Bar Component
const ProgressBar = ({ progress, size = "md" }) => {
  const height = size === "sm" ? "h-1.5" : "h-2";
  return (
    <div
      className={`w-full bg-stone-200 rounded-full ${height} overflow-hidden`}
    >
      <div
        className={`bg-blue-500 ${height} rounded-full transition-all duration-300`}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

// Subject Card Component
const SubjectCard = ({ subject, onStart }) => (
  <div className="flex items-center justify-between p-3 bg-stone-50 rounded-lg hover:bg-blue-50 transition-colors group">
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between mb-1">
        <h4 className="text-sm font-medium text-stone-700 truncate pr-2">
          {subject.name}
        </h4>
        <span className="text-xs text-stone-500 shrink-0">
          {subject.completed}/{subject.total}
        </span>
      </div>
      <ProgressBar progress={subject.progress} size="sm" />
    </div>
    <button
      onClick={() => onStart(subject.id)}
      className="ml-3 p-2 text-stone-400 hover:text-blue-600 hover:bg-white rounded-full transition-colors opacity-0 group-hover:opacity-100"
      aria-label={`Mulai latihan ${subject.name}`}
    >
      <PlayIcon />
    </button>
  </div>
);

// Recent Session Row Component
const RecentSession = ({ session }) => (
  <div className="flex items-center justify-between py-3 border-b border-stone-100 last:border-0">
    <div className="flex-1">
      <p className="text-sm font-medium text-stone-700">{session.subject}</p>
      <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
        <ClockIcon />
        {new Date(session.date).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
        })}
        <span className="mx-1">•</span>
        {session.questions} soal
      </p>
    </div>
    <div
      className={`text-lg font-bold ${session.score >= 80 ? "text-green-600" : session.score >= 60 ? "text-yellow-600" : "text-red-500"}`}
    >
      {session.score}%
    </div>
  </div>
);

export default function PrepDashboard() {
  const [selectedTab, setSelectedTab] = useState("overview");
  const accuracy = Math.round(
    (MOCK_PROGRESS.answeredCorrectly / MOCK_PROGRESS.totalQuestions) * 100,
  );

  const handleStartPractice = (subjectId) => {
    // Placeholder for navigation/action
    console.log(`Starting practice for: ${subjectId}`);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-stone-700 mb-2">
          Latihan Persiapan SNBT
        </h1>
        <p className="text-stone-500">
          Persiapkan dirimu dengan latihan soal berkualitas
        </p>
      </div>

      {/* Quick Action */}
      <div className="bg-linear-to-r from-blue-600 to-blue-500 rounded-xl p-6 text-white">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold mb-1">
              Lanjutkan Latihan
            </h2>
            <p className="text-blue-100 text-sm">
              Kamu sedang dalam streak {MOCK_PROGRESS.currentStreak} hari!
              Jangan putus.
            </p>
          </div>
          <button className="w-full sm:w-auto px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2">
            <PlayIcon />
            Mulai Sekarang
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          icon={<BookIcon />}
          label="Sesi Latihan"
          value={`${MOCK_PROGRESS.completedSessions}/${MOCK_PROGRESS.totalSessions}`}
          subValue="sesi selesai"
        />
        <StatCard
          icon={<CheckIcon />}
          label="Akurasi"
          value={`${accuracy}%`}
          subValue={`${MOCK_PROGRESS.answeredCorrectly} jawaban benar`}
          accent
        />
        <StatCard
          icon={<FireIcon />}
          label="Streak"
          value={`${MOCK_PROGRESS.currentStreak} hari`}
          subValue={`Terbaik: ${MOCK_PROGRESS.bestStreak} hari`}
        />
        <StatCard
          icon={<ChartIcon />}
          label="Total Soal"
          value={MOCK_PROGRESS.totalQuestions}
          subValue="soal dikerjakan"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Subjects Progress */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-stone-700">
              Progress Materi
            </h3>
            <span className="text-xs text-stone-500 bg-stone-100 px-2 py-1 rounded-full">
              7 subtes
            </span>
          </div>
          <div className="space-y-2">
            {MOCK_SUBJECTS.map((subject) => (
              <SubjectCard
                key={subject.id}
                subject={subject}
                onStart={handleStartPractice}
              />
            ))}
          </div>
        </div>

        {/* Recent Sessions */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h3 className="text-lg font-bold text-stone-700 mb-4">
            Aktivitas Terbaru
          </h3>
          {MOCK_RECENT_SESSIONS.length > 0 ? (
            <div>
              {MOCK_RECENT_SESSIONS.map((session) => (
                <RecentSession key={session.id} session={session} />
              ))}
              <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium py-2 hover:bg-blue-50 rounded-lg transition-colors">
                Lihat Semua Riwayat
              </button>
            </div>
          ) : (
            <div className="text-center py-8 text-stone-500">
              <BookIcon />
              <p className="mt-2 text-sm">Belum ada sesi latihan</p>
            </div>
          )}
        </div>
      </div>

      {/* Tips Section */}
      <div className="bg-stone-50 rounded-xl p-5 border border-stone-200">
        <h3 className="text-sm font-bold text-stone-600 uppercase tracking-wide mb-3">
          💡 Tips Hari Ini
        </h3>
        <p className="text-stone-600 text-sm leading-relaxed">
          Fokus pada materi dengan progress terendah terlebih dahulu.
          Berdasarkan data latihanmu,
          <span className="font-semibold text-blue-600">
            {" "}
            Penalaran Matematika{" "}
          </span>
          membutuhkan perhatian lebih. Luangkan 20-30 menit setiap hari untuk
          materi ini.
        </p>
      </div>
    </div>
  );
}
