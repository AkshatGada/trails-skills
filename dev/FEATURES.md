# Trails Capabilities Overview

A comprehensive reference for what Trails enables and what the agent skill provides.

## What Trails Does (The Infrastructure)

### Cross-Chain Token Operations

**Bridge Tokens**
- Move any supported token between chains
- Automatic best-path routing
- Single transaction UX
- Real-time fee calculation

**Swap Tokens**
- Within same chain or cross-chain
- DEX aggregation for best prices
- Slippage protection
- No direct wallet-to-DEX interaction needed

**Pay (EXACT_OUTPUT)**
- User pays whatever is needed to get exact output
- Perfect for checkout flows
- "Pay $50 USDC" regardless of what user has
- Automatic conversion and bridging

**Fund (EXACT_INPUT)**
- User specifies input amount, output calculated
- Perfect for deposits and investments
- "Deposit 1 ETH worth into vault"
- Supports destination contract execution

**Earn**
- Optimized DeFi protocol deposits
- Yield farming entry from any chain
- Automatic protocol discovery
- Best route for deposit optimization

### Smart Contract Execution

**Calldata Support**
- Execute contract functions after bridging
- Perfect for:
  - Vault deposits
  - NFT minting
  - Staking
  - DAO participation
  - Protocol interactions

**Placeholder Amounts**
- Use `0xfff...fff` for dynamic amounts
- Trails fills actual received amount
- Critical for Fund mode with exact input

### Multi-Chain Coverage

