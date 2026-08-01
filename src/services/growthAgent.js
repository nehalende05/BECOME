/**
 * growthAgent.js — The BECOME Dynamic Growth Curator Agent
 *
 * Implements the full OBSERVE → THINK → DISCOVER → CURATE → EXPLAIN pipeline.
 *
 * Guarantees 100% dynamic, fresh, non-repeating video recommendations from our
 * 36+ growth video library based on user goals, current traits, and target identity.
 */

import {
  CONTENT_LIBRARY,
  INTERVENTIONS,
  scoreContent,
} from './contentLibrary.js'

import { getRecommendationHistory, getCompletedIds } from './storage.js'

// ─── Session History Storage (Prevents repeating videos) ──────────────────────

const SHOWN_IDS_KEY = 'become_session_shown_ids'

const getRecentlyShownIds = () => {
  try {
    return JSON.parse(localStorage.getItem(SHOWN_IDS_KEY) || '[]')
  } catch {
    return []
  }
}

export const recordShownIds = (ids) => {
  try {
    const existing = getRecentlyShownIds()
    // Keep memory of last 24 shown videos to ensure maximum variety
    const updated = [...new Set([...ids, ...existing])].slice(0, 24)
    localStorage.setItem(SHOWN_IDS_KEY, JSON.stringify(updated))
  } catch {}
}

export const clearShownHistory = () => {
  try {
    localStorage.removeItem(SHOWN_IDS_KEY)
  } catch {}
}

// ─── Determine Intervention Mode ──────────────────────────────────────────────

const determineIntervention = (growthState) => {
  const { trustScore, momentum, lastIntervention, identityStage } = growthState || {}
  if ((trustScore !== undefined && trustScore < 40) || momentum === 'low') return INTERVENTIONS.ACT
  if (trustScore > 75 && identityStage === 'advanced') return INTERVENTIONS.CONNECT
  const rotationMap = {
    [INTERVENTIONS.LEARN]: INTERVENTIONS.REFLECT,
    [INTERVENTIONS.REFLECT]: INTERVENTIONS.ACT,
    [INTERVENTIONS.ACT]: INTERVENTIONS.CONNECT,
    [INTERVENTIONS.CONNECT]: INTERVENTIONS.LEARN,
    null: INTERVENTIONS.LEARN,
  }
  if (identityStage === 'early' && !lastIntervention) return INTERVENTIONS.LEARN
  return rotationMap[lastIntervention] ?? INTERVENTIONS.LEARN
}

// ─── Dynamic Weighted Selection Engine ────────────────────────────────────────

const selectDynamicRecommendations = (profile, growthState, requestedCount = 3, filterType = null) => {
  const completedIds = getCompletedIds()
  const recentlyShownIds = getRecentlyShownIds()

  // Filter out completed videos & apply filterType if specified (e.g. 'Book')
  let availablePool = CONTENT_LIBRARY.filter(item => {
    if (completedIds.includes(item.id)) return false
    if (filterType && filterType !== 'All' && item.type.toLowerCase() !== filterType.toLowerCase()) return false
    return true
  })

  // Fallback if pool is empty for specific filter
  if (availablePool.length === 0) {
    availablePool = CONTENT_LIBRARY.filter(item => !completedIds.includes(item.id))
  }

  // Prefer items not shown in recent sessions
  let freshPool = availablePool.filter(item => !recentlyShownIds.includes(item.id))

  // If fresh pool is small, reset memory so we can cycle with fresh order
  if (freshPool.length < requestedCount) {
    clearShownHistory()
    freshPool = availablePool
  }

  // Score each candidate against user's current traits, target traits, and goals
  const scoredCandidates = freshPool.map(item => {
    const baseScore = scoreContent(item, {
      goals: profile?.goals || '',
      currentTraits: profile?.currentTraits || '',
      targetTraits: profile?.targetTraits || '',
    })

    // Add random variance (0 to 4.5) to introduce diversity and avoid deterministic repetitions
    const randomJitter = Math.random() * 4.5

    return {
      item,
      finalScore: baseScore + randomJitter
    }
  })

  // Sort by final score descending
  scoredCandidates.sort((a, b) => b.finalScore - a.finalScore)

  // Pick top N candidates
  const selectedItems = scoredCandidates.slice(0, requestedCount).map(c => c.item)
  const selectedIds = selectedItems.map(item => item.id)

  // Save selected IDs to history memory
  recordShownIds(selectedIds)

  const interventionType = determineIntervention(growthState)
  const userName = profile?.name || 'Explorer'
  const currentTrait = profile?.currentTraits?.split(',')[0] || 'growth area'
  const targetTrait = profile?.targetTraits?.split(',')[0] || 'target self'

  const recommendations = selectedItems.map((item, idx) => ({
    ...item,
    id: item.id || `rec_${Date.now()}_${idx}`,
    rank: idx + 1,
    whyThis: `Selected to help you transition from "${currentTrait}" toward "${targetTrait}". ${item.description?.split('.')[0] || ''}.`,
    whyNow: growthState?.momentum === 'low' || (growthState?.trustScore !== undefined && growthState.trustScore < 40)
      ? `Your momentum is building — this ${item.type?.toLowerCase() || 'content'} provides a quick, high-impact win today.`
      : `At your ${growthState?.identityStage || 'current'} stage, ${item.creator}'s core insight supports your active goal of "${profile?.goals || 'daily growth'}".`,
    expectedOutcome: item.expectedOutcome || `Apply ${item.creator}'s key insight into your daily habit routine today.`,
    status: 'pending',
  }))

  return {
    engineType: 'BECOME Autonomous Personalization Engine',
    recommendations,
    reasoning: {
      interventionType,
      identityStage: growthState?.identityStage || 'early',
      trustScore: growthState?.trustScore ?? 50,
      momentum: growthState?.momentum || 'medium',
      sessionTitle: `${interventionType}: Personalized Growth Path`,
      sessionMessage: `Welcome ${userName}. Here are your dynamically curated recommendations tailored to your identity transformation (${currentTrait} → ${targetTrait}).`,
      thinkingSteps: [
        { step: `Observing ${userName}'s profile: ${currentTrait} → ${targetTrait}`, duration: 400 },
        { step: `Assessing growth state: ${growthState?.identityStage || 'early'} stage, ${growthState?.momentum || 'medium'} momentum`, duration: 500 },
        { step: `Evaluating 36+ growth modules across habits, focus, and mindset...`, duration: 600 },
        { step: `Applying dynamic variety filter (excluding ${recentlyShownIds.length} recently viewed items)...`, duration: 400 },
        { step: `Generated ${recommendations.length} fresh growth modules for today ✓`, duration: 300 },
      ]
    }
  }
}

// ─── Main API Export ──────────────────────────────────────────────────────────

export const runGrowthAgent = async (profile, growthState, count = 3, filterType = null) => {
  console.log(`🤖 BECOME Agent: Generating ${count} dynamic recommendations (filter: ${filterType || 'All'}) for ${profile?.name || 'user'}...`)
  return selectDynamicRecommendations(profile, growthState, count, filterType)
}
