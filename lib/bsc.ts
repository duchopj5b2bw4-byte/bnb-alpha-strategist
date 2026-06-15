import { ethers } from "ethers";

const RPC = process.env.BSC_RPC || "https://bsc-dataseed.binance.org/";

export function getProvider() {
  return new ethers.JsonRpcProvider(RPC);
}

export interface TxInfo {
  hash: string;
  from: string;
  to: string | null;
  value: string;
  timestamp: number;
  gasUsed: string;
}

export async function getWalletTransactions(address: string, limit = 20): Promise<TxInfo[]> {
  const provider = getProvider();
  const addr = address.toLowerCase();
  try {
    const [currentBlock, txCount] = await Promise.all([
      provider.getBlockNumber(),
      provider.getTransactionCount(address),
    ]);

    if (txCount === 0) return [];

    const depth = Math.min(30, currentBlock);
    const blockNums = Array.from({ length: depth }, (_, i) => currentBlock - i);

    const blocks = await Promise.all(
      blockNums.map(n => provider.getBlock(n).catch(() => null))
    );

    const allHashes = new Set<string>();
    for (const block of blocks) {
      if (block?.transactions) {
        for (const hash of block.transactions as string[]) {
          allHashes.add(hash);
        }
      }
    }

    const txs = await Promise.all(
      [...allHashes].map(hash => provider.getTransaction(hash).catch(() => null))
    );

    const matched = txs.filter(tx =>
      tx && (tx.from?.toLowerCase() === addr || tx.to?.toLowerCase() === addr)
    ).slice(0, limit) as ethers.TransactionResponse[];

    if (matched.length === 0) return [];

    const receipts = await Promise.all(
      matched.map(tx =>
        provider.getTransactionReceipt(tx.hash).catch(() => null)
      )
    );

    return matched.map((tx, i) => ({
      hash: tx.hash,
      from: tx.from,
      to: tx.to || null,
      value: ethers.formatEther(tx.value),
      timestamp: (blocks.find(b => b?.number === tx.blockNumber)?.timestamp) || Math.floor(Date.now() / 1000),
      gasUsed: receipts[i]?.gasUsed.toString() || '0',
    }));
  } catch {
    return [];
  }
}

export async function getBalance(address: string): Promise<string> {
  const provider = getProvider();
  const balance = await provider.getBalance(address);
  return ethers.formatEther(balance);
}

export async function getBnbPrice(): Promise<number> {
  return 0;
}

export function shortenAddress(addr: string): string {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export function formatTime(ts: number): string {
  const d = new Date(ts * 1000);
  return d.toLocaleString();
}
