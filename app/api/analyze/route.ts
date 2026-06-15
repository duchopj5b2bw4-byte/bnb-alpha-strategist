import { NextRequest, NextResponse } from "next/server";
import { getBalance, getBnbPrice } from "@/lib/bsc";
import { getGlobalMetrics, getTokenQuote, getFearGreedIndex, getTopGainers, getTopLosers, getTrendingTokens, getCryptoInfo } from "@/lib/cmc";
import { generateStrategy } from "@/lib/openai";

export async function GET(req: NextRequest) {
  const symbol = req.nextUrl.searchParams.get("symbol") || "BNB";
  const address = req.nextUrl.searchParams.get("address");

  let bnbPrice = 0;
  let balance = "0";

  const [globalMetrics, tokenQuote, fearGreed, topGainers, topLosers, trending, cryptoInfo] = await Promise.all([
    getGlobalMetrics().catch(() => null),
    getTokenQuote(symbol).catch(() => null),
    getFearGreedIndex().catch(() => null),
    getTopGainers().catch(() => null),
    getTopLosers().catch(() => null),
    getTrendingTokens().catch(() => null),
    getCryptoInfo(symbol).catch(() => null),
  ]);

  const trendDirection = trending?.[0]?.symbol === symbol ? "trending" : "not-trending";

  try {
    bnbPrice = await getBnbPrice().catch(() => 0) || (tokenQuote?.price || 0);
  } catch {}

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