| Network | Status | Chain ID |
|---------|--------|----------|
| Ethereum | ✅ | 1 |
| Base | ✅ | 8453 |
| Arbitrum One | ✅ | 42161 |
| Optimism | ✅ | 10 |
| Polygon PoS | ✅ | 137 |
| Avalanche C-Chain | ✅ | 43114 |
| BNB Chain | ✅ | 56 |
| ...and more | Check [docs.trails.build](https://docs.trails.build) | - |

---

## What the Agent Skill Does

The agent skill is your integration assistant. It doesn't just provide code — it understands your project and guides you to the right solution.

### Intelligent Triage

**Framework Detection**
```
Scans for:
├── package.json → React, Next.js, Node.js
├── tsconfig.json → TypeScript support
├── Dependencies → wagmi, viem, ethers
└── File structure → App Router, Pages, API routes
```

**Context Analysis**
- Reads existing code to understand patterns
- Identifies wallet setup (wagmi config, providers)
- Detects styling approach (Tailwind, CSS-in-JS, etc.)
- Recognizes DeFi protocols or contract interactions

**Smart Questioning**
- Only asks what's truly unclear
- Maximum 3 targeted questions
- Infers from context when possible
- Provides examples to clarify

### Code Generation

**Not Just Snippets — Complete Integration**

**Widget Mode Output:**
```tsx
// 1. Installation command
pnpm add @0xtrails/trails

// 2. Provider setup (understands your app structure)
// app/layout.tsx or pages/_app.tsx based on detection
import { TrailsProvider } from '@0xtrails/trails';

export default function RootLayout({ children }) {
  return (
    <WagmiProvider config={config}>
      <TrailsProvider trailsApiKey={process.env.NEXT_PUBLIC_TRAILS_API_KEY}>
        {children}
      </TrailsProvider>
    </WagmiProvider>
  );
}

// 3. Widget usage with your specific requirements
<TrailsWidget 
  mode="pay"
  destinationChainId={8453}
  destinationTokenAddress="0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"
  destinationAmount="10000000"
  destinationRecipient="0xYourAddress"
/>

// 4. Environment setup explanation
// .env.local:
// NEXT_PUBLIC_TRAILS_API_KEY=your_key_here
```

**Headless Mode Output:**
```tsx
// Provider + Modal (critical for tx flow)
import { TrailsProvider, TrailsHookModal } from '@0xtrails/trails';

function App() {
  return (
    <WagmiProvider config={config}>
      <TrailsProvider trailsApiKey={process.env.NEXT_PUBLIC_TRAILS_API_KEY}>
        <TrailsHookModal /> {/* Required - handles tx signing */}
        {children}
      </TrailsProvider>
    </WagmiProvider>
  );
}

// Hook usage in your component
import { useQuote, useSupportedTokens } from '@0xtrails/trails';

function CustomSwapButton() {
  const { quote, isPending, isSuccess } = useQuote({ /* params */ });
  const { data: tokens } = useSupportedTokens();
  
  // Your custom UI with full control
  // Executes automatically when quote is ready
}
```

**API Mode Output:**
```typescript
// Complete 4-step flow with error handling
import { TrailsAPI } from '@0xtrails/trails-api';

const trails = new TrailsAPI({ 
  apiKey: process.env.TRAILS_API_KEY 
});

async function crossChainTransfer() {
  try {
    // 1. Quote
    const quote = await trails.quoteIntent({
      sourceChainId: 1,
      sourceTokenAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      destinationChainId: 8453,
      destinationTokenAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      amount: '1000000000',
      tradeType: 'EXACT_INPUT',
    });

    // 2. Commit (locks the quote)
    const intent = await trails.commitIntent({ 
      quoteId: quote.quoteId 
    });

    // 3. Execute (signs and submits)
    const execution = await trails.executeIntent({
      intentId: intent.intentId,
      // Signer config here
    });

    // 4. Wait for completion
    const receipt = await trails.waitIntentReceipt({
      intentId: intent.intentId,
      timeout: 120000,
    });

    return receipt;
  } catch (error) {
    // Specific error handling guidance
  }
}
```

### Advanced Features

**Calldata Encoding**
```typescript
// The skill shows proper viem usage
import { encodeFunctionData } from 'viem';

const PLACEHOLDER = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';

const calldata = encodeFunctionData({
  abi: vaultAbi,
  functionName: 'deposit',
  args: [
    BigInt(PLACEHOLDER), // Trails fills this with actual amount
    userAddress,
  ],
});

// Then use in Fund mode widget
<TrailsWidget
  mode="fund"
  destinationCalldata={calldata}
  destinationRecipient="0xVaultContractAddress"
  // ... other props
/>
```

**Token Discovery**
```tsx
// Shows both hook and function approaches
import { useSupportedTokens, getSupportedTokens } from '@0xtrails/trails';

// React hook approach
const { data: tokens, isLoading } = useSupportedTokens();

// Function approach (for non-React)
const tokens = await getSupportedTokens();

// Filtering example
const baseTokens = tokens.filter(t => t.chainId === 8453);
const stablecoins = tokens.filter(t => 
  t.symbol === 'USDC' || t.symbol === 'USDT'
);
```

**Trade Type Guidance**
```
The skill explains:

EXACT_OUTPUT (Pay Mode)
├── User pays whatever needed
├── You specify exact output
├── Perfect for: Checkouts, subscriptions, bills
└── Example: "Customer pays exactly $50 USDC"

EXACT_INPUT (Fund Mode)
├── User specifies input
├── Output calculated dynamically
├── Perfect for: Deposits, investments, yield farming
└── Example: "User deposits 1 ETH worth into vault"

BOTH (Swap Mode)
├── User chooses direction
├── Either input or output specified
└── Perfect for: Trading, portfolio rebalancing
```

### Validation & Troubleshooting

**Provider Hierarchy Check**
```
The skill verifies:
✓ WagmiProvider wraps TrailsProvider
✓ TrailsHookModal present (for headless mode)
✓ trailsApiKey prop provided
✓ Environment variables correctly named
  - NEXT_PUBLIC_TRAILS_API_KEY (client-side)
  - TRAILS_API_KEY (server-side)
```

**Common Error Patterns**
```
"TrailsProvider not found"
→ Checks: Is TrailsProvider imported and rendered?
→ Checks: Is it inside WagmiProvider?
→ Shows: Correct provider structure

"Transaction modal not appearing"
→ Checks: Is TrailsHookModal rendered?
→ Checks: Is it inside TrailsProvider?
→ Explains: Why modal is required

"Cannot read property of undefined"
→ Checks: Are hooks called inside provider?
→ Checks: Is data loading/null handled?
→ Shows: Proper loading state patterns
```

### Documentation Integration

**Embedded Docs (Offline-First)**
```
trails/docs/
├── TRAILS_OVERVIEW.md → Core concepts
├── INTEGRATION_DECISION_TREE.md → Flowchart
├── WIDGET_RECIPES.md → Widget examples
├── HEADLESS_SDK_RECIPES.md → Hook patterns
├── API_RECIPES.md → Server-side flows
├── CALLDATA_GUIDE.md → Contract execution
└── TROUBLESHOOTING.md → Common issues
```

**MCP Tool (Dynamic Data)**
```
The skill suggests using SearchTrails for:
- Latest supported chains
- Latest supported tokens
- Current API schemas
- Real-time endpoint changes
```

**Code Snippets (Copy-Paste)**
```
trails/snippets/
├── react-widget.tsx → Complete widget setup
├── react-headless.tsx → Headless SDK example
├── node-api.ts → Backend flow
└── calldata-viem.ts → Calldata encoding
```

---

## Use Case Matrix

| Use Case | Best Mode | Key Features |
|----------|-----------|--------------|
| E-commerce checkout | Widget (Pay) | Exact output, any input token |
| NFT minting with any token | Widget (Pay) + calldata | Pay + execute mint |
| Vault deposits | Widget (Fund) + calldata | Exact input + execute deposit |
| DEX aggregation | Widget (Swap) | Best price routing |
| Custom swap UI | Headless SDK | Full UI control, hooks |
| Backend settlements | Direct API | Server-side, no React |
| DeFi protocol funding | Widget (Earn) | Yield optimization |
| Cross-chain DAO voting | Headless + calldata | Custom flow + execution |
| Subscription payments | Widget (Pay) | Recurring exact amounts |
| Portfolio rebalancing | Headless (Swap) | Programmatic control |

---

## Integration Complexity

### Widget: Minimal Complexity
```
Lines of code: ~15
Time to integrate: 5-10 minutes
Customization: Theming via CSS variables
Best for: MVP, quick launch, standard flows
```

### Headless SDK: Medium Complexity
```
Lines of code: ~50-100
Time to integrate: 30-60 minutes
Customization: Complete UI control
Best for: Custom design, branded experience
```

### Direct API: Variable Complexity
```
Lines of code: ~100-200
Time to integrate: 1-3 hours
Customization: Full control of everything
Best for: Backend services, automation, non-React
```

---

## What You Get with the Skill

### Immediate Benefits
- ✅ Working code in seconds (not hours)
- ✅ Correct integration mode for your stack
- ✅ Proper error handling patterns
- ✅ Type-safe TypeScript examples
- ✅ Environment setup guidance

### Long-Term Benefits
- ✅ Fewer support tickets (validated patterns)
- ✅ Faster onboarding for new team members
- ✅ Consistent code across projects
- ✅ Built-in best practices
- ✅ Troubleshooting guidance at fingertips

### Expert-Level Features
- ✅ Calldata encoding with placeholders
- ✅ Complex multi-chain flows
- ✅ Custom token filtering
- ✅ Transaction monitoring
- ✅ Error recovery patterns

---

## Summary

**Trails Infrastructure** = Cross-chain superpowers for your app

**Trails Agent Skill** = Expert assistant that gets you there fast

Together, they enable:
- Accepting payments in any token
- Chain abstraction for seamless UX
- Intent-based cross-chain operations
- Cross-chain DeFi integrations
- Custom cross-chain UX
- Backend automation
- Enterprise-grade flows
- x402 payment protocol support

All with minimal code and maximum clarity.

### Activation Keywords

The skill responds to a wide range of keywords:

**Core Terms:**
- `trails`, `@0xtrails`
- `cross-chain`, `cross chain`, `multichain`, `omnichain`
- `payments`, `payment`, `accept payments`
- `intents`, `intent`
- `chain abstraction`

**Standards & Protocols:**
- `x402`, `402`
- `payment rails`, `unified liquidity`

**Operations:**
- `swap`, `swap tokens`, `swap widget`
- `bridge`, `bridge tokens`, `token bridging`
- `pay`, `pay widget`, `accept any token`, `pay with any token`
- `fund mode`, `earn mode`

**Use Cases:**
- `accept any token payment`
- `cross-chain payments`
- `bridge and execute`
- `any token payment`

This comprehensive trigger list ensures the skill activates whenever you're thinking about cross-chain functionality, regardless of how you phrase it.
