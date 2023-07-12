const { ethers } = require("hardhat");
const fs = require("fs");
async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying contracts with the account: ${deployer.address}`);

  const RedToken = await ethers.getContractFactory("RedToken");
  const redToken = await RedToken.deploy("1000000000000000000000000000");

  await redToken.deployed();

  console.log(`RedToken deployed at address: ${redToken.address}`);
  fs.writeFileSync("./my-app/src/utils/RTK_address.txt", redToken.address);

  // copy the contract abi to the my-app/src/utils folder
  fs.copyFileSync(
    "./artifacts/contracts/RedToken.sol/RedToken.json",
    "./my-app/src/utils/RedToken.json"
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
