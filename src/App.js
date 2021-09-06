import React, { lazy, Suspense, useState, useEffect, useContext } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useRouteMatch,
  useLocation,
} from "react-router-dom";
import { ethers } from "ethers";
import { Provider, Contract } from "ethers-multicall";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import Spinner from "./components/Layout/Spinner";
import ErrorBoundary from "./components/Layout/ErrorBoundary";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "semantic-ui-css/semantic.min.css";
import Container from "react-bootstrap/esm/Container";
import Alert from "react-bootstrap/esm/Alert";
import { useSwipeable } from "react-swipeable";
import { useMediaQuery } from "@react-hook/media-query";
import ThemeProvider from "./state/ThemeContext";
import GovernanceContext from "./state/GovernanceContext";
import OraclesContext from "./state/OraclesContext";
import RewardsContext from "./state/RewardsContext";
import SignerContext from "./state/SignerContext";
import TokensContext from "./state/TokensContext";
import VaultsContext from "./state/VaultsContext";
import { Web3ModalContext } from "./state/Web3ModalContext";
import { useGovernance } from "./hooks/useGovernance";
import { useOracles } from "./hooks/useOracles";
import { useRewards } from "./hooks/useRewards";
import { useSigner } from "./hooks/useSigner";
import { useTokens } from "./hooks/useTokens";
import { useVaults } from "./hooks/useVaults";
import AvixJSON from "./contracts/avix.json";
import ERC20 from "./contracts/ERC20.json";
import WAVAX from "./contracts/WAVAX.json";
import UniV2Pair from "./contracts/UniswapV2Pair.json";
import DashboardLayout from "./components/Dashboard/DashboardLayout";
import Vault from "./components/Vault/Vault";
import Trade from "./components/Trade/Trade";
import Pool from "./components/Pool/Pool";
import Farm from "./components/Farm/Farm";
import NFT from "./components/NFT/NFT";
import Learn from "./components/Learn/Learn";
import NotFound from "./components/Layout/NotFound";

const Toastify = () => (
  <ToastContainer
    position="top-right"
    autoClose={5000}
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
  />
);

// const clientOracle = new ApolloClient({
//   uri: process.env.REACT_APP_GRAPH_URL, // Add this later
//   cache: new InMemoryCache(),
// });

