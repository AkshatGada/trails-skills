# Quick Test Prompts

Copy-paste these into Cursor to test the Trails skill.

## Basic Triggers

```
I want to integrate trails into my app
```

```
How do I add cross-chain payments?
```

```
I need a swap widget
```

```
Help me bridge tokens between chains
```

```
I want to accept payments in any token
```

```
How do I implement chain abstraction?
```

```
I need to handle intents in my app
```

```
Add x402 payment support to my site
```

```
Enable multichain payments
```

```
I want unified liquidity across chains
```

```
How do I accept any token payment?
```

## Widget Mode Tests

```
I have a Next.js ecommerce site with wagmi. I want customers to pay in any token for a $50 product.
```

```
Add a swap widget to my React app that lets users trade any token to USDC
```

```
I need a fund mode widget that bridges to Base and deposits into my vault contract
```

## Headless SDK Tests

```
I want custom swap UI but use Trails for routing. Using React + wagmi.
```

```
How do I build my own payment flow with Trails hooks?
```

```
Show me how to use useQuote and useTrails with my custom button
```

## Backend API Tests

```
I need to automate cross-chain settlements in my Node.js backend
```

```
How do I use the Trails API to bridge 1000 USDC from Ethereum to Base programmatically?
```

```
Show me the full API flow for executing a cross-chain intent
```

## Calldata Tests

```
Users should bridge to Arbitrum and then stake in my staking contract
```

```
How do I encode calldata for a deposit function with placeholder amounts?
```

```
Fund mode with destination contract execution - show me the full example
```

## Documentation Tests

```
What chains does Trails support?
```

```
What's the difference between Pay mode and Fund mode?
```

```
Explain EXACT_INPUT vs EXACT_OUTPUT
```

```
How do I get the list of supported tokens?
```

## Troubleshooting Tests

```
My TrailsWidget isn't rendering anything
```

```
I'm getting "TrailsProvider not found" error
```

```
The transaction modal isn't showing up when I call sendTransaction
```

```
How do I debug failed cross-chain transactions?
```

## Edge Cases

```
I want to use trails (in empty project - should ask questions)
```

```
Can I use Trails without wagmi?
```

```
Do you support Python/Go for the API?
```

```
How do I self-host Trails?
```

## Complex Scenarios

```
Build me a full payment checkout flow with Trails:
- User selects product ($50 USDC on Base)
- Can pay with any token from any chain
- Shows confirmation after payment
- Integrates with my Next.js 14 app
```

```
I have a DeFi protocol on Optimism. Users should be able to:
1. Bridge any token from any chain
2. Convert to USDC
3. Deposit into my yield vault (specific contract call)
Help me integrate this with Trails Fund mode.
```

```
Create a cross-chain swap aggregator dashboard:
- Shows supported chains/tokens
- Real-time routing quotes
- Transaction history
- Custom UI (not the widget)
Using the Headless SDK
```

## Expected Skill Behaviors

### ✅ Should Activate On:
- "trails", "cross-chain", "swap", "bridge", "payments"
- "pay widget", "fund mode", "earn mode", "swap widget"
- "@0xtrails", "cross-chain payments", "accept any token"
- "intents", "chain abstraction", "x402", "402"
- "multichain", "omnichain", "unified liquidity", "payment rails"
- "pay with any token", "token bridging", "bridge and execute"

### ✅ Should Recommend:
- **Widget** → When user wants drop-in UI, React/Next.js app
- **Headless SDK** → When user wants custom UI, has wagmi
- **Direct API** → When backend/server-side, non-React, automation

### ✅ Should Include:
- Installation commands (`pnpm add @0xtrails/trails`)
- Provider setup (TrailsProvider inside WagmiProvider)
- Environment variables (TRAILS_API_KEY, NEXT_PUBLIC_TRAILS_API_KEY)
- Correct package names
- Working code examples

### ✅ Should Reference:
- Embedded docs in `docs/` folder
- SearchTrails MCP tool for dynamic data
- https://docs.trails.build for latest info
- Troubleshooting guides for common errors

### ✅ Should Ask Questions When:
- Framework is unclear
- Use case is ambiguous
- UI preference not specified
- No context provided

## Testing Checklist

After testing prompts, verify:

- [ ] Skill activates reliably on trigger words
- [ ] Recommends correct integration mode
- [ ] Code examples are valid and complete
- [ ] Package names are correct
- [ ] Environment variables are properly named
- [ ] Provider hierarchy is correct
- [ ] References documentation appropriately
- [ ] Handles edge cases gracefully
- [ ] Asks clarifying questions when needed
- [ ] Provides troubleshooting steps

## Notes

- Test in different project types (Next.js, plain React, Node.js, empty)
- Try both short and detailed prompts
- Test with and without context (existing code)
- Verify calldata encoding examples work
- Check that trade types are explained correctly
