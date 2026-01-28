/**
 * Trails Direct API Integration - Node.js / Server-side
 *
 * Full control over the Quote → Commit → Execute → Wait flow.
 * Use for backends, automation, and non-React applications.
 *
 * SETUP:
 * 1. Get your API key from https://dashboard.trails.build
 * 2. Install: npm install @0xtrails/trails-api (or pnpm/yarn)
 * 3. Set TRAILS_API_KEY in your environment variables
 */

import { TrailsAPI, TrailsError } from '@0xtrails/trails-api';

// ============================================
// 1. INITIALIZE CLIENT
// ============================================

const trails = new TrailsAPI({
  apiKey: process.env.TRAILS_API_KEY!,
  // Optional: custom endpoint
  // baseUrl: 'https://api.trails.build',
});

// ============================================
// 2. FULL INTENT FLOW
// ============================================

async function executeIntent() {
  // 1. QUOTE - Get pricing and route
  const quote = await trails.quoteIntent({
    sourceChainId: 1, // Ethereum
    sourceTokenAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
    destinationChainId: 8453, // Base
    destinationTokenAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // USDC
    amount: '1000000000', // 1000 USDC (6 decimals)
    tradeType: 'EXACT_INPUT',
    userAddress: '0xUserWalletAddress',
  });

  console.log('Quote ID:', quote.quoteId);
  console.log('Estimated output:', quote.estimatedOutput);
  console.log('Expires at:', quote.expiresAt);

  // 2. COMMIT - Lock the quote and create intent
  const intent = await trails.commitIntent({
    quoteId: quote.quoteId,
  });

  console.log('Intent ID:', intent.intentId);
  console.log('Status:', intent.status);

  // 3. EXECUTE - Trigger the cross-chain flow
  const execution = await trails.executeIntent({
    intentId: intent.intentId,
    signature: '0x...', // User's signature (implement your signing logic)
  });

  console.log('Execution started:', execution.transactionHash);

  // 4. WAIT - Poll for completion
  const receipt = await trails.waitIntentReceipt({
    intentId: intent.intentId,
    timeout: 120000, // 2 minutes
    pollInterval: 3000, // Check every 3 seconds
  });

  console.log('Intent complete!');
  console.log('Final status:', receipt.status);
  console.log('Destination tx:', receipt.destinationTransactionHash);

  return receipt;
}

// ============================================
// 3. QUOTE WITH CALLDATA (Contract Execution)
// ============================================

import { encodeFunctionData } from 'viem';

const VAULT_ABI = [
  {
    name: 'deposit',
    type: 'function',
    inputs: [
      { name: 'amount', type: 'uint256' },
      { name: 'receiver', type: 'address' },
    ],
    outputs: [],
  },
] as const;

const PLACEHOLDER_AMOUNT = BigInt(
  '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
);

async function quoteVaultDeposit(vaultAddress: string, userAddress: string) {
  const calldata = encodeFunctionData({
    abi: VAULT_ABI,
    functionName: 'deposit',
    args: [PLACEHOLDER_AMOUNT, userAddress as `0x${string}`],
  });

  const quote = await trails.quoteIntent({
    sourceChainId: 1,
    sourceTokenAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    destinationChainId: 42161,
    destinationTokenAddress: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
    amount: '1000000000', // Input amount
    tradeType: 'EXACT_INPUT', // Fund-style: user picks input
    userAddress,
    destinationRecipient: vaultAddress,
    destinationCalldata: calldata,
  });

  return quote;
}

// ============================================
// 4. ERROR HANDLING
// ============================================

async function safeExecuteIntent() {
  try {
    const quote = await trails.quoteIntent({
      sourceChainId: 1,
      sourceTokenAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      destinationChainId: 8453,
      destinationTokenAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      amount: '1000000000',
      tradeType: 'EXACT_INPUT',
      userAddress: '0xUserAddress',
    });

    const intent = await trails.commitIntent({ quoteId: quote.quoteId });

    const receipt = await trails.waitIntentReceipt({
      intentId: intent.intentId,
      timeout: 120000,
    });

    return receipt;
  } catch (error) {
    if (error instanceof TrailsError) {
      console.error('Trails error:', error.code, error.message);

      switch (error.code) {
        case 'QUOTE_EXPIRED':
          console.log('Quote expired, fetching new quote...');
          break;
        case 'INSUFFICIENT_BALANCE':
          console.log('User has insufficient balance');
          break;
        case 'ROUTE_NOT_FOUND':
          console.log('No route available for this trade');
          break;
        default:
          console.log('Unknown error');
      }
    } else {
      console.error('Unexpected error:', error);
    }
    throw error;
  }
}

// ============================================
// 5. QUOTE WITH RETRY
// ============================================

