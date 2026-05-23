export const STORE = 'leaderboard'
export const KEY = 'top'
export const LIMIT = 10

export const json = (status, body) => new Response(JSON.stringify(body), {
  status,
  headers: { 'content-type': 'application/json' }
})
