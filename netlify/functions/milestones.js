import { getStore } from '@netlify/blobs'

const MILESTONES_KEY = 'milestones'

const DEFAULT_MILESTONES = {
  '1M': { achieved: false },
  '10M': { achieved: false },
  '50M': { achieved: false },
  '100M': { achieved: false },
}

export default async function handler(req, context) {
  const store = getStore('speed-milestones')

  if (req.method === 'GET') {
    try {
      const data = await store.get(MILESTONES_KEY, { type: 'json' })
      return new Response(JSON.stringify(data || DEFAULT_MILESTONES), {
        headers: { 'Content-Type': 'application/json' },
      })
    } catch (err) {
      return new Response(JSON.stringify(DEFAULT_MILESTONES), {
        headers: { 'Content-Type': 'application/json' },
      })
    }
  }

  if (req.method === 'POST') {
    try {
      const { milestone, elapsed, price, volume, liquidity } = await req.json()

      if (!milestone || !elapsed) {
        return new Response(JSON.stringify({ error: 'Missing milestone or elapsed' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        })
      }

      let data
      try {
        data = await store.get(MILESTONES_KEY, { type: 'json' })
      } catch {
        data = null
      }

      const milestones = data || { ...DEFAULT_MILESTONES }

      if (milestones[milestone]?.achieved) {
        return new Response(JSON.stringify(milestones), {
          headers: { 'Content-Type': 'application/json' },
        })
      }

      milestones[milestone] = {
        achieved: true,
        timestamp: Date.now(),
        elapsed,
        price: price || null,
        volume: volume || null,
        liquidity: liquidity || null,
      }

      await store.setJSON(MILESTONES_KEY, milestones)

      return new Response(JSON.stringify(milestones), {
        headers: { 'Content-Type': 'application/json' },
      })
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }
  }

  return new Response(JSON.stringify({ error: 'Method not allowed' }), {
    status: 405,
    headers: { 'Content-Type': 'application/json' },
  })
}
