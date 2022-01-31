// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  const NAME_OF_TOKEN = 'Solaris 2022';
  const SYMBOL_OF_TOKEN = 'SOL22';
  const NUMBER_OF_BOTTLES_TO_AUCTION = 20;
  const AUCTION_DURATION_IN_DAYS = 5

  // We get the contract to deploy
  const contractFactory = await ethers.getContractFactory("Ibo");
  const contract = await contractFactory.deploy(NAME_OF_TOKEN, SYMBOL_OF_TOKEN, NUMBER_OF_BOTTLES_TO_AUCTION, AUCTION_DURATION_IN_DAYS);

  await contract.deployed();

  console.log("Greeter deployed to:", contract.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
