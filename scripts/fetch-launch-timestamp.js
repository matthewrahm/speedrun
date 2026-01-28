/**
 * Fetches the token launch timestamp from DexScreener API
 * Uses the earliest pairCreatedAt timestamp across all trading pairs
 */

const tokenAddress = process.env.VITE_TOKEN_ADDRESS;

if (!tokenAddress) {
  console.error('Error: VITE_TOKEN_ADDRESS environment variable is not set');
  process.exit(1);
}

async function fetchLaunchTimestamp() {
  const url = `https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`DexScreener API returned ${response.status}`);
    }

    const data = await response.json();

    if (!data.pairs || data.pairs.length === 0) {
      throw new Error('No trading pairs found for this token');
    }

    // Find the earliest pairCreatedAt timestamp
    const timestamps = data.pairs
      .map(pair => pair.pairCreatedAt)
      .filter(ts => ts != null);

    if (timestamps.length === 0) {
      throw new Error('No pairCreatedAt timestamps found in trading pairs');
    }

    const earliestTimestamp = Math.min(...timestamps);
    console.log(earliestTimestamp);
    return earliestTimestamp;

  } catch (error) {
    // Check for fallback
    const fallback = process.env.VITE_LAUNCH_TIMESTAMP;

    if (fallback) {
      console.error(`Warning: DexScreener fetch failed (${error.message}), using fallback timestamp`);
      console.log(fallback);
      return parseInt(fallback, 10);
    }

    console.error(`Error: Failed to fetch launch timestamp: ${error.message}`);
    console.error('No VITE_LAUNCH_TIMESTAMP fallback available');
    process.exit(1);
  }
}

fetchLaunchTimestamp();
