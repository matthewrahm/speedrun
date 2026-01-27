import { useState, useEffect, useCallback } from 'react'

const MILESTONES = ['1M', '10M', '50M', '100M']

export function useMilestones() {
  const [milestones, setMilestones] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchMilestones = useCallback(async () => {
    try {
      const response = await fetch('/.netlify/functions/milestones')
      if (!response.ok) throw new Error('Failed to fetch milestones')
      const data = await response.json()
      setMilestones(data)
      setError(null)
    } catch (err) {
      console.error('Failed to fetch milestones:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const logMilestone = useCallback(async (milestone, elapsed, snapshot = {}) => {
    if (!MILESTONES.includes(milestone)) return false
    if (milestones[milestone]?.achieved) return true

    const maxRetries = 3
    let attempt = 0

    while (attempt < maxRetries) {
      try {
        const response = await fetch('/.netlify/functions/milestones', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            milestone,
            elapsed,
            price: snapshot.price,
            volume: snapshot.volume,
            liquidity: snapshot.liquidity,
          }),
        })

        if (!response.ok) throw new Error('Failed to log milestone')

        const data = await response.json()
        setMilestones(data)
        return true
      } catch (err) {
        attempt++
        if (attempt < maxRetries) {
          // Exponential backoff: 1s, 2s, 4s
          await new Promise(r => setTimeout(r, 1000 * Math.pow(2, attempt - 1)))
        } else {
          console.error('Failed to log milestone after retries:', err)
          return false
        }
      }
    }
    return false
  }, [milestones])

  useEffect(() => {
    fetchMilestones()
  }, [fetchMilestones])

  return { milestones, loading, error, logMilestone, refetch: fetchMilestones }
}
