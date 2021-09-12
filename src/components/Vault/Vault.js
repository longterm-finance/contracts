import React, { useState, useEffect, useContext } from "react";
import "./vault.css";
import dai from "../../assets/images/dai.png";
import avax from "../../assets/images/avax.png";
import eth from "../../assets/images/eth.png";
import avix from "../../assets/images/favicon.png";
import dvix from "../../assets/images/dVIX_favicon.png";
import { ThemeContext } from "../../state/ThemeContext";
import SignerContext from "../../state/SignerContext";
import { Web3ModalContext } from "../../state/Web3ModalContext";
import Spinner from "../Layout/Spinner";
import Details from "./Details";

// const TabNav = ({ children, tabs, selected, setSelected }) => {
//   return (
//     <div className="tab-nav">
//       <ul className="nav nav-tabs">
//         {tabs.map((tab) => {
//           const active = tab === selected ? "active" : "";
//           return (
//             <li className="nav-item" key={tab}>
//               <span
//                 className={"nav-link " + active}
//                 onClick={() => setSelected(tab)}
//               >
//                 {tab}
//               </span>
//             </li>
//           );
//         })}
//       </ul>
//       {children}
//     </div>
//   );
// };

// const Tab = ({ isSelected, children }) => {
//   if (isSelected) {
//     return <div className="tab-container">{children}</div>;
//   }

//   return null;
// };

// const CollateralSelector = ({ selectedColl, setSelectedColl, collOptions }) => {
//   return (
//     <div className="coll-selector mb-5">
//       <select name="" id="" className="form-select">
//         {collOptions.map((collOption) => {
//           const active = collOption.name === selectedColl ? "active" : "";
//           return (
//             <option
//               className={active}
//               onClick={() => {
//                 setSelectedColl(collOption.name);
//               }}
//               value={collOption.name.substr(0)}
//               key={collOption.name}
//             >
//               {/* <img alt={collOption.name} src={dai} width={32} height={32} /> */}
//               {collOption.name.substr(0)}
//             </option>
//           );
//         })}
//       </select>
//     </div>
//   );
// };

// const Vault = ({ collateral }) => {
//   const { isDarkMode } = useContext(ThemeContext);
//   const [selected, setSelected] = useState("Add / Remove Collateral");
//   const [selectedColl, setSelectedColl] = useState("AVAX");

//   useEffect(() => {
//     const loadBlockchainData = async (dispatch) => {
//       console.log("Load blockchain data...");
//     };

//     loadBlockchainData();
//   }, []);

//   const handleSelected = (tab) => setSelected(tab);
//   const handleSelectedColl = (collOption) => setSelectedColl(collOption);

//   return (
//     <div className="vault-container">
//       <br />
//       <br />
//       <br />
//       <br />
//       <br />
//       <br />

//       <h1 className="text-center">Avix Vault</h1>

//       <div className="select-coll-container">
//         <h3 className="text-left">Select Collateral:</h3>
//         <CollateralSelector
//           collOptions={[
//             {
//               name: "AVAX",
//               src: avax,
//             },
//             {
//               name: "WETH.e",
//               src: eth,
//             },
//             {
//               name: "DAI.e",
//               src: dai,
//             },
//           ]}
//           selectedColl={selectedColl}
//           setSelectedColl={handleSelectedColl}
//         />
//       </div>

//       <TabNav
//         tabs={["Add / Remove Collateral", "Mint / Burn dVIX"]}
//         selected={selected}
//         setSelected={handleSelected}
//       >
//         <Tab isSelected={selected === "Add / Remove Collateral"}>
//           <p>Add / Remove Collateral</p>
//         </Tab>
//         <Tab isSelected={selected === "Mint / Burn dVIX"}>
//           <p>Mint / Burn dVIX</p>
//         </Tab>
//       </TabNav>
//       <h1>{collateral}</h1>
//     </div>
//   );
// };

const Vault = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const web3Modal = useContext(Web3ModalContext);
  const signer = useContext(SignerContext);

  // State
  const [isLoading, setIsLoading] = useState(true);
  const [address, setAddress] = useState("");

  useEffect(() => {
    async function load() {
      if (!signer.signer) {
        setIsLoading(false);
      } else if (signer.signer) {
        const currentAddress = await signer.signer.getAddress();
        setAddress(currentAddress);
        setIsLoading(false);
      }
    }

    load();
    // eslint-disable-next-line
  }, [signer.signer, address]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="trade-container">
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <div>
        <h3>Avix Vault</h3>

        {!signer.signer ? (
          <div className="pre-actions">
            <h5 className="action-title mt-4 pt-2">Connect Wallet</h5>
            <p>
              No wallet connected. Please Connect your wallet to Create a Vault
              and approve your collateral to start minting dVIX tokens.
            </p>
            <button
              onClick={() => {
                web3Modal.toggleModal();
              }}
              type="button"
              className="btn btn-regular border-rad-05 bold"
            >
              Connect Wallet
            </button>
          </div>
        ) : (
          <Details address={address} />
        )}
      </div>
      <br />
      <br />
      <br />
      <br />
    </div>
  );
};

export default Vault;
