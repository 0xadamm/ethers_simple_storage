import { ethers } from "ethers";
import * as fs from "fs-extra";
import "dotenv/config";

// RPC: http://127.0.0.1:7545

const main = async () => {
  // console.log(process.env.PRIVATE_KEY);
  // Connect to the RPC Probider to ethers
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);

  // Create signer | wallet  variable
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

  // Create a variable that is the encrypted JSON
  const encryptedJson = fs.readFileSync("./.encryptedKey.json", "utf-8");
  console.log(encryptedJson);

  // Create new encrypted wallet by passing in JSON encyrption
  let encryptedWallet = await ethers.Wallet.fromEncryptedJson(
    encryptedJson,
    process.env.PRIVATE_KEY_PASSWORD!
  );

  console.log(encryptedWallet);

  // Create abi | interface variable
  const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8");

  // Create a binary | bytecode variable
  const binary = fs.readFileSync(
    "./SimpleStorage_sol_SimpleStorage.bin",
    "utf8"
  );

  // Connect (interface, bytecode, signer)
  const contractFactory = new ethers.ContractFactory(
    abi,
    binary,
    encryptedWallet
  );
  console.log("Deploying, please wait....");
  // Deploys Contract
  const contract = await contractFactory.deploy();

  // Waits for contract to deploy then creates deployment response
  const deploymentReceipt = await contract.deployTransaction.wait(1);
  // console.log("Deployment Transaction...");
  // console.log(contract.deployTransaction); // Deployment Response
  // console.log("Transaction Receipt...");
  // console.log(deploymentReceipt); // Receipt is from next block

  // Get favorite number from contract
  const currentFavoriteNumber = await contract.retrieve();
  console.log(`Currnt favorite number: ${currentFavoriteNumber.toString()}`);

  // Call the store function on the contract and store a new favorite number
  const transctionResponse = await contract.store("8");

  const transctionReceipt = await transctionResponse.wait(1);

  // Get new favorite number from contract
  const updatedFavoriteNumber = await contract.retrieve();
  console.log(`Updated favorite number is: ${updatedFavoriteNumber}`);
};

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
