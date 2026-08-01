/**
 * storage.js — localStorage abstraction for BECOME
 * Replaces Supabase in the local-only build.
 * All data is namespaced under "become_" prefix.
 */

const NS = 'become_'

const get = (key, fallback = null) => {
  try {
    const raw = localStorage.getItem(NS + key)
    return raw ? JSON.parse(raw) : fallback
  } catch { return fallback }
}

const set = (key, value) => {
  try { localStorage.setItem(NS + key, JSON.stringify(value)) }
  catch (e) { console.error('Storage write failed', e) }
}

const remove = (key) => localStorage.removeItem(NS + key)

// ===== USER PROFILE =====
export const getProfile = () => get('profile', null)
export const setProfile = (profile) => set('profile', { ...profile, updatedAt: Date.now() })
export const hasProfile = () => !!get('profile', null)

// ===== GROWTH STATE =====
const DEFAULT_GROWTH_STATE = {
  trustScore: 82,
  momentum: 'medium',     // low | medium | high
  consistency: 5,         // completion streak
  identityStage: 'early', // early | mid | advanced
  lastIntervention: null, // LEARN | REFLECT | ACT | CONNECT
  sessionCount: 1,
  completedCount: 3,
  skippedCount: 0,
}

export const getGrowthState = () => get('growthState', DEFAULT_GROWTH_STATE)

export const updateGrowthState = (updates) => {
  const current = getGrowthState()
  const next = { ...current, ...updates, updatedAt: Date.now() }
  set('growthState', next)
  return next
}

// ===== RECOMMENDATION LOGGING =====
export const getRecommendationHistory = () => get('recommendations', [])

export const logRecommendation = (rec, status = 'completed', feedback = null) => {
  const history = getRecommendationHistory()
  const entry = {
    id: rec.id,
    title: rec.title,
    type: rec.type,
    creator: rec.creator,
    status,
    feedback,
    loggedAt: Date.now(),
  }
  const next = [entry, ...history.filter(h => h.id !== rec.id)]
  set('recommendations', next)
  return next
}

export const getCompletedIds = () => {
  return getRecommendationHistory()
    .filter(h => h.status === 'completed')
    .map(h => h.id)
}

// ===== SESSIONS =====
export const getSessions = () => get('sessions', [])

export const logSession = (session) => {
  const sessions = getSessions()
  const entry = { ...session, id: `session_${Date.now()}`, timestamp: Date.now() }
  set('sessions', [entry, ...sessions])
  return entry
}

// ===== STREAK CALCULATION =====
export const updateStreak = (completed) => {
  const current = getGrowthState()
  let { consistency = 0, trustScore = 50 } = current

  if (completed) {
    consistency += 1
    trustScore = Math.min(100, trustScore + 3)
  } else {
    consistency = Math.max(0, consistency - 1)
    trustScore = Math.max(0, trustScore - 5)
  }

  let momentum = 'medium'
  if (consistency >= 5) momentum = 'high'
  if (consistency < 2) momentum = 'low'

  return updateGrowthState({ consistency, trustScore, momentum })
}

// ===== RESET ALL =====
export const resetAll = () => {
  ['profile', 'growthState', 'recommendations', 'sessions'].forEach(remove)
}
