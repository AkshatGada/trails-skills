# API Recipes

Server-side integration with the Trails Direct API.

## When to Use Direct API

- Backend services and automation
- Non-React applications
- Batch processing
- Full control over the signing pipeline
- Server-to-server settlement

---

## Setup

### 1. Get Your API Key

👉 **Visit [https://dashboard.trails.build](https://dashboard.trails.build)** to get your API key, then set it as an environment variable:

```bash
TRAILS_API_KEY=your_api_key
```

### 2. Install

```bash
pnpm add @0xtrails/trails-api
# or
npm install @0xtrails/trails-api
```

### 3. Initialize Client

```typescript
import { TrailsAPI } from '@0xtrails/trails-api';

const trails = new TrailsAPI({
  apiKey: process.env.TRAILS_API_KEY!,
  // Optional: custom endpoint
  // baseUrl: 'https://api.trails.build',
});
```

---

## Core Flow: Quote → Commit → Execute → Wait

```typescript
import { TrailsAPI } from '@0xtrails/trails-api';

const trails = new TrailsAPI({ apiKey: process.env.TRAILS_API_KEY! });

async function executeIntent() {
  // 1. QUOTE - Get pricing and route
  const quote = await trails.quoteIntent({
    sourceChainId: 1,                                    // Ethereum
    sourceTokenAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
    destinationChainId: 8453,                            // Base
    destinationTokenAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // USDC
    amount: '1000000000',                                // 1000 USDC
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
  // This requires the user to sign or you to provide a signer
  const execution = await trails.executeIntent({
    intentId: intent.intentId,
    // Signature or signer configuration depends on your setup
    signature: '0x...', // User's signature
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
```

---

## API Methods Reference

### quoteIntent

Get a price quote for a cross-chain operation.

```typescript
const quote = await trails.quoteIntent({
  // Required
  sourceChainId: 1,
  sourceTokenAddress: '0x...',
  destinationChainId: 8453,
  destinationTokenAddress: '0x...',
  amount: '1000000000',
  tradeType: 'EXACT_INPUT', // or 'EXACT_OUTPUT'
  userAddress: '0x...',

  // Optional
  destinationRecipient: '0x...', // If different from userAddress
  destinationCalldata: '0x...',  // For contract calls
  slippageTolerance: 0.5,        // Percentage
});
```

### commitIntent

Lock a quote and create an intent.

```typescript
const intent = await trails.commitIntent({
  quoteId: quote.quoteId,
});
```

### executeIntent

Start execution of a committed intent.

```typescript
const execution = await trails.executeIntent({
  intentId: intent.intentId,
  signature: '0x...', // Required: user's signature
});
```

### waitIntentReceipt

Poll for intent completion.

```typescript
const receipt = await trails.waitIntentReceipt({
  intentId: intent.intentId,
  timeout: 120000,     // Max wait time in ms
  pollInterval: 3000,  // Poll frequency in ms
});
```

### getIntent

Fetch intent details by ID.

```typescript
const intent = await trails.getIntent({
  intentId: 'intent_abc123',
});
```

### getIntentReceipt

Get the receipt for a completed intent.

```typescript
const receipt = await trails.getIntentReceipt({
  intentId: 'intent_abc123',
});
```

### searchIntents

Query intents with filters.

```typescript
const results = await trails.searchIntents({
  userAddress: '0x...',
  status: 'COMPLETED',
  sourceChainId: 1,
  limit: 10,
  offset: 0,
});
```

### getIntentHistory

Get a user's intent history.

```typescript
const history = await trails.getIntentHistory({
  userAddress: '0x...',
  limit: 20,
});
```

### getTokenPrices

Fetch current token prices.

```typescript
const prices = await trails.getTokenPrices({
  tokens: [
    { chainId: 1, address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' },
    { chainId: 8453, address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' },
  ],
});
```

---

## Error Handling

```typescript
import { TrailsAPI, TrailsError } from '@0xtrails/trails-api';

const trails = new TrailsAPI({ apiKey: process.env.TRAILS_API_KEY! });

async function safeExecute() {
  try {
    const quote = await trails.quoteIntent({ ... });
    const intent = await trails.commitIntent({ quoteId: quote.quoteId });
    const receipt = await trails.waitIntentReceipt({
      intentId: intent.intentId,
      timeout: 120000,
    });
    return receipt;
  } catch (error) {
    if (error instanceof TrailsError) {
      console.error('Trails error:', error.code, error.message);

      // Handle specific error codes
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
```

---

## Batch Processing Example

```typescript
import { TrailsAPI } from '@0xtrails/trails-api';

const trails = new TrailsAPI({ apiKey: process.env.TRAILS_API_KEY! });

interface Settlement {
  recipient: string;
  amount: string;
  chainId: number;
  tokenAddress: string;
}

async function processSettlements(settlements: Settlement[]) {
  const results = [];

  for (const settlement of settlements) {
    try {
      // Quote
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

      // Commit
      const intent = await trails.commitIntent({ quoteId: quote.quoteId });

      // Execute (assumes you have signing infrastructure)
      await trails.executeIntent({
        intentId: intent.intentId,
        signature: await signIntent(intent), // Your signing logic
      });

      // Wait
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
```

---

## Webhook Integration (Polling Alternative)

If you prefer webhooks over polling:

```typescript
// In your webhook handler (e.g., Next.js API route)
import { NextRequest, NextResponse } from 'next/server';
import { verifyTrailsWebhook } from '@0xtrails/trails-api';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('x-trails-signature')!;

  // Verify webhook signature
  const isValid = verifyTrailsWebhook(body, signature, process.env.TRAILS_WEBHOOK_SECRET!);

  if (!isValid) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const event = JSON.parse(body);

  switch (event.type) {
    case 'intent.completed':
      console.log('Intent completed:', event.data.intentId);
      // Update your database, notify user, etc.
      break;
    case 'intent.failed':
      console.log('Intent failed:', event.data.intentId, event.data.error);
      break;
  }

  return NextResponse.json({ received: true });
}
```

---

## Express.js Example

```typescript
import express from 'express';
import { TrailsAPI } from '@0xtrails/trails-api';

const app = express();
app.use(express.json());

const trails = new TrailsAPI({ apiKey: process.env.TRAILS_API_KEY! });

app.post('/api/quote', async (req, res) => {
  try {
    const quote = await trails.quoteIntent(req.body);
    res.json(quote);
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' });
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
    res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```
