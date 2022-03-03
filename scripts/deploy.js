// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const OWNER_ADDR = "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266";
const BigNumber = require('bignumber.js');
const TOTAL_SUPPLY = new BigNumber(10).pow(18).multiplu(525).toString(10);

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const StakingToken = await hre.ethers.getContractFactory("StakingToken");
  const stakingToken = await StakingToken.deploy(OWNER_ADDR, TOTAL_SUPPLY);

  await stakingToken.deployed();

  console.log("StakingToken deployed to:", stakingToken.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
