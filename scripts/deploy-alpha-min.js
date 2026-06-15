const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");
const solc = require("solc");

const RPC = process.env.MANTLE_RPC || "https://rpc.sepolia.mantle.xyz";
const keyFile = fs.readFileSync(path.join(__dirname, "..", "keys", "mantle-deploy-wallet.txt"), "utf8");
const PRIVATE_KEY = keyFile.match(/Private Key:\s*(0x[a-fA-F0-9]+)/)?.[1] || keyFile.trim();

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  const balance = await provider.getBalance(wallet.address);
  console.log("Deployer:", wallet.address);
  console.log("Balance:", ethers.formatEther(balance), "MNT");

  const source = fs.readFileSync(path.join(__dirname, "..", "contracts", "AlphaScoreRegistry.min.sol"), "utf8");
  const input = {
    language: "Solidity",
    sources: { "AlphaScoreRegistry.min.sol": { content: source } },
    settings: { outputSelection: { "*": { "*": ["evm.bytecode", "abi"] } } },
  };
  const output = JSON.parse(solc.compile(JSON.stringify(input)));
  const contract = output.contracts["AlphaScoreRegistry.min.sol"]["AlphaScoreRegistry"];
  const bytecode = contract.evm.bytecode.object;
  const abi = contract.abi;

  console.log("Bytecode:", (bytecode.length / 2).toFixed(0), "bytes");

  const fee = await provider.getFeeData();
  const tx = await wallet.sendTransaction({
    data: "0x" + bytecode,
    gasLimit: 261000,
    gasPrice: fee.gasPrice,
  });
  console.log("Deploying... tx:", tx.hash);
  const receipt = await tx.wait();
  console.log("Deployed at:", receipt.contractAddress);
  console.log("Gas used:", receipt.gasUsed.toString());

  fs.writeFileSync(path.join(__dirname, "..", "lib", "AlphaScoreRegistry.min.abi.json"), JSON.stringify(abi));
  console.log("ABI saved to lib/AlphaScoreRegistry.min.abi.json");
}

main().catch(console.error);
