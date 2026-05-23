const LEADERBOARD_KEY = 'leaderboard'
const ENCOUNTERS_KEY = 'encounters'
const TOTAL_SCORE_KEY = 'totalScore'
const LEADERBOARD_SIZE = 10

const read = (key, fallback) => {
  const raw = window.localStorage.getItem(key)
  if (!raw) return fallback
  try {
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

export const getLeaderboard = () => read(LEADERBOARD_KEY, [])

export const getEncounters = () => read(ENCOUNTERS_KEY, {})

export const getTotalScore = () => Number(window.localStorage.getItem(TOTAL_SCORE_KEY)) || 0

export const recordGame = ({ name, results }) => {
  const score = results.filter(r => r.correct).length

  const board = getLeaderboard()
  board.push({ name, score, date: new Date().toISOString() })
  board.sort((a, b) => b.score - a.score)
  window.localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(board.slice(0, LEADERBOARD_SIZE)))

  const encounters = getEncounters()
  results.forEach(r => {
    encounters[r.pokemon] = (encounters[r.pokemon] || 0) + 1
  })
  window.localStorage.setItem(ENCOUNTERS_KEY, JSON.stringify(encounters))

  window.localStorage.setItem(TOTAL_SCORE_KEY, getTotalScore() + score)

  return score
}
