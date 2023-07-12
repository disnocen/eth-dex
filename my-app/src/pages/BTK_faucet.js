import { ethers } from "ethers";
import React, { useState } from "react";
import BlueToken from "../utils/BlueToken.json";
import fs from "fs";

const { Wallet } = ethers;
export async function getStaticProps() {
  const tokenAddress = fs.readFileSync("./src/utils/BTK_address.txt", "utf-8");
  return {
    props: {
      tokenAddress,
    },
  };
}
function Faucet({ tokenAddress }) {
  const [address, setAddress] = useState("");
  const [tokens, setTokens] = useState("");
  const [web3, setWeb3] = useState(null);
  const deployerAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

  const BTKAmount = 10;
  // Connect to the injected web3 provider
  const connectWeb3 = async () => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });
      setWeb3(provider);
    }
  };

  // Request Approval from the faucet
  const requestApproval = async () => {
    // Check if the web3 provider is connected
    if (!web3) {
      window.alert("Please connect a web3 provider first!");
      return;
    }

    // Instantiate the BlueToken contract
    const networkId = (await web3.getNetwork()).chainId;

    const tokenContract = new ethers.Contract(
      tokenAddress,
      BlueToken.abi,
      web3.getSigner()
    );

    // ask the faucet to approve the user's address
    const response = await tokenContract.approve(
      address,
      ethers.utils.parseEther(BTKAmount.toString()),
      { gasLimit: 100000 }
    );

    // Update the UI
    setTokens(BTKAmount.toString());
    window.alert("Approval sent! Transaction hash: " + response.hash);
  };

  // Request tokens from the faucet
  const requestTokens = async () => {
    // Check if the web3 provider is connected
    if (!web3) {
      window.alert("Please connect a web3 provider first!");
      return;
    }

    // Instantiate the BlueToken contract
    const networkId = (await web3.getNetwork()).chainId;
    const tokenContract = new ethers.Contract(
      tokenAddress,
      BlueToken.abi,
      web3.getSigner()
    );

    const privKey =
      "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
    // create wallet fromt the private key
    const wallet = new Wallet(privKey, web3);

    // print the public key of the wallet
    console.log("wallet address", wallet.address);
    // const provider = new ethers.providers.JsonRpcProvider();
    // const contract = new ethers.Contract(
    //   tokenAddress,
    //   BlueToken.abi,
    //   provider
    // );
    // approve the faucet to transfer tokens from  deployer to the user's address
    const approval = await tokenContract.connect(wallet).approve(
      address,
      ethers.utils.parseEther(BTKAmount.toString()), // 0.1 BTK
      { gasLimit: 100000 }
    );

    console.log("approval", approval);

    // Transfer 0x90F79bf6EB2c4f870365E785982E1f101E93b906 BTK to the user's address
    const response = await tokenContract.transferFrom(
      deployerAddress,
      address,
      ethers.utils.parseEther(BTKAmount.toString()),
      { gasLimit: 100000 }
    );

    // Update the UI
    setTokens(BTKAmount.toString());
    window.alert("Tokens sent! Transaction hash: " + response.hash);
  };

  return (
    <div className="App">
      {/* make the backgroud light blue */}
      <style>
        {`
        body {
          background-color: lightblue;
        }
      `}
      </style>
      <h1>BTK Faucet</h1>
      <p>{"The token contract is: " + tokenAddress}</p>
      <label>
        Your Address:{" "}
        <input
          type="text"
          value={address}
          onChange={(event) => setAddress(event.target.value)}
        />
      </label>
      <br />

      <button onClick={requestApproval}>Request Approval</button>
      <br />
      <label>
        Tokens: <input type="text" value={BTKAmount} readOnly />
      </label>
      <br />
      {/* show the connect web3 button only if the web3 provider is not connected */}
      {!web3 && <button onClick={connectWeb3}>Connect Web3</button>}
      {/* <button onClick={connectWeb3}>Connect Web3</button> */}
      <button onClick={requestTokens}>Request Tokens</button>
    </div>
  );
}

export default Faucet;
