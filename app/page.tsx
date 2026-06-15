import StrategySearch from "@/components/StrategySearch";
import SampleStrategies from "@/components/SampleStrategies";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] text-center">
      <div className="mb-2">
        <span className="text-xs text-purple-400 bg-purple-900/30 px-3 py-1 rounded-full border border-purple-800/50">
          BNB Hack 2026 · AI Trading Agent Edition
        </span>
      </div>

      <h1 className="text-5xl font-bold mb-3 tracking-tight">
        <span className="text-yellow-400">BNB</span>{" "}
        <span className="text-gray-100">Alpha Strategist</span>
      </h1>
      <p className="text-gray-400 mb-2 max-w-lg">
        AI-powered trading strategies backed by CMC Agent Hub data.
        Enter any token symbol to get a backtestable strategy spec.
      </p>
      <p className="text-gray-600 text-sm mb-8 max-w-md">
        Market regime · Fear & Greed · Token analysis · Risk scoring
      </p>

      <StrategySearch />

      <div className="mt-4">
        <SampleStrategies />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12 w-full max-w-4xl">
        <div className="bg-[#111] border border-gray-800 rounded-xl p-5 text-left hover:border-yellow-800/50 transition group">
          <div className="w-10 h-10 rounded-lg bg-yellow-900/30 flex items-center justify-center mb-3 group-hover:bg-yellow-900/50 transition">
            <span className="text-lg">🧠</span>
          </div>
          <h3 className="font-medium text-sm mb-1">AI Strategy Generation</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Real-time market data from CMC Agent Hub powers AI-generated trading strategies with entry/exit conditions
          </p>
        </div>
        <div className="bg-[#111] border border-gray-800 rounded-xl p-5 text-left hover:border-yellow-800/50 transition group">
          <div className="w-10 h-10 rounded-lg bg-yellow-900/30 flex items-center justify-center mb-3 group-hover:bg-yellow-900/50 transition">
            <span className="text-lg">📈</span>
          </div>
          <h3 className="font-medium text-sm mb-1">Market Intelligence</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Fear & Greed, funding rates, liquidation data, and market regime analysis from 12 CMC data tools
          </p>
        </div>
        <div className="bg-[#111] border border-gray-800 rounded-xl p-5 text-left hover:border-yellow-800/50 transition group">
          <div className="w-10 h-10 rounded-lg bg-yellow-900/30 flex items-center justify-center mb-3 group-hover:bg-yellow-900/50 transition">
            <span className="text-lg">⚡</span>
          </div>
          <h3 className="font-medium text-sm mb-1">Backtestable Specs</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Every strategy includes entry, exit, stop-loss, indicators, and confidence scoring — ready for backtesting
          </p>
        </div>
      </div>

      <div className="flex gap-8 mt-12 text-xs text-gray-600">
        <span>Powered by CMC Agent Hub</span>
        <span>·</span>
        <span>BNB Chain</span>
        <span>·</span>
        <span>BNB Hack 2026</span>
      </div>
    </div>
  );
}
