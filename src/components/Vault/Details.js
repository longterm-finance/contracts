import React, { useState, useEffect, useContext } from "react";
import { ThemeContext } from "../../state/ThemeContext";
import Button from "react-bootstrap/esm/Button";
import Card from "react-bootstrap/esm/Card";
import Form from "react-bootstrap/esm/Form";
import InputGroup from "react-bootstrap/esm/InputGroup";
import OverlayTrigger from "react-bootstrap/esm/OverlayTrigger";
import Tooltip from "react-bootstrap/esm/Tooltip";
import { ethers, BigNumber } from "ethers";
import NumberFormat from "react-number-format";
import { useRouteMatch, useHistory } from "react-router-dom";
import {
  useQuery,
  gql,
  // TODO: uncomment after fully integrating gql
  // NetworkStatus
} from "@apollo/client";
import OraclesContext from "../../state/OraclesContext";
import TokensContext from "../../state/TokensContext";
import VaultsContext from "../../state/VaultsContext";
import SignerContext from "../../state/SignerContext";
import avax from "../../assets/images/avax.png";
import eth from "../../assets/images/eth.png";
import dai from "../../assets/images/dai.png";
import dvix from "../../assets/images/dvix_logo_new.png";
import ratioIcon from "../../assets/images/ratio.png";
import {
  notifyUser,
  toUSD,
  errorNotification,
  getRatio,
  getSafeRemoveCollateral,
  getSafeMint,
} from "../../utils/utils";
import Spinner from "../Layout/Spinner";

// @TODO: Vault doesn't show if approve is 0 even if there is data in the vault

