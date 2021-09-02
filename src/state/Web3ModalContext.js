import React from "react";
import Web3Modal from "web3modal";
// import Portis from "@portis/web3";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Authereum from "authereum";

let network = "mainnet";

switch (process.env.REACT_APP_NETWORK_ID) {
  case "43114":
    network = "mainnet";
    break;
  case "43113":
    network = "fuji";
    break;
  default:
    break;
}

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      infuraId: process.env.REACT_APP_PROVIDER, // required
    },
  },
  // portis: {
  //   package: Portis, // required
  //   options: {
  //     id: process.env.REACT_APP_PORTIS_ID, // required
  //   },
  // },
  authereum: {
    package: Authereum, // required
  },
  /* See Provider Options Section */
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
