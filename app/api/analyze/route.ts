import { NextRequest, NextResponse } from "next/server";
import { getBalance } from "@/lib/bsc";
import { getGlobalMetrics, getTokenQuote, getFearGreedIndex, getTopGainers, getTopLosers, getTrendingTokens, getCryptoInfo } from "@/lib/cmc";
import { generateStrategy } from "@/lib/openai";

export async function GET(req: NextRequest) {
  const symbol = req.nextUrl.searchParams.get("symbol") || "BNB";
  const address = req.nextUrl.searchParams.get("address");

  let balance = "0";

  const [bnbQuote, globalMetrics, tokenQuote, fearGreed, topGainers, topLosers, trending, cryptoInfo] = await Promise.all([
    getTokenQuote("BNB").catch(() => null),
    getGlobalMetrics().catch(() => null),
    getTokenQuote(symbol).catch(() => null),
    getFearGreedIndex().catch(() => null),
    getTopGainers().catch(() => null),
    getTopLosers().catch(() => null),
    getTrendingTokens().catch(() => null),
    getCryptoInfo(symbol).catch(() => null),
  ]);

  const bnbPrice = bnbQuote?.price ?? 0;
  const trendDirection = trending?.[0]?.symbol === symbol ? "trending" : "not-trending";

  if (address) {
    try { balance = await getBalance(address); } catch {}
  }

  const cmcData: Record<string, unknown> = {
    globalMetrics,
    tokenQuote,
    fearGreed,
    topGainers,
    topLosers,
    trending,
    cryptoInfo,
    trendDirection,
  };

  let strategy = null;
  try {
    strategy = await generateStrategy(symbol, cmcData, bnbPrice);
  } catch {
    strategy = null;
  }

  return NextResponse.json({
    symbol,
    bnbPrice,
    balance,
    cmcData,
    strategy,
    timestamp: new Date().toISOString(),
  });
}
