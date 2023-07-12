import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import YellowToken from "../utils/YellowToken.json";
import BlueToken from "../utils/BlueToken.json";
import RedToken from "../utils/RedToken.json";
import PoolContract from "../utils/Pool.json";
import fs from "fs";

const { Wallet } = ethers;

export async function getStaticProps() {
  const yellowTokenAddress = fs.readFileSync(
    "./src/utils/YTK_address.txt",
    "utf-8"
  );
  const blueTokenAddress = fs.readFileSync(
    "./src/utils/BTK_address.txt",
    "utf-8"
  );
  const redTokenAddress = fs.readFileSync(
    "./src/utils/RTK_address.txt",
    "utf-8"
  );

  const poolAddress = fs.readFileSync("./src/utils/Pool_address.txt", "utf-8");

  return {
    props: {
      yellowTokenAddress,
      blueTokenAddress,
      redTokenAddress,
      poolAddress,
    },
  };
}

function Pool({
  poolAddress,
  yellowTokenAddress,
  blueTokenAddress,
  redTokenAddress,
}) {
  const [address, setAddress] = useState("");
  const [currentAddress, setCurrentAddress] = useState("");
  const [yellowBalance, setYellowBalance] = useState("");
  const [yellowAllowance, setYellowAllowance] = useState("");
  const [blueBalance, setBlueBalance] = useState("");
  const [redBalance, setRedBalance] = useState("");
  const [tokenFrom, setTokenFrom] = useState("");
  const [tokenTo, setTokenTo] = useState("");
  const [amountFrom, setAmountFrom] = useState("");
  const [yellowRedPool, setYellowRedPool] = useState("");
  const [yellowBluePool, setYellowBluePool] = useState("");
  const [blueRedPool, setBlueRedPool] = useState("");

  const [redTokenApproved, setRedTokenApproved] = useState(false);
  const [blueTokenApproved, setBlueTokenApproved] = useState(false);
  const [yellowTokenApproved, setYellowTokenApproved] = useState(false);
  const [deployerSigner, setDeployerSigner] = useState(null);

  const [tokens, setTokens] = useState("");
  const [web3, setWeb3] = useState(null);
  const deployerAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

  const deployerPrivateKey =
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
  const connectWeb3 = async () => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });
      setWeb3(provider);
      // return the  connected address
      setCurrentAddress(window.ethereum.selectedAddress);
    }
    setTokenFrom("yellow");
    setTokenTo("red");
    setYellowRedPool(poolAddress);
    setYellowBluePool("0");
    setBlueRedPool("0");
    setDeployerSigner(new ethers.Wallet(deployerPrivateKey, web3));
  };

  const trackAddressChange = async () => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", function (accounts) {
        setCurrentAddress(window.ethereum.selectedAddress);
      });
    }
  };

  useEffect(() => {
    const getBalance = async () => {
      if (web3) {
        const yellowContract = new ethers.Contract(
          yellowTokenAddress,
          YellowToken.abi,
          web3.getSigner()
        );
        const blueContract = new ethers.Contract(
          blueTokenAddress,
          BlueToken.abi,
          web3.getSigner()
        );
        const redContract = new ethers.Contract(
          redTokenAddress,
          RedToken.abi,
          web3.getSigner()
        );
        const yellowBalance = await yellowContract.balanceOf(currentAddress);
        const blueBalance = await blueContract.balanceOf(currentAddress);
        const redBalance = await redContract.balanceOf(currentAddress);
        const yellowBalanceInTokens = ethers.utils.formatEther(yellowBalance);
        const blueBalanceInTokens = ethers.utils.formatEther(blueBalance);
        const redBalanceInTokens = ethers.utils.formatEther(redBalance);
        setYellowBalance(yellowBalanceInTokens.toString());
        setBlueBalance(blueBalanceInTokens.toString());
        setRedBalance(redBalanceInTokens.toString());
      }
    };
    getBalance();
  }, [web3, currentAddress]);

  const requestBlueApproval = async () => {
    // Check if the web3 provider is connected
    if (!web3) {
      window.alert("Please connect a web3 provider first!");
      return;
    }

    // Instantiate the BlueToken contract
    const networkId = (await web3.getNetwork()).chainId;

    const blueTokenContract = new ethers.Contract(
      blueTokenAddress,
      BlueToken.abi,
      web3.getSigner()
    );
    // ask the faucet to approve the user's address
    const response = await blueTokenContract.approve(
      deployerAddress,
      ethers.utils.parseEther("1000"),
      { gasLimit: 100000 }
    );

    // Update the UI
    setTokens(ethers.utils.parseEther("1000").toString());
    window.alert("Approval sent! Transaction hash: " + response.hash);
    setBlueTokenApproved(true);
  };

  const requestRedApproval = async () => {
    // Check if the web3 provider is connected
    if (!web3) {
      window.alert("Please connect a web3 provider first!");
      return;
    }

    // Instantiate the RedToken contract
    const networkId = (await web3.getNetwork()).chainId;

    const redTokenContract = new ethers.Contract(
      redTokenAddress,
      RedToken.abi,
      web3.getSigner()
    );
    // ask the faucet to approve the user's address
    const response = await redTokenContract.approve(
      deployerAddress,
      ethers.utils.parseEther("1000"),
      { gasLimit: 100000 }
    );

    // Update the UI
    setTokens(ethers.utils.parseEther("1000").toString());
    window.alert("Approval sent! Transaction hash: " + response.hash);
    setRedTokenApproved(true);
  };
  const requestYellowApproval = async () => {
    // Check if the web3 provider is connected
    if (!web3) {
      window.alert("Please connect a web3 provider first!");
      return;
    }

    // Instantiate the YellowToken contract
    const networkId = (await web3.getNetwork()).chainId;

    const yellowTokenContract = new ethers.Contract(
      yellowTokenAddress,
      YellowToken.abi,
      web3.getSigner()
    );

    // ask the faucet to approve the user's address
    const response = await yellowTokenContract.approve(
      poolAddress,
      ethers.utils.parseEther(ethers.utils.parseEther("1000").toString()),
      { gasLimit: 100000 }
    );

    // Update the UI
    setTokens(ethers.utils.parseEther("1000").toString());
    window.alert("Approval sent! Transaction hash: " + response.hash);
    setYellowTokenApproved(true);
    const allowance = await yellowTokenContract.allowance(
      poolAddress,
      currentAddress
    );
    setYellowAllowance(
      ethers.utils.parseEther(allowance.toString()).toString()
    );
  };

  const transferTokensYtoR = (amt) => async () => {
    // Check if the web3 provider is connected
    if (!web3) {
      window.alert("Please connect a web3 provider first!");
      return;
    }

    // Instantiate the Pool contract
    const networkId = (await web3.getNetwork()).chainId;

    const poolContract = new ethers.Contract(
      poolAddress,
      PoolContract.abi,
      web3.getSigner()
    );

    // instantiate the YellowToken contract
    const yellowTokenContract = new ethers.Contract(
      yellowTokenAddress,
      YellowToken.abi,
      web3.getSigner()
    );

    // instantiate the RedToken contract
    const redTokenContract = new ethers.Contract(
      redTokenAddress,
      RedToken.abi,
      web3.getSigner()
    );

    // ask the pool to transfer tokens
    console.log("amt:", amt);

    // console log address fo web3 signer
    console.log("deployerSigner:", web3.getSigner().getAddress());
    let swapAmount = ethers.utils.parseEther(amt);
    const tx6 = await poolContract.swapAtoB(amt, {
      gasLimit: 100000,
    });
    // const response = await poolContract.transferTokensYtoR(
    //   yellowTokenAddress,
    //   redTokenAddress,
  };

  return (
    <div className="container">
      <style>
        {`
            body {
                background-color: #15202b;
            }
        `}
      </style>
      <div className="row">
        <h1>Pool</h1>
        <div className="col-sm-12">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Yellow Token</h5>
              <p className="card-text">YTK Address: {yellowTokenAddress}</p>
              {/* get balance of YTK */}
              <p className="card-text">YTK Balance: {yellowBalance}</p>
              <p className="card-text">YTK Allowance: {yellowAllowance}</p>
              <br />
              <h5 className="card-title">Blue Token</h5>
              <p className="card-text">BTK Address: {blueTokenAddress}</p>
              {/* get balance of BTK */}
              <p className="card-text">BTK Balance: {blueBalance}</p>
              <br />
              <h5 className="card-title">Red Token</h5>
              <p className="card-text">RTK Address: {redTokenAddress}</p>
              {/* get balance of RTK */}
              <p className="card-text">RTK Balance: {redBalance}</p>
              <br />
              <h5 className="card-title">current Address</h5>
              <p className="card-text">
                current Address: {web3 && currentAddress}
              </p>

              {(!yellowTokenApproved ||
                !blueTokenApproved ||
                !redTokenApproved) && <h2>Request Approval</h2>}
              {!yellowTokenApproved && (
                <button
                  className="btn btn-primary"
                  onClick={requestYellowApproval}
                >
                  Request Yellow Approval
                </button>
              )}
              {!blueTokenApproved && (
                <button
                  className="btn btn-primary"
                  onClick={requestBlueApproval}
                >
                  Request Blue Approval
                </button>
              )}
              {!redTokenApproved && (
                <button
                  className="btn btn-primary"
                  onClick={requestRedApproval}
                >
                  Request Red Approval
                </button>
              )}
              {/* show the connect web3 button only if the web3 provider is not connected */}
              {!web3 && <button onClick={connectWeb3}>Connect Web3</button>}

              {/*<button className="btn btn-primary" onClick={requestTokens}>
                Request Tokens
              </button> */}

              <h2>Transfer token</h2>
              {/* add a selector of Yellowtoken, RedToken and Bluetoken */}

              <div className="form-group">
                <label htmlFor="token">Select Token</label>
                <select
                  className="form-control"
                  value={tokenFrom}
                  onChange={(event) => setTokenFrom(event.target.value)}
                >
                  <option value="yellow">Yellow Token</option>
                  <option value="blue">Blue Token</option>
                  <option value="red">Red Token</option>
                </select>
              </div>
              {/* print selected value */}
              <p className="card-text">Token selected: {tokenFrom}</p>
              {/* add a field for the amount */}

              <div className="form-group">
                <label htmlFor="amount">Amount</label>
                <input
                  type="text"
                  className="form-control"
                  id="amount"
                  value={amountFrom}
                  onChange={(e) => setAmountFrom(e.target.value)}
                />
              </div>

              {/* add another selector for the token to receive. remove the chosen option from the previous selector. */}
              <div className="form-group">
                <label htmlFor="token">Select Token to receive</label>
                <select
                  className="form-control"
                  id="tokenTo"
                  onChange={(e) => setTokenTo(e.target.value)}
                >
                  <option value="red">Red Token</option>
                  <option value="yellow">Yellow Token</option>
                  <option value="blue">Blue Token</option>
                </select>
              </div>

              {/* if tokenFrom is YellowToken and tokenTo is RedToken, or viceversa, then good. Otherwise make an alert that there is no pool */}
              {tokenFrom === "yellow" && tokenTo === "red" && (
                <p className="card-text">Pool: {yellowRedPool}</p>
              )}
              {tokenFrom === "red" && tokenTo === "yellow" && (
                <p className="card-text">Pool: {yellowRedPool}</p>
              )}
              {tokenFrom === "yellow" && tokenTo === "blue" && (
                <p className="card-text">Pool: {yellowBluePool}</p>
              )}
              {tokenFrom === "blue" && tokenTo === "yellow" && (
                <p className="card-text">Pool: {yellowBluePool}</p>
              )}
              {tokenFrom === "blue" && tokenTo === "red" && (
                <p className="card-text">Pool: {blueRedPool}</p>
              )}
              {tokenFrom === "red" && tokenTo === "blue" && (
                <p className="card-text">Pool: {blueRedPool}</p>
              )}

              <p className="card-text">
                Pool: {tokenFrom} - {tokenTo}
              </p>
              <p className="card-text">Amount: {amountFrom}</p>
              {/* <div className="form-group">
                <label htmlFor="recipient">Recipient Address</label>
                <input
                  type="text"
                  className="form-control"
                  id="recipient"
                  onChange={(e) => setRecipient(e.target.value)}
                />
              </div> */}

              {/* show the transfer tokens button only if the web3 provider is connected */}

              {web3 && (
                <button
                  className="btn btn-primary"
                  onClick={transferTokensYtoR(amountFrom)}
                >
                  Transfer Tokens
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pool;
