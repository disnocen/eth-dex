# Basic DEX

The Basic Decentralized Exchange is a simple implementation of a decentralized exchange that demonstrates how users can exchange tokens in a trustless and decentralized manner. The exchange is built using Ethereum smart contracts and utilizes the Hardhat development environment.

The project includes a React app that provides a user-friendly interface for interacting with the exchange. Users can deposit and withdraw example tokens (yellow, blue, and red) using the provided faucets, and can then use these tokens to buy and sell on the exchange. The exchange uses a simple bonding curve algorithm to calculate the token prices based on the current supply and demand.

The codebase is designed to be modular and extensible, and can be easily adapted to support other tokens and trading algorithms.

This project may be seen as a starting point for anyone looking to learn more about decentralized exchanges and Ethereum smart contract development.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- You have installed [Node.js](https://nodejs.org/en/) version 12 or higher.
- You have installed [npm](https://www.npmjs.com/) version 6 or higher.
- You have installed [Hardhat](https://hardhat.org)aby running the following command:
  ```
  npm install hardhat
  ```

## Getting Started

To get started, follow these steps from the root directory of this repo:

1. Open three terminal windows.

2. In the first terminal, start the local blockchain node:

```
npx hardhat node
```

3. In the second terminal, run the demo or script file:

```
sh demo.sh
```

4. In the third terminal, navigate to the React app directory and run the development server:

```
cd my-app
npm run dev
```

5. Open your web browser and go to http://localhost:3000/ to view the app.

## How it Works

The DEX operates by pooling together liquidity from various traders who want to make trades using the tokens listed on the platform. Each token available on the DEX has its own unique pool, with a token-wrapped Ether (wETH) pair.

For example, if a token called Token A is listed on the DEX, a Token A/wETH pool is created. Traders who want to trade Token A on the DEX can do so by exchanging it with wETH at the Token A/wETH pool.

Additionally, there is a YTK/RTK pool. If you want to exchange YTK (Yellow token) for RTK (Red token), you can do so directly through this pool.

However, if you want to exchange a token that doesn’t have a direct pool with RTK, you’ll need to use the intermediate wETH token. For example, if you want to exchange token BTK (Blue token) for RTK, you’ll need to exchange it for wETH first. This is done by using the BTK/wETH pool, then the RTK/wETH pool.

You only need to authorize the transfer of your BTK tokens once, however, as the deployer takes care of dealing with the pools.

Once you complete the exchange, you will receive your RTK tokens from the RTK/wETH pool.

## Contributing

To contribute to this project, follow these steps:

1. Fork this repository.
2. Create a branch: `git checkout -b feature/your-feature`
3. Make your changes and commit them: `git commit -m '<commit_message>'`
4. Push to the original branch: `git push origin feature/your-feature`
5. Create a pull request.

## License

This project uses the [MIT](https://opensource.org/licenses/MIT) license.
