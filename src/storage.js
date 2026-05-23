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
