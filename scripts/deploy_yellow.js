const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying contracts with the account: ${deployer.address}`);

  // deploy the YellowToken contract with 1 eth as the initial supply
  const YellowToken = await ethers.getContractFactory("YellowToken");
  const yellowToken = await YellowToken.deploy("1000000000000000000000000000");

  await yellowToken.deployed();

  console.log(`YellowToken deployed at address: ${yellowToken.address}`);
  // write contract address to file YTK_address.txt
  fs.writeFileSync("./my-app/src/utils/YTK_address.txt", yellowToken.address);

  // copy the contract abi to the my-app/src/utils folder
  fs.copyFileSync(
    "./artifacts/contracts/YellowToken.sol/YellowToken.json",
    "./my-app/src/utils/YellowToken.json"
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
