import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "BNB Alpha Strategist | AI Trading Strategies for BNB Hack 2026",
  description: "AI-powered trading strategy generator backed by CMC Agent Hub data. Enter any token to get entry/exit/sl with backtest estimates. Built for BNB Hack: AI Trading Agent Edition.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <Navbar />
        <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
