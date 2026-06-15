const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

async function main() {
  const PRIVATE_KEY = process.env.PRIVATE_KEY;
  if (!PRIVATE_KEY) throw new Error("Set PRIVATE_KEY env var");

  const provider = new ethers.JsonRpcProvider("https://rpc.testnet.mantle.xyz");
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

  console.log("Deploying from:", wallet.address);
  const balance = await provider.getBalance(wallet.address);
  console.log("Balance:", ethers.formatEther(balance), "MNT");

  if (balance === 0n) {
    console.log("ERROR: Zero balance. Get test MNT from https://faucet.testnet.mantle.xyz");
    process.exit(1);
  }

  const abi = [
    "constructor()",
    "function registerAgent(string calldata _name, string calldata _description) external returns (uint256)",
    "function logAnalysis(string calldata _txHash, string calldata _summary, uint256 _riskScore) external returns (uint256)",
    "function getAgent(uint256 _id) external view returns (tuple(string name, string description, address owner, uint256 createdAt, bool active))",
    "function getAnalysis(uint256 _id) external view returns (tuple(uint256 id, string txHash, string summary, uint256 riskScore, uint256 timestamp))",
    "function agentCount() external view returns (uint256)",
    "function analysisCount() external view returns (uint256)",
    "function admin() external view returns (address)",
    "event AgentRegistered(uint256 indexed id, string name, address indexed owner)",
    "event AnalysisLogged(uint256 indexed id, string txHash, uint256 riskScore)",
  ];
  const bytecode = fs.readFileSync(path.join(__dirname, "..", "contracts", "AgentIdentity.bin"), "utf-8").trim();

  const factory = new ethers.ContractFactory(abi, bytecode, wallet);
  console.log("Deploying AgentIdentity...");
  const contract = await factory.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("\n=== DEPLOYED ===");
  console.log("Contract address:", address);
  console.log("Explorer: https://explorer.testnet.mantle.xyz/address/" + address);
  console.log("Register with: node scripts/register-agent.js " + address);
}

main().catch(err => { console.error(err); process.exit(1); });
