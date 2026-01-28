/**
 * Build script that fetches launch timestamp from DexScreener
 * then runs the Vite build with the timestamp as an environment variable
 */

import { spawn } from 'child_process';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Load .env file since Node doesn't do this automatically
try {
  const envFile = readFileSync(join(projectRoot, '.env'), 'utf-8');
  for (const line of envFile.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const eqIndex = trimmed.indexOf('=');
      if (eqIndex !== -1) {
        const key = trimmed.slice(0, eqIndex);
        const value = trimmed.slice(eqIndex + 1);
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    }
  }
} catch {
  // .env file not found, rely on environment variables
}

async function fetchTimestamp() {
  const tokenAddress = process.env.VITE_TOKEN_ADDRESS;

  if (!tokenAddress) {
    console.error('Error: VITE_TOKEN_ADDRESS environment variable is not set');
    process.exit(1);
  }

  const url = `https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`;

  try {
    console.log(`Fetching launch timestamp for token: ${tokenAddress}`);
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
    console.log(`Found launch timestamp: ${earliestTimestamp} (${new Date(earliestTimestamp).toISOString()})`);
    return earliestTimestamp.toString();

  } catch (error) {
    // Check for fallback
    const fallback = process.env.VITE_LAUNCH_TIMESTAMP;

    if (fallback) {
      console.warn(`Warning: DexScreener fetch failed (${error.message}), using fallback timestamp`);
      console.log(`Using fallback timestamp: ${fallback}`);
      return fallback;
    }

    console.error(`Error: Failed to fetch launch timestamp: ${error.message}`);
    console.error('Set VITE_LAUNCH_TIMESTAMP as a fallback if the API is unavailable');
    process.exit(1);
  }
}

async function runBuild() {
  const timestamp = await fetchTimestamp();

  // Set the timestamp in the environment
  const env = {
    ...process.env,
    VITE_LAUNCH_TIMESTAMP: timestamp
  };

  console.log('Starting Vite build...');

  // Run vite build
  const isWindows = process.platform === 'win32';
  const npmCmd = isWindows ? 'npm.cmd' : 'npm';

  const buildProcess = spawn(npmCmd, ['run', 'build:vite'], {
    cwd: projectRoot,
    env,
    stdio: 'inherit',
    shell: isWindows
  });

  buildProcess.on('close', (code) => {
    if (code !== 0) {
      console.error(`Build failed with exit code ${code}`);
      process.exit(code);
    }
    console.log('Build completed successfully!');
  });

  buildProcess.on('error', (error) => {
    console.error(`Build process error: ${error.message}`);
    process.exit(1);
  });
}

runBuild();
