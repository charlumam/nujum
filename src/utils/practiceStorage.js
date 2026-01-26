/**
 * Practice Storage Utility
 * 
 * Abstraction layer for storing practice session data.
 * Currently uses localStorage, but designed to be easily swapped with D1 SQLite.
 * 
 * To migrate to D1:
 * 1. Create corresponding API endpoints in src/pages/api/
 * 2. Replace localStorage calls with fetch() calls to those endpoints
 * 3. The interface (function signatures) should remain the same
 */

const STORAGE_KEYS = {
  SESSIONS: "nujum_practice_sessions",
  CURRENT_SESSION: "nujum_current_practice_session",
  USER_STATS: "nujum_practice_stats",
};

/**
 * @typedef {Object} PracticeSession
 * @property {string} id - Unique session ID
 * @property {string[]} subtests - Array of subtest IDs
 * @property {string[]} subtestNames - Array of subtest names
 * @property {number} duration - Duration in minutes
 * @property {Object<string, string>} answers - Map of questionId to answerId
 * @property {number} score - Score percentage (0-100)
 * @property {number} correct - Number of correct answers
 * @property {number} total - Total number of questions
 * @property {number} totalTime - Time spent in seconds
 * @property {string} date - ISO date string
 * @property {boolean} completed - Whether session was completed
 * @property {boolean} autoSubmit - Whether session was auto-submitted due to timeout
 */

/**
 * @typedef {Object} PracticeStats
 * @property {number} totalQuestions - Total questions answered across all sessions
 * @property {number} correctAnswers - Total correct answers
 * @property {number} totalTime - Total time spent in seconds
 * @property {number} sessionsCompleted - Number of completed sessions
 */

// Helper to generate unique IDs
const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Helper to safely parse JSON
const safeJSONParse = (str, fallback) => {
  try {
    return JSON.parse(str) || fallback;
  } catch {
    return fallback;
  }
};

/**
 * Save a completed practice session
 * @param {PracticeSession} session 
 * @returns {Promise<PracticeSession>}
 */
export async function saveSession(session) {
  // TODO: Replace with API call for D1
  // return fetch('/api/practice/sessions', { method: 'POST', body: JSON.stringify(session) })
  
  const sessions = await getSessions();
  const newSession = {
    ...session,
    id: generateId(),
    date: new Date().toISOString(),
    completed: true,
  };
  
  sessions.unshift(newSession); // Add to beginning
  
  // Keep only last 50 sessions to prevent localStorage bloat
  const trimmedSessions = sessions.slice(0, 50);
  
  localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(trimmedSessions));
  
  // Update stats
  await updateStats(newSession);
  
  return newSession;
}

/**
 * Get all practice sessions
 * @param {number} [limit=10] - Maximum number of sessions to return
 * @returns {Promise<PracticeSession[]>}
 */
export async function getSessions(limit = 10) {
  // TODO: Replace with API call for D1
  // return fetch(`/api/practice/sessions?limit=${limit}`).then(r => r.json())
  
  const stored = localStorage.getItem(STORAGE_KEYS.SESSIONS);
  const sessions = safeJSONParse(stored, []);
  return sessions.slice(0, limit);
}

/**
 * Get recent sessions formatted for display
 * @param {number} [limit=3] - Maximum number of sessions to return
 * @returns {Promise<Array>}
 */
export async function getRecentSessions(limit = 3) {
  const sessions = await getSessions(limit);
  
  return sessions.map(session => ({
    id: session.id,
    subtests: session.subtestNames || session.subtests,
    score: session.score,
    date: session.date,
    duration: session.duration,
    questions: session.total,
  }));
}

/**
 * Save current practice session state (for recovery on page refresh)
 * @param {Object} sessionState
 * @returns {Promise<void>}
 */
export async function saveCurrentSession(sessionState) {
  // For D1, you might want to save this server-side as well
  // but localStorage is fine for session recovery
  
  localStorage.setItem(STORAGE_KEYS.CURRENT_SESSION, JSON.stringify({
    ...sessionState,
    savedAt: Date.now(),
  }));
}

/**
 * Get current in-progress session (for recovery)
 * @returns {Promise<Object|null>}
 */
export async function getCurrentSession() {
  const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_SESSION);
  if (!stored) return null;
  
  const session = safeJSONParse(stored, null);
  if (!session) return null;
  
  // Check if session is still valid (less than 4 hours old)
  const maxAge = 4 * 60 * 60 * 1000; // 4 hours in ms
  if (Date.now() - session.savedAt > maxAge) {
    clearCurrentSession();
    return null;
  }
  
  return session;
}

/**
 * Clear current session state
 * @returns {Promise<void>}
 */
export async function clearCurrentSession() {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_SESSION);
}

/**
 * Get user practice statistics
 * @returns {Promise<PracticeStats>}
 */
export async function getStats() {
  // TODO: Replace with API call for D1
  // return fetch('/api/practice/stats').then(r => r.json())
  
  const stored = localStorage.getItem(STORAGE_KEYS.USER_STATS);
  return safeJSONParse(stored, {
    totalQuestions: 0,
    correctAnswers: 0,
    totalTime: 0,
    sessionsCompleted: 0,
  });
}

/**
 * Update stats after completing a session
 * @param {PracticeSession} session
 * @returns {Promise<PracticeStats>}
 */
async function updateStats(session) {
  // TODO: Replace with server-side calculation for D1
  
  const stats = await getStats();
  
  const updatedStats = {
    totalQuestions: stats.totalQuestions + session.total,
    correctAnswers: stats.correctAnswers + session.correct,
    totalTime: stats.totalTime + session.totalTime,
    sessionsCompleted: stats.sessionsCompleted + 1,
  };
  
  localStorage.setItem(STORAGE_KEYS.USER_STATS, JSON.stringify(updatedStats));
  
  return updatedStats;
}

/**
 * Get formatted stats for display
 * @returns {Promise<Object>}
 */
export async function getFormattedStats() {
  const stats = await getStats();
  
  const accuracy = stats.totalQuestions > 0 
    ? Math.round((stats.correctAnswers / stats.totalQuestions) * 100) 
    : 0;
  
  return {
    totalQuestions: stats.totalQuestions,
    accuracy,
    totalTime: Math.round(stats.totalTime / 60), // Convert to minutes
    sessionsCompleted: stats.sessionsCompleted,
  };
}

/**
 * Clear all practice data (for testing/debugging)
 * @returns {Promise<void>}
 */
export async function clearAllData() {
  localStorage.removeItem(STORAGE_KEYS.SESSIONS);
  localStorage.removeItem(STORAGE_KEYS.CURRENT_SESSION);
  localStorage.removeItem(STORAGE_KEYS.USER_STATS);
}
