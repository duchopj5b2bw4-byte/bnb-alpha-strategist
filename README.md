# BNB Alpha Strategist

AI-powered trading strategy engine for **BNB Hack: AI Trading Agent Edition** (Track 2: Strategy Skills).

Backtestable strategy specs powered by **CoinMarketCap Agent Hub** real-time data and **OpenRouter AI** (GPT-4o-mini).

## Features

- **Strategy Generation** — Enter any token symbol, get AI-generated entry/exit/stop-loss rules
- **CMC Real-Time Data** — Price, 24h change, volume, market cap, Fear & Greed Index
- **Market Regime Detection** — Bullish/Bearish/Neutral/Volatile classification
- **Leaderboard** — Live rankings of top token strategies by confidence/risk
- **Backtestable Specs** — Clean strategy output exportable as Markdown
- **Share on X** — One-click share strategy to Twitter

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- CoinMarketCap Pro API — Market data
- OpenRouter (GPT-4o-mini) — AI strategy generation
- BSC RPC — BNB Chain price
- Vercel — Hosting

## Setup

```bash
npm install
cp .env.example .env.local
# Fill in your API keys
npm run dev
```

## Environment

| Variable | Description |
|---|---|
| `CMC_API_KEY` | CoinMarketCap Pro API key (free) |
| `BSC_RPC` | BNB Chain RPC URL |
| `OPENAI_API_KEY` | OpenAI / OpenRouter API key |
| `OPENAI_BASE_URL` | API base URL (OpenRouter: `https://openrouter.ai/api/v1`) |
| `OPENAI_MODEL` | Model name (default: `gpt-4o-mini`) |

## Live Demo

https://bnb-alpha-strategist.vercel.app

## Submission

- **Hackathon:** [BNB Hack: AI Trading Agent](https://dorahacks.io/hackathon/bnbhack-twt-cmc/)
- **Track:** Strategy Skills ($6K)
- **Deliverable:** Backtestable strategy spec powered by CMC Agent Hub
