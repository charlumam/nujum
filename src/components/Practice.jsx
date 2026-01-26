import { useState, useEffect, useCallback, useMemo } from "react";

// Icons
const ClockIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const FlagIcon = ({ filled }) => (
  <svg className="w-5 h-5" fill={filled ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const GridIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

const XIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const AlertIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

// Format time as MM:SS or HH:MM:SS
const formatTime = (seconds) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

// Navigation Grid Modal
const NavigationGrid = ({ questions, answers, flagged, currentIndex, onSelect, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-stone-200">
          <h3 className="text-lg font-bold text-stone-700">Navigasi Soal</h3>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
          >
            <XIcon />
          </button>
        </div>
        
        {/* Legend */}
        <div className="flex gap-4 px-4 py-3 bg-stone-50 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded bg-blue-500"></div>
            <span className="text-stone-600">Aktif</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded bg-green-500"></div>
            <span className="text-stone-600">Terjawab</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded bg-stone-200"></div>
            <span className="text-stone-600">Belum</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded border-2 border-amber-500"></div>
            <span className="text-stone-600">Ditandai</span>
          </div>
        </div>
        
        {/* Grid */}
        <div className="p-4 overflow-y-auto max-h-[50vh]">
          <div className="grid grid-cols-8 sm:grid-cols-10 gap-2">
            {questions.map((q, idx) => {
              const isAnswered = answers[q.id] !== undefined;
              const isFlagged = flagged.has(q.id);
              const isCurrent = idx === currentIndex;
              
              return (
                <button
                  key={q.id}
                  onClick={() => {
                    onSelect(idx);
                    onClose();
                  }}
                  className={`
                    w-8 h-8 rounded-lg text-sm font-medium transition-all
                    ${isCurrent 
                      ? "bg-blue-500 text-white shadow-lg shadow-blue-200" 
                      : isAnswered 
                        ? "bg-green-500 text-white" 
                        : "bg-stone-200 text-stone-600 hover:bg-stone-300"
                    }
                    ${isFlagged ? "ring-2 ring-amber-500 ring-offset-1" : ""}
                  `}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>
        
        {/* Summary */}
        <div className="p-4 border-t border-stone-200 bg-stone-50">
          <div className="flex justify-between text-sm text-stone-600">
            <span>Terjawab: {Object.keys(answers).length}/{questions.length}</span>
            <span>Ditandai: {flagged.size}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Confirm Submit Modal
const ConfirmSubmitModal = ({ unansweredCount, flaggedCount, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        <div className="flex items-center gap-3 text-amber-600 mb-4">
          <AlertIcon />
          <h3 className="text-lg font-bold">Konfirmasi Selesai</h3>
        </div>
        
        <div className="space-y-2 mb-6 text-stone-600">
          {unansweredCount > 0 && (
            <p>• {unansweredCount} soal belum dijawab</p>
          )}
          {flaggedCount > 0 && (
            <p>• {flaggedCount} soal ditandai untuk ditinjau</p>
          )}
          {unansweredCount === 0 && flaggedCount === 0 && (
            <p>Semua soal sudah dijawab. Yakin ingin menyelesaikan latihan?</p>
          )}
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 px-4 rounded-xl font-medium bg-stone-100 text-stone-600 hover:bg-stone-200 transition-colors"
          >
            Kembali
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 px-4 rounded-xl font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};

// Question Card Component
const QuestionCard = ({ question, selectedAnswer, onSelectAnswer, isFlagged, onToggleFlag }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      {/* Question Header */}
      <div className="flex items-center justify-between p-4 bg-stone-50 border-b border-stone-100">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
            {question.subtest?.name || question.subtestId}
          </span>
          <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
            question.difficulty === "easy" ? "bg-green-100 text-green-700" :
            question.difficulty === "medium" ? "bg-amber-100 text-amber-700" :
            "bg-red-100 text-red-700"
          }`}>
            {question.difficulty === "easy" ? "Mudah" :
             question.difficulty === "medium" ? "Sedang" : "Sulit"}
          </span>
        </div>
        <button
          onClick={onToggleFlag}
          className={`p-2 rounded-lg transition-colors ${
            isFlagged 
              ? "bg-amber-100 text-amber-600" 
              : "hover:bg-stone-200 text-stone-400"
          }`}
          title={isFlagged ? "Hapus tanda" : "Tandai untuk ditinjau"}
        >
          <FlagIcon filled={isFlagged} />
        </button>
      </div>
      
      {/* Question Body */}
      <div className="p-5">
        <p className="text-stone-700 whitespace-pre-line leading-relaxed mb-6">
          {question.question}
        </p>
        
        {/* Options */}
        <div className="space-y-3">
          {question.options.map((option) => (
            <button
              key={option.id}
              onClick={() => onSelectAnswer(option.id)}
              className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-start gap-3 ${
                selectedAnswer === option.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-stone-200 hover:border-stone-300 hover:bg-stone-50"
              }`}
            >
              <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${
                selectedAnswer === option.id
                  ? "bg-blue-500 text-white"
                  : "bg-stone-200 text-stone-600"
              }`}>
                {option.id.toUpperCase()}
              </span>
              <span className={`flex-1 ${
                selectedAnswer === option.id ? "text-blue-700" : "text-stone-600"
              }`}>
                {option.text}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Mini Navigation Grid (visible on desktop sidebar)
const MiniNavigationGrid = ({ questions, answers, flagged, currentIndex, onSelect }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <h4 className="text-sm font-bold text-stone-700 mb-3">Navigasi Soal</h4>
      <div className="grid grid-cols-5 gap-1.5">
        {questions.map((q, idx) => {
          const isAnswered = answers[q.id] !== undefined;
          const isFlagged = flagged.has(q.id);
          const isCurrent = idx === currentIndex;
          
          return (
            <button
              key={q.id}
              onClick={() => onSelect(idx)}
              className={`
                w-8 h-8 rounded text-xs font-medium transition-all
                ${isCurrent 
                  ? "bg-blue-500 text-white" 
                  : isAnswered 
                    ? "bg-green-500 text-white" 
                    : "bg-stone-100 text-stone-500 hover:bg-stone-200"
                }
                ${isFlagged ? "ring-2 ring-amber-400" : ""}
              `}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>
      
      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-4 pt-3 border-t border-stone-100 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-green-500"></div>
          <span className="text-stone-500">Terjawab</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-stone-100"></div>
          <span className="text-stone-500">Belum</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded ring-2 ring-amber-400"></div>
          <span className="text-stone-500">Ditandai</span>
        </div>
      </div>
    </div>
  );
};

export default function Practice({ 
  questions, 
  durationMinutes, 
  subtestNames,
  onFinish, 
  onExit 
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flagged, setFlagged] = useState(new Set());
  const [timeRemaining, setTimeRemaining] = useState(durationMinutes * 60);
  const [showNavGrid, setShowNavGrid] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const currentQuestion = questions[currentIndex];
  
  // Timer Effect
  useEffect(() => {
    if (isPaused || timeRemaining <= 0) return;
    
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isPaused, timeRemaining]);

  // Timer warning class
  const timerClass = useMemo(() => {
    if (timeRemaining <= 60) return "text-red-600 bg-red-50 animate-pulse";
    if (timeRemaining <= 300) return "text-amber-600 bg-amber-50";
    return "text-stone-700 bg-white";
  }, [timeRemaining]);

  const handleSelectAnswer = useCallback((optionId) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionId,
    }));
  }, [currentQuestion?.id]);

  const handleToggleFlag = useCallback(() => {
    setFlagged((prev) => {
      const next = new Set(prev);
      if (next.has(currentQuestion.id)) {
        next.delete(currentQuestion.id);
      } else {
        next.add(currentQuestion.id);
      }
      return next;
    });
  }, [currentQuestion?.id]);

  const handlePrevious = useCallback(() => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1));
  }, [questions.length]);

  const handleSubmit = useCallback((autoSubmit = false) => {
    const totalTime = durationMinutes * 60 - timeRemaining;
    onFinish({
      answers,
      flagged: Array.from(flagged),
      totalTime,
      autoSubmit,
    });
  }, [answers, flagged, timeRemaining, durationMinutes, onFinish]);

  const unansweredCount = questions.length - Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-stone-100" style={{ fontFamily: '"Nunito Sans Variable", sans-serif' }}>
      {/* Top Bar */}
      <div className="sticky top-0 z-40 bg-white border-b border-stone-200 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left: Exit & Progress */}
            <div className="flex items-center gap-4">
              <button
                onClick={onExit}
                className="p-2 hover:bg-stone-100 rounded-lg text-stone-500 transition-colors"
                title="Keluar"
              >
                <XIcon />
              </button>
              <div className="hidden sm:block">
                <p className="text-xs text-stone-500">Latihan</p>
                <p className="text-sm font-medium text-stone-700">
                  {subtestNames.join(", ")}
                </p>
              </div>
            </div>

            {/* Center: Timer */}
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-lg font-bold ${timerClass}`}>
              <ClockIcon />
              <span>{formatTime(timeRemaining)}</span>
            </div>

            {/* Right: Progress & Submit */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-stone-500 hidden sm:block">
                {Object.keys(answers).length}/{questions.length} soal
              </span>
              <button
                onClick={() => setShowNavGrid(true)}
                className="p-2 hover:bg-stone-100 rounded-lg text-stone-500 transition-colors lg:hidden"
                title="Navigasi soal"
              >
                <GridIcon />
              </button>
              <button
                onClick={() => setShowConfirmSubmit(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors flex items-center gap-2"
              >
                <CheckIcon />
                <span className="hidden sm:inline">Selesai</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Question Area */}
          <div className="flex-1 max-w-3xl mx-auto lg:mx-0">
            {/* Question Number */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-stone-700">
                Soal {currentIndex + 1} <span className="text-stone-400 font-normal">dari {questions.length}</span>
              </h2>
            </div>

            {/* Question Card */}
            <QuestionCard
              question={currentQuestion}
              selectedAnswer={answers[currentQuestion.id]}
              onSelectAnswer={handleSelectAnswer}
              isFlagged={flagged.has(currentQuestion.id)}
              onToggleFlag={handleToggleFlag}
            />

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-6">
              <button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-colors ${
                  currentIndex === 0
                    ? "bg-stone-100 text-stone-400 cursor-not-allowed"
                    : "bg-white text-stone-600 hover:bg-stone-50 shadow-sm"
                }`}
              >
                <ChevronLeftIcon />
                <span className="hidden sm:inline">Sebelumnya</span>
              </button>

              <div className="flex items-center gap-2 lg:hidden">
                {questions.slice(Math.max(0, currentIndex - 2), currentIndex + 3).map((q, idx) => {
                  const actualIdx = Math.max(0, currentIndex - 2) + idx;
                  const isAnswered = answers[q.id] !== undefined;
                  const isCurrent = actualIdx === currentIndex;
                  
                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentIndex(actualIdx)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                        isCurrent
                          ? "bg-blue-500 text-white"
                          : isAnswered
                            ? "bg-green-100 text-green-700"
                            : "bg-stone-100 text-stone-500"
                      }`}
                    >
                      {actualIdx + 1}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={handleNext}
                disabled={currentIndex === questions.length - 1}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-colors ${
                  currentIndex === questions.length - 1
                    ? "bg-stone-100 text-stone-400 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                }`}
              >
                <span className="hidden sm:inline">Selanjutnya</span>
                <ChevronRightIcon />
              </button>
            </div>
          </div>

          {/* Sidebar - Desktop Only */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-4">
              <MiniNavigationGrid
                questions={questions}
                answers={answers}
                flagged={flagged}
                currentIndex={currentIndex}
                onSelect={setCurrentIndex}
              />
              
              {/* Stats Card */}
              <div className="bg-white rounded-xl shadow-sm p-4">
                <h4 className="text-sm font-bold text-stone-700 mb-3">Statistik</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Terjawab</span>
                    <span className="font-medium text-green-600">{Object.keys(answers).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Belum dijawab</span>
                    <span className="font-medium text-stone-600">{unansweredCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Ditandai</span>
                    <span className="font-medium text-amber-600">{flagged.size}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Grid Modal */}
      {showNavGrid && (
        <NavigationGrid
          questions={questions}
          answers={answers}
          flagged={flagged}
          currentIndex={currentIndex}
          onSelect={setCurrentIndex}
          onClose={() => setShowNavGrid(false)}
        />
      )}

      {/* Confirm Submit Modal */}
      {showConfirmSubmit && (
        <ConfirmSubmitModal
          unansweredCount={unansweredCount}
          flaggedCount={flagged.size}
          onConfirm={() => handleSubmit(false)}
          onCancel={() => setShowConfirmSubmit(false)}
        />
      )}
    </div>
  );
}
