module.exports = {
  client: require("ganache-cli"),
  providerOptions: {
    mnemonic: "1 2 3 4 5 6 7 8 9 10 11 12",
    default_balance_eth: 100000000,
    gas: 800000000,
  },
  skipFiles: ["/oracles/ChainlinkOracle.sol", "/mocks/"],
};
