import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="border-b border-yellow-900/50 bg-[#0a0a1a]/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="text-lg font-bold text-yellow-400 tracking-tight">
          BNB Alpha Strategist
        </Link>
        <div className="flex gap-6 text-sm text-gray-400">
          <Link href="/" className="hover:text-yellow-400 transition">
            Dashboard
          </Link>
          <Link href="/leaderboard" className="hover:text-yellow-400 transition">
            Strategies
          </Link>
        </div>
      </div>
    </nav>
  );
}
