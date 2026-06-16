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
  const token = cmcData?.tokenQuote as any;
  const fear = cmcData?.fearGreed as any;
  const metrics = cmcData?.globalMetrics as any;
  const info = cmcData?.cryptoInfo as any;
  const trendDirection = cmcData?.trendDirection as string;
  const technicals = cmcData?.technicals as any;
  const bscChain = cmcData?.bscChain as any;

  const fgStr = fear?.value ? `${fear.value}/100 (${fear.value_classification})` : "N/A (Basic plan limitation)";
  const techStr = technicals ? `RSI(14): ${technicals.rsi14.toFixed(0)}, Volatility: ${technicals.volatility24h.toFixed(1)}%, Trend: ${technicals.trendStrength}${technicals.isTrendConsistent ? " (consistent)" : " (divergent)"}` : "N/A";
  const bscStr = bscChain ? `BSC Block: #${bscChain.blockNumber}, Gas: ${bscChain.gasPriceGwei} Gwei` : "N/A";

  const prompt = `You are BNB Alpha Strategist, an AI trading strategist for BNB Hack 2026. Generate a backtestable trading strategy for ${symbol}.

PRICE ACTION (1h / 24h / 7d):
- 1h: ${token?.percent_change_1h ?? "N/A"}%
- 24h: ${token?.percent_change_24h ?? "N/A"}%
- 7d: ${token?.percent_change_7d ?? "N/A"}%
- Current Price: $${token?.price?.toFixed(4) ?? bnbPrice}
- 24h Volume: $${token?.volume_24h ? (token.volume_24h / 1e6).toFixed(0) : "N/A"}M
- Market Cap: $${token?.market_cap ? (token.market_cap / 1e9).toFixed(2) : "N/A"}B

TECHNICAL INDICATORS:
${techStr}

MARKET CONTEXT:
- Fear & Greed: ${fgStr}
- Total Market Cap: $${metrics?.total_market_cap ? (metrics.total_market_cap / 1e12).toFixed(2) : "N/A"}T
- BTC Dominance: ${metrics?.btc_dominance?.toFixed(1) ?? "N/A"}%
- Trending: ${trendDirection}

BNB CHAIN:
- $${bnbPrice} per BNB
- ${bscStr}

INFO: ${info?.description?.slice(0, 300) ?? "N/A"}

Analyze across all 3 timeframes (1h, 24h, 7d). Output ONLY valid JSON (no markdown, no code blocks):
{
  "strategy": "one-sentence strategy name",
  "entry": "clear, backtestable entry condition with specific price levels",
  "exit": "clear, backtestable exit condition with specific price levels",
  "stopLoss": "clear stop loss level",
  "confidence": "low|medium|high",
  "reasoning": "cite specific data: multi-timeframe analysis, technicals, market context",
  "indicators": ["indicator1", "indicator2"],
  "riskLevel": "low|medium|high",
  "marketRegime": "bullish|bearish|neutral|volatile",
  "backtest": {
    "estimatedReturn": "e.g. +5.2% in 14 days",
    "estimatedWinRate": "e.g. 58%",
    "riskRewardRatio": "e.g. 1:2.1",
    "maxDrawdown": "e.g. -3.8%"
  }
}`;

  try {
    const response = await client.chat.completions.create({
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 900,
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
  const technicals = cmcData?.technicals as any;

  if (token || bnbPrice > 0) {
    const change1h = token?.percent_change_1h ?? 0;
    const change24h = token?.percent_change_24h ?? 0;
    const change7d = token?.percent_change_7d ?? 0;
    const price = token?.price ?? bnbPrice;
    const rsi = technicals?.rsi14 ?? 50;
    const vol = technicals?.volatility24h ?? 3;
    const trendConsistent = technicals?.isTrendConsistent ?? true;

    const regime = rsi > 60 ? "bullish" : rsi < 40 ? "bearish" : "neutral";
    const risk = vol > 5 ? "high" : vol > 2 ? "medium" : "low";
    const confidence = rsi > 30 && rsi < 70 ? "medium" : "low";
    const direction = change24h >= 0 ? "pullback entry on dips" : "momentum continuation";

    const entryDip = change24h >= 0 ? 0.03 : 0.02;
    const targetPct = Math.min(0.10, Math.max(0.03, Math.abs(change24h) / 100 * 2));
    const stopPct = Math.max(0.03, Math.min(0.07, vol * 0.3 / 100));
    const entryPrice = price * (1 - entryDip);
    const exitPrice = entryPrice * (1 + targetPct);
    const stopPrice = entryPrice * (1 - stopPct);
    const rewardPct = ((exitPrice - entryPrice) / entryPrice) * 100;
    const riskPct = ((entryPrice - stopPrice) / entryPrice) * 100;
    const rr = riskPct > 0 ? (rewardPct / riskPct).toFixed(1) : "1.0";
    const winRate = regime === "bullish" ? 60 : regime === "bearish" ? 45 : 52;
    const estReturn = ((winRate / 100) * rewardPct - ((100 - winRate) / 100) * riskPct);

    const multiTfNote = trendConsistent
      ? `All timeframes align (1h: ${change1h >= 0 ? "+" : ""}${change1h.toFixed(2)}%, 24h: ${change24h.toFixed(2)}%, 7d: ${change7d.toFixed(2)}%)`
      : `Mixed signals across timeframes (1h: ${change1h >= 0 ? "+" : ""}${change1h.toFixed(2)}%, 24h: ${change24h.toFixed(2)}%, 7d: ${change7d.toFixed(2)}%)`;

    return {
      strategy: `${regime === "bullish" ? "Accumulation" : "Defensive"} ${direction} strategy for ${symbol}`,
      entry: direction.includes("pullback")
        ? `Enter on 3-5% pullback from current $${price.toFixed(2)}`
        : `Enter on confirmed support at $${(price * 0.95).toFixed(2)}`,
      exit: `Take profit at $${exitPrice.toFixed(2)} (${rewardPct >= 0 ? "+" : ""}${rewardPct.toFixed(1)}%)`,
      stopLoss: `Stop loss at $${stopPrice.toFixed(2)} (${riskPct.toFixed(1)}% below entry)`,
      confidence: confidence as "low" | "medium" | "high",
      reasoning: `${symbol} at $${price.toFixed(2)}. ${multiTfNote}. RSI(14): ${rsi.toFixed(0)}. Volatility: ${vol.toFixed(1)}%. ${regime === "bullish" ? "Bullish conditions favor buying dips." : regime === "bearish" ? "Bearish conditions suggest tight stops." : "Neutral conditions suggest mean-reversion."}`,
      indicators: ["RSI(14)", "MA(50)", "MA(200)", "Volume"],
      riskLevel: risk as "low" | "medium" | "high",
      marketRegime: regime,
      backtest: {
        estimatedReturn: `${estReturn >= 0 ? "+" : ""}${estReturn.toFixed(1)}% (14d)`,
        estimatedWinRate: `${winRate}%`,
        riskRewardRatio: `1:${rr}`,
        maxDrawdown: `-${(riskPct).toFixed(1)}%`,
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
