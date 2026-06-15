# BNB Alpha Strategist — 迁移指南 & 项目文档

## 项目状态

```
项目: bnb-alpha-strategist
技术栈: Next.js 14 + TypeScript + Tailwind CSS
端口: http://localhost:3000
API: /api/analyze?symbol=BTC
```

### 已完成的迁移

| 步骤 | 文件 | 说明 |
|------|------|------|
| ✅ 复制项目 | `mantle-alpha-hunter` → `bnb-alpha-strategist` | 完整复制，排除 node_modules |
| ✅ package.json | `package.json` | 改名 `bnb-alpha-strategist` |
| ✅ 链配置 | `lib/bsc.ts` | Mantle RPC → BSC Mainnet (`bsc-dataseed.binance.org`) |
| ✅ CMC 客户端 | `lib/cmc.ts` | REST API: `pro-api.coinmarketcap.com/v1/...` |
| ✅ AI 策略 | `lib/openai.ts` | 钱包分析 → 策略生成 (含 CMC 数据 fallback) |
| ✅ API 路由 | `app/api/analyze/route.ts` | `?symbol=BTC` → CMC 数据 + 策略 |
| ✅ 首页 | `app/page.tsx` | BNB 主题，token 搜索 |
| ✅ 分析页 | `app/analyze/[address]/page.tsx` | 策略结果展示 |
| ✅ 排行榜 | `app/leaderboard/page.tsx` | 策略排名 (demo 数据) |
| ✅ 组件 | `components/` | StrategySearch, StrategyCard, StrategyDashboard, ShareCard, Navbar, SampleStrategies |
| ✅ 删除旧组件 | — | WalletCard, TxTable, AnalysisDashboard, WalletSearch, wallet API route |

### 当前架构

```
用户输入 symbol
    ↓
/api/analyze?symbol=BTC
    ├── BSC RPC → BNB Price
    ├── CMC API → Token Quote, Fear & Greed, Global Metrics, Top Gainers/Losers
    └── OpenAI (或 fallback) → Strategy { entry, exit, stopLoss, indicators, ... }
    ↓
前端渲染: StrategyCard + StrategyDashboard + ShareCard
```

### CMC 集成情况

| 数据源 | 端点 | 状态 |
|--------|------|------|
| Token 报价 | `/v1/cryptocurrency/quotes/latest` | ✅ |
| Fear & Greed | `/v1/fear-and-greed/latest` | ✅ |
| 全局指标 | `/v1/global-metrics/quotes/latest` | ✅ (Basic 可能不支持) |
| 涨幅榜 | `/v1/cryptocurrency/listings/latest?sort=percent_change_24h` | ✅ |
| 跌幅榜 | `/v1/cryptocurrency/listings/latest?sort_dir=asc` | ✅ |
| Trending | `/v1/cryptocurrency/trending/latest` | ✅ |
| Crypto Info | `/v2/cryptocurrency/info` | ✅ |
| Funding Rates | — | ❌ (Basic 不支持) |
| On-Chain Flow | — | ❌ (Basic 不支持) |
| Liquidation Data | — | ❌ (Basic 不支持) |

## 优化清单（按优先级）

### P0 — 必须

- [ ] **配 OpenAI Key** — 填 `.env.local`，否则策略走 fallback 启发式
- [ ] **底部 Strategy Details 空白** — ShareCard 区域需要补内容

### P1 — 已完成

- [x] **Leaderboard 实时化** — 从 API 拉 8 个 token 的实时策略 (BNB/BTC/ETH/SOL/DOGE/XRP/ADA/DOT)
- [x] **更多 CMC 工具** — Trending Tokens + Crypto Info (描述/Logo/链接)

### P2 — 锦上添花

- [ ] **路由命名** — `[address]` → `[symbol]`
- [ ] **策略导出** — Copy / Export / Download 为 markdown
- [ ] **Demo 视频脚本** — 录屏准备

## 时间线

```
6/15 ✅ 注册 DoraHacks，领 CMC API Key
6/15 ✅ 复制项目，换链配置，接 CMC REST API
6/15 ✅ 改 API 路由、前端 UI、组件
6/15 ✅ P0: 底部 Strategy Spec + Copy as Markdown
6/15 ✅ P1: Leaderboard 实时化 + Trending/Crypto Info
6/15 ✅ P0: OpenAI Key → OpenRouter 免费 API
6/15 ✅ 部署 Vercel + GitHub 仓库
6/15 ✅ 清理旧 Mantle 文件 + 重写 README/提交文档
6/16 → 录 Demo 视频
6/21 12:00 UTC 截止 → 提交 DoraHacks
```

## 关键链接

- DoraHacks: https://dorahacks.io/hackathon/bnbhack-twt-cmc/
- CMC API 文档: https://coinmarketcap.com/api/documentation
- CMC Agent Hub: https://coinmarketcap.com/api/documentation/ai-agent-hub
- CMC 注册领 Key: https://pro.coinmarketcap.com/signup/?plan=0
- BNB Chain: https://www.bnbchain.org
- BSC RPC: https://bsc-dataseed.binance.org/
- Vercel: https://vercel.com

## 注意事项

- Track 2 (Strategy Skills) 纯策略赛道，不需要实盘交易
- CMC API Basic 免费计划有频率限制 (~30 req/min)
- 请求头: `X-CMC_PRO_API_KEY` (不是 `X-CMC-MCP-API-KEY`)
- 使用 REST API 而非 MCP 协议，后端 HTTP 调用更稳定
