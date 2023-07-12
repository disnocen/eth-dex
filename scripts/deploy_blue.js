const { ethers } = require("hardhat");
const fs = require("fs");
async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying contracts with the account: ${deployer.address}`);

  const BlueToken = await ethers.getContractFactory("BlueToken");
  const blueToken = await BlueToken.deploy("1000000000000000000000000000");

  await blueToken.deployed();

  console.log(`BlueToken deployed at address: ${blueToken.address}`);
  fs.writeFileSync("./my-app/src/utils/BTK_address.txt", blueToken.address);

  // copy the contract abi to the my-app/src/utils folder
  fs.copyFileSync(
    "./artifacts/contracts/BlueToken.sol/BlueToken.json",
    "./my-app/src/utils/BlueToken.json"
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
