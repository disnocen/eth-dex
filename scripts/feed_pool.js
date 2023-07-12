const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  const [deployer] = await ethers.getSigners();
  const yellowTokenAddress = fs.readFileSync(
    "./my-app/src/utils/YTK_address.txt",
    "utf-8"
  );
  const redTokenAddress = fs.readFileSync(
    "./my-app/src/utils/RTK_address.txt",
    "utf-8"
  );

  const poolAddress = fs.readFileSync(
    "./my-app/src/utils/Pool_address.txt",
    "utf-8"
  );

  // read the YellowToken abi from the my-app/src/utils/YellowToken.json file
  const YellowTokenJson = fs.readFileSync(
    "./my-app/src/utils/YellowToken.json"
  );

  const YellowToken = JSON.parse(YellowTokenJson);
  const BlueTokenJson = fs.readFileSync("./my-app/src/utils/BlueToken.json");
  const BlueToken = JSON.parse(YellowTokenJson);
  const RedTokenJson = fs.readFileSync("./my-app/src/utils/RedToken.json");
  const RedToken = JSON.parse(YellowTokenJson);

  // transfer 100 YTK from the  deployer to the pool contract
  const yellowToken = new ethers.Contract(
    yellowTokenAddress,
    YellowToken.abi,
    deployer
  );
  const redToken = new ethers.Contract(redTokenAddress, RedToken.abi, deployer);

  const yellowBalance = await yellowToken.balanceOf(deployer.address);
  const redBalance = await redToken.balanceOf(deployer.address);
  console.log("yellowBalance: ", yellowBalance.toString());
  console.log("redBalance: ", redBalance.toString());
  const amtYTK = ethers.utils.parseEther("100");
  const amtRTK = ethers.utils.parseEther("80");
  await yellowToken.transfer(poolAddress, amtYTK);
  await redToken.transfer(poolAddress, amtRTK);
  const yellowBalanceAfter = await yellowToken.balanceOf(deployer.address);
  const redBalanceAfter = await redToken.balanceOf(deployer.address);
  console.log("yellowBalanceAfter: ", yellowBalanceAfter.toString());
  console.log("redBalanceAfter: ", redBalanceAfter.toString());
  const yellowBalancePool = await yellowToken.balanceOf(poolAddress);
  const redBalancePool = await redToken.balanceOf(poolAddress);
  console.log("yellowBalancePool: ", yellowBalancePool.toString());
  console.log("redBalancePool: ", redBalancePool.toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
