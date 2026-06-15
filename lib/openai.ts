import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
  baseURL: process.env.OPENAI_BASE_URL || undefined,
  defaultHeaders: process.env.OPENAI_BASE_URL?.includes("openrouter")
    ? { "HTTP-Referer": "https://bnb-alpha-strategist.vercel.app", "X-Title": "BNB Alpha Strategist" }
    : undefined,
});
const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

export interface StrategyResult {
  strategy: string;
  entry: string;
  exit: string;
  stopLoss: string;
  confidence: "low" | "medium" | "high";
  reasoning: string;
  indicators: string[];
  riskLevel: "low" | "medium" | "high";
  marketRegime: string;
  backtest?: {
    estimatedReturn: string;
    estimatedWinRate: string;
    riskRewardRatio: string;
    maxDrawdown: string;
  };
}

export type CMCDataBundle = Record<string, unknown>;

export async function generateStrategy(
  symbol: string,
  cmcData: CMCDataBundle,
  bnbPrice: number
): Promise<StrategyResult> {
  const marketInfo = JSON.stringify(cmcData, null, 2);

  const token = cmcData?.tokenQuote as any;
  const fear = cmcData?.fearGreed as any;
  const metrics = cmcData?.globalMetrics as any;
  const info = cmcData?.cryptoInfo as any;
  const trendDirection = cmcData?.trendDirection as string;

  const prompt = `You are BNB Alpha Strategist, an AI trading strategist for BNB Hack 2026. Generate a backtestable trading strategy for ${symbol}.

Market Data:
- Price: $${token?.price || bnbPrice}
- 24h Change: ${token?.percent_change_24h ?? "N/A"}%
- 7d Change: ${token?.percent_change_7d ?? "N/A"}%
- 24h Volume: $${token?.volume_24h ? (token.volume_24h / 1e6).toFixed(0) : "N/A"}M
- Market Cap: $${token?.market_cap ? (token.market_cap / 1e9).toFixed(2) : "N/A"}B
- Fear & Greed: ${fear?.value ?? "N/A"}/100 (${fear?.value_classification ?? "N/A"})
- Global Market Cap: $${metrics?.total_market_cap ? (metrics.total_market_cap / 1e12).toFixed(2) : "N/A"}T
- BTC Dominance: ${metrics?.btc_dominance?.toFixed(1) ?? "N/A"}%
- BNB Price: $${bnbPrice}
- Trending: ${trendDirection}
- Description: ${info?.description?.slice(0, 200) ?? "N/A"}

Output ONLY valid JSON (no markdown, no code blocks) with backtest estimates:
{
  "strategy": "one-sentence strategy name",
  "entry": "clear, backtestable entry condition with price levels",
  "exit": "clear, backtestable exit condition with price levels",
  "stopLoss": "clear stop loss level with justification",
  "confidence": "low|medium|high",
  "reasoning": "detailed reasoning citing specific CMC data points",
  "indicators": ["indicator1", "indicator2"],
  "riskLevel": "low|medium|high",
  "marketRegime": "bullish|bearish|neutral|volatile",
  "backtest": {
    "estimatedReturn": "e.g. +8.5% in 14 days",
    "estimatedWinRate": "e.g. 65%",
    "riskRewardRatio": "e.g. 1:2.5",
    "maxDrawdown": "e.g. -4.2%"
  }
}`;

  try {
    const response = await client.chat.completions.create({
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 800,
    });

    const text = response.choices[0]?.message?.content || "";
    return parseStrategy(text);
  } catch (err) {
    console.error("OpenAI error:", err);
    return fallbackStrategy(symbol, bnbPrice, cmcData);
  }
}

function parseStrategy(text: string): StrategyResult {
  try {
    const cleaned = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
    const json = JSON.parse(cleaned);
    return {
      strategy: json.strategy || "AI-generated strategy",
      entry: json.entry || "Monitor price action",
      exit: json.exit || "Take profit at target",
      stopLoss: json.stopLoss || "5% below entry",
      confidence: json.confidence || "medium",
      reasoning: json.reasoning || "Based on market data analysis",
      indicators: json.indicators || ["RSI", "MA"],
      riskLevel: json.riskLevel || "medium",
      marketRegime: json.marketRegime || "neutral",
      backtest: json.backtest || undefined,
    };
  } catch {
    return fallbackStrategy("UNKNOWN", 0, {});
  }
}

