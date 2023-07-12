import { ethers } from "ethers";
import React, { useState } from "react";
import YellowToken from "../utils/YellowToken.json";
import fs from "fs";

const { Wallet } = ethers;

export async function getStaticProps() {
  const tokenAddress = fs.readFileSync("./src/utils/YTK_address.txt", "utf-8");
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
  const [currentAddress, setCurrentAddress] = useState("");

  // let currentAddress = "";
  // read the token address from file YTK_address.txt
  // const tokenAddress = fs.readFileSync("YTK_address.txt").toString();
  // const tokenAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  const YTKAmount = 10;
  // Connect to the injected web3 provider
  const connectWeb3 = async () => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });
      setWeb3(provider);
      // return the  connected address
      // currentAddress = await provider.listAccounts();
    }
  };

  // on change of selected address change the address
  // const trackAddressChange = async () => {
  //   if (window.ethereum) {
  //     window.ethereum.on("accountsChanged", function (accounts) {
  //       setCurrentAddress(window.ethereum.selectedAddress);
  //     });
  //   }
  // };

  // Request Approval from the faucet
  const requestApproval = async () => {
    // Check if the web3 provider is connected
    if (!web3) {
      window.alert("Please connect a web3 provider first!");
      return;
    }

    // Instantiate the YellowToken contract
    const networkId = (await web3.getNetwork()).chainId;

    // const tokenAdgccdress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
    const tokenContract = new ethers.Contract(
      tokenAddress,
      YellowToken.abi,
      web3.getSigner()
    );

    // ask the faucet to approve the user's address
    const response = await tokenContract.approve(
      address,
      ethers.utils.parseEther(YTKAmount.toString()),
      { gasLimit: 100000 }
    );

    // Update the UI
    setTokens(YTKAmount.toString());
    window.alert("Approval sent! Transaction hash: " + response.hash);
  };

  // Request tokens from the faucet
  const requestTokens = async () => {
    // Check if the web3 provider is connected
    if (!web3) {
      window.alert("Please connect a web3 provider first!");
      return;
    }

    // Instantiate the YellowToken contract
    const networkId = (await web3.getNetwork()).chainId;
    // const tokenAddress = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";
    const tokenContract = new ethers.Contract(
      tokenAddress,
      YellowToken.abi,
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
    //   YellowToken.abi,
    //   provider
    // );
    // approve the faucet to transfer tokens from  deployer to the user's address
    const approval = await tokenContract.connect(wallet).approve(
      address,
      ethers.utils.parseEther(YTKAmount.toString()), // 0.1 YTK
      { gasLimit: 100000 }
    );

    console.log("approval", approval);

    // Transfer 0x90F79bf6EB2c4f870365E785982E1f101E93b906 YTK to the user's address
    const response = await tokenContract.transferFrom(
      deployerAddress,
      address,
      ethers.utils.parseEther(YTKAmount.toString()),
      { gasLimit: 100000 }
    );

    // Update the UI
    setTokens(YTKAmount.toString());
    window.alert("Tokens sent! Transaction hash: " + response.hash);
  };

  return (
    <div className="App">
      {/* make the backgroud with a yellow hue which goes well with twitter palette */}
      <style>
        {`
        body {
          background-color: #ffffe0;
        }
        p {
          color: #000000;
        }
      `}
      </style>
      <h1>YTK Faucet</h1>
      {/* add a paragraph with the value of the token contract */}
      <p>{"The token contract is: " + tokenAddress}</p>
      <label>
        <p>
          Your Address:
          <input
            type="text"
            value={currentAddress}
            onChange={(event) => setAddress(event.target.value)}
          />
        </p>
      </label>
      <br />

      <button onClick={requestApproval}>Request Approval</button>
      <br />
      <label>
        <p>
          Tokens: <input type="text" value={YTKAmount} readOnly />
        </p>
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
