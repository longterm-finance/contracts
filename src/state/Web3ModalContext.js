import React from "react";
import Web3Modal from "web3modal";

let network = "avalanche";

switch (process.env.REACT_APP_NETWORK_ID) {
  case "43114":
    network = "avalanche";
    break;
  case "43113":
    network = "fuji";
    break;
  default:
    break;
}

const providerOptions = {
  injected: {
    display: {
      logo: "",
      name: "MetaMask",
      description: "Connect with the MetaMask wallet in your browser",
    },
    package: null,
    options: {
      rpc: {
        43114: "https://api.avax.network/ext/bc/C/rpc", // mainnet
        43113: "https://api.avax-test.network/ext/bc/C/rpc", // testnet
      },
      network: "avalanche",
    },
  },
};

const web3Modal = new Web3Modal({
  network,
  cacheProvider: true, // optional
  providerOptions, // required
  theme: {
    background: "#1d1d3c",
    main: "white",
    secondary: "#f5f5f5",
    border: "#e440f2",
    hover: "rgba(241, 36, 255, 0.0)",
  },
});

export const Web3ModalContext = React.createContext(web3Modal);
