const CMC_API_KEY = process.env.CMC_API_KEY || "";
const BASE_URL = "https://pro-api.coinmarketcap.com/v1";

async function cmcFetch(path: string) {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      headers: { "X-CMC_PRO_API_KEY": CMC_API_KEY },
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export interface GlobalMetrics {
  total_market_cap: number;
  total_volume_24h: number;
  btc_dominance: number;
  eth_dominance: number;
  altcoin_market_cap: number;
  total_cryptocurrencies: number;
  market_cap_percentage: Record<string, number>;
}

export interface TokenQuote {
  symbol: string;
  name: string;
  price: number;
  volume_24h: number;
  percent_change_1h: number;
  percent_change_24h: number;
  percent_change_7d: number;
  market_cap: number;
  circulating_supply: number;
  total_supply: number;
}

export interface FearGreedData {
  value: number;
  value_classification: string;
  timestamp: string;
}

export async function getGlobalMetrics(): Promise<GlobalMetrics | null> {
  const data = await cmcFetch("/global-metrics/quotes/latest");
  return data?.data || null;
}

export async function getTokenQuote(symbol: string): Promise<TokenQuote | null> {
  const data = await cmcFetch(`/cryptocurrency/quotes/latest?symbol=${symbol}`);
  if (!data?.data?.[symbol]) return null;
  const d = data.data[symbol];
  const q = d.quote?.USD || {};
  return {
    symbol: d.symbol,
    name: d.name,
    price: q.price || 0,
    volume_24h: q.volume_24h || 0,
    percent_change_1h: q.percent_change_1h || 0,
    percent_change_24h: q.percent_change_24h || 0,
    percent_change_7d: q.percent_change_7d || 0,
    market_cap: q.market_cap || 0,
    circulating_supply: d.circulating_supply || 0,
    total_supply: d.total_supply || 0,
  };
}

export async function getFearGreedIndex(): Promise<FearGreedData | null> {
  const data = await cmcFetch("/fear-and-greed/latest");
  if (!data?.data) return null;
  return {
    value: parseInt(data.data.value),
    value_classification: data.data.value_classification,
    timestamp: data.data.timestamp,
  };
}

export async function getTopGainers(): Promise<TokenQuote[]> {
  const data = await cmcFetch(`/cryptocurrency/listings/latest?sort=percent_change_24h&limit=5`);
  if (!data?.data) return [];
  return data.data.map((d: any) => ({
    symbol: d.symbol,
    name: d.name,
    price: d.quote?.USD?.price || 0,
    volume_24h: d.quote?.USD?.volume_24h || 0,
    percent_change_1h: d.quote?.USD?.percent_change_1h || 0,
    percent_change_24h: d.quote?.USD?.percent_change_24h || 0,
    percent_change_7d: d.quote?.USD?.percent_change_7d || 0,
    market_cap: d.quote?.USD?.market_cap || 0,
    circulating_supply: d.circulating_supply || 0,
    total_supply: d.total_supply || 0,
  }));
}

export async function getTopLosers(): Promise<TokenQuote[]> {
  const data = await cmcFetch(`/cryptocurrency/listings/latest?sort=percent_change_24h&sort_dir=asc&limit=5`);
  if (!data?.data) return [];
  return data.data.map((d: any) => ({
    symbol: d.symbol,
    name: d.name,
    price: d.quote?.USD?.price || 0,
    volume_24h: d.quote?.USD?.volume_24h || 0,
    percent_change_1h: d.quote?.USD?.percent_change_1h || 0,
    percent_change_24h: d.quote?.USD?.percent_change_24h || 0,
    percent_change_7d: d.quote?.USD?.percent_change_7d || 0,
    market_cap: d.quote?.USD?.market_cap || 0,
    circulating_supply: d.circulating_supply || 0,
    total_supply: d.total_supply || 0,
  }));
}

export async function getTrendingTokens(): Promise<TokenQuote[]> {
  const data = await cmcFetch(`/cryptocurrency/trending/latest`);
  if (!data?.data) return [];
  return data.data.slice(0, 5).map((d: any) => ({
    symbol: d.symbol,
    name: d.name,
    price: d.quote?.USD?.price || 0,
    volume_24h: d.quote?.USD?.volume_24h || 0,
    percent_change_1h: d.quote?.USD?.percent_change_1h || 0,
    percent_change_24h: d.quote?.USD?.percent_change_24h || 0,
    percent_change_7d: d.quote?.USD?.percent_change_7d || 0,
    market_cap: d.quote?.USD?.market_cap || 0,
    circulating_supply: d.circulating_supply || 0,
    total_supply: d.total_supply || 0,
  }));
}

export interface TechnicalIndicators {
  rsi14: number;
  volatility24h: number;
  trendStrength: "strong" | "moderate" | "weak";
  momentumDivergence: number;
  isTrendConsistent: boolean;
}

export function computeIndicators(quote: TokenQuote): TechnicalIndicators {
  const abs1h = Math.abs(quote.percent_change_1h);
  const abs24h = Math.abs(quote.percent_change_24h);
  const abs7d = Math.abs(quote.percent_change_7d);

  const avgChange = (quote.percent_change_1h + quote.percent_change_24h + quote.percent_change_7d) / 3;
  const rsi14 = Math.min(100, Math.max(0, 50 + avgChange * 1.5));

  const volatility24h = Math.max(abs1h * 24, abs24h);

  const signs = [Math.sign(quote.percent_change_1h), Math.sign(quote.percent_change_24h), Math.sign(quote.percent_change_7d)];
  const positives = signs.filter(s => s >= 0).length;
  const isTrendConsistent = positives === 0 || positives === 3;

  const avgAbs = (abs1h + abs24h + abs7d) / 3;
  const trendStrength: "strong" | "moderate" | "weak" = avgAbs > 3 ? "strong" : avgAbs > 1 ? "moderate" : "weak";

  const twentyFourHFrom1h = quote.percent_change_1h * 24;
  const momentumDivergence = Math.abs(twentyFourHFrom1h - quote.percent_change_24h);

  return { rsi14, volatility24h, trendStrength, momentumDivergence, isTrendConsistent };
}

export interface CryptoInfo {
  id: number;
  name: string;
  symbol: string;
  description: string;
  logo: string;
  urls: { website: string[]; twitter: string[]; message_board: string[] };
}

export async function getCryptoInfo(symbol: string): Promise<CryptoInfo | null> {
  const data = await cmcFetch(`/cryptocurrency/info?symbol=${symbol}`);
  if (!data?.data?.[symbol]) return null;
  const d = data.data[symbol];
  return {
    id: d.id,
    name: d.name,
    symbol: d.symbol,
    description: d.description || "",
    logo: d.logo || "",
    urls: d.urls || { website: [], twitter: [], message_board: [] },
  };
}
