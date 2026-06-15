"use client";
import { useRouter } from "next/navigation";

const SAMPLES = [
  { symbol: "BNB", label: "BNB Chain Native" },
  { symbol: "BTC", label: "Bitcoin" },
  { symbol: "ETH", label: "Ethereum" },
];

export default function SampleStrategies() {
  const router = useRouter();
  return (
    <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
      <span className="hidden sm:inline">Try:</span>
      {SAMPLES.map((s) => (
        <button
          key={s.symbol}
          onClick={() => router.push(`/analyze/${s.symbol}`)}
          className="font-mono text-xs text-yellow-400 hover:text-yellow-300 bg-yellow-900/20 hover:bg-yellow-900/40 px-2.5 py-1 rounded-lg border border-yellow-800/30 transition"
        >
          {s.symbol} ({s.label})
        </button>
      ))}
    </div>
  );
}
