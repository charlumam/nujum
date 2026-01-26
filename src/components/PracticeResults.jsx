import { useState, useMemo } from "react";

// Icons
const CheckCircleIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const XCircleIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const TargetIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const DocumentIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const ChevronUpIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
  </svg>
);

const RefreshIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const HomeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

// Format time as Xm Ys or Xj Ym Zd
const formatTime = (seconds) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hrs > 0) {
    return `${hrs}j ${mins}m ${secs}d`;
  }
  return `${mins}m ${secs}d`;
};

// Score Circle Component
const ScoreCircle = ({ score, size = "large" }) => {
  const radius = size === "large" ? 70 : 40;
  const strokeWidth = size === "large" ? 8 : 5;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  
  const getColor = (s) => {
    if (s >= 80) return { stroke: "#22c55e", text: "text-green-600", bg: "bg-green-50" };
    if (s >= 60) return { stroke: "#f59e0b", text: "text-amber-600", bg: "bg-amber-50" };
    return { stroke: "#ef4444", text: "text-red-600", bg: "bg-red-50" };
  };
  
  const colors = getColor(score);
  
  return (
    <div className={`relative inline-flex items-center justify-center ${size === "large" ? "w-44 h-44" : "w-24 h-24"}`}>
      <svg className="transform -rotate-90" width={size === "large" ? 176 : 96} height={size === "large" ? 176 : 96}>
        <circle
          cx={size === "large" ? 88 : 48}
          cy={size === "large" ? 88 : 48}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size === "large" ? 88 : 48}
          cy={size === "large" ? 88 : 48}
          r={radius}
          fill="none"
          stroke={colors.stroke}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`${size === "large" ? "text-4xl" : "text-xl"} font-bold ${colors.text}`}>
          {Math.round(score)}
        </span>
        <span className={`${size === "large" ? "text-sm" : "text-xs"} text-stone-500`}>skor</span>
      </div>
    </div>
  );
};

// Stats Card
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

