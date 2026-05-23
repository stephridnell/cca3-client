import { getStore } from '@netlify/blobs'
import { STORE, KEY, json } from './_shared.mjs'

export default async () => {
  const store = getStore(STORE)
  const board = (await store.get(KEY, { type: 'json' })) || []
  return json(200, board)
}

export const config = { path: '/api/leaderboard' }
