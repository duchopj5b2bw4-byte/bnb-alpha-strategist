# BNB Alpha Strategist

AI-powered trading strategy engine for **BNB Hack: AI Trading Agent Edition** (Track 2: Strategy Skills).

Backtestable strategy specs powered by **CoinMarketCap Pro API** real-time data and **OpenRouter AI** (GPT-4o-mini).

## Features

- **AI Strategy Generation** — Enter any token symbol, get AI-generated entry/exit/stop-loss rules with confidence scoring
- **Multi-Timeframe Analysis** — AI analyzes 1h/24h/7d price action for deeper insights
- **Technical Indicators** — RSI(14), volatility, trend strength, trend consistency computed from live CMC data
- **BSC On-Chain Data** — Real-time BNB Chain block height, gas price, pending transactions
- **Backtest Estimates** — Each strategy includes simulated return, win rate, risk/reward ratio, and max drawdown
- **CMC Real-Time Data** — Price, 1h/24h/7d changes, volume, market cap, Fear & Greed Index, global metrics
- **Market Regime Detection** — Bullish/Bearish/Neutral/Volatile classification with regime-aware strategies
- **Leaderboard** — Live rankings of 8 top tokens sorted by confidence or risk
- **Backtestable Specs** — Clean Markdown strategy output with one-click copy
- **Offline Degradation** — Falls back to computed strategy when CMC API or AI is unavailable
- **Share on X** — One-click share strategy to Twitter

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- CoinMarketCap Pro API (6 endpoints) — Market data
- OpenRouter (GPT-4o-mini) — AI strategy generation
- BSC RPC (ethers.js) — BNB Chain on-chain data
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
| `CMC_API_KEY` | CoinMarketCap Pro API key (free tier works) |
| `BSC_RPC` | BNB Chain RPC URL (default: `https://bsc-dataseed.binance.org/`) |
| `OPENAI_API_KEY` | OpenAI / OpenRouter API key |
| `OPENAI_BASE_URL` | API base URL (OpenRouter: `https://openrouter.ai/api/v1`) |
| `OPENAI_MODEL` | Model name (default: `gpt-4o-mini`) |

## Live Demo

https://bnb-alpha-strategist.vercel.app

## Submission

- **Hackathon:** [BNB Hack: AI Trading Agent](https://dorahacks.io/hackathon/bnbhack-twt-cmc/)
- **Track:** Strategy Skills ($6K prize pool)
- **Deliverable:** Backtestable strategy spec powered by CMC Agent Hub
- **Judging Criteria:** Technical execution, Originality, Real-world relevance, Demo & presentation
