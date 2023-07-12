const { ethers } = require("hardhat");

async function main() {
  const [deployer, randomPerson1, randomPerson2] = await ethers.getSigners();

  // Deploy the BlueToken contract
  const BlueToken = await ethers.getContractFactory("BlueToken");
  const blueToken = await BlueToken.deploy("1000000000000000000000000000");

  await blueToken.deployed();

  console.log(`BlueToken deployed at address: ${blueToken.address}`);

  // Get a random Ethereum address
  const randomAddress1 = randomPerson1.address;
  const randomAddress2 = randomPerson2.address;

  // print the random addresses and the deployer address
  console.log(`Deployer address: ${deployer.address}`);
  console.log(`Random address 1: ${randomAddress1}`);
  console.log(`Random address 2: ${randomAddress2}`);

  // Send 10,000 BTK to the random address
  const tx = await blueToken.transfer(
    randomAddress1,
    ethers.utils.parseEther("10000")
  );

  console.log(`Sent 10,000 BTK to address ${randomAddress1}`);
  console.log(`Transaction hash: ${tx.hash}`);

  // print that we are going to transfer 5000 BTK from the randomAddress to the randomAddress2
  console.log(
    `Sending 5,000 BTK from address ${randomAddress1} to address ${randomAddress2}`
  );
  // transfer 5000 BTK from the randomAddress to the randomAddress2
  const tx2 = await blueToken
    .connect(
      randomPerson1
    ) /* connect the randomPerson1 to the contract; note that we are using the randomPerson1 instead of the randomAddress1 */
    .transfer(
      randomAddress2,
      ethers.utils.parseEther("5000")
    ); /* transfer 5000 BTK from the randomAddress to the randomAddress2 */
  console.log(`Sent 5,000 BTK to address ${randomAddress2}`);
  console.log(`Transaction hash: ${tx2.hash}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