interface QuoteParams {
  sourceChainId: number;
  sourceTokenAddress: string;
  destinationChainId: number;
  destinationTokenAddress: string;
  amount: string;
  tradeType: 'EXACT_INPUT' | 'EXACT_OUTPUT';
  userAddress: string;
}

async function quoteWithRetry(params: QuoteParams, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const quote = await trails.quoteIntent(params);
      const intent = await trails.commitIntent({ quoteId: quote.quoteId });
      return intent;
    } catch (error) {
      if (
        error instanceof TrailsError &&
        error.code === 'QUOTE_EXPIRED' &&
        i < maxRetries - 1
      ) {
        console.log(`Quote expired, retrying (${i + 1}/${maxRetries})...`);
        continue;
      }
      throw error;
    }
  }
  throw new Error('Max retries exceeded');
}

// ============================================
// 6. BATCH PROCESSING
// ============================================

interface Settlement {
  recipient: string;
  amount: string;
  chainId: number;
  tokenAddress: string;
}

async function processSettlements(settlements: Settlement[]) {
  const results: Array<{
    recipient: string;
    status: 'success' | 'failed';
    intentId?: string;
    txHash?: string;
    error?: string;
  }> = [];

  for (const settlement of settlements) {
    try {
      const quote = await trails.quoteIntent({
        sourceChainId: 1,
        sourceTokenAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        destinationChainId: settlement.chainId,
        destinationTokenAddress: settlement.tokenAddress,
        amount: settlement.amount,
        tradeType: 'EXACT_OUTPUT', // Recipient gets exact amount
        userAddress: process.env.TREASURY_ADDRESS!,
        destinationRecipient: settlement.recipient,
      });

      const intent = await trails.commitIntent({ quoteId: quote.quoteId });

      await trails.executeIntent({
        intentId: intent.intentId,
        signature: await signIntent(intent), // Your signing logic
      });

      const receipt = await trails.waitIntentReceipt({
        intentId: intent.intentId,
        timeout: 300000, // 5 minutes for batch
      });

      results.push({
        recipient: settlement.recipient,
        status: 'success',
        intentId: intent.intentId,
        txHash: receipt.destinationTransactionHash,
      });
    } catch (error) {
      results.push({
        recipient: settlement.recipient,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  return results;
}

// Placeholder for your signing implementation
async function signIntent(_intent: unknown): Promise<string> {
  // Implement your signing logic here
  // Could use viem, ethers, or hardware wallet
  throw new Error('Implement signIntent');
}

// ============================================
// 7. FETCH OPERATIONS
// ============================================

// Get intent by ID
async function getIntent(intentId: string) {
  return await trails.getIntent({ intentId });
}

// Get intent receipt
async function getReceipt(intentId: string) {
  return await trails.getIntentReceipt({ intentId });
}

// Search intents
async function searchUserIntents(userAddress: string) {
  return await trails.searchIntents({
    userAddress,
    status: 'COMPLETED',
    limit: 10,
    offset: 0,
  });
}

// Get user history
async function getUserHistory(userAddress: string) {
  return await trails.getIntentHistory({
    userAddress,
    limit: 20,
  });
}

// Get token prices
async function getTokenPrices() {
  return await trails.getTokenPrices({
    tokens: [
      { chainId: 1, address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' },
      { chainId: 8453, address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' },
    ],
  });
}

// ============================================
// 8. EXPRESS.JS EXAMPLE
// ============================================

import express from 'express';

const app = express();
app.use(express.json());

app.post('/api/quote', async (req, res) => {
  try {
    const quote = await trails.quoteIntent(req.body);
    res.json(quote);
  } catch (error) {
    res
      .status(400)
      .json({ error: error instanceof Error ? error.message : 'Unknown' });
  }
});

app.post('/api/execute', async (req, res) => {
  try {
    const { quoteId, signature } = req.body;

    const intent = await trails.commitIntent({ quoteId });
    await trails.executeIntent({ intentId: intent.intentId, signature });

    const receipt = await trails.waitIntentReceipt({
      intentId: intent.intentId,
      timeout: 120000,
    });

    res.json(receipt);
  } catch (error) {
    res
      .status(400)
      .json({ error: error instanceof Error ? error.message : 'Unknown' });
  }
});

app.get('/api/intent/:id', async (req, res) => {
  try {
    const intent = await trails.getIntent({ intentId: req.params.id });
    res.json(intent);
  } catch (error) {
    res
      .status(404)
      .json({ error: error instanceof Error ? error.message : 'Not found' });
  }
});

// Start server
// app.listen(3000, () => console.log('Server running on port 3000'));

export {
  executeIntent,
  quoteVaultDeposit,
  safeExecuteIntent,
  quoteWithRetry,
  processSettlements,
  getIntent,
  getReceipt,
  searchUserIntents,
  getUserHistory,
  getTokenPrices,
};
