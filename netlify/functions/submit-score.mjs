import { getStore } from '@netlify/blobs'
import { STORE, KEY, LIMIT, json } from './_shared.mjs'

const MAX_NAME = 20
const MAX_SCORE = 1000

export default async (req) => {
  if (req.method !== 'POST') return json(405, { error: 'method not allowed' })

  let body
  try {
    body = await req.json()
  } catch {
    return json(400, { error: 'invalid json' })
  }

  const name = String(body?.name ?? '').trim().slice(0, MAX_NAME) || 'anon'
  const score = Number(body?.score)
  if (!Number.isFinite(score) || score < 0 || score > MAX_SCORE) {
    return json(400, { error: 'invalid score' })
  }

  const store = getStore(STORE)
  const board = (await store.get(KEY, { type: 'json' })) || []
  board.push({ name, score, date: new Date().toISOString() })
  board.sort((a, b) => b.score - a.score)
  const top = board.slice(0, LIMIT)
  await store.setJSON(KEY, top)

  return json(200, top)
}

export const config = { path: '/api/submit-score' }
