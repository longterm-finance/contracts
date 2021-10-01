import React, { Suspense, useState, useEffect, useContext } from "react";
import { Route, Switch } from "react-router-dom";
import { ethers } from "ethers";
import { Provider, Contract } from "ethers-multicall";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import Spinner from "./components/Layout/Spinner";
import ErrorBoundary from "./components/Layout/ErrorBoundary";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "semantic-ui-css/semantic.min.css";
import Alert from "react-bootstrap/esm/Alert";
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
import Governance from "./components/Governance/Governance";
import Stats from "./components/Stats/Stats";
import Learn from "./components/Learn/Learn";
import NotFound from "./components/Layout/NotFound";
import { Header } from "./components/Dashboard/DashboardLayout";

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

const clientOracle = new ApolloClient({
  uri: process.env.REACT_APP_GRAPH_URL, // Add this later
  cache: new InMemoryCache(),
});

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
  //# const match = useRouteMatch();
  //# const location = useLocation();

  const setContracts = async (currentSigner, ethcallProvider) => {
    await ethcallProvider.init();

    signer.setCurrentEthcallProvider(ethcallProvider);

    const networkId = parseInt(process.env.REACT_APP_NETWORK_ID || 43114);
    let contracts;

    switch (networkId) {
      case 43114:
        contracts = AvixJSON[43114].mainnet.contracts;
        break;
      case 43113:
        contracts = AvixJSON[43113].fuji.contracts;
        break;
      default:
        contracts = AvixJSON[43114].fuji.contracts;
        break;
    }

    // Set Vaults
    const currentWAVAXVault = new ethers.Contract(
      contracts.WAVAXVaultHandler.address,
      contracts.WAVAXVaultHandler.abi,
      currentSigner
    );
    vaults.setCurrentWAVAXVault(currentWAVAXVault);

    const currentWETHVault = new ethers.Contract(
      contracts.WETHVaultHandler.address,
      contracts.WETHVaultHandler.abi,
      currentSigner
    );
    vaults.setCurrentWETHVault(currentWETHVault);

    const currentDAIVault = new ethers.Contract(
      contracts.DAIVaultHandler.address,
      contracts.DAIVaultHandler.abi,
      currentSigner
    );
    vaults.setCurrentDAIVault(currentDAIVault);

    // Set Vault Reads
    const currentWAVAXVaultRead = new Contract(
      contracts.WAVAXVaultHandler.address,
      contracts.WAVAXVaultHandler.abi
    );
    vaults.setCurrentWAVAXVaultRead(currentWAVAXVaultRead);

    // const currentWETHVaultRead = new Contract(
    //   contracts.WETHVaultHandler.address,
    //   contracts.WETHVaultHandler.abi
    // );
    // vaults.setCurrentWETHVaultRead(currentWETHVaultRead);
    const currentWETHVaultRead = {};

    const currentDAIVaultRead = new Contract(
      contracts.DAIVaultHandler.address,
      contracts.DAIVaultHandler.abi
    );
    vaults.setCurrentDAIVaultRead(currentDAIVaultRead);

    // Set Tokens
    const currentWAVAXToken = new ethers.Contract(
      process.env.REACT_APP_WAVAX_ADDRESS || "",
      ERC20.abi,
      currentSigner
    );
    tokens.setCurrentWAVAXToken(currentWAVAXToken);

    const currentWETHToken = new ethers.Contract(
      process.env.REACT_APP_WETH_ADDRESS || "",
      ERC20.abi,
      currentSigner
    );
    tokens.setCurrentWETHToken(currentWETHToken);

    const currentDAIToken = new ethers.Contract(
      process.env.REACT_APP_DAI_ADDRESS || "",
      WAVAX.abi,
      currentSigner
    );
    tokens.setCurrentDAIToken(currentDAIToken);

    const currentDVIXToken = new ethers.Contract(
      contracts.DVIX.address,
      contracts.DVIX.abi,
      currentSigner
    );
    tokens.setCurrentDVIXToken(currentDVIXToken);

    // Set Token Reads
    const currentWAVAXTokenRead = new Contract(
      process.env.REACT_APP_WAVAX_ADDRESS || "",
      ERC20.abi
    );
    tokens.setCurrentWAVAXTokenRead(currentWAVAXTokenRead);

    const currentWETHTokenRead = new Contract(
      process.env.REACT_APP_WETH_ADDRESS || "",
      ERC20.abi
    );
    tokens.setCurrentWETHTokenRead(currentWETHTokenRead);

    const currentDAITokenRead = new Contract(
      process.env.REACT_APP_DAI_ADDRESS || "",
      WAVAX.abi
    );
    tokens.setCurrentDAITokenRead(currentDAITokenRead);

    const currentDVIXTokenRead = new Contract(
      contracts.DVIX.address,
      contracts.DVIX.abi
    );
    tokens.setCurrentDVIXTokenRead(currentDVIXTokenRead);

    // TODO: Remove this once other pools work
    // if (
    //   process.env.REACT_APP_POOL_AVAX &&
    //   process.env.REACT_APP_POOL_ETH &&
    //   process.env.REACT_APP_POOL_DAI &&
    //   process.env.REACT_APP_POOL_AVIX
    // ) {
    //   // Set Pool Tokens
    //   const currentWAVAXPoolToken = new ethers.Contract(
    //     process.env.REACT_APP_POOL_AVAX,
    //     UniV2Pair.abi,
    //     currentSigner
    //   );
    //   tokens.setCurrentWAVAXPoolToken(currentWAVAXPoolToken);

    //   const currentWETHPoolToken = new ethers.Contract(
    //     process.env.REACT_APP_POOL_ETH,
    //     UniV2Pair.abi,
    //     currentSigner
    //   );
    //   tokens.setCurrentWETHPoolToken(currentWETHPoolToken);

    //   const currentDAIPoolToken = new ethers.Contract(
    //     process.env.REACT_APP_POOL_DAI,
    //     UniV2Pair.abi,
    //     currentSigner
    //   );
    //   tokens.setCurrentDAIPoolToken(currentDAIPoolToken);

    //   const currentAVIXPoolToken = new ethers.Contract(
    //     process.env.REACT_APP_POOL_AVIX,
    //     UniV2Pair.abi,
    //     currentSigner
    //   );
    //   tokens.setCurrentAVIXPoolToken(currentAVIXPoolToken);

    //   // Set Pool Token Reads
    //   const currentWAVAXPoolTokenRead = new Contract(
    //     process.env.REACT_APP_POOL_AVAX,
    //     UniV2Pair.abi
    //   );
    //   tokens.setCurrentWAVAXPoolTokenRead(currentWAVAXPoolTokenRead);

    //   const currentWETHPoolTokenRead = new Contract(
    //     process.env.REACT_APP_POOL_ETH,
    //     UniV2Pair.abi
    //   );
    //   tokens.setCurrentWETHPoolTokenRead(currentWETHPoolTokenRead);

    //   const currentDAIPoolTokenRead = new Contract(
    //     process.env.REACT_APP_POOL_DAI,
    //     UniV2Pair.abi
    //   );
    //   tokens.setCurrentDAIPoolTokenRead(currentDAIPoolTokenRead);

    //   const currentAVIXPoolTokenRead = new Contract(
    //     process.env.REACT_APP_POOL_AVIX,
    //     UniV2Pair.abi
    //   );
    //   tokens.setCurrentAVIXPoolTokenRead(currentAVIXPoolTokenRead);
    // }

    if (
      process.env.REACT_APP_POOL_AVAX &&
      process.env.REACT_APP_POOL_ETH &&
      process.env.REACT_APP_POOL_DAI &&
      process.env.REACT_APP_POOL_AVIX
    ) {
      // Set Pool Tokens
      const currentWAVAXPoolToken = new ethers.Contract(
        process.env.REACT_APP_POOL_AVAX,
        UniV2Pair.abi,
        currentSigner
      );
      tokens.setCurrentWAVAXPoolToken(currentWAVAXPoolToken);

      const currentWETHPoolToken = new ethers.Contract(
        process.env.REACT_APP_POOL_ETH,
        UniV2Pair.abi,
        currentSigner
      );
      tokens.setCurrentWETHPoolToken(currentWETHPoolToken);

      const currentDAIPoolToken = new ethers.Contract(
        process.env.REACT_APP_POOL_DAI,
        UniV2Pair.abi,
        currentSigner
      );
      tokens.setCurrentDAIPoolToken(currentDAIPoolToken);

      const currentAVIXPoolToken = new ethers.Contract(
        process.env.REACT_APP_POOL_AVIX,
        UniV2Pair.abi,
        currentSigner
      );
      tokens.setCurrentAVIXPoolToken(currentAVIXPoolToken);

      // Set Pool Token Reads
      const currentWAVAXPoolTokenRead = new Contract(
        process.env.REACT_APP_POOL_AVAX,
        UniV2Pair.abi
      );
      tokens.setCurrentWAVAXPoolTokenRead(currentWAVAXPoolTokenRead);

      const currentWETHPoolTokenRead = new Contract(
        process.env.REACT_APP_POOL_ETH,
        UniV2Pair.abi
      );
      tokens.setCurrentWETHPoolTokenRead(currentWETHPoolTokenRead);

      const currentDAIPoolTokenRead = new Contract(
        process.env.REACT_APP_POOL_DAI,
        UniV2Pair.abi
      );
      tokens.setCurrentDAIPoolTokenRead(currentDAIPoolTokenRead);

      const currentAVIXPoolTokenRead = new Contract(
        process.env.REACT_APP_POOL_AVIX,
        UniV2Pair.abi
      );
      tokens.setCurrentAVIXPoolTokenRead(currentAVIXPoolTokenRead);
    }

    // Set Rewards (RewardHandler's)
    const currentWAVAXReward = new ethers.Contract(
      contracts.WAVAXRewardHandler.address,
      contracts.WAVAXRewardHandler.abi,
      currentSigner
    );
    rewards.setCurrentWAVAXReward(currentWAVAXReward);

    const currentWETHReward = new ethers.Contract(
      contracts.WETHRewardHandler.address,
      contracts.WETHRewardHandler.abi,
      currentSigner
    );
    rewards.setCurrentWETHReward(currentWETHReward);

    const currentDAIReward = new ethers.Contract(
      contracts.DAIRewardHandler.address,
      contracts.DAIRewardHandler.abi,
      currentSigner
    );
    rewards.setCurrentDAIReward(currentDAIReward);

    // Set Reward Reads (RewardHandler's)
    const currentWAVAXRewardRead = new Contract(
      contracts.WAVAXRewardHandler.address,
      contracts.WAVAXRewardHandler.abi
    );
    rewards.setCurrentWAVAXRewardRead(currentWAVAXRewardRead);

    const currentWETHRewardRead = new Contract(
      contracts.WETHRewardHandler.address,
      contracts.WETHRewardHandler.abi
    );
    rewards.setCurrentWETHRewardRead(currentWETHRewardRead);

    const currentDAIRewardRead = new Contract(
      contracts.DAIRewardHandler.address,
      contracts.DAIRewardHandler.abi
    );
    rewards.setCurrentDAIRewardRead(currentDAIRewardRead);

    // Set Liquidity Rewards (LiquidityReward's)
    const currentWAVAXPoolReward = new ethers.Contract(
      contracts.WAVAXLiquidityReward.address,
      contracts.WAVAXLiquidityReward.abi,
      currentSigner
    );
    rewards.setCurrentWAVAXPoolReward(currentWAVAXPoolReward);

    const currentWETHPoolReward = new ethers.Contract(
      contracts.WETHLiquidityReward.address,
      contracts.WETHLiquidityReward.abi,
      currentSigner
    );
    rewards.setCurrentWETHPoolReward(currentWETHPoolReward);

    const currentDAIPoolReward = new ethers.Contract(
      contracts.DAILiquidityReward.address,
      contracts.DAILiquidityReward.abi,
      currentSigner
    );
    rewards.setCurrentDAIPoolReward(currentDAIPoolReward);

    const currentAVIXPoolReward = new ethers.Contract(
      contracts.AVIXLiquidityReward.address,
      contracts.AVIXLiquidityReward.abi,
      currentSigner
    );
    rewards.setCurrentAVIXPoolReward(currentAVIXPoolReward);

    // Set Liquidity Reward Reads (LiquidityReward's)
    const currentWAVAXPoolRewardRead = new Contract(
      contracts.WAVAXLiquidityReward.address,
      contracts.WAVAXLiquidityReward.abi
    );
    rewards.setCurrentWAVAXPoolRewardRead(currentWAVAXPoolRewardRead);

    const currentWETHPoolRewardRead = new Contract(
      contracts.WETHLiquidityReward.address,
      contracts.WETHLiquidityReward.abi
    );
    rewards.setCurrentWETHPoolRewardRead(currentWETHPoolRewardRead);

    const currentDAIPoolRewardRead = new Contract(
      contracts.DAILiquidityReward.address,
      contracts.DAILiquidityReward.abi
    );
    rewards.setCurrentDAIPoolRewardRead(currentDAIPoolRewardRead);

    const currentAVIXPoolRewardRead = new Contract(
      contracts.AVIXLiquidityReward.address,
      contracts.AVIXLiquidityReward.abi
    );
    rewards.setCurrentAVIXPoolRewardRead(currentAVIXPoolRewardRead);

    // Set Oracles
    const currentWAVAXOracle = new ethers.Contract(
      contracts.WAVAXOracle.address,
      contracts.WAVAXOracle.abi,
      currentSigner
    );
    oracles.setCurrentWAVAXOracle(currentWAVAXOracle);

    const currentWETHOracle = new ethers.Contract(
      contracts.WETHOracle.address,
      contracts.WETHOracle.abi,
      currentSigner
    );
    oracles.setCurrentWETHOracle(currentWETHOracle);

    const currentDAIOracle = new ethers.Contract(
      contracts.DAIOracle.address,
      contracts.DAIOracle.abi,
      currentSigner
    );
    oracles.setCurrentDAIOracle(currentDAIOracle);

    const currentDVIXOracle = new ethers.Contract(
      contracts.DVIXOracle.address,
      contracts.DVIXOracle.abi,
      currentSigner
    );
    oracles.setCurrentDVIXOracle(currentDVIXOracle);

    // Set Oracle Reads
    const currentWAVAXOracleRead = new Contract(
      contracts.WAVAXOracle.address,
      contracts.WAVAXOracle.abi
    );
    oracles.setCurrentWAVAXOracleRead(currentWAVAXOracleRead);

    const currentWETHOracleRead = new Contract(
      contracts.WETHOracle.address,
      contracts.WETHOracle.abi
    );
    oracles.setCurrentWETHOracleRead(currentWETHOracleRead);

    const currentDAIOracleRead = new Contract(
      contracts.DAIOracle.address,
      contracts.DAIOracle.abi
    );
    oracles.setCurrentDAIOracleRead(currentDAIOracleRead);

    const currentDVIXOracleRead = new Contract(
      contracts.DVIXOracle.address,
      contracts.DVIXOracle.abi
    );
    oracles.setCurrentDVIXOracleRead(currentDVIXOracleRead);

    // Set Governance Contracts
    const currentAvix = new ethers.Contract(
      contracts.Avix.address,
      contracts.Avix.abi,
      currentSigner
    );
    tokens.setCurrentAvixToken(currentAvix);

    const currentGovernorBeta = new ethers.Contract(
      contracts.GovernorBeta.address,
      contracts.GovernorBeta.abi,
      currentSigner
    );
    governance.setCurrentGovernorBeta(currentGovernorBeta);

    const currentTimelock = new ethers.Contract(
      contracts.Timelock.address,
      contracts.Timelock.abi,
      currentSigner
    );
    governance.setCurrentTimelock(currentTimelock);

    // Set Governance Contract Reads
    const currentAvixRead = new Contract(
      contracts.Avix.address,
      contracts.Avix.abi
    );
    tokens.setCurrentAvixTokenRead(currentAvixRead);

    const currentGovernorBetaRead = new Contract(
      contracts.GovernorBeta.address,
      contracts.GovernorBeta.abi
    );
    governance.setCurrentGovernorBetaRead(currentGovernorBetaRead);

    const currentTimelockRead = new Contract(
      contracts.Timelock.address,
      contracts.Timelock.abi
    );
    governance.setCurrentTimelockRead(currentTimelockRead);

    console.log({ currentWETHVaultRead });
  };

  web3Modal.on("connect", async (networkProvider) => {
    setLoading(true);

    const currentProvider = new ethers.providers.Web3Provider(networkProvider);
    const network = await currentProvider.getNetwork();

    console.log({ appjs: { network } });

    // if (
    //   process.env.REACT_APP_NETWORK_ID &&
    //   !(
    //     (network.chainId === parseInt(process.env.REACT_APP_NETWORK_ID))
    //     // || parseInt(process.env.REACT_APP_NETWORK_ID) === 0
    //   )
    // ) {
    //   setInvalidNetwork(true);
    // }

    const currentSigner = currentProvider.getSigner();
    signer.setCurrentSigner(currentSigner);

    const ethcallProvider = new Provider(currentProvider);
    setContracts(currentSigner, ethcallProvider);

    setLoading(false);
  });

  useEffect(() => {
    const savedAlert = localStorage.getItem("alert");
    if (savedAlert) setShow(false);

    async function loadProvider() {
      if (web3Modal.cachedProvider && !signer.signer) {
        const networkProvider = await web3Modal.connect();
        const currentProvider = new ethers.providers.Web3Provider(
          networkProvider
        );
        const network = await currentProvider.getNetwork();

        console.log({
          cachedProvider: web3Modal.cachedProvider,
          signer: signer.signer,
          network,
        });

        // if (
        //   process.env.REACT_APP_NETWORK_ID &&
        //   !(
        //     (network.chainId === parseInt(process.env.REACT_APP_NETWORK_ID))
        //     // || parseInt(process.env.REACT_APP_NETWORK_ID) === 0
        //   )
        // ) {
        //   setInvalidNetwork(true);
        // }

        const currentSigner = currentProvider.getSigner();
        signer.setCurrentSigner(currentSigner);

        console.log({ signer2: currentSigner, signerObj: signer });

        const ethcallProvider = new Provider(currentProvider);
        setContracts(currentSigner, ethcallProvider);
      } else {
        const network = process.env.REACT_APP_NETWORK_NAME;
        const providerUrl = process.env.REACT_APP_PROVIDER;
        const provider = new ethers.providers.JsonRpcProvider(providerUrl, {
          name: network.toString(),
          chainId: 43114,
        });

        const randomSigner = ethers.Wallet.createRandom().connect(provider);
        const ethcallProvider = new Provider(randomSigner.provider);
        setContracts(randomSigner, ethcallProvider);
      }
      setLoading(false);
    }
    // Execute the created function directly
    loadProvider();
    // eslint-disable-next-line
  }, [web3Modal]);

  if (isLoading) {
    return (
      <React.Fragment>
        <DashboardLayout />
        <h1>Loading</h1>
        <p>Please wait</p>
        <Spinner />
      </React.Fragment>
    );
  }

  if (invalidNetwork) {
    const networkName = process.env.REACT_APP_NETWORK_NAME;

    return (
      <React.Fragment>
        <DashboardLayout />
        <h1>Invalid Network</h1>
        <p>
          Please switch to{" "}
          {networkName.substr(0, 1).toUpperCase() + networkName.substr(1)}{" "}
          C-Chain network
        </p>
      </React.Fragment>
    );
  }

  return (
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
                      {show && (
                        <Alert
                          onClose={() => {
                            setShow(false);
                            localStorage.setItem("alert", "false");
                          }}
                          dismissible
                        >
                          <b>
                            💀 This project is in beta. Use at your own risk.
                          </b>
                        </Alert>
                      )}

                      {vaultWarning && window.location.pathname === "/" && (
                        <Alert
                          onClose={() => {
                            setVaultWarning(false);
                            localStorage.setItem("alert", "false");
                          }}
                          dismissible
                        >
                          <b>
                            ⚠️ Make sure to always have a ratio above the
                            minimum ratio (300%) to avoid getting liquidated.
                          </b>
                        </Alert>
                      )}
                      <Toastify />
                      <Switch>
                        <ApolloProvider client={clientOracle}>
                          <Route exact path="/" component={Vault} />
                          <Route exact path="/trade" component={Trade} />
                          <Route exact path="/pool" component={Pool} />
                          <Route exact path="/farm" component={Farm} />
                          <Route exact path="/nft" component={NFT} />
                          <Route exact path="/gov" component={Governance} />
                          <Route exact path="/stats" component={Stats} />
                          <Route exact path="/learn" component={Learn} />
                          <Route exact path="/test" component={Header} />
                        </ApolloProvider>
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
  );
};

export default App;
