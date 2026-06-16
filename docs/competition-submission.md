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
┌─ User Browser ───────────────────────────┐
│  Next.js 14 SSR + Tailwind CSS           │
│  /analyze/BTC → StrategyCard + Dashboard │
│  /leaderboard → 8 token 实时排名          │
└────────────┬─────────────────────────────┘
             │
┌────────────▼─────────────────────────────┐
│  API Route: /api/analyze?symbol=BTC      │
│                                           │
│  ┌─────────────┐  ┌───────────────────┐  │
│  │ CMC Pro API │  │ OpenRouter AI     │  │
│  │ (实时市场数据) │  │ (GPT-4o-mini)     │  │
│  │ 6 个数据源   │  │ 策略 JSON 输出    │  │
│  └──────┬──────┘  └───────────────────┘  │
│         │  BNB Price 改用 CMC 报价       │
│         ▼                                │
│  (BSC RPC 仅用于地址余额查询)            │
└───────────────────────────────────────────┘
```

## CMC 数据集成

| 数据 | 端点 | 用途 |
|------|------|------|
| BNB 报价 | `/v1/cryptocurrency/quotes/latest?symbol=BNB` | BNB 实时价格 (替代 BSC RPC) |
| Token 报价 | `/v1/cryptocurrency/quotes/latest` | 目标代币价格/涨跌/市值/成交量 |
| Fear & Greed | `/v1/fear-and-greed/latest` | 市场情绪判断 |
| 涨幅榜 | `/v1/cryptocurrency/listings/latest?sort=percent_change_24h` | 趋势确认 |
| 跌幅榜 | `/v1/cryptocurrency/listings/latest?sort_dir=asc` | 风险预警 |
| Trending | `/v1/cryptocurrency/trending/latest` | 热门代币信号 |

## AI 策略生成

**模型:** GPT-4o-mini (via OpenRouter, 免费)
**输入:** CMC 实时数据 (6 个数据源)
**输出结构:**
- `strategy` — 策略名称
- `entry` — 入场条件 (含价格)
- `exit` — 出场条件 (含价格)
- `stopLoss` — 止损位
- `confidence` — 信心等级 (low/medium/high)
- `indicators` — 参考指标
- `marketRegime` — 市场状态 (bullish/bearish/neutral/volatile)
- `reasoning` — AI 推理过程
- `backtest` — 模拟回测统计:
  - `estimatedReturn` — 预计 14 天收益 (如 `+8.5%`)
  - `estimatedWinRate` — 预计胜率 (如 `62%`)
  - `riskRewardRatio` — 风险回报比 (如 `1:2.5`)
  - `maxDrawdown` — 最大回撤 (如 `-4.2%`)

## 评审标准对齐

### 1. 技术执行 (Technical execution)
- CMC Pro API 集成 6 个数据源 + 计算技术指标 (RSI/波动率/趋势一致性)
- OpenRouter (GPT-4o-mini) AI 策略生成，支持多时间框架分析 (1h/24h/7d)
- BSC RPC 集成 (实时区块高度、Gas 费、待处理交易数)
- Next.js 14 SSR + Tailwind CSS 前端，类型安全
- 完整的离线降级：AI 或 CMC 不可用时自动回退到本地计算的策略

### 2. 原创性 (Originality)
- 结合 CMC 实时数据 + AI 推理的量化风格策略生成引擎
- 每个策略包含自动计算的模拟回测统计 (收益/胜率/风险回报比/最大回撤)
- 市场状态检测 + 多时间框架趋势一致性分析
- Copy as Markdown 导出，可直接用于第三方回测平台

### 3. 实际应用价值 (Real-world relevance)
- 支持任意 CMC 列出的代币符号，零门槛使用
- 实时 Fear & Greed + 技术指标 + 市场状态一目了然
- Leaderboard 按信心/风险排序，快速比较 8 大主流代币
- 策略规规范格式标准，可直接复制到 TradingView/回测脚本

### 4. 演示和展示 (Demo & presentation)
- 视频演示：[待补充]()
- 在线体验：https://bnb-alpha-strategist.vercel.app
- 完整 README + 提交文档

## 技术栈

| 组件 | 使用 |
|------|------|
| **CMC Pro API** | 6 个数据源 (报价/全局指标/Fear&Greed/涨跌榜/趋势/信息) + 技术指标计算 |
| **BSC RPC** | 实时区块高度、Gas 费、地址余额查询 |
| **OpenRouter AI** | GPT-4o-mini 策略生成 (CMC 数据驱动) |
| **Next.js 14** | App Router + Server Components |
| **ethers.js** | BSC 链上交互 |
| **Vercel** | 部署托管 |

## 功能清单

| 功能 | 状态 |
|------|------|
| Token 策略搜索 | ✅ |
| CMC 实时数据集成 (6 个数据源) | ✅ |
| **技术指标计算 (RSI/波动率/趋势一致性)** | ✅ |
| **多时间框架分析 (1h/24h/7d)** | ✅ |
| **BSC 链上数据 (区块高度/Gas 费)** | ✅ |
| AI 策略生成 (GPT-4o-mini) | ✅ |
| 可回测策略规规范 (Entry/Exit/SL) | ✅ |
| **模拟回测统计 (回报/胜率/R:R/最大回撤)** | ✅ |
| **CMC BNB 报价 (替代失效的 BSC RPC)** | ✅ |
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
- **CMC Pro API：** https://coinmarketcap.com/api/documentation
- **BSC Scan：** https://bscscan.com
