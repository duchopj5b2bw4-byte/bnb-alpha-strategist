"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface StrategyEntry {
  symbol: string;
  strategy: string;
  confidence: string;
  risk: string;
  regime: string;
  loading: boolean;
}

const TRACKED_TOKENS = ["BNB", "BTC", "ETH", "SOL", "DOGE", "XRP", "ADA", "DOT"];

export default function LeaderboardPage() {
  const [strategies, setStrategies] = useState<StrategyEntry[]>(
    TRACKED_TOKENS.map(s => ({ symbol: s, strategy: "", confidence: "", risk: "", regime: "", loading: true }))
  );
  const [sortBy, setSortBy] = useState<"confidence" | "risk">("confidence");

  useEffect(() => {
    const fetchAll = async () => {
      const results = await Promise.all(
        TRACKED_TOKENS.map(async (symbol) => {
          try {
            const res = await fetch(`/api/analyze?symbol=${symbol}`);
            if (!res.ok) return { symbol, strategy: "", confidence: "", risk: "", regime: "", loading: false };
            const json = await res.json();
            if (!json.strategy) return { symbol, strategy: "", confidence: "", risk: "", regime: "", loading: false };
            return {
              symbol,
              strategy: json.strategy.strategy,
              confidence: json.strategy.confidence,
              risk: json.strategy.riskLevel,
              regime: json.strategy.marketRegime,
              loading: false,
            };
          } catch {
            return { symbol, strategy: "", confidence: "", risk: "", regime: "", loading: false };
          }
        })
      );
      setStrategies(results);
    };
    fetchAll();
  }, []);

  const confidenceRank = (c: string) => c === "high" ? 3 : c === "medium" ? 2 : 1;
  const riskRank = (r: string) => r === "low" ? 3 : r === "medium" ? 2 : 1;

  const sorted = [...strategies]
    .filter(s => !s.loading && s.confidence)
    .sort((a, b) =>
      sortBy === "confidence"
        ? confidenceRank(b.confidence) - confidenceRank(a.confidence)
        : riskRank(b.risk) - riskRank(a.risk)
    );

  const regimeBadge = (r: string) => {
    const colors: Record<string, string> = {
      bullish: "bg-green-900/30 text-green-300",
      bearish: "bg-red-900/30 text-red-300",
      volatile: "bg-yellow-900/30 text-yellow-300",
      neutral: "bg-blue-900/30 text-blue-300",
    };
    return colors[r] || "bg-gray-900/30 text-gray-300";
  };

  const confidenceBadge = (c: string) => {
    const colors: Record<string, string> = {
      high: "bg-green-900/30 text-green-300",
      medium: "bg-yellow-900/30 text-yellow-300",
      low: "bg-red-900/30 text-red-300",
    };
    return colors[c] || "bg-gray-900/30 text-gray-300";
  };

  const riskDot = (r: string) =>
    r === "low" ? "bg-green-400" : r === "high" ? "bg-red-400" : "bg-yellow-400";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Strategy Rankings</h1>
          <p className="text-gray-400 text-sm mt-1">
            Live AI-generated strategies across top tokens
          </p>
        </div>
        <div className="flex gap-2 text-sm">
          <button
            onClick={() => setSortBy("confidence")}
            className={`px-3 py-1.5 rounded-lg transition ${sortBy === "confidence" ? "bg-yellow-600 text-white" : "bg-gray-800 text-gray-400 hover:text-white"}`}
          >
            Confidence
          </button>
          <button
            onClick={() => setSortBy("risk")}
            className={`px-3 py-1.5 rounded-lg transition ${sortBy === "risk" ? "bg-yellow-600 text-white" : "bg-gray-800 text-gray-400 hover:text-white"}`}
          >
            Risk
          </button>
        </div>
      </div>

      <div className="bg-[#111] border border-gray-800 rounded-xl overflow-hidden">
        {sorted.length === 0 ? (
          <div className="p-8 space-y-4 animate-pulse">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="h-12 bg-gray-800 rounded" />
            ))}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-gray-500 text-xs uppercase">
                <th className="text-left py-3 px-4 w-12">#</th>
                <th className="text-left py-3 px-4">Token</th>
                <th className="text-left py-3 px-4">Strategy</th>
                <th className="text-left py-3 px-4">Regime</th>
                <th className="text-left py-3 px-4">Confidence</th>
                <th className="text-left py-3 px-4">Risk</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((entry, i) => (
                <tr key={entry.symbol} className="border-b border-gray-800/50 hover:bg-gray-900/50 transition">
                  <td className="py-3 px-4">
                    {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
                  </td>
                  <td className="py-3 px-4">
                    <Link
                      href={`/analyze/${entry.symbol}`}
                      className="font-mono text-yellow-400 hover:text-yellow-300 text-sm font-bold"
                    >
                      {entry.symbol}
                    </Link>
                  </td>
                  <td className="py-3 px-4 text-gray-300 text-xs max-w-xs truncate">
                    {entry.strategy}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${regimeBadge(entry.regime)}`}>
                      {entry.regime}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${confidenceBadge(entry.confidence)}`}>
                      {entry.confidence}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${riskDot(entry.risk)}`} />
                      <span className="text-gray-400 text-xs">{entry.risk}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
