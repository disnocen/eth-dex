const { ethers } = require("hardhat");

async function main() {
  const [deployer, randomPerson1, randomPerson2] = await ethers.getSigners();

  // Deploy the RedToken contract
  const RedToken = await ethers.getContractFactory("RedToken");
  const redToken = await RedToken.deploy("1000000000000000000000000000");

  await redToken.deployed();

  console.log(`RedToken deployed at address: ${redToken.address}`);

  // Get a random Ethereum address
  const randomAddress1 = randomPerson1.address;
  const randomAddress2 = randomPerson2.address;

  // print the random addresses and the deployer address
  console.log(`Deployer address: ${deployer.address}`);
  console.log(`Random address 1: ${randomAddress1}`);
  console.log(`Random address 2: ${randomAddress2}`);

  // Send 10,000 RTK to the random address
  const tx = await redToken.transfer(
    randomAddress1,
    ethers.utils.parseEther("10000")
  );

  console.log(`Sent 10,000 RTK to address ${randomAddress1}`);
  console.log(`Transaction hash: ${tx.hash}`);

  // print that we are going to transfer 5000 RTK from the randomAddress to the randomAddress2
  console.log(
    `Sending 5,000 RTK from address ${randomAddress1} to address ${randomAddress2}`
  );
  // transfer 5000 RTK from the randomAddress to the randomAddress2
  const tx2 = await redToken
    .connect(
      randomPerson1
    ) /* connect the randomPerson1 to the contract; note that we are using the randomPerson1 instead of the randomAddress1 */
    .transfer(
      randomAddress2,
      ethers.utils.parseEther("5000")
    ); /* transfer 5000 RTK from the randomAddress to the randomAddress2 */
  console.log(`Sent 5,000 RTK to address ${randomAddress2}`);
  console.log(`Transaction hash: ${tx2.hash}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
