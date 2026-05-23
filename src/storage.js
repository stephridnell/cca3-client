const ENCOUNTERS_KEY = 'encounters'
const TOTAL_SCORE_KEY = 'totalScore'

const read = (key, fallback) => {
  const raw = window.localStorage.getItem(key)
  if (!raw) return fallback
  try {
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

export const getEncounters = () => read(ENCOUNTERS_KEY, {})

export const getTotalScore = () => Number(window.localStorage.getItem(TOTAL_SCORE_KEY)) || 0

export const fetchLeaderboard = async () => {
  try {
    const res = await fetch('/api/leaderboard')
    if (!res.ok) return []
    return await res.json()
  } catch {
    return []
  }
}

export const submitScore = async ({ name, score }) => {
  try {
    const res = await fetch('/api/submit-score', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name, score })
    })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

export const recordGame = async ({ name, results }) => {
  const score = results.filter(r => r.correct).length

  const encounters = getEncounters()
  results.forEach(r => {
    encounters[r.pokemon] = (encounters[r.pokemon] || 0) + 1
  })
  window.localStorage.setItem(ENCOUNTERS_KEY, JSON.stringify(encounters))
  window.localStorage.setItem(TOTAL_SCORE_KEY, getTotalScore() + score)

  await submitScore({ name, score })
  return score
}