const Details = ({ address }) => {
  const { isDarkMode } = useContext(ThemeContext);

  const oracles = useContext(OraclesContext);
  const tokens = useContext(TokensContext);
  const vaults = useContext(VaultsContext);
  const signer = useContext(SignerContext);

  let currency = "AVAX";
  const match = useRouteMatch("/vault/:currency");
  const history = useHistory();

  switch (match?.params?.currency?.toLowerCase()) {
    case "avax":
      currency = "AVAX";
      break;
    case "wavax":
      currency = "WAVAX";
      break;
    case "weth":
      currency = "WETH";
      break;
    case "dai":
      currency = "DAI";
      break;
    default:
      currency = "AVAX";
      break;
  }

  // Actions
  const [title, setTitle] = useState("Create Vault");
  const [text, setText] = useState(
    "No vault Created. Please Create a Vault and approve your collateral to start minting dVIX tokens."
  );
  const [isApproved, setIsApproved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Vault Data
  const [selectedVaultId, setSelectedVaultId] = useState("0");
  const [vaultDebt, setVaultDebt] = useState("0");
  const [vaultDebtUSD, setVaultDebtUSD] = useState("0");
  const [vaultCollateral, setVaultCollateral] = useState("0");
  const [vaultCollateralUSD, setVaultCollateralUSD] = useState("0");
  const [vaultRatio, setVaultRatio] = useState("0");
  const [tempRatio, setTempRatio] = useState("");
  const [minRatio, setMinRatio] = useState("0");
  const [selectedVault, setSelectedVault] = useState(currency);
  const [selectedVaultContract, setSelectedVaultContract] = useState();
  const [selectedVaultRead, setSelectedVaultRead] = useState();
  const [selectedOracleRead, setSelectedOracleRead] = useState();
  const [
    selectedCollateralContract,
    setSelectedCollateralContract,
  ] = useState();
  const [selectedVaultDecimals, setSelectedVaultDecimals] = useState(18);

  // General Data
  const [tokenBalanceUSD, setTokenBalanceUSD] = useState("0");
  const [tokenBalance, setTokenBalance] = useState("0");
  const [tokenBalanceDecimals, setTokenBalanceDecimals] = useState(2);

  // Inputs
  const [addCollateralTxt, setAddCollateralTxt] = useState("");
  const [addCollateralUSD, setAddCollateralUSD] = useState("0");
  const [removeCollateralTxt, setRemoveCollateralTxt] = useState("");
  const [removeCollateralUSD, setRemoveCollateralUSD] = useState("0");
  const [mintTxt, setMintTxt] = useState("");
  const [mintUSD, setMintUSD] = useState("0");
  const [burnTxt, setBurnTxt] = useState("");
  const [burnUSD, setBurnUSD] = useState("0");
  const [burnFee, setBurnFee] = useState("0");
  const [vaultStatus, setVaultStatus] = useState("");

  // Infinite Approval
  const approveValue = BigNumber.from(
    "1157920892373161954235709850086879078532699"
  );

  const USER_VAULT = gql`
    query getVault($owner: String!) {
      vaults(where: { owner: $owner }) {
        id
        vaultId
        owner
        collateral
        debt
        address
        owner
      }
      _meta {
        block {
          number
          hash
        }
        hasIndexingErrors
      }
    }
  `;

  const dvixPrice = async () => {
    const currentDVIXPriceCall = await oracles.dvixOracleRead?.getLatestAnswer();

    const [currentDVIXPrice] = await signer.ethcallProvider?.all([
      currentDVIXPriceCall,
    ]);
    return currentDVIXPrice;
  };

  const collateralPrice = async () => {
    const collateralPriceCall = await selectedOracleRead?.getLatestAnswer();

    const [currentCollateralPrice] = await signer.ethcallProvider?.all([
      collateralPriceCall,
    ]);
    return currentCollateralPrice;
  };

  async function loadVault(vaultType, vaultData) {
    if (
      signer.signer &&
      oracles.wavaxOracle &&
      oracles.wethOracle &&
      oracles.daiOracle &&
      oracles.wavaxOracleRead &&
      oracles.wethOracleRead &&
      oracles.daiOracleRead &&
      oracles.dvixOracle &&
      vaults.wavaxVault &&
      vaults.wethVault &&
      vaults.daiVault &&
      tokens.wavaxToken &&
      tokens.wethToken &&
      tokens.daiToken &&
      tokens.wavaxTokenRead &&
      tokens.wethTokenRead &&
      tokens.daiTokenRead &&
      vaultData
    ) {
      let currentVault;
      let currentVaultRead;
      let currentToken;
      let currentOracleRead;
      let currentTokenRead;
      let balance;

      const network = process.env.REACT_APP_NETWORK_NAME;
      const providerUrl = process.env.REACT_APP_PROVIDER;

      const provider = new ethers.providers.JsonRpcProvider(providerUrl, {
        name: network.toString(),
        chainId: 43114,
      });

      switch (vaultType) {
        case "AVAX": {
          currentVault = vaults.wavaxVault;
          currentVaultRead = vaults.wavaxVaultRead;
          currentToken = tokens.wavaxToken;
          currentOracleRead = oracles.wavaxOracleRead;
          currentTokenRead = tokens.wavaxTokenRead;
          balance = await provider.getBalance(address);
          break;
        }
        case "WAVAX": {
          currentVault = vaults.wavaxVault;
          currentVaultRead = vaults.wavaxVaultRead;
          currentToken = tokens.wavaxToken;
          currentOracleRead = oracles.wavaxOracleRead;
          currentTokenRead = tokens.wavaxTokenRead;
          break;
        }
        case "WETH":
          currentVault = vaults.wethVault;
          currentVaultRead = vaults.wethVaultRead;
          currentToken = tokens.wethToken;
          currentOracleRead = oracles.wethOracleRead;
          currentTokenRead = tokens.wethTokenRead;
          break;
        case "DAI":
          currentVault = vaults.daiVault;
          currentVaultRead = vaults.daiVaultRead;
          currentToken = tokens.daiToken;
          currentOracleRead = oracles.daiOracleRead;
          currentTokenRead = tokens.daiTokenRead;
          break;
        default:
          currentVault = vaults.wavaxVault;
          currentVaultRead = vaults.wavaxVaultRead;
          currentToken = tokens.wavaxToken;
          currentOracleRead = oracles.wavaxOracleRead;
          currentTokenRead = tokens.wavaxTokenRead;
          break;
      }

      setSelectedVaultContract(currentVault);
      setSelectedCollateralContract(currentToken);
      setSelectedVaultRead(currentVaultRead);
      setSelectedOracleRead(currentOracleRead);

      let currentVaultData;

      // Removed GRAPH
      // if data is empty load vault data from contract
      const graphBlock = vaultData._meta.block.number;
      let currentBlock = await provider.getBlockNumber();
      currentBlock -= 10;

      if (
        vaultData.vaults.length > 0 &&
        !vaultData._meta.hasIndexingErrors &&
        graphBlock >= currentBlock
      ) {
        await vaultData.vaults.forEach((v) => {
          if (v.address.toLowerCase() === currentVault.address.toLowerCase()) {
            currentVaultData = v;
          }
        });
      } else {
        const vaultID = await currentVault.userToVault(address);

        if (!vaultID.eq(0)) {
          const vault = await currentVault.vaults(vaultID);
          currentVaultData = {
            vaultId: vaultID,
            collateral: vault.Collateral,
            debt: vault.Debt,
          };
        }
      }

      if (vaultType !== "AVAX") {
        balance = await currentToken.balanceOf(address);
      }

      let decimals;
      let currentPrice;

      if (currentVaultData) {
        const { vaultId, collateral, debt } = currentVaultData;
        const allowanceCall = await currentTokenRead.allowance(
          address,
          currentVault.address
        );
        const currentRatioCall = await currentVaultRead.getVaultRatio(vaultId);
        const currentDVIXPriceCall = await oracles.dvixOracleRead?.getLatestAnswer();
        const decimalsCall = await currentTokenRead.decimals();
        const currentPriceCall = await currentOracleRead.getLatestAnswer();
        const currentMinRatioCall = await currentVaultRead.ratio();

        const [
          allowance,
          currentRatio,
          currentDVIXPrice,
          decimalsVal,
          currentPriceVal,
          currentMinRatio,
        ] = await signer.ethcallProvider?.all([
          allowanceCall,
          currentRatioCall,
          currentDVIXPriceCall,
          decimalsCall,
          currentPriceCall,
          currentMinRatioCall,
        ]);

        decimals = decimalsVal;
        currentPrice = ethers.utils.formatEther(
          currentPriceVal.mul(10000000000)
        );

        setSelectedVaultId(vaultId);

        if (!allowance.isZero() || vaultType === "AVAX") {
          setMinRatio(currentMinRatio.toString());
          setIsApproved(true);
          setVaultRatio(currentRatio.toString());

          if (currentRatio.toString() === "0") {
            setVaultStatus("N/A");
          } else if (
            currentRatio.toString() >=
            parseFloat(currentMinRatio.toString()) + 50
          ) {
            setVaultStatus("safe");
          } else if (
            currentRatio.toString() >=
            parseFloat(currentMinRatio.toString()) + 30
          ) {
            setVaultStatus("warning");
          } else {
            setVaultStatus("danger");
          }

          const parsedCollateral = ethers.utils.formatUnits(
            collateral,
            decimals
          );

          // const parsedCollateral = ethers.utils.formatEther(collateral);
          setVaultCollateral(parsedCollateral);
          const usdCollateral = toUSD(currentPrice, parsedCollateral);
          setVaultCollateralUSD(usdCollateral.toString());

          const currentDVIXPriceFormat = ethers.utils.formatEther(
            currentDVIXPrice
          );
          const parsedDebt = ethers.utils.formatEther(debt);

          setVaultDebt(parsedDebt);

          const usdDVIX = toUSD(currentDVIXPriceFormat, parsedDebt);
          setVaultDebtUSD(usdDVIX.toString());
        } else {
          setText(
            "Vault not approved. Please approve your collateral to start minting dVIX tokens."
          );
          setTitle("Approve Vault");
          setIsApproved(false);
        }
      } else {
        const decimalsCall = await currentTokenRead.decimals();
        const currentPriceCall = await currentOracleRead.getLatestAnswer();

        const [
          decimalsVal,
          currentPriceVal,
        ] = await signer.ethcallProvider?.all([decimalsCall, currentPriceCall]);

        decimals = decimalsVal;
        currentPrice = ethers.utils.formatEther(
          currentPriceVal.mul(10000000000)
        );

        setSelectedVaultId("0");
        setText(
          "No vault Created. Please Create a Vault and approve your collateral to start minting dVIX tokens."
        );
        setTitle("Create Vault");
        setIsApproved(false);
      }

      setSelectedVaultDecimals(decimals);
      const currentBalance = ethers.utils.formatUnits(balance, decimals);

      if (parseFloat(currentBalance) < 0.09) {
        setTokenBalanceDecimals(4);
      }

      setTokenBalance(currentBalance);

      const usdBalance = toUSD(currentPrice, currentBalance);
      setTokenBalanceUSD(usdBalance.toString());
    }
  }

  const {
    data,
    refetch,
    // TODO: uncomment after fully integrating gql
    // networkStatus
  } = useQuery(USER_VAULT, {
    variables: { owner: address },
    pollInterval: 200000,
    fetchPolicy: "no-cache",
    notifyOnNetworkStatusChange: true,
    onCompleted: () => {
      loadVault(selectedVault, data);
    },
  });

  const refresh = async () => {
    try {
      await refetch();
    } catch (error) {
      // catch error in case the vault screen is changed
      console.error(error);
    }
  };

  const resetFields = () => {
    setBurnFee("0");
    setAddCollateralUSD("0");
    setAddCollateralTxt("");
    setRemoveCollateralTxt("");
    setRemoveCollateralUSD("0");
    setMintTxt("");
    setMintUSD("0");
    setBurnUSD("0");
    setBurnTxt("");
  };

  const changeVault = async (newRatio, reset = false) => {
    let r = newRatio;

    if (reset) {
      r = parseFloat(tempRatio);
      setVaultRatio(tempRatio);
      setTempRatio("");
      resetFields();
    } else {
      if (tempRatio === "") {
        setTempRatio(vaultRatio);
      }

      r = newRatio;
      setVaultRatio(r.toString());
    }

    if (r === 0) {
      setVaultStatus("N/A");
    } else if (r >= parseFloat(minRatio) + 100) {
      setVaultStatus("safe");
    } else if (r >= parseFloat(minRatio) + 60) {
      setVaultStatus("warning");
    } else if (r >= parseFloat(minRatio)) {
      setVaultStatus("danger");
    } else {
      setVaultRatio("0");
      setVaultStatus("error");
    }
  };

  // forms
  const onChangeAddCollateral = async (event) => {
    setAddCollateralTxt(event.target.value);

    if (event.target.value !== "") {
      const currentPrice = ethers.utils.formatEther(
        (await collateralPrice()).mul(10000000000)
      );
      const currentDvixPrice = ethers.utils.formatEther(await dvixPrice());
      let usd = toUSD(currentPrice, event.target.value);

      if (!usd) {
        usd = 0;
      }

      const newCollateral =
        parseFloat(event.target.value) + parseFloat(vaultCollateral);
      const r = await getRatio(
        newCollateral.toString(),
        currentPrice,
        vaultDebt,
        currentDvixPrice
      );

      changeVault(r);
      setAddCollateralUSD(usd.toString());
    } else {
      changeVault(0, true);
      setAddCollateralUSD("0");
    }
  };

  const onChangeRemoveCollateral = async (event) => {
    setRemoveCollateralTxt(event.target.value);

    if (event.target.value !== "") {
      const currentPrice = ethers.utils.formatEther(
        (await collateralPrice()).mul(10000000000)
      );
      const currentDvixPrice = ethers.utils.formatEther(await dvixPrice());
      let usd = toUSD(currentPrice, event.target.value);

      if (!usd) {
        usd = 0;
      }

      const newCollateral =
        parseFloat(vaultCollateral) - parseFloat(event.target.value);
      const r = await getRatio(
        newCollateral.toString(),
        currentPrice,
        vaultDebt,
        currentDvixPrice
      );

      changeVault(r);
      setRemoveCollateralUSD(usd.toString());
    } else {
      changeVault(0, true);
      setRemoveCollateralUSD("0");
    }
  };

  const onChangeMint = async (event) => {
    setMintTxt(event.target.value);

    if (event.target.value !== "") {
      const currentPrice = ethers.utils.formatEther(
        (await collateralPrice()).mul(10000000000)
      );
      const currentDvixPrice = ethers.utils.formatEther(await dvixPrice());
      let usd = toUSD(currentDvixPrice, event.target.value);

      if (!usd) {
        usd = 0;
      }

      const newDebt = parseFloat(event.target.value) + parseFloat(vaultDebt);
      const r = await getRatio(
        vaultCollateral,
        currentPrice,
        newDebt.toString(),
        currentDvixPrice
      );

      changeVault(r);
      setMintUSD(usd.toString());
    } else {
      changeVault(0, true);
      setMintUSD("0");
    }
  };

  const onChangeBurn = async (event) => {
    try {
      setBurnTxt(event.target.value);
      if (event.target.value !== "") {
        const currentPrice = ethers.utils.formatEther(
          (await collateralPrice()).mul(10000000000)
        );
        const currentDvixPrice = ethers.utils.formatEther(await dvixPrice());
        let usd = toUSD(currentDvixPrice, event.target.value);

        if (!usd) {
          usd = 0;
        }

        const newDebt = parseFloat(vaultDebt) - parseFloat(event.target.value);

        const r = await getRatio(
          vaultCollateral,
          currentPrice,
          newDebt.toString(),
          currentDvixPrice
        );

        changeVault(r);
        setBurnUSD(usd.toString());

        const currentBurnFee = await selectedVaultContract?.getFee(
          ethers.utils.parseEther(event.target.value)
        );

        const increasedFee = currentBurnFee
          .add(currentBurnFee.div(100))
          .toString();
        const avaxFee = ethers.utils.formatEther(increasedFee);

        setBurnFee(avaxFee.toString());
      } else {
        changeVault(0, true);
        setBurnUSD("0");
        setBurnFee("0");
      }
    } catch (error) {
      console.error(error);
      changeVault(0, true);
      setBurnUSD("0");
      setBurnFee("0");
    }
  };

  const addCollateral = async () => {
    if (addCollateralTxt) {
      // fix decimals
      const amount = ethers.utils.parseUnits(
        addCollateralTxt,
        selectedVaultDecimals
      );

      // const amount = ethers.utils.parseEther(addCollateralTxt);
      try {
        if (selectedVault === "AVAX") {
          const tx = await selectedVaultContract?.addCollateralAVAX({
            value: amount,
          });

          notifyUser(tx, refresh);
        } else {
          const tx = await selectedVaultContract?.addCollateral(amount);

          notifyUser(tx, refresh);
        }
      } catch (error) {
        console.error(error);
        if (error.code === 4001) {
          errorNotification("Transaction rejected");
        } else {
          errorNotification("Insufficient funds to stake");
        }
      }

      setAddCollateralTxt("");
      setAddCollateralUSD("0");
    } else {
      errorNotification("Field can't be empty");
    }
  };

  const maxAddCollateral = async (e) => {
    e.preventDefault();

    let balance = "0";

    if (selectedVault === "AVAX") {
      const network = process.env.REACT_APP_NETWORK_NAME;
      const providerUrl = process.env.REACT_APP_PROVIDER;

      const provider = new ethers.providers.JsonRpcProvider(providerUrl, {
        name: network.toString(),
        chainId: 43114,
      });
      balance = ethers.utils.formatEther(await provider.getBalance(address));
    } else if (selectedCollateralContract) {
      const value = BigNumber.from(
        await selectedCollateralContract.balanceOf(address)
      );
      balance = ethers.utils.formatUnits(value, selectedVaultDecimals);
    }
    const currentPrice = ethers.utils.formatEther(
      (await collateralPrice()).mul(10000000000)
    );
    const currentDvixPrice = ethers.utils.formatEther(await dvixPrice());
    setAddCollateralTxt(balance);
    let usd = toUSD(currentPrice, balance);

    if (!usd) {
      usd = 0;
    }

    const newCollateral = parseFloat(balance) + parseFloat(vaultCollateral);
    const r = await getRatio(
      newCollateral.toString(),
      currentPrice,
      vaultDebt,
      currentDvixPrice
    );

    changeVault(r);
    setAddCollateralUSD(usd.toString());
  };

  const removeCollateral = async () => {
    if (removeCollateralTxt) {
      const amount = ethers.utils.parseUnits(
        removeCollateralTxt,
        selectedVaultDecimals
      );

      try {
        if (selectedVault === "AVAX") {
          const tx = await selectedVaultContract?.removeCollateralAVAX(amount);
          notifyUser(tx, refresh);
        } else {
          const tx = await selectedVaultContract?.removeCollateral(amount);
          notifyUser(tx, refresh);
        }
      } catch (error) {
        console.error(error);
        if (error.code === 4001) {
          errorNotification("Transaction rejected");
        } else {
          errorNotification("Not enough collateral on vault");
        }
      }
      setRemoveCollateralTxt("");
      setRemoveCollateralUSD("0");
    } else {
      errorNotification("Field can't be empty");
    }
  };

  const safeRemoveCollateral = async (e) => {
    e.preventDefault();

    const currentPrice = ethers.utils.formatEther(
      (await collateralPrice()).mul(10000000000)
    );
    const currentDvixPrice = ethers.utils.formatEther(await dvixPrice());

    const collateralToRemove = await getSafeRemoveCollateral(
      minRatio,
      vaultCollateral,
      currentPrice,
      currentDvixPrice,
      vaultDebt
    );

    setRemoveCollateralTxt(collateralToRemove.toString());
    let usd = toUSD(currentPrice, collateralToRemove.toString());

    if (!usd) {
      usd = 0;
    }

    const newCollateral = parseFloat(vaultCollateral) - collateralToRemove;
    const r = await getRatio(
      newCollateral.toString(),
      currentPrice,
      vaultDebt,
      currentDvixPrice
    );

    changeVault(r);
    setRemoveCollateralUSD(usd.toString());
  };

  const mintDVIX = async () => {
    if (mintTxt) {
      try {
        const amount = ethers.utils.parseEther(mintTxt);
        const tx = await selectedVaultContract?.mint(amount);

        notifyUser(tx, refresh);
      } catch (error) {
        console.error(error);
        if (error.code === 4001) {
          errorNotification("Transaction rejected");
        } else {
          errorNotification("Not enough collateral on vault");
        }
      }
      setMintTxt("");
      setMintUSD("0");
    } else {
      errorNotification("Field can't be empty");
    }
  };

  const safeMintDVIX = async (e) => {
    e.preventDefault();

    const currentPrice = ethers.utils.formatEther(
      (await collateralPrice()).mul(10000000000)
    );
    const currentDvixPrice = ethers.utils.formatEther(await dvixPrice());

    const safeMint = await getSafeMint(
      minRatio,
      vaultCollateral,
      currentPrice,
      currentDvixPrice,
      vaultDebt
    );

    setMintTxt(safeMint.toString());
    let usd = toUSD(currentDvixPrice, safeMint.toString());

    if (!usd) {
      usd = 0;
    }

    const newDebt = safeMint + parseFloat(vaultDebt);
    const r = await getRatio(
      vaultCollateral,
      currentPrice,
      newDebt.toString(),
      currentDvixPrice
    );

    changeVault(r);
    setMintUSD(usd.toString());
  };

  const burnDVIX = async () => {
    if (burnTxt) {
      try {
        const amount = ethers.utils.parseEther(burnTxt);
        const currentBurnFee = await selectedVaultContract?.getFee(amount);
        const increasedFee = currentBurnFee
          .add(currentBurnFee.div(100))
          .toString();
        const avaxFee = ethers.utils.formatEther(increasedFee);
        setBurnFee(avaxFee.toString());

        const tx = await selectedVaultContract?.burn(amount, {
          value: increasedFee,
        });
        notifyUser(tx, refresh);
      } catch (error) {
        console.error(error);
        if (error.code === 4001) {
          errorNotification("Transaction rejected");
        } else {
          errorNotification("Burn value too high");
        }
      }
      setBurnTxt("");
      setBurnUSD("0");
      setBurnFee("0");
    } else {
      errorNotification("Field can't be empty");
    }
  };

  const maxBurnDVIX = async (e) => {
    e.preventDefault();

    const currentPrice = ethers.utils.formatEther(
      (await collateralPrice()).mul(10000000000)
    );
    const currentDvixPrice = ethers.utils.formatEther(await dvixPrice());
    const currentBalanceCall = await tokens.dvixTokenRead?.balanceOf(address);
    const currentVaultDebtCall = await selectedVaultRead?.vaults(
      selectedVaultId
    );

    const [currentBalance, currentVault] = await signer.ethcallProvider?.all([
      currentBalanceCall,
      currentVaultDebtCall,
    ]);

    let balanceFormat = "0";
    let balance;

    if (currentBalance.lt(currentVault.Debt)) {
      balanceFormat = ethers.utils.formatEther(currentBalance);
      balance = currentBalance;
    } else {
      balanceFormat = vaultDebt;
      balance = currentVault.Debt;
    }

    setBurnTxt(balanceFormat);
    let usd = toUSD(currentDvixPrice, balanceFormat);

    if (!usd) {
      usd = 0;
    }

    const newDebt = parseFloat(balanceFormat) - parseFloat(balanceFormat);
    const r = await getRatio(
      vaultCollateral,
      currentPrice,
      newDebt.toString(),
      currentDvixPrice
    );

    changeVault(r);
    setBurnUSD(usd.toString());

    if (balanceFormat !== "0") {
      const currentBurnFee = await selectedVaultContract?.getFee(balance);
      const increasedFee = currentBurnFee
        .add(currentBurnFee.div(100))
        .toString();
      const avaxFee = ethers.utils.formatEther(increasedFee);
      setBurnFee(avaxFee.toString());
    } else {
      setBurnFee("0");
    }
  };

  const action = async () => {
    if (selectedVaultId === "0") {
      const tx = await selectedVaultContract?.createVault();
      notifyUser(tx, refresh);
    } else {
      const amount = approveValue;
      const tx = await selectedCollateralContract?.approve(
        selectedVaultContract?.address,
        amount
      );
      notifyUser(tx, refresh);
    }
  };

  const onChangeVault = async (event) => {
    setSelectedVault(event.target.value);

    // Clean form
    setAddCollateralTxt("");
    setAddCollateralUSD("0");
    setRemoveCollateralTxt("");
    setRemoveCollateralUSD("0");
    setMintTxt("");
    setMintUSD("0");
    setBurnTxt("");
    setBurnUSD("0");
    setBurnFee("0");

    // Load values
    history?.push(`/vault/${event.target.value}`);

    await refetch();
  };

  useEffect(() => {
    async function load() {
      // TODO: if stuck at pending do something
      // if (networkStatus === NetworkStatus.loading) {
      //   return <Spinner />
      // }

      // TODO: uncomment after fully integrating gql
      // if (
      //   networkStatus === NetworkStatus.ready ||
      //   networkStatus === NetworkStatus.error
      // ) {
      //   // await loadVault(selectedVault);
      setIsLoading(false);
      // }
    }
    load();

    // eslint-disable-next-line
  }, [address, data]);

  if (isLoading) {
    return <Spinner />;
  }

  const Icon = ({ src, alt }) => (
    <img width="42" height="42" alt={alt} src={src} className="trade-icon-1" />
  );

  return (
    <div
      className={`vault-details-container ${
        isDarkMode && "vault-details-container-dark-mode"
      }`}
    >
      <p>Select your Collateral</p>
      <div className="icon-container">
        {(() => {
          switch (selectedVault) {
            case "WETH":
              return <Icon alt={"WETH.e"} src={eth} />;
            case "DAI":
              return <Icon alt={"DAI.e"} src={dai} />;
            default:
              return <Icon alt={"AVAX"} src={avax} />;
          }
        })()}

        <div className="select-container">
          <Form.Control
            as="select"
            onChange={onChangeVault}
            value={selectedVault}
          >
            <option value="AVAX">AVAX</option>
            <option>WAVAX</option>
            <option>WETH</option>
            <option>DAI</option>
          </Form.Control>
          <p className="number">
            <NumberFormat
              className="number"
              value={tokenBalance}
              displayType="text"
              thousandSeparator
              decimalScale={2}
            />{" "}
            {selectedVault} /{" "}
            <NumberFormat
              className="number"
              value={tokenBalanceUSD}
              displayType="text"
              thousandSeparator
              prefix="$"
              decimalScale={2}
            />
          </p>
        </div>
      </div>
      {isApproved ? (
        <>
          <div className="actions-container">
            <div className="balance">
              <Card>
                {(() => {
                  switch (selectedVault) {
                    case "WETH":
                      return <Icon alt={"WETH.e"} src={eth} />;
                    case "DAI":
                      return <Icon alt={"DAI.e"} src={dai} />;
                    default:
                      return <Icon alt={"AVAX"} src={avax} />;
                  }
                })()}
                <div className="info">
                  <h4>{selectedVault} Balance</h4>
                  <div>
                    <div className="amount">
                      {(() => {
                        switch (selectedVault) {
                          case "WETH":
                            return <Icon alt={"WETH.e"} src={eth} />;
                          case "DAI":
                            return <Icon alt={"DAI.e"} src={dai} />;
                          default:
                            return <Icon alt={"AVAX"} src={avax} />;
                        }
                      })()}
                      <h4 className=" ml-2 number neon-highlight">
                        <NumberFormat
                          className="number"
                          value={tokenBalance}
                          displayType="text"
                          thousandSeparator
                          decimalScale={tokenBalanceDecimals}
                        />
                      </h4>
                    </div>
                    <p className="number">
                      <NumberFormat
                        className="number"
                        value={tokenBalanceUSD}
                        displayType="text"
                        thousandSeparator
                        prefix="$"
                        decimalScale={
                          parseFloat(tokenBalanceUSD) > 1000 ? 0 : 2
                        }
                      />
                    </p>
                  </div>
                </div>
              </Card>
              <Card>
                <Icon alt={"Ratio"} src={ratioIcon} />
                <div className="info">
                  <h4>Vault Ratio</h4>{" "}
                  <OverlayTrigger
                    key="top"
                    placement="top"
                    overlay={
                      <Tooltip id="tooltip-top">
                        Ratio must be {`>`} {minRatio}% or you will be
                        liquidated
                      </Tooltip>
                    }
                  >
                    <Button variant="dark">?</Button>
                  </OverlayTrigger>
                  <div>
                    <div className="amount">
                      <h4 className=" ml-2 number neon-blue">
                        <NumberFormat
                          className="number"
                          value={vaultRatio}
                          displayType="text"
                          thousandSeparator
                          decimalScale={0}
                          suffix="%"
                        />
                      </h4>
                    </div>
                    <p className={`number ${vaultStatus}`}>
                      {vaultStatus.toUpperCase()}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="form-card">
              <Card>
                <div className="info">
                  <h4>Staked Collateral</h4>
                  <div>
                    <div className="amount">
                      {(() => {
                        switch (selectedVault) {
                          case "WETH":
                            return <Icon alt={"WETH.e"} src={eth} />;
                          case "DAI":
                            return <Icon alt={"DAI.e"} src={dai} />;
                          default:
                            return <Icon alt={"AVAX"} src={avax} />;
                        }
                      })()}
                      <h4 className=" ml-2 number neon-dark-blue">
                        <NumberFormat
                          className="number"
                          value={vaultCollateral}
                          displayType="text"
                          thousandSeparator
                          decimalScale={2}
                        />
                      </h4>
                    </div>
                    <p className="number">
                      <NumberFormat
                        className="number"
                        value={vaultCollateralUSD}
                        displayType="text"
                        thousandSeparator
                        prefix="$"
                        decimalScale={
                          parseFloat(vaultCollateralUSD) > 1000 ? 0 : 2
                        }
                      />
                    </p>
                  </div>
                </div>
                <Form>
                  <Form.Group>
                    <Form.Label>Add Collateral</Form.Label>
                    <Form.Label className="max">
                      <a href="/" className="number" onClick={maxAddCollateral}>
                        MAX
                      </a>
                    </Form.Label>
                    <InputGroup>
                      <Form.Control
                        type="number"
                        placeholder=""
                        className="neon-green"
                        value={addCollateralTxt}
                        onChange={onChangeAddCollateral}
                      />
                      <InputGroup.Append>
                        <Button className="neon-green" onClick={addCollateral}>
                          +
                        </Button>
                      </InputGroup.Append>
                    </InputGroup>
                    <Form.Text className="text-muted">
                      <NumberFormat
                        className="number"
                        value={addCollateralUSD}
                        displayType="text"
                        thousandSeparator
                        prefix="$"
                        decimalScale={2}
                      />
                    </Form.Text>
                  </Form.Group>
                  <Form.Group className="remove">
                    <Form.Label>Remove Collateral</Form.Label>
                    <Form.Label className="max">
                      <a
                        href="/"
                        className="number orange"
                        onClick={safeRemoveCollateral}
                      >
                        MAX SAFE
                      </a>
                    </Form.Label>
                    <InputGroup>
                      <Form.Control
                        type="number"
                        placeholder=""
                        className="neon-orange"
                        value={removeCollateralTxt}
                        onChange={onChangeRemoveCollateral}
                      />
                      <InputGroup.Append>
                        <Button
                          className="neon-orange"
                          onClick={removeCollateral}
                        >
                          -
                        </Button>
                      </InputGroup.Append>
                    </InputGroup>
                    <Form.Text className="text-muted">
                      <NumberFormat
                        className="number"
                        value={removeCollateralUSD}
                        displayType="text"
                        thousandSeparator
                        prefix="$"
                        decimalScale={2}
                      />
                    </Form.Text>
                  </Form.Group>
                </Form>
              </Card>
            </div>
            <div className="form-card">
              <Card>
                <div className="info">
                  <h4>Vault Debt</h4>
                  <div>
                    <div className="amount">
                      <Icon alt="dVIX" src={dvix} />
                      <h4 className=" ml-2 number neon-pink">
                        <NumberFormat
                          className="number"
                          value={vaultDebt}
                          displayType="text"
                          thousandSeparator
                          decimalScale={2}
                        />
                      </h4>
                    </div>
                    <p className="number">
                      <NumberFormat
                        className="number"
                        value={vaultDebtUSD}
                        displayType="text"
                        thousandSeparator
                        prefix="$"
                        decimalScale={parseFloat(vaultDebtUSD) > 1000 ? 0 : 2}
                      />
                    </p>
                  </div>
                </div>
                <Form>
                  <Form.Group>
                    <Form.Label>Mint dVIX</Form.Label>
                    <Form.Label className="max">
                      <a href="/" className="number" onClick={safeMintDVIX}>
                        MAX SAFE
                      </a>
                    </Form.Label>
                    <InputGroup>
                      <Form.Control
                        type="number"
                        placeholder=""
                        className="neon-green"
                        value={mintTxt}
                        onChange={onChangeMint}
                      />
                      <InputGroup.Append>
                        <Button className="neon-green" onClick={mintDVIX}>
                          +
                        </Button>
                      </InputGroup.Append>
                    </InputGroup>
                    <Form.Text className="text-muted">
                      <NumberFormat
                        className="number"
                        value={mintUSD}
                        displayType="text"
                        thousandSeparator
                        prefix="$"
                        decimalScale={2}
                      />
                    </Form.Text>
                  </Form.Group>
                  <Form.Group className="remove">
                    <Form.Label>Burn DVIX</Form.Label>
                    <Form.Label className="max">
                      <a
                        href="/"
                        className="number orange"
                        onClick={maxBurnDVIX}
                      >
                        MAX
                      </a>
                    </Form.Label>
                    <InputGroup>
                      <Form.Control
                        type="number"
                        placeholder=""
                        className="neon-orange"
                        value={burnTxt}
                        onChange={onChangeBurn}
                      />
                      <InputGroup.Append>
                        <Button className="neon-orange" onClick={burnDVIX}>
                          -
                        </Button>
                      </InputGroup.Append>
                    </InputGroup>
                    <Form.Text className="text-muted">
                      <NumberFormat
                        className="number"
                        value={burnUSD}
                        displayType="text"
                        thousandSeparator
                        prefix="$"
                        decimalScale={2}
                      />
                    </Form.Text>
                    <Form.Text className="text-muted burn-fee">
                      Burn Fee:{" "}
                      <NumberFormat
                        className="number neon-pink"
                        value={burnFee}
                        displayType="text"
                        thousandSeparator
                        decimalScale={4}
                      />{" "}
                      AVAX
                    </Form.Text>
                  </Form.Group>
                </Form>
              </Card>
            </div>
          </div>
        </>
      ) : (
        <div className="pre-actions">
          <h5 className="action-title">{title}</h5>
          <p>{text}</p>
          <Button variant="pink neon-pink" onClick={action}>
            {title}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Details;
