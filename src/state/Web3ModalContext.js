import React from "react";
import Web3Modal from "web3modal";

let network = "avalanche";

switch (process.env.REACT_APP_NETWORK_ID) {
  case 43114:
    network = "avalanche";
    break;
  case 43113:
    network = "fuji";
    break;
  default:
    break;
}

const providerOptions = {
  injected: {
    display: {
      logo: "../assets/images/metamask.svg",
      name: "MetaMask",
      description: "Connect with the MetaMask wallet in your browser",
    },
    package: null, // true ??
    options: {
      rpc: {
        43114: process.env.REACT_APP_PROVIDER, // mainnet
      },
      network: "avalanche",
      chainId: 43114,
      // infuraId: "https://api.avax.network/ext/bc/C/rpc", ??
    },
  },
};

const web3Modal = new Web3Modal({
  network,
  cacheProvider: true, // optional
  providerOptions, // required
  disableInjectedProvider: false,
  theme: {
    background: "#1d1d3c",
    main: "white",
    secondary: "#f5f5f5",
    border: "#e440f2",
    hover: "rgba(241, 36, 255, 0.0)",
  },
});

// let providerOptions2 = {
//   injected: {
//     display: {
//       logo: "../assets/images/metamask.svg",
//       name: "MetaMask",
//       description: "Connect to your MetaMask Wallet",
//     },
//     package: true,
//     connector: async () => {
//       let provider = null;
//       if (typeof window.ethereum !== "undefined") {
//         provider = window.ethereum;
//         try {
//           await provider.request({ method: "eth_requestAccounts" });
//         } catch (error) {
//           throw new Error("Wallet Rejected");
//         }
//       } else {
//         throw new Error("No MetaMask Wallet found");
//       }
//       return provider;
//     },
//   },
// };

export const Web3ModalContext = React.createContext(web3Modal);
