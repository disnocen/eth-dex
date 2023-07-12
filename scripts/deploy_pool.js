const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying contracts with the account: ${deployer.address}`);

  // read YTK address from file YTK_address.txt
  const YellowTokenAddress = fs.readFileSync(
    "./my-app/src/utils/YTK_address.txt",
    "utf-8"
  );

  // read RTK address from file RTK_address.txt
  const RedTokenAddress = fs.readFileSync(
    "./my-app/src/utils/RTK_address.txt",
    "utf-8"
  );

  // deploy the YellowToken contract with 1 eth as the initial supply
  const TokenExchange = await ethers.getContractFactory("TokenExchange");
  const tokenExchange = await TokenExchange.deploy(
    YellowTokenAddress,
    RedTokenAddress,
    1
  );

  await tokenExchange.deployed();

  console.log(`tokenExchange deployed at address: ${tokenExchange.address}`);
  // write contract address to file Pool_address.txt
  fs.writeFileSync(
    "./my-app/src/utils/Pool_address.txt",
    tokenExchange.address
  );

  // copy the contract abi to the my-app/src/utils folder
  fs.copyFileSync(
    "./artifacts/contracts/Pool.sol/TokenExchange.json",
    "./my-app/src/utils/Pool.json"
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
