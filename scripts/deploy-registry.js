const { ethers } = require("ethers");
const solc = require("solc");
const fs = require("fs");
const path = require("path");

const RPC = "https://rpc.sepolia.mantle.xyz";
const keyFile = fs.readFileSync(path.join(__dirname, "..", "keys", "mantle-deploy-wallet.txt"), "utf8");
const PRIVATE_KEY = keyFile.match(/Private Key:\s*(0x[a-fA-F0-9]+)/)[1];

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  const bal = await provider.getBalance(wallet.address);
  console.log("Balance:", ethers.formatEther(bal), "MNT");

  const src = fs.readFileSync(path.join(__dirname, "..", "contracts", "Registry.sol"), "utf8");
  const input = { language: "Solidity", sources: { "R.sol": { content: src } }, settings: { outputSelection: { "*": { "*": ["evm.bytecode", "abi"] } } } };
  const out = JSON.parse(solc.compile(JSON.stringify(input)));
  const bc = out.contracts["R.sol"]["Registry"].evm.bytecode.object;
  const abi = out.contracts["R.sol"]["Registry"].abi;
  console.log("Bytecode:", (bc.length / 2).toFixed(0), "bytes");

  const est = await provider.estimateGas({ from: wallet.address, data: "0x" + bc });
  const fee = await provider.getFeeData();
  const cost = est * fee.gasPrice;
  console.log("Est gas:", est.toString(), "Cost:", ethers.formatEther(cost), "MNT");

  if (cost > bal) {
    console.log("Short by", ethers.formatEther(cost - bal), "MNT — trying anyway with 95% gas limit");
  }

  const tx = await wallet.sendTransaction({ data: "0x" + bc, gasLimit: est * 120n / 100n, type: 0, gasPrice: fee.gasPrice });
  console.log("Tx:", tx.hash);
  const r = await tx.wait();
  console.log("Deployed at:", r.contractAddress);
  console.log("Gas used:", r.gasUsed.toString());
  fs.writeFileSync(path.join(__dirname, "..", "lib", "Registry.abi.json"), JSON.stringify(abi));
  console.log("ABI saved");
}

main().catch(console.error);
