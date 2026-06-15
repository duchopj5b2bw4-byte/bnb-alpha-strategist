# Mantle Alpha Hunter

On-chain intelligence dashboard for Mantle Network. AI-powered wallet analysis, transaction tracking, and smart labeling.

Built for **Turing Test Hackathon 2026** — AI Alpha & Data track.

## Features

- **Wallet Analysis** — Enter any Mantle address for instant AI analysis (GPT-4o-mini)
- **Risk Scoring** — Auto-classified risk levels (low/medium/high) and activity scores
- **Smart Labels** — AI tags wallets as whale, trader, DEX user, bridge user, etc.
- **Transaction History** — Real-time on-chain activity from Mantle testnet
- **Alpha Leaderboard** — Top wallets ranked by activity score
- **Share on X** — One-click share analysis results

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- ethers.js v6 — Mantle RPC
- OpenAI GPT-4o-mini — AI analysis
- Vercel — Hosting

## Setup

```bash
npm install
cp .env.example .env.local
# Add your OPENAI_API_KEY
npm run dev
```

## Environment

| Variable | Description |
|---|---|
| `OPENAI_API_KEY` | OpenAI API key for AI analysis |
| `MANTLE_RPC` | Mantle RPC URL (defaults to testnet) |

## Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

## Contract

`AgentIdentity.sol` — deployed to Mantle testnet for on-chain agent identity.

---