function fallbackStrategy(symbol: string, bnbPrice: number, cmcData?: CMCDataBundle): StrategyResult {
  const token = cmcData?.tokenQuote as any;
  const fear = cmcData?.fearGreed as any;
  const metrics = cmcData?.globalMetrics as any;

  if (token || fear || bnbPrice > 0) {
    const change24h = token?.percent_change_24h ?? 0;
    const change7d = token?.percent_change_7d ?? 0;
    const price = token?.price ?? bnbPrice;
    const fgValue = fear?.value ?? 50;
    const regime = fgValue > 60 ? "bullish" : fgValue < 30 ? "bearish" : "neutral";
    const risk = Math.abs(change24h) > 5 ? "high" : Math.abs(change24h) > 2 ? "medium" : "low";
    const confidence = fgValue > 40 && fgValue < 80 ? "medium" : "low";
    const direction = change24h >= 0 ? "pullback entry on dips" : "momentum continuation";

    const entryPct = 0.05;
    const targetPct = change24h >= 0 ? 0.05 : 0.08;
    const stopPct = 0.05;
    const entryPrice = change24h >= 0 ? price * (1 - entryPct * 0.6) : price * 0.95;
    const exitPrice = entryPrice * (1 + targetPct);
    const stopPrice = entryPrice * (1 - stopPct);
    const rewardPct = ((exitPrice - entryPrice) / entryPrice) * 100;
    const riskPct = ((entryPrice - stopPrice) / entryPrice) * 100;
    const rr = riskPct > 0 ? (rewardPct / riskPct).toFixed(1) : "1.0";
    const winRate = regime === "bullish" ? 62 : regime === "bearish" ? 45 : 53;
    const estReturn = ((winRate / 100) * rewardPct - ((100 - winRate) / 100) * riskPct);
    const directionLabel = change24h >= 0 ? "pullback" : "momentum";

    return {
      strategy: `${regime === "bullish" ? "Accumulation" : "Defensive"} ${directionLabel} strategy for ${symbol}`,
      entry: `Enter on ${directionLabel === "pullback" ? "3-5%" : "2%"} dip to ~$${entryPrice.toFixed(2)}`,
      exit: `Take profit at $${exitPrice.toFixed(2)} (${rewardPct >= 0 ? "+" : ""}${rewardPct.toFixed(1)}%)`,
      stopLoss: `Stop loss at $${stopPrice.toFixed(2)} (${stopPct * 100}% below entry)`,
      confidence: confidence as "low" | "medium" | "high",
      reasoning: `${symbol} at $${price.toFixed(2)} with ${change24h >= 0 ? "+" : ""}${change24h.toFixed(2)}% 24h, ${change7d >= 0 ? "+" : ""}${change7d.toFixed(2)}% 7d. Fear & Greed: ${fgValue}/100. Market cap: $${token?.market_cap ? (token.market_cap / 1e9).toFixed(2) + "B" : "N/A"}. ${regime === "bullish" ? "Bullish conditions favor buying dips." : regime === "bearish" ? "Bearish conditions suggest tight stops." : "Neutral range suggests mean-reversion setup."}`,
      indicators: ["RSI(14)", "MA(50)", "MA(200)", "Volume", "Fear & Greed"],
      riskLevel: risk as "low" | "medium" | "high",
      marketRegime: regime,
      backtest: {
        estimatedReturn: `${estReturn >= 0 ? "+" : ""}${estReturn.toFixed(1)}% (14d)`,
        estimatedWinRate: `${winRate}%`,
        riskRewardRatio: `1:${rr}`,
        maxDrawdown: `-${stopPct * 100}%`,
      },
    };
  }

  return {
    strategy: `Trend-following strategy for ${symbol}`,
    entry: `Enter on 2% daily dip from 24h high`,
    exit: `Exit at 5% profit or RSI > 70`,
    stopLoss: `Hard stop at 3% below entry`,
    confidence: "medium",
    reasoning: `Market data temporarily unavailable. Using default trend-following logic. BNB at $${bnbPrice}.`,
    indicators: ["RSI(14)", "MA(50)", "MA(200)", "Volume"],
    riskLevel: "medium",
    marketRegime: "neutral",
    backtest: {
      estimatedReturn: "N/A",
      estimatedWinRate: "50%",
      riskRewardRatio: "1:1",
      maxDrawdown: "N/A",
    },
  };
}
