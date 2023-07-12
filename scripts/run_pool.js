const { ethers } = require("hardhat");
const fs = require("fs");
async function main() {
  const [deployer, randomPerson1, randomPerson2] = await ethers.getSigners();

  // yellow token creation

  const YellowToken = await ethers.getContractFactory("YellowToken");

  const yellowToken = await YellowToken.deploy("1000000000000000000000000000");
  await yellowToken.deployed();

  console.log(`YellowToken deployed at address: ${yellowToken.address}`);

  // blue token creation
  const BlueToken = await ethers.getContractFactory("BlueToken");

  const blueToken = await BlueToken.deploy("1000000000000000000000000000");
  await blueToken.deployed();

  console.log(`BlueToken deployed at address: ${blueToken.address}`);

  // red token creation
  const RedToken = await ethers.getContractFactory("RedToken");

  const redToken = await RedToken.deploy("1000000000000000000000000000");
  await redToken.deployed();

  console.log(`RedToken deployed at address: ${redToken.address}`);

  // pool contract creation

  const TokenExchange = await ethers.getContractFactory("TokenExchange");
  const tokenExchange = await TokenExchange.deploy(
    yellowToken.address,
    redToken.address,
    1
  );

  await tokenExchange.deployed();

  console.log(`tokenExchange deployed at address: ${tokenExchange.address}`);

  // Get a random Ethereum address
  const randomAddress1 = randomPerson1.address;
  const randomAddress2 = randomPerson2.address;

  // print the random addresses and the deployer address
  console.log(`Deployer address: ${deployer.address}`);
  console.log(`Random address 1: ${randomAddress1}`);
  console.log(`Random address 2: ${randomAddress2}`);

  // Send 10,000 YTK to the random address
  const tx = await yellowToken.transfer(
    randomAddress1,
    ethers.utils.parseEther("10000")
  );

  console.log(`Sent 10,000 YTK to address ${randomAddress1}`);
  console.log(`Transaction hash: ${tx.hash}`);

  // print that we are going to transfer 5000 YTK from the randomAddress to the randomAddress2
  console.log(
    `Sending 5,000 YTK from address ${randomAddress1} to address ${randomAddress2}`
  );
  // transfer 5000 YTK from the randomAddress to the randomAddress2
  const tx2 = await yellowToken
    .connect(
      randomPerson1
    ) /* connect the randomPerson1 to the contract; note that we are using the randomPerson1 instead of the randomAddress1 */
    .transfer(
      randomAddress2,
      ethers.utils.parseEther("5000")
    ); /* transfer 5000 YTK from the randomAddress to the randomAddress2 */
  console.log(`Sent 5,000 YTK to address ${randomAddress2}`);
  console.log(`Transaction hash: ${tx2.hash}`);

  // get balance of randomAddress1
  const YTKBalanceOfRandomAddress1 = await yellowToken.balanceOf(
    randomAddress1
  );
  console.log(
    `Balance of randomAddress1: ${ethers.utils.formatEther(
      YTKBalanceOfRandomAddress1
    )}`
  );

  // deployer sends 1000 YTK to the tokenExchange contract
  const tx4 = await yellowToken.transfer(
    tokenExchange.address,
    ethers.utils.parseEther("1000")
  );
  console.log(`Sent 1,000 YTK from deployer to tokenExchange`);

  // deployer sends 300 RTK to the tokenExchange contract
  const tx5 = await redToken.transfer(
    tokenExchange.address,
    ethers.utils.parseEther("200")
  );
  console.log(`Sent 300 RTK from deployer to tokenExchange`);

  // approve the tokenExchange contract to spend 5000 YTK from the randomAddress1
  const tx3 = await yellowToken
    .connect(randomPerson1)
    .approve(tokenExchange.address, ethers.utils.parseEther("5000"));
  console.log(
    `Approved tokenExchange to spend 5,000 YTK on behalf of randomAddress1`
  );

  // get the YTK balance of the tokenExchange contract
  const YTKBalanceOfTokenExchange = await yellowToken.balanceOf(
    tokenExchange.address
  );
  console.log(
    `Balance of YTK tokenExchange: ${ethers.utils.formatEther(
      YTKBalanceOfTokenExchange
    )}`
  );

  // get the RTK balance of the tokenExchange contract
  const RTKBalanceOfTokenExchange = await redToken.balanceOf(
    tokenExchange.address
  );
  console.log(
    `Balance of RTK tokenExchange: ${ethers.utils.formatEther(
      RTKBalanceOfTokenExchange
    )}`
  );
  // get the YTK balance of the randomAddress1
  const YTKBalanceOfRandomAddress1Before = await yellowToken.balanceOf(
    randomAddress1
  );
  console.log(
    `Balance of randomAddress1: ${ethers.utils.formatEther(
      YTKBalanceOfRandomAddress1Before
    )}`
  );

  // get the RTK balance of the randomAddress1
  const RTKBalanceOfRandomAddress1Before = await redToken.balanceOf(
    randomAddress1
  );
  console.log(
    `Balance of randomAddress1: ${ethers.utils.formatEther(
      RTKBalanceOfRandomAddress1Before
    )}`
  );

  // make randomAddress1 swap 1000 YTK for 200 RTK
  const swapAmount = ethers.utils.parseEther(".5");
  const tx6 = await tokenExchange.connect(randomPerson1).swapAtoB(swapAmount);
  console.log(`Swapped ${swapAmount}  YTK for RTK`);

  // get balance of tokenExchange for YTK
  const YTKBalanceOfTokenExchangeAfter = await yellowToken.balanceOf(
    tokenExchange.address
  );
  console.log(
    `Balance of YTK tokenExchange: ${ethers.utils.formatEther(
      YTKBalanceOfTokenExchangeAfter
    )}`
  );
  // get balance of tokenExchange for RTK
  const RTKBalanceOfTokenExchangeAfter = await redToken.balanceOf(
    tokenExchange.address
  );
  console.log(
    `Balance of RTK tokenExchange: ${ethers.utils.formatEther(
      RTKBalanceOfTokenExchangeAfter
    )}`
  );

  // get balance of randomAddress1 for YTK
  const YTKBalanceOfRandomAddress1After = await yellowToken.balanceOf(
    randomAddress1
  );
  console.log(
    `Balance of randomAddress1: ${ethers.utils.formatEther(
      YTKBalanceOfRandomAddress1After
    )}`
  );
  // get balance of randomAddress1 for RTK

  const RTKBalanceOfRandomAddress1After = await redToken.balanceOf(
    randomAddress1
  );
  console.log(
    `Balance of randomAddress1: ${ethers.utils.formatEther(
      RTKBalanceOfRandomAddress1After
    )}`
  );

  // swap again with the same randomAddress1 and the same amount
  const tx7 = await tokenExchange.connect(randomPerson1).swapAtoB(swapAmount);
  console.log(`Swapped ${swapAmount}  YTK for RTK`);
  // get balance of randomAddress1 for YTK
  const YTKBalanceOfRandomAddress1After2 = await yellowToken.balanceOf(
    randomAddress1
  );
  console.log(
    `Balance of randomAddress1: ${ethers.utils.formatEther(
      YTKBalanceOfRandomAddress1After2
    )}`
  );
  // get balance of randomAddress1 for RTK
  const RTKBalanceOfRandomAddress1After2 = await redToken.balanceOf(
    randomAddress1
  );
  console.log(
    `Balance of randomAddress1: ${ethers.utils.formatEther(
      RTKBalanceOfRandomAddress1After2
    )}`
  );

  // get balance of tokenExchange for YTK
  const YTKBalanceOfTokenExchangeAfter2 = await yellowToken.balanceOf(
    tokenExchange.address
  );
  console.log(
    `Balance of YTK tokenExchange: ${ethers.utils.formatEther(
      YTKBalanceOfTokenExchangeAfter2
    )}`
  );
  // get balance of tokenExchange for RTK
  const RTKBalanceOfTokenExchangeAfter2 = await redToken.balanceOf(
    tokenExchange.address
  );
  console.log(
    `Balance of RTK tokenExchange: ${ethers.utils.formatEther(
      RTKBalanceOfTokenExchangeAfter2
    )}`
  );



}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
