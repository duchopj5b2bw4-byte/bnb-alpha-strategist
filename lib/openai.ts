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

Output ONLY valid JSON (no markdown, no code blocks):
{
  "strategy": "one-sentence strategy name",
  "entry": "clear, backtestable entry condition with price levels",
  "exit": "clear, backtestable exit condition with price levels",
  "stopLoss": "clear stop loss level with justification",
  "confidence": "low|medium|high",
  "reasoning": "detailed reasoning citing specific CMC data points",
  "indicators": ["indicator1", "indicator2"],
  "riskLevel": "low|medium|high",
  "marketRegime": "bullish|bearish|neutral|volatile"
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
    const price = token?.price ?? bnbPrice;
    const fgValue = fear?.value ?? 50;
    const regime = fgValue > 60 ? "bullish" : fgValue < 30 ? "bearish" : "neutral";
    const risk = Math.abs(change24h) > 5 ? "high" : Math.abs(change24h) > 2 ? "medium" : "low";
    const confidence = fgValue > 40 && fgValue < 80 ? "medium" : "low";
    const direction = change24h >= 0 ? "pullback entry on dips" : "momentum continuation";

    return {
      strategy: `${regime === "bullish" ? "Accumulation" : "Defensive"} strategy for ${symbol}`,
      entry: direction === "pullback entry on dips"
        ? `Enter on 3-5% pullback from current $${price.toFixed(2)}`
        : `Enter on confirmed support at $${(price * 0.95).toFixed(2)}`,
      exit: `Take profit at $${(price * (1 + (change24h >= 0 ? 0.03 : 0.05))).toFixed(2)}`,
      stopLoss: `Stop loss at $${(price * 0.95).toFixed(2)} (5% below entry)`,
      confidence: confidence as "low" | "medium" | "high",
      reasoning: `${symbol} at $${price.toFixed(2)} with ${change24h >= 0 ? "+" : ""}${change24h.toFixed(2)}% 24h. Fear & Greed: ${fgValue}/100. Market cap: $${token?.market_cap ? (token.market_cap / 1e9).toFixed(2) + "B" : "N/A"}. ${regime === "bullish" ? "Bullish market conditions favor accumulation." : "Neutral/bearish conditions suggest defensive positioning."}`,
      indicators: ["RSI(14)", "MA(50)", "MA(200)", "Volume", "Fear & Greed"],
      riskLevel: risk as "low" | "medium" | "high",
      marketRegime: regime,
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
  };
}
