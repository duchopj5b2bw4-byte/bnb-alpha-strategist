"use client";

interface TokenQuote {
  symbol: string;
  name: string;
  price: number;
  volume_24h: number;
  percent_change_1h: number;
  percent_change_24h: number;
  percent_change_7d: number;
  market_cap: number;
}

interface FearGreedData {
  value: number;
  value_classification: string;
}

interface GlobalMetrics {
  total_market_cap: number;
  total_volume_24h: number;
  btc_dominance: number;
}

interface CMCDataDisplay {
  globalMetrics?: GlobalMetrics | null;
  tokenQuote?: TokenQuote | null;
  fearGreed?: FearGreedData | null;
  topGainers?: TokenQuote[] | null;
  topLosers?: TokenQuote[] | null;
}

interface Strategy {
  strategy: string;
  entry: string;
  exit: string;
  stopLoss: string;
  confidence: string;
  reasoning: string;
  indicators: string[];
  riskLevel: string;
  marketRegime: string;
}

interface StrategyDashboardProps {
  cmcData: CMCDataDisplay;
  strategy: Strategy;
}

export default function StrategyDashboard({ cmcData, strategy }: StrategyDashboardProps) {
  const hasCMCFallback = !cmcData.tokenQuote && !cmcData.fearGreed && !cmcData.globalMetrics;

  const riskColor =
    strategy.riskLevel === "low" ? "text-green-400" :
    strategy.riskLevel === "high" ? "text-red-400" : "text-yellow-400";

  const confidenceColor =
    strategy.confidence === "high" ? "text-green-400" :
    strategy.confidence === "low" ? "text-red-400" : "text-yellow-400";

  const regimeColor: Record<string, string> = {
    bullish: "text-green-400",
    bearish: "text-red-400",
    volatile: "text-yellow-400",
    neutral: "text-blue-400",
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="bg-[#111] border border-gray-800 rounded-xl p-5">
        <p className="text-xs text-gray-500 mb-3 uppercase tracking-wider">Strategy Health</p>
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20">
            <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.5" fill="none" stroke="#1f2937" strokeWidth="3" />
              <circle
                cx="18" cy="18" r="15.5" fill="none"
                stroke={strategy.confidence === "high" ? "#22c55e" : strategy.confidence === "low" ? "#ef4444" : "#eab308"}
                strokeWidth="3"
                strokeDasharray={`${strategy.confidence === "high" ? 90 : strategy.confidence === "low" ? 30 : 60} 97`}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-lg font-bold">
              {strategy.confidence === "high" ? "H" : strategy.confidence === "low" ? "L" : "M"}
            </span>
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Confidence</span>
              <span className={`font-mono ${confidenceColor}`}>{strategy.confidence.toUpperCase()}</span>
            </div>
            <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-500 rounded-full transition-all"
                style={{ width: `${strategy.confidence === "high" ? 90 : strategy.confidence === "low" ? 30 : 60}%` }}
              />
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Risk</span>
              <span className={`font-mono ${riskColor}`}>{strategy.riskLevel.toUpperCase()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#111] border border-gray-800 rounded-xl p-5">
        <p className="text-xs text-gray-500 mb-3 uppercase tracking-wider">Strategy Spec</p>
        <div className="grid grid-cols-1 gap-3 text-sm">
          <div>
            <p className="text-gray-500 text-xs">Entry</p>
            <p className="text-green-400">{strategy.entry}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs">Exit</p>
            <p className="text-red-400">{strategy.exit}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs">Stop Loss</p>
            <p className="text-yellow-400">{strategy.stopLoss}</p>
          </div>
        </div>
      </div>

      <div className="bg-[#111] border border-gray-800 rounded-xl p-5">
        <p className="text-xs text-gray-500 mb-3 uppercase tracking-wider">Market Context</p>
        <div className="space-y-3">
          <div>
            <p className="text-xs text-gray-500 mb-1">Regime</p>
            <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium border ${regimeColor[strategy.marketRegime] || "text-gray-300"} bg-gray-900/30 border-gray-800/50`}>
              {strategy.marketRegime.toUpperCase()}
            </span>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-2">Indicators</p>
            <div className="flex flex-wrap gap-1.5">
              {strategy.indicators.map((ind, i) => (
                <span key={i} className="px-2 py-0.5 bg-purple-900/30 text-purple-300 text-xs rounded-full border border-purple-800/50">
                  #{ind}
                </span>
              ))}
            </div>
          </div>
          {cmcData.fearGreed && (
            <div>
              <p className="text-xs text-gray-500 mb-1">Fear & Greed</p>
              <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium border ${
                cmcData.fearGreed.value > 50 ? "bg-green-900/30 text-green-300 border-green-800/50" : "bg-red-900/30 text-red-300 border-red-800/50"
              }`}>
                {cmcData.fearGreed.value}/100 ({cmcData.fearGreed.value_classification})
              </span>
            </div>
          )}
        </div>
      </div>

      {cmcData.tokenQuote && (
        <div className="lg:col-span-3 bg-[#111] border border-gray-800 rounded-xl p-5">
          <p className="text-xs text-gray-500 mb-3 uppercase tracking-wider">Market Data: {cmcData.tokenQuote.symbol}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-500 text-xs">Price</p>
              <p className="text-gray-200 font-mono">${cmcData.tokenQuote.price.toFixed(6)}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs">24h Change</p>
              <p className={`font-mono ${cmcData.tokenQuote.percent_change_24h >= 0 ? "text-green-400" : "text-red-400"}`}>
                {cmcData.tokenQuote.percent_change_24h >= 0 ? "+" : ""}{cmcData.tokenQuote.percent_change_24h.toFixed(2)}%
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-xs">24h Volume</p>
              <p className="text-gray-200 font-mono">${(cmcData.tokenQuote.volume_24h / 1e6).toFixed(1)}M</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs">Market Cap</p>
              <p className="text-gray-200 font-mono">${(cmcData.tokenQuote.market_cap / 1e9).toFixed(2)}B</p>
            </div>
          </div>
        </div>
      )}

      {hasCMCFallback && (
        <div className="lg:col-span-3 bg-yellow-900/10 border border-yellow-800/30 rounded-xl p-4">
          <p className="text-xs text-yellow-400 mb-1 uppercase tracking-wider">Data Note</p>
          <p className="text-sm text-gray-400">
            CMC API data was unavailable. Strategy is based on default parameters and BNB price.
          </p>
        </div>
      )}

      <div className="lg:col-span-3 bg-purple-900/10 border border-purple-800/30 rounded-xl p-5">
        <p className="text-xs text-purple-400 mb-2 uppercase tracking-wider">AI Reasoning</p>
        <p className="text-sm text-gray-300 leading-relaxed">{strategy.reasoning}</p>
      </div>
    </div>
  );
}
