# BNB Alpha Strategist — BNB Hack 提交文档

## 赛道信息

- **比赛：** BNB Hack: AI Trading Agent Edition
- **赛道：** Track 2 — Strategy Skills ($6K)
- **截止：** 2026年6月21日 12:00 UTC
- **主办：** DoraHacks × CoinMarketCap × Trust Wallet
- **提交链接：** https://dorahacks.io/hackathon/bnbhack-twt-cmc/

## 项目简介

**BNB Alpha Strategist** 是一个 AI 驱动的交易策略生成引擎，使用 CoinMarketCap Agent Hub 实时市场数据 + OpenRouter AI，为任意代币生成可回测的交易策略规规范。

```
用户输入 token symbol (BNB/BTC/ETH/...)
    ↓
CMC API (实时价格/涨跌/市值/Fear&Greed)
    ↓
OpenRouter AI (GPT-4o-mini) 分析
    ↓
输出: Strategy { entry, exit, stopLoss, indicators, regime, reasoning }
    ↓
可导出 Markdown 策略规规范 → 用于回测
```

## 技术架构

```
┌─ User Browser ─────────────────────────┐
│  Next.js 14 SSR + Tailwind CSS         │
│  /analyze/BTC → StrategyCard + Dashboard│
│  /leaderboard → 8 token 实时排名        │
└────────────┬───────────────────────────┘
             │
┌────────────▼───────────────────────────┐
│  API Route: /api/analyze?symbol=BTC    │
│                                         │
│  ┌─────────────┐  ┌──────────────────┐  │
│  │ CMC Pro API │  │ OpenRouter AI    │  │
│  │ (实时市场数据) │  │ (GPT-4o-mini)    │  │
│  │ 5 个数据源   │  │ 策略 JSON 输出   │  │
│  └─────────────┘  └──────────────────┘  │
│                                         │
│  ┌─────────────┐                        │
│  │ BSC RPC     │                        │
│  │ (BNB Price) │                        │
│  └─────────────┘                        │
└─────────────────────────────────────────┘
```

## CMC 数据集成

| 数据 | 端点 | 用途 |
|------|------|------|
| Token 报价 | `/v1/cryptocurrency/quotes/latest` | 价格/涨跌/市值/成交量 |
| Fear & Greed | `/v1/fear-and-greed/latest` | 市场情绪判断 |
| 涨幅榜 | `/v1/cryptocurrency/listings/latest?sort=percent_change_24h` | 趋势确认 |
| 跌幅榜 | `/v1/cryptocurrency/listings/latest?sort_dir=asc` | 风险预警 |
| Trending | `/v1/cryptocurrency/trending/latest` | 热门代币信号 |

## AI 策略生成

**模型:** GPT-4o-mini (via OpenRouter, 免费)
**输入:** CMC 实时数据 + BNB Price
**输出结构:**
- `strategy` — 策略名称
- `entry` — 入场条件 (含价格)
- `exit` — 出场条件 (含价格)
- `stopLoss` — 止损位
- `confidence` — 信心等级 (low/medium/high)
- `indicators` — 参考指标
- `marketRegime` — 市场状态 (bullish/bearish/neutral/volatile)
- `reasoning` — AI 推理过程

## 功能清单

| 功能 | 状态 |
|------|------|
| Token 策略搜索 | ✅ |
| CMC 实时数据集成 (5 个数据源) | ✅ |
| AI 策略生成 (GPT-4o-mini) | ✅ |
| 可回测策略规规范 (Entry/Exit/SL) | ✅ |
| Copy as Markdown 导出 | ✅ |
| X/Twitter 一键分享 | ✅ |
| Leaderboard (8 token 实时排名) | ✅ |
| Confidence/Risk 排序 | ✅ |
| 市场情绪指标 (Fear & Greed) | ✅ |
| 离线降级 (CMC/AI 不可用时) | ✅ |

## 链接

- **网站：** https://bnb-alpha-strategist.vercel.app
- **GitHub：** https://github.com/duchopj5b2bw4-byte/bnb-alpha-strategist
- **DoraHacks：** https://dorahacks.io/hackathon/bnbhack-twt-cmc/
- **CMC API：** https://coinmarketcap.com/api/documentation
