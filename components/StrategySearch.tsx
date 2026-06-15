"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function StrategySearch() {
  const [symbol, setSymbol] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (symbol.trim()) {
      router.push(`/analyze/${symbol.trim().toUpperCase()}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div className="flex gap-2">
        <input
          type="text"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          placeholder="Enter token symbol (e.g. BNB, BTC, ETH)..."
          className="flex-1 px-4 py-3 bg-[#111] border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-yellow-500 font-mono text-sm uppercase"
        />
        <button
          type="submit"
          className="px-6 py-3 bg-yellow-600 hover:bg-yellow-500 rounded-lg font-medium transition"
        >
          Generate Strategy
        </button>
      </div>
    </form>
  );
}
