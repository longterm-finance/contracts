/**
 * @type import('hardhat/config').HardhatUserConfig
 */

require('@nomiclabs/hardhat-waffle')
require('@nomiclabs/hardhat-ethers')
require('hardhat-deploy')
require('@nomiclabs/hardhat-etherscan')
require('solidity-coverage')
// require('hardhat-gas-reporter')
require('hardhat-tracer')
require('dotenv').config()

const mnemonic = process.env.DEPLOYER_MNEMONIC
const ganacheMnemonic = process.env.GANACHE_MNEMONIC

const config = {
  namedAccounts: {
    deployer: {
      default: 0, // this will by default take the first account as deployer
    },
  },
  solidity: {
    version: '0.7.5',
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
        url: process.env.AVAX_MAINNET_API_URL,
      },
    },
    ganache: {
      url: 'http://127.0.0.1:8545',
      accounts: { mnemonic: ganacheMnemonic },
    },
    mainnet: {
      url: process.env.AVAX_MAINNET_API_URL,
      accounts: { mnemonic: mnemonic },
    },
    testnet: {
      url: process.env.AVAX_TESTNET_API_URL,
      accounts: { mnemonic: mnemonic },
    },
  },
  //  etherscan: {
  //    apiKey: process.env.ETHERSCAN_API_KEY
  //  },
  //  gasReporter: {
  //    enabled: process.env.REPORT_GAS === "true" ? true : false,
  //    currency: "USD",
  //    gasPrice: 152,
  //    coinmarketcap: process.env.COIN_API
  //  },
}

module.exports = config