// Subtest Breakdown Card
const SubtestBreakdown = ({ subtestId, subtestName, questions, answers }) => {
  const subtestQuestions = questions.filter(q => q.subtestId === subtestId);
  const correct = subtestQuestions.filter(q => answers[q.id] === q.correctAnswer).length;
  const total = subtestQuestions.length;
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
  
  return (
    <div className="flex items-center gap-4 p-3 bg-stone-50 rounded-lg">
      <div className="flex-1 min-w-0">
        <p className="font-medium text-stone-700 truncate">{subtestName}</p>
        <p className="text-sm text-stone-500">{correct}/{total} benar</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-24 bg-stone-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all ${
              percentage >= 80 ? "bg-green-500" :
              percentage >= 60 ? "bg-amber-500" : "bg-red-500"
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className={`text-sm font-bold w-10 text-right ${
          percentage >= 80 ? "text-green-600" :
          percentage >= 60 ? "text-amber-600" : "text-red-600"
        }`}>
          {percentage}%
        </span>
      </div>
    </div>
  );
};

// Question Review Card
const QuestionReview = ({ question, userAnswer, isExpanded, onToggle }) => {
  const isCorrect = userAnswer === question.correctAnswer;
  const wasAnswered = userAnswer !== undefined;
  
  return (
    <div className={`border-2 rounded-xl overflow-hidden transition-colors ${
      isCorrect ? "border-green-200 bg-green-50/50" : 
      wasAnswered ? "border-red-200 bg-red-50/50" :
      "border-stone-200 bg-stone-50/50"
    }`}>
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-white/50 transition-colors"
      >
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isCorrect ? "bg-green-100 text-green-600" : 
          wasAnswered ? "bg-red-100 text-red-600" :
          "bg-stone-200 text-stone-500"
        }`}>
          {isCorrect ? <CheckCircleIcon /> : <XCircleIcon />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-stone-700 line-clamp-2">{question.question}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            isCorrect ? "bg-green-100 text-green-700" :
            wasAnswered ? "bg-red-100 text-red-700" :
            "bg-stone-200 text-stone-600"
          }`}>
            {isCorrect ? "Benar" : wasAnswered ? "Salah" : "Tidak Dijawab"}
          </span>
          {isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-stone-200">
          <div className="pt-4 space-y-3">
            {/* Options */}
            {question.options.map((option) => {
              const isUserAnswer = userAnswer === option.id;
              const isCorrectOption = question.correctAnswer === option.id;
              
              return (
                <div
                  key={option.id}
                  className={`p-3 rounded-lg flex items-start gap-3 ${
                    isCorrectOption ? "bg-green-100 border border-green-300" :
                    isUserAnswer && !isCorrect ? "bg-red-100 border border-red-300" :
                    "bg-white border border-stone-200"
                  }`}
                >
                  <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    isCorrectOption ? "bg-green-500 text-white" :
                    isUserAnswer && !isCorrect ? "bg-red-500 text-white" :
                    "bg-stone-200 text-stone-600"
                  }`}>
                    {option.id.toUpperCase()}
                  </span>
                  <span className={`flex-1 text-sm ${
                    isCorrectOption ? "text-green-800" :
                    isUserAnswer && !isCorrect ? "text-red-800" :
                    "text-stone-600"
                  }`}>
                    {option.text}
                    {isCorrectOption && <span className="ml-2 text-green-600 font-medium">(Jawaban Benar)</span>}
                    {isUserAnswer && !isCorrect && <span className="ml-2 text-red-600 font-medium">(Jawaban Anda)</span>}
                  </span>
                </div>
              );
            })}
            
            {/* Explanation */}
            {question.explanation && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm font-medium text-blue-800 mb-1">Pembahasan:</p>
                <p className="text-sm text-blue-700">{question.explanation}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default function PracticeResults({
  questions,
  answers,
  totalTime,
  subtestNames,
  autoSubmit,
  onRetry,
  onBack,
}) {
  const [filter, setFilter] = useState("all"); // all, correct, incorrect, unanswered
  const [expandedQuestions, setExpandedQuestions] = useState(new Set());

  // Calculate results
  const results = useMemo(() => {
    const correct = questions.filter(q => answers[q.id] === q.correctAnswer).length;
    const incorrect = questions.filter(q => answers[q.id] && answers[q.id] !== q.correctAnswer).length;
    const unanswered = questions.filter(q => !answers[q.id]).length;
    const score = Math.round((correct / questions.length) * 100);
    
    // Group by subtest
    const subtestIds = [...new Set(questions.map(q => q.subtestId))];
    
    return {
      correct,
      incorrect,
      unanswered,
      score,
      total: questions.length,
      subtestIds,
    };
  }, [questions, answers]);

  // Filtered questions
  const filteredQuestions = useMemo(() => {
    switch (filter) {
      case "correct":
        return questions.filter(q => answers[q.id] === q.correctAnswer);
      case "incorrect":
        return questions.filter(q => answers[q.id] && answers[q.id] !== q.correctAnswer);
      case "unanswered":
        return questions.filter(q => !answers[q.id]);
      default:
        return questions;
    }
  }, [questions, answers, filter]);

  const toggleQuestion = (questionId) => {
    setExpandedQuestions(prev => {
      const next = new Set(prev);
      if (next.has(questionId)) {
        next.delete(questionId);
      } else {
        next.add(questionId);
      }
      return next;
    });
  };

  const expandAll = () => {
    setExpandedQuestions(new Set(filteredQuestions.map(q => q.id)));
  };

  const collapseAll = () => {
    setExpandedQuestions(new Set());
  };

  return (
    <div className="min-h-screen bg-stone-100" style={{ fontFamily: '"Nunito Sans Variable", sans-serif' }}>
      {/* Header */}
      <div className="bg-white border-b border-stone-200">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-stone-700 mb-2">
              Hasil Latihan
            </h1>
            <p className="text-stone-500">
              {subtestNames.join(", ")}
            </p>
            {autoSubmit && (
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-amber-100 text-amber-700 text-sm rounded-full">
                <ClockIcon />
                <span>Waktu habis - otomatis dikumpulkan</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Score Overview */}
        <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-8">
            {/* Score Circle */}
            <div className="flex-shrink-0">
              <ScoreCircle score={results.score} size="large" />
            </div>
            
            {/* Stats */}
            <div className="flex-1 w-full">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center sm:text-left">
                  <p className="text-3xl font-bold text-green-600">{results.correct}</p>
                  <p className="text-sm text-stone-500">Benar</p>
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-3xl font-bold text-red-600">{results.incorrect}</p>
                  <p className="text-sm text-stone-500">Salah</p>
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-3xl font-bold text-stone-400">{results.unanswered}</p>
                  <p className="text-sm text-stone-500">Tidak Dijawab</p>
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-3xl font-bold text-stone-700">{formatTime(totalTime)}</p>
                  <p className="text-sm text-stone-500">Waktu</p>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-6">
                <div className="flex h-3 rounded-full overflow-hidden bg-stone-200">
                  <div 
                    className="bg-green-500 transition-all" 
                    style={{ width: `${(results.correct / results.total) * 100}%` }}
                  />
                  <div 
                    className="bg-red-500 transition-all" 
                    style={{ width: `${(results.incorrect / results.total) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-xs text-stone-500">
                  <span>{results.correct} benar</span>
                  <span>{results.incorrect} salah</span>
                  <span>{results.unanswered} kosong</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subtest Breakdown */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold text-stone-700 mb-4">Performa per Subtes</h2>
          <div className="space-y-3">
            {results.subtestIds.map((subtestId) => {
              const subtestQuestion = questions.find(q => q.subtestId === subtestId);
              const subtestName = subtestQuestion?.subtest?.name || subtestId;
              
              return (
                <SubtestBreakdown
                  key={subtestId}
                  subtestId={subtestId}
                  subtestName={subtestName}
                  questions={questions}
                  answers={answers}
                />
              );
            })}
          </div>
        </div>

        {/* Question Review */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <h2 className="text-lg font-bold text-stone-700">Review Soal</h2>
            
            <div className="flex items-center gap-2">
              {/* Filter */}
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 rounded-lg border border-stone-300 text-sm bg-white"
              >
                <option value="all">Semua ({questions.length})</option>
                <option value="correct">Benar ({results.correct})</option>
                <option value="incorrect">Salah ({results.incorrect})</option>
                <option value="unanswered">Tidak Dijawab ({results.unanswered})</option>
              </select>
              
              {/* Expand/Collapse */}
              <button
                onClick={expandedQuestions.size > 0 ? collapseAll : expandAll}
                className="px-3 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-sm text-stone-600 transition-colors"
              >
                {expandedQuestions.size > 0 ? "Tutup Semua" : "Buka Semua"}
              </button>
            </div>
          </div>

          {/* Questions List */}
          <div className="space-y-3">
            {filteredQuestions.map((question, idx) => (
              <QuestionReview
                key={question.id}
                question={question}
                userAnswer={answers[question.id]}
                isExpanded={expandedQuestions.has(question.id)}
                onToggle={() => toggleQuestion(question.id)}
              />
            ))}
          </div>

          {filteredQuestions.length === 0 && (
            <div className="text-center py-8 text-stone-400">
              <p>Tidak ada soal yang sesuai filter</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={onBack}
            className="flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-medium bg-white text-stone-600 hover:bg-stone-50 shadow-sm transition-colors"
          >
            <HomeIcon />
            Kembali ke Beranda
          </button>
          <button
            onClick={onRetry}
            className="flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-medium bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-colors"
          >
            <RefreshIcon />
            Latihan Lagi
          </button>
        </div>
      </div>
    </div>
  );
}
