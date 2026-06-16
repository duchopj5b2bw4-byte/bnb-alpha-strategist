"use client";

import { useEffect, useState } from "react";
import StrategyCard from "@/components/StrategyCard";
import StrategyDashboard from "@/components/StrategyDashboard";
import ShareCard from "@/components/ShareCard";

function specMarkdown(symbol: string, s: any) {
  return [
    `# Strategy: ${s.strategy}`,
    `**Token:** ${symbol}`,
    `**Regime:** ${s.marketRegime}`,
    `**Confidence:** ${s.confidence}`,
    `**Risk Level:** ${s.riskLevel}`,
    ``,
    `## Entry`,
    s.entry,
    ``,
    `## Exit`,
    s.exit,
    ``,
    `## Stop Loss`,
    s.stopLoss,
    ``,
    `## Indicators`,
    s.indicators.map((i: string) => `- ${i}`).join("\n"),
    ``,
    `## Reasoning`,
    s.reasoning,
  ].join("\n");
}

export default function AnalyzePage({ params }: { params: Promise<{ address: string }> }) {
  const [symbol, setSymbol] = useState<string>("");
  useEffect(() => { (async () => { setSymbol((await params).address?.toUpperCase() || "BNB"); })(); }, [params]);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!symbol) return;

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/analyze?symbol=${symbol}`);
        if (!res.ok) throw new Error("Failed to fetch strategy");
        const json = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [symbol]);

  const handleCopy = async () => {
    if (!data?.strategy) return;
    const md = specMarkdown(symbol, data.strategy);
    await navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-400 mb-2">{error}</p>
        <p className="text-gray-500 text-sm">Please try a different token symbol</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {loading && !data ? (
        <div className="bg-[#111] border border-gray-800 rounded-xl p-6 space-y-4 animate-pulse">
          <div className="flex justify-between">
            <div className="space-y-2">
              <div className="h-3 w-12 bg-gray-800 rounded" />
              <div className="h-6 w-24 bg-gray-800 rounded" />
            </div>
            <div className="text-right space-y-2">
              <div className="h-3 w-16 bg-gray-800 rounded ml-auto" />
              <div className="h-5 w-20 bg-gray-800 rounded ml-auto" />
            </div>
          </div>
          <div className="h-3 w-3/4 bg-gray-800 rounded" />
          <div className="h-3 w-1/2 bg-gray-800 rounded" />
          <div className="grid grid-cols-3 gap-3">
            <div className="h-16 bg-gray-800/50 rounded-lg" />
            <div className="h-16 bg-gray-800/50 rounded-lg" />
            <div className="h-16 bg-gray-800/50 rounded-lg" />
          </div>
        </div>
      ) : (
        <StrategyCard
          symbol={data?.symbol || symbol}
          strategy={data?.strategy || null}
          bnbPrice={data?.bnbPrice || 0}
          loading={false}
        />
      )}

      {data?.strategy && (
        <StrategyDashboard cmcData={data?.cmcData || {}} strategy={data.strategy} />
      )}

      {data?.strategy && (
        <div className="bg-[#111] border border-gray-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">Backtestable Strategy Spec</h2>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-medium transition"
              >
                {copied ? "Copied!" : "Copy as Markdown"}
              </button>
              <ShareCard
                symbol={symbol}
                strategy={data.strategy.strategy}
                confidence={data.strategy.confidence}
                riskLevel={data.strategy.riskLevel}
                marketRegime={data.strategy.marketRegime}
                bnbPrice={data.bnbPrice}
              />
            </div>
          </div>

          <pre className="bg-gray-900/50 rounded-lg p-4 text-xs text-gray-300 font-mono whitespace-pre-wrap overflow-x-auto">
            {specMarkdown(symbol, data.strategy)}
          </pre>
        </div>
      )}
    </div>
  );
}
