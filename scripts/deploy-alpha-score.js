const { ethers } = require("ethers");
const solc = require("solc");
const fs = require("fs");
const path = require("path");

if (!process.env.PRIVATE_KEY) { console.error("Set PRIVATE_KEY env var"); process.exit(1); }

async function main() {
  const sourcePath = path.join(__dirname, "..", "contracts", "AlphaScoreRegistry.sol");
  const source = fs.readFileSync(sourcePath, "utf-8");

  const input = {
    language: "Solidity",
    sources: { "A.sol": { content: source } },
    settings: { outputSelection: { "*": { "*": ["abi", "evm.bytecode.object"] } } },
  };

  console.log("Compiling...");
  const output = JSON.parse(solc.compile(JSON.stringify(input)));
  const contract = output.contracts["A.sol"]["AlphaScoreRegistry"];
  if (!contract) { console.error("Compile failed:", JSON.stringify(output.errors)); process.exit(1); }

  const abi = contract.abi;
  const bytecode = "0x" + contract.evm.bytecode.object;
  console.log("Compiled OK");
  console.log("Bytecode size:", bytecode.length / 2 - 1, "bytes");

  const provider = new ethers.JsonRpcProvider("https://rpc.sepolia.mantle.xyz");
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const balance = await provider.getBalance(wallet.address);
  console.log("Balance:", ethers.formatEther(balance), "MNT");

  const factory = new ethers.ContractFactory(abi, bytecode, wallet);
  console.log("Deploying AlphaScoreRegistry...");
  const inst = await factory.deploy();
  await inst.waitForDeployment();
  const address = await inst.getAddress();

  console.log("\n=== DEPLOYED ===");
  console.log("AlphaScoreRegistry:", address);
  console.log("Explorer: https://explorer.sepolia.mantle.xyz/address/" + address);

  fs.writeFileSync(path.join(__dirname, "..", "keys", "alpha-score-address.txt"),
    `AlphaScoreRegistry: ${address}\nExplorer: https://explorer.sepolia.mantle.xyz/address/${address}\n`);

  const abiPath = path.join(__dirname, "..", "lib", "AlphaScoreRegistry.abi.json");
  fs.writeFileSync(abiPath, JSON.stringify(abi, null, 2));
  console.log("ABI saved to lib/AlphaScoreRegistry.abi.json");
}

main().catch(err => { console.error(err); process.exit(1); });
