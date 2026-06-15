# 60 秒录屏需求（带字幕）

**准备：** 浏览器打开 `mantle-alpha-hunter.vercel.app`，录屏 1920×1080，背景轻音乐，不需要人声。

---

| # | 画面 | 时长 | 字幕（叠加文字） |
|---|------|------|------------------|
| 1 | 首页完整展示，不操作 | 3-5s | `Mantle Alpha Hunter` `输入任意钱包地址 · AI 实时分析 · 链上存证` |
| 2 | 鼠标点输入框 → 粘贴地址 `0x722550bb8ec6416522afe9eaf446f0de3262f701` → 点 Analyze | 5-8s | `粘贴钱包地址，点击 Analyze` |
| 3 | 等待加载（loading spinner）→ 显示结果页 | 3-5s | `AI 正在分析链上数据...` |
| 4 | 结果页：慢速从上到下扫一遍（Health 圆环 → Activity 进度条 → Risk LOW → Labels → AI Insight → Key Metrics） | 10-12s | `Health Score: 93/100` → `Activity: 88/100` → `Risk Level: LOW` → `AI 自动生成标签和分析` → `链上数据：余额 69.8 MNT · 4711 笔交易` |
| 5 | 切标签页到 `explorer.sepolia.mantle.xyz/address/0xc86B5629c8DCcECaaeeB0034D34e6845F60e3673` | 5-8s | `分析结果已存储到链上合约` `AlphaScoreRegistry · 0xc86B...3673` |
| 6 | 回到网站 → 点导航 "Leaderboard" | 3-5s | `排行榜 — 所有已分析钱包排名` |
| 7 | 排行榜展示 → 点 "Health" 排序切换 | 5-8s | `支持 Activity / Health 双维度排序` |
| 8 | 结尾页面（首页或排行榜皆可），叠加最终字幕 | 5-8s | `Mantle Alpha Hunter` `mantle-alpha-hunter.vercel.app` `GitHub · 开源 · 合约已部署` `#MantleAIHackathon` |

---

**剪辑注意：**
- 每步之间留 1-2s 淡入淡出
- 加载等待的部分剪掉
- 字幕用白色半透明底、居中或底部
- 第 4 步字幕可以分 3-4 帧换行，不要一次性全显示
- 总长度控制在 60 秒以内
