import { useState, useEffect, useCallback } from 'react'

const DEXSCREENER_API = 'https://api.dexscreener.com/latest/dex/tokens'

export function useDexScreener(tokenAddress, pollInterval = 30000) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdate, setLastUpdate] = useState(null)

  const fetchData = useCallback(async () => {
    if (!tokenAddress) {
      setLoading(false)
      return
    }

    try {
      const response = await fetch(`${DEXSCREENER_API}/${tokenAddress}`)
      if (!response.ok) throw new Error('Failed to fetch data')

      const json = await response.json()

      if (json.pairs && json.pairs.length > 0) {
        // Get the pair with highest liquidity
        const mainPair = json.pairs.reduce((prev, curr) =>
          (parseFloat(curr.liquidity?.usd) || 0) > (parseFloat(prev.liquidity?.usd) || 0) ? curr : prev
        )

        setData({
          marketCap: mainPair.marketCap || mainPair.fdv || 0,
          priceUsd: parseFloat(mainPair.priceUsd) || 0,
          priceChange24h: mainPair.priceChange?.h24 || 0,
          volume24h: mainPair.volume?.h24 || 0,
          liquidity: mainPair.liquidity?.usd || 0,
          txns24h: (mainPair.txns?.h24?.buys || 0) + (mainPair.txns?.h24?.sells || 0),
          pairAddress: mainPair.pairAddress,
          dexId: mainPair.dexId
        })
        setLastUpdate(new Date())
      }
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [tokenAddress])

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, pollInterval)
    return () => clearInterval(interval)
  }, [fetchData, pollInterval])

  return { data, loading, error, lastUpdate, refetch: fetchData }
}

export function formatMarketCap(value) {
  if (!value) return '$0'
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`
  if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`
  return `$${value.toFixed(2)}`
}

export function formatNumber(value) {
  if (!value) return '0'
  return new Intl.NumberFormat().format(Math.round(value))
}
