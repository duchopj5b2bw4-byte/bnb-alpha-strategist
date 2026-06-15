"use client";

interface BacktestData {
  estimatedReturn: string;
  estimatedWinRate: string;
  riskRewardRatio: string;
  maxDrawdown: string;
}

interface StrategyCardProps {
  symbol: string;
  strategy: {
    strategy: string;
    entry: string;
    exit: string;
    stopLoss: string;
    confidence: string;
    reasoning: string;
    indicators: string[];
    riskLevel: string;
    marketRegime: string;
    backtest?: BacktestData;
  } | null;
  bnbPrice: number;
  loading: boolean;
}

export default function StrategyCard({ symbol, strategy, bnbPrice, loading }: StrategyCardProps) {
  const riskColor =
    strategy?.riskLevel === "low" ? "text-green-400" :
    strategy?.riskLevel === "high" ? "text-red-400" : "text-yellow-400";

  const confidenceColor =
    strategy?.confidence === "high" ? "text-green-400" :
    strategy?.confidence === "low" ? "text-red-400" : "text-yellow-400";

  const regimeColor: Record<string, string> = {
    bullish: "text-green-400",
    bearish: "text-red-400",
    volatile: "text-yellow-400",
  };

  return (
    <div className="bg-[#111] border border-gray-800 rounded-xl p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500 mb-1">Token</p>
          <p className="text-2xl font-bold text-yellow-400">{symbol}</p>
        </div>
        <div className="text-right ml-4">
          <p className="text-xs text-gray-500 mb-1">BNB Price</p>
          <p className="text-xl font-bold text-gray-100">${bnbPrice.toFixed(2)}</p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3 animate-pulse">
          <div className="h-4 bg-gray-800 rounded w-3/4" />
          <div className="h-4 bg-gray-800 rounded w-1/2" />
          <div className="h-8 bg-gray-800 rounded w-full" />
        </div>
      ) : strategy ? (
        <>
          <div className="flex flex-wrap items-center gap-3 mb-4 text-sm">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${regimeColor[strategy.marketRegime] || "text-gray-300"} bg-gray-900/30 border-gray-800/50`}>
              {strategy.marketRegime.toUpperCase()}
            </span>
            <span className={riskColor}>Risk: {strategy.riskLevel.toUpperCase()}</span>
            <span className={confidenceColor}>Confidence: {strategy.confidence.toUpperCase()}</span>
          </div>

          <p className="text-gray-200 text-sm font-medium mb-3">{strategy.strategy}</p>
          <p className="text-gray-400 text-sm mb-4 leading-relaxed">{strategy.reasoning}</p>

          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-gray-900/50 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Entry</p>
              <p className="text-sm text-green-400">{strategy.entry}</p>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Exit</p>
              <p className="text-sm text-red-400">{strategy.exit}</p>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Stop Loss</p>
              <p className="text-sm text-yellow-400">{strategy.stopLoss}</p>
            </div>
          </div>

          {strategy.indicators.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {strategy.indicators.map((indicator, i) => (
                <span key={i} className="px-2 py-1 bg-purple-900/30 text-purple-300 text-xs rounded-full border border-purple-800/50">
                  {indicator}
                </span>
              ))}
            </div>
          )}

          {strategy.backtest && (
            <div className="grid grid-cols-4 gap-2 pt-3 border-t border-gray-800">
              <div className="text-center">
                <p className="text-xs text-gray-500">Est. Return (14d)</p>
                <p className={`text-sm font-mono ${strategy.backtest.estimatedReturn.startsWith("+") ? "text-green-400" : "text-red-400"}`}>{strategy.backtest.estimatedReturn}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500">Win Rate</p>
                <p className="text-sm font-mono text-gray-200">{strategy.backtest.estimatedWinRate}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500">R:R Ratio</p>
                <p className="text-sm font-mono text-gray-200">{strategy.backtest.riskRewardRatio}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500">Max DD</p>
                <p className="text-sm font-mono text-red-400">{strategy.backtest.maxDrawdown}</p>
              </div>
            </div>
          )}
        </>
      ) : null}
    </div>
  );
}
