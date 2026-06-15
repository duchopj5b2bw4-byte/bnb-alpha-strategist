const { ethers } = require("ethers");
const solc = require("solc");
const fs = require("fs");
const path = require("path");

const PRIVATE_KEY = process.env.PRIVATE_KEY;
if (!PRIVATE_KEY) { console.error("Set PRIVATE_KEY env var"); process.exit(1); }

async function main() {
  const sourcePath = path.join(__dirname, "..", "contracts", "AgentIdentity.sol");
  const source = fs.readFileSync(sourcePath, "utf-8");

  const input = {
    language: "Solidity",
    sources: { "AgentIdentity.sol": { content: source } },
    settings: { outputSelection: { "*": { "*": ["abi", "evm.bytecode.object"] } } },
  };

  console.log("Compiling...");
  const output = JSON.parse(solc.compile(JSON.stringify(input)));
  const contract = output.contracts["AgentIdentity.sol"]["AgentIdentity"];
  if (!contract) { console.error("Compile failed:", JSON.stringify(output.errors)); process.exit(1); }

  const abi = contract.abi;
  const bytecode = "0x" + contract.evm.bytecode.object;
  console.log("Compiled OK");

  const provider = new ethers.JsonRpcProvider("https://rpc.sepolia.mantle.xyz");
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  console.log("Deploying from:", wallet.address);

  const balance = await provider.getBalance(wallet.address);
  console.log("Balance:", ethers.formatEther(balance), "MNT");
  if (balance === 0n) { console.log("Need test MNT from https://faucet.testnet.mantle.xyz"); process.exit(1); }

  const factory = new ethers.ContractFactory(abi, bytecode, wallet);
  console.log("Deploying AgentIdentity...");
  const contract_inst = await factory.deploy();
  await contract_inst.waitForDeployment();
  const address = await contract_inst.getAddress();

  console.log("\n=== DEPLOYED ===");
  console.log("Contract:", address);
  console.log("Explorer: https://explorer.sepolia.mantle.xyz/address/" + address);

  fs.writeFileSync(path.join(__dirname, "..", "keys", "contract-address.txt"),
    `AgentIdentity deployed at: ${address}\nExplorer: https://explorer.sepolia.mantle.xyz/address/${address}\nDeployed: ${new Date().toISOString()}\n`);
}

main().catch(err => { console.error(err); process.exit(1); });