const App = () => {
  const signer = useSigner();
  const web3Modal = useContext(Web3ModalContext);
  const [isLoading, setLoading] = useState(true);
  const [invalidNetwork, setInvalidNetwork] = useState(false);
  const [show, setShow] = useState(true);
  const [vaultWarning, setVaultWarning] = useState(true);
  const vaults = useVaults();
  const tokens = useTokens();
  const oracles = useOracles();
  const governance = useGovernance();
  const rewards = useRewards();
  // const match = useRouteMatch();
  // const location = useLocation();

  // const setContracts = async (currentSigner, ethcallProvider) => {
  //   await ethcallProvider.init();

  //   signer.setCurrentEthcallProvider(ethcallProvider);

  //   const networkId = parseInt(process.env.REACT_APP_NETWORK_ID || "43113");
  //   let contracts;

  //   switch (networkId) {
  //     case 43114:
  //       contracts = AvixJSON[43114].mainnet.contracts;
  //       break;
  //     case 43113:
  //       contracts = AvixJSON[43113].fuji.contracts;
  //       break;
  //     default:
  //       contracts = AvixJSON[43113].fuji.contracts;
  //       break;
  //   }

  //   // Set Vaults
  //   const currentWETHVault = new ethers.Contract(
  //     contracts.WETHVaultHandler.address,
  //     contracts.WETHVaultHandler.abi,
  //     currentSigner
  //   );
  //   vaults.setCurrentWETHVault(currentWETHVault);
  //   const currentDAIVault = new ethers.Contract(
  //     contracts.DAIVaultHandler.address,
  //     contracts.DAIVaultHandler.abi,
  //     currentSigner
  //   );
  //   vaults.setCurrentDAIVault(currentDAIVault);

  //   const currentWETHVaultRead = new Contract(
  //     contracts.WETHVaultHandler.address,
  //     contracts.WETHVaultHandler.abi
  //   );
  //   vaults.setCurrentWETHVaultRead(currentWETHVaultRead);
  //   const currentDAIVaultRead = new Contract(
  //     contracts.DAIVaultHandler.address,
  //     contracts.DAIVaultHandler.abi
  //   );
  //   vaults.setCurrentDAIVaultRead(currentDAIVaultRead);

  //   // Set Tokens
  //   const currentWETHToken = new ethers.Contract(
  //     process.env.REACT_APP_WETH_ADDRESS || "",
  //     ERC20.abi,
  //     currentSigner
  //   );
  //   tokens.setCurrentWETHToken(currentWETHToken);
  //   const currentDAIToken = new ethers.Contract(
  //     process.env.REACT_APP_DAI_ADDRESS || "",
  //     WAVAX.abi,
  //     currentSigner
  //   );
  //   tokens.setCurrentDAIToken(currentDAIToken);
  //   const currentTCAPToken = new ethers.Contract(
  //     contracts.TCAP.address,
  //     contracts.TCAP.abi,
  //     currentSigner
  //   );
  //   tokens.setCurrentTCAPToken(currentTCAPToken);

  //   const currentWETHTokenRead = new Contract(
  //     process.env.REACT_APP_WETH_ADDRESS || "",
  //     ERC20.abi
  //   );
  //   tokens.setCurrentWETHTokenRead(currentWETHTokenRead);
  //   const currentDAITokenRead = new Contract(
  //     process.env.REACT_APP_DAI_ADDRESS || "",
  //     WAVAX.abi
  //   );
  //   tokens.setCurrentDAITokenRead(currentDAITokenRead);
  //   const currentTCAPTokenRead = new Contract(
  //     contracts.TCAP.address,
  //     contracts.TCAP.abi
  //   );
  //   tokens.setCurrentTCAPTokenRead(currentTCAPTokenRead);

  //   // TODO:remove this once other pools work
  //   if (process.env.REACT_APP_POOL_ETH && process.env.REACT_APP_POOL_CTX) {
  //     const currentWETHPoolToken = new ethers.Contract(
  //       process.env.REACT_APP_POOL_ETH,
  //       UniV2Pair.abi,
  //       currentSigner
  //     );
  //     tokens.setCurrentWETHPoolToken(currentWETHPoolToken);

  //     const currentWETHPoolTokenRead = new Contract(
  //       process.env.REACT_APP_POOL_ETH,
  //       UniV2Pair.abi
  //     );
  //     tokens.setCurrentWETHPoolTokenRead(currentWETHPoolTokenRead);

  //     const currentCTXPoolToken = new ethers.Contract(
  //       process.env.REACT_APP_POOL_CTX,
  //       UniV2Pair.abi,
  //       currentSigner
  //     );
  //     tokens.setCurrentCTXPoolToken(currentCTXPoolToken);

  //     const currentCTXPoolTokenRead = new Contract(
  //       process.env.REACT_APP_POOL_CTX,
  //       UniV2Pair.abi
  //     );
  //     tokens.setCurrentCTXPoolTokenRead(currentCTXPoolTokenRead);
  //   }

  //   if (
  //     process.env.REACT_APP_POOL_ETH &&
  //     process.env.REACT_APP_POOL_DAI &&
  //     process.env.REACT_APP_POOL_CTX
  //   ) {
  //     // Set Pool Tokens
  //     const currentWETHPoolToken = new ethers.Contract(
  //       process.env.REACT_APP_POOL_ETH,
  //       UniV2Pair.abi,
  //       currentSigner
  //     );

  //     tokens.setCurrentWETHPoolToken(currentWETHPoolToken);

  //     const currentDAIPoolToken = new ethers.Contract(
  //       process.env.REACT_APP_POOL_DAI,
  //       UniV2Pair.abi,
  //       currentSigner
  //     );
  //     tokens.setCurrentDAIPoolToken(currentDAIPoolToken);
  //   }

  //   // Set Rewards
  //   const currentWETHReward = new ethers.Contract(
  //     contracts.WETHRewardHandler.address,
  //     contracts.WETHRewardHandler.abi,
  //     currentSigner
  //   );
  //   rewards.setCurrentWETHReward(currentWETHReward);

  //   const currentDAIReward = new ethers.Contract(
  //     contracts.DAIRewardHandler.address,
  //     contracts.DAIRewardHandler.abi,
  //     currentSigner
  //   );
  //   rewards.setCurrentDAIReward(currentDAIReward);

  //   const currentWETHRewardRead = new Contract(
  //     contracts.WETHRewardHandler.address,
  //     contracts.WETHRewardHandler.abi
  //   );
  //   rewards.setCurrentWETHRewardRead(currentWETHRewardRead);

  //   const currentDAIRewardRead = new Contract(
  //     contracts.DAIRewardHandler.address,
  //     contracts.DAIRewardHandler.abi
  //   );
  //   rewards.setCurrentDAIRewardRead(currentDAIRewardRead);

  //   // Set Liquidity Rewards
  //   const currentWETHPoolReward = new ethers.Contract(
  //     contracts.ETHLiquidityReward.address,
  //     contracts.ETHLiquidityReward.abi,
  //     currentSigner
  //   );
  //   rewards.setCurrentWETHPoolReward(currentWETHPoolReward);

  //   const currentWETHPoolRewardRead = new Contract(
  //     contracts.ETHLiquidityReward.address,
  //     contracts.ETHLiquidityReward.abi
  //   );
  //   rewards.setCurrentWETHPoolRewardRead(currentWETHPoolRewardRead);

  //   const currentCTXPoolReward = new ethers.Contract(
  //     // @ts-ignore
  //     contracts.CTXLiquidityReward.address, // @ts-ignore
  //     contracts.CTXLiquidityReward.abi,
  //     currentSigner
  //   );
  //   rewards.setCurrentCTXPoolReward(currentCTXPoolReward);

  //   const currentCTXPoolRewardRead = new Contract( // @ts-ignore
  //     contracts.CTXLiquidityReward.address, // @ts-ignore
  //     contracts.CTXLiquidityReward.abi
  //   );
  //   rewards.setCurrentCTXPoolRewardRead(currentCTXPoolRewardRead);

  //   // Set Oracles
  //   const currentWETHOracle = new ethers.Contract(
  //     contracts.WETHOracle.address,
  //     contracts.WETHOracle.abi,
  //     currentSigner
  //   );
  //   oracles.setCurrentWETHOracle(currentWETHOracle);
  //   const currentDAIOracle = new ethers.Contract(
  //     contracts.DAIOracle.address,
  //     contracts.DAIOracle.abi,
  //     currentSigner
  //   );
  //   oracles.setCurrentDAIOracle(currentDAIOracle);

  //   const currentTCAPOracle = new ethers.Contract(
  //     contracts.TCAPOracle.address,
  //     contracts.TCAPOracle.abi,
  //     currentSigner
  //   );
  //   oracles.setCurrentTCAPOracle(currentTCAPOracle);

  //   const currentWETHOracleRead = new Contract(
  //     contracts.WETHOracle.address,
  //     contracts.WETHOracle.abi
  //   );
  //   oracles.setCurrentWETHOracleRead(currentWETHOracleRead);
  //   const currentDAIOracleRead = new Contract(
  //     contracts.DAIOracle.address,
  //     contracts.DAIOracle.abi
  //   );
  //   oracles.setCurrentDAIOracleRead(currentDAIOracleRead);

  //   const currentTCAPOracleRead = new Contract(
  //     contracts.TCAPOracle.address,
  //     contracts.TCAPOracle.abi
  //   );
  //   oracles.setCurrentTCAPOracleRead(currentTCAPOracleRead);

  //   // Set Governance
  //   const currentCtx = new ethers.Contract(
  //     contracts.Ctx.address,
  //     contracts.Ctx.abi,
  //     currentSigner
  //   );
  //   tokens.setCurrentCtxToken(currentCtx);
  //   const currentGovernorAlpha = new ethers.Contract(
  //     contracts.GovernorAlpha.address,
  //     contracts.GovernorAlpha.abi,
  //     currentSigner
  //   );
  //   governance.setCurrentGovernorAlpha(currentGovernorAlpha);
  //   const currentTimelock = new ethers.Contract(
  //     contracts.Timelock.address,
  //     contracts.Timelock.abi,
  //     currentSigner
  //   );
  //   governance.setCurrentTimelock(currentTimelock);

  //   const currentCtxRead = new Contract(
  //     contracts.Ctx.address,
  //     contracts.Ctx.abi
  //   );
  //   tokens.setCurrentCtxTokenRead(currentCtxRead);
  //   const currentGovernorAlphaRead = new Contract(
  //     contracts.GovernorAlpha.address,
  //     contracts.GovernorAlpha.abi
  //   );
  //   governance.setCurrentGovernorAlphaRead(currentGovernorAlphaRead);
  //   const currentTimelockRead = new Contract(
  //     contracts.Timelock.address,
  //     contracts.Timelock.abi
  //   );
  //   governance.setCurrentTimelockRead(currentTimelockRead);
  // };

  // web3Modal.on("connect", async (networkProvider) => {
  //   setLoading(true);
  //   const currentProvider = new ethers.providers.Web3Provider(networkProvider);
  //   const network = await currentProvider.getNetwork();
  //   if (
  //     process.env.REACT_APP_NETWORK_ID &&
  //     !(
  //       network.chainId === parseInt(process.env.REACT_APP_NETWORK_ID) ||
  //       parseInt(process.env.REACT_APP_NETWORK_ID) === 0
  //     )
  //   ) {
  //     setInvalidNetwork(true);
  //   }

  //   const currentSigner = currentProvider.getSigner();
  //   signer.setCurrentSigner(currentSigner);

  //   const ethcallProvider = new Provider(currentProvider);
  //   // setContracts(currentSigner, ethcallProvider);

  //   setLoading(false);
  // });

  // useEffect(() => {
  //   const savedAlert = localStorage.getItem("alert");
  //   if (savedAlert) setShow(false);

  //   async function loadProvider() {
  //     if (web3Modal.cachedProvider && !signer.signer) {
  //       const networkProvider = await web3Modal.connect();
  //       const currentProvider = new ethers.providers.Web3Provider(
  //         networkProvider
  //       );
  //       const network = await currentProvider.getNetwork();

  //       if (
  //         process.env.REACT_APP_NETWORK_ID &&
  //         !(
  //           network.chainId === parseInt(process.env.REACT_APP_NETWORK_ID) ||
  //           parseInt(process.env.REACT_APP_NETWORK_ID) === 0
  //         )
  //       ) {
  //         setInvalidNetwork(true);
  //       }

  //       const currentSigner = currentProvider.getSigner();
  //       signer.setCurrentSigner(currentSigner);

  //       const ethcallProvider = new Provider(currentProvider);
  //       // setContracts(currentSigner, ethcallProvider);
  //     } else {
  //       const network = process.env.REACT_APP_NETWORK_NAME;
  //       const provider = ethers.getDefaultProvider(network, {
  //         infura: process.env.REACT_APP_PROVIDER, // Customize this later for Avalanche
  //       });

  //       const randomSigner = ethers.Wallet.createRandom().connect(provider);
  //       const ethcallProvider = new Provider(randomSigner.provider);
  //       // setContracts(randomSigner, ethcallProvider);
  //     }
  //     setLoading(false);
  //   }
  //   // Execute the created function directly
  //   loadProvider();
  //   // eslint-disable-next-line
  // }, [web3Modal]);

  // if (isLoading) {
  //   return (
  //     <React.Fragment>
  //       <DashboardLayout />
  //       <h1>Loading</h1>
  //       <p>Please wait</p>
  //       <Spinner />
  //     </React.Fragment>
  //   );
  // }

  // if (invalidNetwork) {
  //   const networkName = process.env.REACT_APP_NETWORK_NAME;
  //   return (
  //     <React.Fragment>
  //       <DashboardLayout />
  //       <h1>Invalid Network</h1>
  //       <p>Please switch to {networkName} network</p>
  //     </React.Fragment>
  //   );
  // }

  return (
    <Router>
      <SignerContext.Provider value={signer}>
        <TokensContext.Provider value={tokens}>
          <OraclesContext.Provider value={oracles}>
            <VaultsContext.Provider value={vaults}>
              <GovernanceContext.Provider value={governance}>
                <RewardsContext.Provider value={rewards}>
                  <ThemeProvider>
                    <ErrorBoundary>
                      <Suspense fallback={<Spinner />}>
                        <DashboardLayout />
                        <Toastify />
                        <Switch>
                          <Route exact path="/" component={Vault} />
                          <Route exact path="/trade" component={Trade} />
                          <Route exact path="/pool" component={Pool} />
                          <Route exact path="/farm" component={Farm} />
                          <Route exact path="/nft" component={NFT} />
                          <Route exact path="/learn" component={Learn} />
                          <Route component={NotFound} />
                        </Switch>
                      </Suspense>
                    </ErrorBoundary>
                  </ThemeProvider>
                </RewardsContext.Provider>
              </GovernanceContext.Provider>
            </VaultsContext.Provider>
          </OraclesContext.Provider>
        </TokensContext.Provider>
      </SignerContext.Provider>
    </Router>
  );
};

export default App;
