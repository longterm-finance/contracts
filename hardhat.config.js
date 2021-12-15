require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("hardhat-deploy");
require("@nomiclabs/hardhat-etherscan");
require("solidity-coverage");
require("hardhat-tracer");
require("dotenv").config();

const mnemonic = process.env.DEPLOYER_MNEMONIC;
const ganacheMnemonic = process.env.GANACHE_MNEMONIC;

const config = {
  namedAccounts: {
    deployer: {
      default: 0, // This will by default take the first account as deployer
    },
  },
  solidity: {
    version: "0.7.5",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      forking: {
        url: process.env.RPC_URL,
      },
    },
    ganache: {
      url: "http://127.0.0.1:8545",
      accounts: { mnemonic: ganacheMnemonic },
    },
    matic: {
      url: process.env.RPC_URL,
      accounts: { mnemonic: mnemonic },
    },
  },
};

module.exports = config;
