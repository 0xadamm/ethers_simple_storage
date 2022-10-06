import { ethers } from "ethers";
import * as fs from "fs-extra";
// RPC: http://127.0.0.1:7545

const main = async () => {
  // Connect to the RPC Probider to ethers
  const provider = new ethers.providers.JsonRpcProvider(
    "http://127.0.0.1:7545"
  );

  // Create signer variable
  const wallet = new ethers.Wallet(
    // Never use private key in real project !!
    "008eb98165004a77be815d101d0033e374af7ebfbde6d7f3ecab8df522ca68d2",
    provider
  );

  // Create abi | interface variable
  const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8");

  // Create a binary | bytecode variable
  const binary = fs.readFileSync(
    "./SimpleStorage_sol_SimpleStorage.bin",
    "utf8"
  );

  // Pass in (interface, bytecode, signer)
  //Deploys new contract
  const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
  console.log("Deploying, please wait");
  const contract = await contractFactory.deploy();
  console.log(contract);
};
