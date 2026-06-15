# Mantle Alpha Hunter — 比赛提交文档

## 赛道信息

- **比赛：** Turing Test Hackathon 2026
- **赛道：** AI Alpha & Data
- **目标奖项：** Finalist & Deployment ($1K) + Best UI/UX ($3K)
- **提交要求：** X/Twitter 帖子 + 演示视频 + 合约地址 + GitHub 链接

---

## 项目背景

### 问题
Mantle 网络上钱包行为难以追踪和理解：
- 普通用户无法判断一个地址是 whale、bot 还是正常交易者
- 链上数据原始且碎片化，缺乏可解释的洞察
- 缺乏针对 Mantle 生态的 AI 分析工具

### 解决方案
**Mantle Alpha Hunter** — AI 驱动的链上情报仪表板：
- 输入任意 Mantle 钱包地址 → AI 自动分析行为特征
- 输出：健康评分、风险等级、行为分类、异常检测、可读洞察
- 一键分享分析报告到 X/Twitter
- 排行榜展示 Top 地址的评分对比

---

## 技术架构

```
用户浏览器 ─→ Vercel (Next.js SSR)
                  │
           ┌──────┼──────┐
           ▼      ▼      ▼
     Mantle RPC  OpenAI  Contract
     (链上数据)  (AI分析) (AgentIdentity.sol)
```

### 前端
- **框架：** Next.js 14 (App Router)
- **UI：** Tailwind CSS, 深色主题, 响应式设计
- **部署：** Vercel (vercel.app)

### 区块链
- **网络：** Mantle Sepolia (Chain ID: 5003)
- **合约：** AgentIdentity.sol
- **地址：** `0x538fd54Db066AEDBF13cf78832edCdEE8173c981`
- **功能：** 链上 agent 注册与分析日志记录

### AI
- **模型：** GPT-4o-mini (通过 OpenAI 兼容 API)
- **分析维度：** 行为分类, 健康评分, 异常检测, 风险等级
- **降级策略：** AI 不可用时基于链上指标启发式评分

---

## 功能清单

### 已实现

| 功能 | 状态 |
|---|---|
| 钱包搜索 + 地址验证 | ✅ |
| AI 行为分析 (摘要/评分/分类/异常) | ✅ |
| 健康评分 (SVG 环形仪表盘) | ✅ |
| 活动/风险评分可视化 | ✅ |
| 行为分类标签 (trader/whale/bot 等 9 类) | ✅ |
| 异常检测面板 (danger/warning/info) | ✅ |
| 链上指标展示 (流入/出/交易数/对手方) | ✅ |
| 交易记录表格 (IN/OUT 方向标注) | ✅ |
| 多维度排行榜 (Activity/Health 排序) | ✅ |
| X/Twitter 一键分享 | ✅ |
| 示例钱包快速入口 | ✅ |
| 深色主题 UI + 动画 | ✅ |
| 链上合约部署 | ✅ |
| 自动化 CI/CD (GitHub → Vercel) | ✅ |
| AI 降级策略 (API 不可用时的备用分析) | ✅ |

### 计划中但未实现

| 功能 | 原因 |
|---|---|
| AlphaScoreRegistry.sol 增强合约 | 测试网余额不足, 合约部署 Gas 不够 |
| 动态排行榜 (自动收录) | 时间限制 |
| 多链支持 | 超出 MVP 范围 |
| 单元/集成测试 | Hackathon 周期内未覆盖 |

---

## 关键实现细节

### AI 分析流程
1. 通过 Mantle RPC 查询 `getBalance` + `getWalletTransactions`
2. 计算链上指标: totalIn/Out, txCount, uniqueCounterparties, avgValue, peakActivity
3. 构建包含完整上下文的结构化 Prompt
4. 调用 OpenAI API 获取结构化 JSON 输出
5. 解析并展示在仪表板

### 异常检测维度
- 集中转账 (concentrated-transfers)
- 闪电贷交互 (flash-loan-interaction)
- 合约交互模式 (contract-interaction-pattern)
- 大额流入流出 (large-inflow / large-outflow)
- 无交易历史 (no-transaction-history)
- 余额无活动 (balance-without-activity)

### 行为分类体系
trader | investor | whale | bot | bridge-user | defi-user | new-wallet | dex-trader | collector | inactive

---

## 演示流程

1. 打开首页 `mantle-alpha-hunter.vercel.app`
2. 点击示例钱包 "Our Agent" → 进入分析页面
3. 查看健康评分环形图、活动进度条、风险等级
4. 查看行为分类标签与 AI 洞察
5. 展开异常检测面板
6. 查看链上指标网格与交易记录
7. 点击 "Share on X" 分享报告
8. 返回首页 → 进入排行榜 → 切换排序

---

## 合约信息

### AgentIdentity.sol (已部署)
- **网络：** Mantle Sepolia
- **地址：** `0x538fd54Db066AEDBF13cf78832edCdEE8173c981`
- **功能：** `registerAgent(name, description)` + `logAnalysis(txHash, summary, riskScore)`
- **链上记录：** Agent "Mantle Alpha Hunter AI" 已注册，分析记录已写入 → [查看](https://explorer.sepolia.mantle.xyz/address/0x538fd54Db066AEDBF13cf78832edCdEE8173c981)

### AlphaScoreRegistry (极简版，已部署)
- **网络：** Mantle Sepolia
- **地址：** `0xc86B5629c8DCcECaaeeB0034D34e6845F60e3673`
- **功能：** `record(address, score, txCount)` — 存储 AI 分析评分上链；`scores(address)` — 链上查询评分
- **用途：** AI 分析结果 → 链上存储 → 可在任何链上应用读取验证
- **示例数据：** 钱包 `0x88d2...47F42` 健康分 92 已写入 → [查看](https://explorer.sepolia.mantle.xyz/address/0xc86B5629c8DCcECaaeeB0034D34e6845F60e3673)

---

## 链接

- **网站：** https://mantle-alpha-hunter.vercel.app
- **GitHub：** https://github.com/duchopj5b2bw4-byte/mantle-alpha-hunter
- **合约1 (AgentIdentity)：** https://explorer.sepolia.mantle.xyz/address/0x538fd54Db066AEDBF13cf78832edCdEE8173c981
- **合约2 (AlphaScoreRegistry)：** https://explorer.sepolia.mantle.xyz/address/0xc86B5629c8DCcECaaeeB0034D34e6845F60e3673
- **演示视频：** [YouTube 链接 — 待上传]
- **X/Twitter 帖子：** [链接 — 待发布]
