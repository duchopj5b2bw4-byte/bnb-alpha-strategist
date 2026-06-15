"use client";
import { useRouter } from "next/navigation";

const SAMPLES = [
  { addr: "0x88d2037c99572cB86a87e7636485aA42c9a47F42", label: "Deploy Wallet" },
  { addr: "0x388c818ca8b9251b393131c08a736a67ccb19297", label: "Test Wallet" },
  { addr: "0x742d35cc6634c0532925a3b844bc454e4438f44e", label: "Test Wallet 2" },
];

export default function SampleWallets() {
  const router = useRouter();
  return (
    <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
      <span className="hidden sm:inline">Try:</span>
      {SAMPLES.map((s) => (
        <button
          key={s.addr}
          onClick={() => router.push(`/analyze/${s.addr}`)}
          className="font-mono text-xs text-blue-400 hover:text-blue-300 bg-blue-900/20 hover:bg-blue-900/40 px-2.5 py-1 rounded-lg border border-blue-800/30 transition"
        >
          {s.addr.slice(0, 8)}...{s.addr.slice(-4)} ({s.label})
        </button>
      ))}
    </div>
  );
}
