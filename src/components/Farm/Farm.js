import React, { useContext, useState, useEffect } from "react";
import "./farm.css";
import { Link } from "react-router-dom";
import moment from "moment";
import dai from "../../assets/images/dai.png";
import eth from "../../assets/images/eth.png";
import avix from "../../assets/images/avix_logo_new.png";
import dvix from "../../assets/images/dvix_logo_new.png";
import avax from "../../assets/images/avax.png";
import { ThemeContext } from "../../state/ThemeContext";
import SignerContext from "../../state/SignerContext";
import TokensContext from "../../state/TokensContext";
import VaultsContext from "../../state/VaultsContext";
import OraclesContext from "../../state/OraclesContext";
import GovernanceContext from "../../state/GovernanceContext";
import RewardsContext from "../../state/RewardsContext";
import {
  notifyUser,
  errorNotification,
  tsToDateString,
  getPriceInUSDFromPair,
} from "../../utils/utils";
import { ethers } from "ethers";
import NumberFormat from "react-number-format";
import { useQuery, gql } from "@apollo/client";
import Spinner from "../../components/Layout/Spinner";
import { Stake } from "./Stake";

const Farm = () => {
  const { isDarkMode } = useContext(ThemeContext);

  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [avaxRewards, setAvaxRewards] = useState("0");
  const [ethRewards, setEthRewards] = useState("0");
  const [daiRewards, setDaiRewards] = useState("0");
  const [avaxPoolRewards, setAvaxPoolRewards] = useState("0.0");
  const [ethPoolRewards, setEthPoolRewards] = useState("0.0");
  const [daiPoolRewards, setDaiPoolRewards] = useState("0.0");
  const [avixPoolRewards, setAvixPoolRewards] = useState("0.0");
  const [vavaxPoolRewards, setVAvaxPoolRewards] = useState("0.0");
  const [vethPoolRewards, setVEthPoolRewards] = useState("0.0");
  const [vdaiPoolRewards, setVDaiPoolRewards] = useState("0.0");
  const [vavixPoolRewards, setVAvixPoolRewards] = useState("0.0");
  const [avaxDebt, setAvaxDebt] = useState("0.0");
  const [ethDebt, setEthDebt] = useState("0.0");
  const [daiDebt, setDaiDebt] = useState("0.0");
  const [avaxPoolStake, setAvaxPoolStake] = useState("0.0");
  const [ethPoolStake, setEthPoolStake] = useState("0.0");
  const [daiPoolStake, setDaiPoolStake] = useState("0.0");
  const [avixPoolStake, setAvixPoolStake] = useState("0.0");
  const [avaxPoolBalance, setAvaxPoolBalance] = useState("0.0");
  const [ethPoolBalance, setEthPoolBalance] = useState("0.0");
  const [daiPoolBalance, setDaiPoolBalance] = useState("0.0");
  const [avixPoolBalance, setAvixPoolBalance] = useState("0.0");
  const [avaxVestingEndTime, setAvaxVestingEndTime] = useState(0);
  const [ethVestingEndTime, setEthVestingEndTime] = useState(0);
  const [daiVestingEndTime, setDaiVestingEndTime] = useState(0);
  const [avixVestingEndTime, setAvixVestingEndTime] = useState(0);
  const signer = useContext(SignerContext);

  const tokens = useContext(TokensContext);
  const vaults = useContext(VaultsContext);
  const oracles = useContext(OraclesContext);
  const governance = useContext(GovernanceContext);
  const rewards = useContext(RewardsContext);
  const [stakeShow, setStakeShow] = useState(false);
  const [stakeBalance, setStakeBalance] = useState("0");
  const [selectedPoolTitle, setSelectedPoolTitle] = useState("");
  const [selectedPool, setSelectedPool] = useState();
  const [selectedPoolToken, setSelectedPoolToken] = useState();
  // APY
  const [avaxVaultAPY, setAvaxVaultAPY] = useState("0");
  const [ethVaultAPY, setEthVaultAPY] = useState("0");
  const [daiVaultAPY, setDaiVaultAPY] = useState("0");
  const [avaxPoolAPY, setAvaxPoolAPY] = useState("0");
  const [ethPoolAPY, setEthPoolAPY] = useState("0");
  const [daiPoolAPY, setDaiPoolAPY] = useState("0");
  const [avixPoolAPY, setAvixPoolAPY] = useState("0");

  const oneYear = 60 * 60 * 24 * 365;

  const lpURL = process.env.REACT_APP_LP_URL;

  const USER_VAULTS = gql`
    query getVault($owner: String!) {
      vaults(where: { owner: $owner }) {
        id
        vaultId
        owner
        collateral
        debt
        currentRatio
        address
        owner
      }
    }
  `;

  async function getAPYFromVaultRewards(
    totalDvixDebt,
    rate,
    avixPrice,
    dvixPrice
  ) {
    const apy =
      ((rate * oneYear * avixPrice) / (dvixPrice * totalDvixDebt)) * 100;
    return apy.toString();
  }

  async function getAPYFromLPRewards(
    rate,
    LPsStaked,
    reserves,
    totalSupplyPool,
    avixPrice,
    avaxPrice
  ) {
    const token0Price = await getPriceInUSDFromPair(
      reserves[0],
      reserves[1],
      avaxPrice
    );
    const valuePerLPToken =
      (token0Price * reserves[0] + avaxPrice * reserves[1]) / totalSupplyPool;
    const apy =
      ((rate * oneYear * avixPrice) / (valuePerLPToken * LPsStaked)) * 100;

    if (Number.isNaN(apy)) {
      return "0";
    }

    return apy.toString();
  }

  async function setDebt(vaultData) {
    // TODO: fix if no graph
    await vaultData.vaults.forEach((v) => {
      switch (v.address.toLowerCase()) {
        case vaults?.avaxVault?.address.toLowerCase():
          setAvaxDebt(ethers.utils.formatEther(v.debt));
          break;
        case vaults?.wethVault?.address.toLowerCase():
          setEthDebt(ethers.utils.formatEther(v.debt));
          break;
        case vaults?.daiVault?.address.toLowerCase():
          setDaiDebt(ethers.utils.formatEther(v.debt));
          break;
        default:
          break;
      }
    });
  }

  const { data, refetch } = useQuery(USER_VAULTS, {
    variables: { owner: address },
    fetchPolicy: "no-cache",
    notifyOnNetworkStatusChange: true,
    onCompleted: () => {
      setDebt(data);
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

  useEffect(() => {
    const loadAddress = async () => {
      if (
        tokens.dvixToken &&
        tokens.wethPoolToken &&
        oracles.dvixOracle &&
        tokens.avixToken &&
        oracles.wethOracle &&
        governance.governorAlpha &&
        governance.timelock &&
        rewards.wethReward &&
        rewards.daiReward &&
        rewards.wethPoolReward
      ) {
        // Batch Calls
        const avaxOracleCall = oracles.avaxOracleRead?.getLatestAnswer();
        const dvixOracleCall = oracles.dvixOracleRead?.getLatestAnswer();

        const totalDvixDebtAvaxCall = await rewards.avaxRewardRead?.totalSupply();
        const rateAvaxCall = await rewards.avaxRewardRead?.rewardRate();

        const totalDvixDebtWethCall = await rewards.wethRewardRead?.totalSupply();
        const rateWethCall = await rewards.wethRewardRead?.rewardRate();

        const totalDvixDebtDaihCall = await rewards.daiRewardRead?.totalSupply();
        const rateDaiCall = await rewards.daiRewardRead?.rewardRate();

        const reservesAvaxPoolCall = await tokens.avaxPoolTokenRead?.getReserves();
        const totalSupplyAvaxPoolCall = await tokens.avaxPoolTokenRead?.totalSupply();
        const rateAvaxPoolCall = await rewards.avaxPoolRewardRead?.rewardRate();
        const avaxLPsStakedCall = await rewards.avaxPoolRewardRead?.totalSupply();

        const reservesEthPoolCall = await tokens.wethPoolTokenRead?.getReserves();
        const totalSupplyEthPoolCall = await tokens.wethPoolTokenRead?.totalSupply();
        const rateEthPoolCall = await rewards.wethPoolRewardRead?.rewardRate();
        const wethLPsStakedCall = await rewards.wethPoolRewardRead?.totalSupply();

        const reservesDaiPoolCall = await tokens.daiPoolTokenRead?.getReserves();
        const totalSupplyDaiPoolCall = await tokens.daiPoolTokenRead?.totalSupply();
        const rateDaiPoolCall = await rewards.daiPoolRewardRead?.rewardRate();
        const daiLPsStakedCall = await rewards.daiPoolRewardRead?.totalSupply();

        const reservesAvixPoolCall = await tokens.avixPoolTokenRead?.getReserves();
        const totalSupplyAvixPoolCall = await tokens.avixPoolTokenRead?.totalSupply();
        const rateAvixPoolCall = await rewards.avixPoolRewardRead?.rewardRate();
        const avixLPsStakedCall = await rewards.avixPoolRewardRead?.totalSupply();

        const avaxPoolVestingRatioCall = await rewards.avaxPoolRewardRead?.vestingRatio();
        const avaxPoolVestingTimeCall = await rewards.avaxPoolRewardRead?.vestingEnd();

        const wethPoolVestingRatioCall = await rewards.wethPoolRewardRead?.vestingRatio();
        const wethPoolVestingTimeCall = await rewards.wethPoolRewardRead?.vestingEnd();

        const daiPoolVestingRatioCall = await rewards.daiPoolRewardRead?.vestingRatio();
        const daiPoolVestingTimeCall = await rewards.daiPoolRewardRead?.vestingEnd();

        const avixVestingRatioCall = await rewards.avixPoolRewardRead?.vestingRatio();
        const avixVestingTimeCall = await rewards.avixPoolRewardRead?.vestingEnd();

        const [
          avaxOraclePrice,
          dvixPrice,

          totalDvixDebtAvax,
          rateAvax,

          totalDvixDebtWeth,
          rateWeth,

          totalDvixDebtDai,
          rateDai,

          reservesAvaxPool,
          totalSupplyAvaxPool,
          rateAvaxPool,
          avaxLPsStaked,

          reservesEthPool,
          totalSupplyEthPool,
          rateEthPool,
          wethLPsStaked,

          reservesDaiPool,
          totalSupplyDaiPool,
          rateDaiPool,
          daiLPsStaked,

          reservesAvixPool,
          totalSupplyAvixPool,
          rateAvixPool,
          avixLPsStaked,

          avaxPoolVestingRatio,
          avaxPoolVestingTime,

          wethPoolVestingRatio,
          wethPoolVestingTime,

          daiPoolVestingRatio,
          daiPoolVestingTime,

          avixVestingRatio,
          avixVestingTime,
        ] = await signer.ethcallProvider?.all([
          avaxOracleCall,
          dvixOracleCall,

          totalDvixDebtAvaxCall,
          rateAvaxCall,

          totalDvixDebtWethCall,
          rateWethCall,

          totalDvixDebtDaihCall,
          rateDaiCall,

          reservesAvaxPoolCall,
          totalSupplyAvaxPoolCall,
          rateAvaxPoolCall,
          avaxLPsStakedCall,

          reservesEthPoolCall,
          totalSupplyEthPoolCall,
          rateEthPoolCall,
          wethLPsStakedCall,

          reservesDaiPoolCall,
          totalSupplyDaiPoolCall,
          rateDaiPoolCall,
          daiLPsStakedCall,

          reservesAvixPoolCall,
          totalSupplyAvixPoolCall,
          rateAvixPoolCall,
          avixLPsStakedCall,

          avaxPoolVestingRatioCall,
          avaxPoolVestingTimeCall,

          wethPoolVestingRatioCall,
          wethPoolVestingTimeCall,

          daiPoolVestingRatioCall,
          daiPoolVestingTimeCall,

          avixVestingRatioCall,
          avixVestingTimeCall,
        ]);

        const currentPriceDVIX = ethers.utils.formatEther(dvixPrice);
        const currentPriceAVAX = ethers.utils.formatEther(
          avaxOraclePrice.mul(10000000000)
        );

        // REACT_APP_POOL_AVIX
        const currentPriceAVIX = await getPriceInUSDFromPair(
          reservesAvixPool[0],
          reservesAvixPool[1],
          parseFloat(currentPriceAVAX)
        );

        // AVAX VAULT APY
        setAvaxVaultAPY(
          await getAPYFromVaultRewards(
            totalDvixDebtAvax,
            rateAvax,
            currentPriceAVIX,
            parseFloat(currentPriceDVIX)
          )
        );

        // WETH VAULT APY
        setEthVaultAPY(
          await getAPYFromVaultRewards(
            totalDvixDebtWeth,
            rateWeth,
            currentPriceAVIX,
            parseFloat(currentPriceDVIX)
          )
        );

        // DAI VAULT APY
        setDaiVaultAPY(
          await getAPYFromVaultRewards(
            totalDvixDebtDai,
            rateDai,
            currentPriceAVIX,
            parseFloat(currentPriceDVIX)
          )
        );

        // AVAX Pool APY
        setAvaxPoolAPY(
          await getAPYFromLPRewards(
            rateAvaxPool,
            avaxLPsStaked,
            reservesAvaxPool,
            totalSupplyAvaxPool,
            currentPriceAVIX,
            parseFloat(currentPriceAVAX)
          )
        );

        // ETH Pool APY
        setEthPoolAPY(
          await getAPYFromLPRewards(
            rateEthPool,
            wethLPsStaked,
            reservesEthPool,
            totalSupplyEthPool,
            currentPriceAVIX,
            parseFloat(currentPriceAVAX)
          )
        );

        // DAI Pool APY
        setDaiPoolAPY(
          await getAPYFromLPRewards(
            rateDaiPool,
            daiLPsStaked,
            reservesDaiPool,
            totalSupplyDaiPool,
            currentPriceAVIX,
            parseFloat(currentPriceAVAX)
          )
        );

        // AVIX Pool APY
        setAvixPoolAPY(
          await getAPYFromLPRewards(
            rateAvixPool,
            avixLPsStaked,
            reservesAvixPool,
            totalSupplyAvixPool,
            currentPriceAVIX,
            parseFloat(currentPriceAVAX)
          )
        );

        setAvaxVestingEndTime(avaxPoolVestingTime);
        setEthVestingEndTime(wethPoolVestingTime);
        setDaiVestingEndTime(daiPoolVestingTime);
        setAvixVestingEndTime(avixVestingTime);

        if (signer.signer) {
          const currentAddress = await signer.signer.getAddress();
          setAddress(currentAddress);

          const currentAvaxRewardCall = await rewards?.avaxRewardRead?.earned(
            currentAddress
          );
          const currentEthRewardCall = await rewards?.wethRewardRead?.earned(
            currentAddress
          );
          const currentDaiRewardCall = await rewards?.daiRewardRead?.earned(
            currentAddress
          );

          // AVAX
          const currentAvaxPoolRewardCall = await rewards.avaxPoolRewardRead?.earned(
            currentAddress
          );
          const currentVAvaxPoolRewardCall = await rewards.avaxPoolRewardRead?.vestingAmounts(
            currentAddress
          );
          const currentAvaxPoolStakeCall = await rewards.avaxPoolRewardRead?.balanceOf(
            currentAddress
          );
          const currentAvaxPoolBalanceCall = await tokens.avaxPoolTokenRead?.balanceOf(
            currentAddress
          );

          // WETH
          const currentEthPoolRewardCall = await rewards.wethPoolRewardRead?.earned(
            currentAddress
          );
          const currentVEthPoolRewardCall = await rewards.wethPoolRewardRead?.vestingAmounts(
            currentAddress
          );
          const currentEthPoolStakeCall = await rewards.wethPoolRewardRead?.balanceOf(
            currentAddress
          );
          const currentEthPoolBalanceCall = await tokens.wethPoolTokenRead?.balanceOf(
            currentAddress
          );

          // DAI
          const currentDaiPoolRewardCall = await rewards.daiPoolRewardRead?.earned(
            currentAddress
          );
          const currentVDaiPoolRewardCall = await rewards.daiPoolRewardRead?.vestingAmounts(
            currentAddress
          );
          const currentDaiPoolStakeCall = await rewards.daiPoolRewardRead?.balanceOf(
            currentAddress
          );
          const currentDaiPoolBalanceCall = await tokens.daiPoolTokenRead?.balanceOf(
            currentAddress
          );

          // aVIX
          const currentAvixPoolRewardCall = await rewards.avixPoolRewardRead?.earned(
            currentAddress
          );
          const currentVAvixPoolRewardCall = await rewards.avixPoolRewardRead?.vestingAmounts(
            currentAddress
          );
          const currentAvixPoolStakeCall = await rewards.avixPoolRewardRead?.balanceOf(
            currentAddress
          );
          const currentAvixPoolBalanceCall = await tokens.avixPoolTokenRead?.balanceOf(
            currentAddress
          );

          const [
            currentAvaxReward,
            currentEthReward,
            currentDaiReward,

            currentAvaxPoolReward,
            currentVAvaxPoolReward,
            currentAvaxPoolStake,
            currentAvaxPoolBalance,

            currentEthPoolReward,
            currentVEthPoolReward,
            currentEthPoolStake,
            currentEthPoolBalance,

            currentDaiPoolReward,
            currentVDaiPoolReward,
            currentDaiPoolStake,
            currentDaiPoolBalance,

            currentAvixPoolReward,
            currentVAvixPoolReward,
            currentAvixPoolStake,
            currentAvixPoolBalance,
          ] = await signer.ethcallProvider?.all([
            currentAvaxRewardCall,
            currentEthRewardCall,
            currentDaiRewardCall,

            currentAvaxPoolRewardCall,
            currentVAvaxPoolRewardCall,
            currentAvaxPoolStakeCall,
            currentAvaxPoolBalanceCall,

            currentEthPoolRewardCall,
            currentVEthPoolRewardCall,
            currentEthPoolStakeCall,
            currentEthPoolBalanceCall,

            currentDaiPoolRewardCall,
            currentVDaiPoolRewardCall,
            currentDaiPoolStakeCall,
            currentDaiPoolBalanceCall,

            currentAvixPoolRewardCall,
            currentVAvixPoolRewardCall,
            currentAvixPoolStakeCall,
            currentAvixPoolBalanceCall,
          ]);

          setAvaxRewards(ethers.utils.formatEther(currentAvaxReward));
          setEthRewards(ethers.utils.formatEther(currentEthReward));
          setDaiRewards(ethers.utils.formatEther(currentDaiReward));

          // AVAX
          setAvaxPoolRewards(
            ethers.utils.formatEther(
              currentAvaxPoolReward.mul(100 - avaxPoolVestingRatio).div(100)
            )
          );
          setVAvaxPoolRewards(
            ethers.utils.formatEther(
              currentVAvaxPoolReward.add(
                currentAvaxPoolReward.mul(avaxPoolVestingRatio).div(100)
              )
            )
          );
          setAvaxPoolStake(ethers.utils.formatEther(currentAvaxPoolStake));
          setAvaxPoolBalance(ethers.utils.formatEther(currentAvaxPoolBalance));

          // WETH
          setEthPoolRewards(
            ethers.utils.formatEther(
              currentEthPoolReward.mul(100 - wethPoolVestingRatio).div(100)
            )
          );
          setVEthPoolRewards(
            ethers.utils.formatEther(
              currentVEthPoolReward.add(
                currentEthPoolReward.mul(wethPoolVestingRatio).div(100)
              )
            )
          );
          setEthPoolStake(ethers.utils.formatEther(currentEthPoolStake));
          setEthPoolBalance(ethers.utils.formatEther(currentEthPoolBalance));

          // DAI
          setDaiPoolRewards(
            ethers.utils.formatEther(
              currentDaiPoolReward.mul(100 - daiPoolVestingRatio).div(100)
            )
          );
          setVDaiPoolRewards(
            ethers.utils.formatEther(
              currentVDaiPoolReward.add(
                currentDaiPoolReward.mul(daiPoolVestingRatio).div(100)
              )
            )
          );
          setDaiPoolStake(ethers.utils.formatEther(currentDaiPoolStake));
          setDaiPoolBalance(ethers.utils.formatEther(currentDaiPoolBalance));

          // aVIX
          setAvixPoolRewards(
            ethers.utils.formatEther(
              currentAvixPoolReward.mul(100 - avixVestingRatio).div(100)
            )
          );
          setVAvixPoolRewards(
            ethers.utils.formatEther(
              currentVAvixPoolReward.add(
                currentAvixPoolReward.mul(avixVestingRatio).div(100)
              )
            )
          );
          setAvixPoolStake(ethers.utils.formatEther(currentAvixPoolStake));
          setAvixPoolBalance(ethers.utils.formatEther(currentAvixPoolBalance));
        }
      }
      setIsLoading(false);
    };

    loadAddress();
    // eslint-disable-next-line
  }, [data]);

  if (isLoading) {
    return <Spinner />;
  }

  const claimRewards = async (vaultType) => {
    try {
      let tx;

      switch (vaultType) {
        case "AVAX":
          tx = await rewards?.avaxReward?.getReward();
          break;
        case "WETH":
          tx = await rewards?.wethReward?.getReward();
          break;
        case "DAI":
          tx = await rewards?.daiReward?.getReward();
          break;
        case "AVAXPOOL":
          tx = await rewards?.avaxPoolReward?.getReward();
          break;
        case "WETHPOOL":
          tx = await rewards?.wethPoolReward?.getReward();
          break;
        case "DAIPOOL":
          tx = await rewards?.daiPoolReward?.getReward();
          break;
        case "AVIXPOOL":
          tx = await rewards?.avixPoolReward?.getReward();
          break;
        default:
          tx = await rewards?.avaxReward?.getReward();
          break;
      }

      notifyUser(tx, refresh);
    } catch (error) {
      if (error.code === 4001) {
        errorNotification("Transaction rejected");
      } else {
        errorNotification("Insufficient funds to stake");
      }
    }
  };

  const exitRewards = async (vaultType) => {
    try {
      let tx;

      switch (vaultType) {
        case "AVAXPOOL":
          tx = await rewards?.avaxPoolReward?.exit();
          break;
        case "WETHPOOL":
          tx = await rewards?.wethPoolReward?.exit();
          break;
        case "DAIPOOL":
          tx = await rewards?.daiPoolReward?.exit();
          break;
        case "AVIXPOOL":
          tx = await rewards?.avixPoolReward?.exit();
          break;
        default:
          tx = await rewards?.avaxPoolReward?.exit();
          break;
      }

      notifyUser(tx, refresh);
    } catch (error) {
      if (error.code === 4001) {
        errorNotification("Transaction rejected");
      } else {
        errorNotification("Insufficient funds to exit");
      }
    }
  };

  const EarlyCard = ({
    hasE,
    icon,
    vaultName,
    myCurrentMint,
    myCurrentReward,
    estAPY,
  }) => {
    return (
      <div
        className={`${
          !isDarkMode
            ? "trade-card-container early-card-container"
            : "trade-card-container-dark-mode early-card-container"
        }`}
      >
        <div className="trade-card-icons">
          <img
            src={icon}
            width="42"
            height="42"
            alt={vaultName}
            className="trade-icon-1"
            style={{
              border: "none",
            }}
          />
        </div>
        <h3 className="trade-card-title">
          <Link
            to={vaultName === "AVAX" ? "/" : `/${vaultName}`}
            className="trade-card-analytics-link farm-link"
            style={{ fontWeight: "bold", color: isDarkMode ? "#fff" : "#000" }}
          >
            {vaultName}
            {hasE && ".e"} Vault
          </Link>
        </h3>
        <br />
        <p className="trade-card-dex">
          <strong>My Current Mint:</strong> {myCurrentMint} dVIX
        </p>
        <p className="trade-card-trading-volume">
          <strong>My Current Reward:</strong> {myCurrentReward} aVIX
        </p>
        <p className="trade-card-dex">
          <strong>Estimated APY:</strong> {estAPY}%
        </p>
        <div className="trading-buttons">
          <button className="btn regular-btn border-rad-05 mr-3" type="button">
            <Link
              to={vaultName === "AVAX" ? "/" : `/${vaultName}`}
              className="trade-card-analytics-link"
              style={{ color: "white", fontWeight: "bold" }}
            >
              Mint
            </Link>
          </button>
          <button
            className="btn regular-btn border-rad-05"
            type="button"
            onClick={() => {
              claimRewards(vaultName);
            }}
            style={{ fontWeight: "bold" }}
          >
            Claim
          </button>
        </div>
      </div>
    );
  };

  const MiningCard = ({
    icon1,
    icon2,
    tradingPair,
    dex,
    myBalance,
    stakedBalance,
    claimableReward,
    lockedReward,
    lockedUntil,
    estAPY,
    addLiquidityLink,
    stakeFn,
    claimString,
    exitString,
  }) => {
    return (
      <div
        className={`${
          !isDarkMode
            ? "trade-card-container mining-card-container"
            : "trade-card-container-dark-mode mining-card-container"
        }`}
      >
        <div className="trade-card-icons">
          <img
            src={icon1}
            width="42"
            height="42"
            alt={tradingPair && tradingPair.split("/")[0]}
            className="trade-icon-1"
          />
          <img
            src={icon2}
            width="42"
            height="42"
            alt={tradingPair && tradingPair.split("/")[1]}
            className="trade-icon-2"
            style={{
              border: "none",
            }}
          />
        </div>
        <h3 className="trade-card-title">
          <a
            target="_blank"
            rel="noreferrer"
            className="trade-card-analytics-link farm-link"
            style={{ fontWeight: "bold", color: isDarkMode ? "#fff" : "#000" }}
            href={`${lpURL}add/${addLiquidityLink}/${
              tradingPair.includes("AVAX") && "AVAX"
            }`}
          >
            {tradingPair + " Pool"}
          </a>
        </h3>
        <br />
        <p className="trade-card-dex">
          <strong>DEX:</strong> {dex}
        </p>
        <p className="trade-card-trading-volume">
          <strong>My Balance:</strong> {myBalance}
        </p>
        <p className="trade-card-trading-volume">
          <strong>Staked Balance:</strong> {stakedBalance}
        </p>
        <p className="trade-card-trading-volume">
          <strong>Claimable Rewards:</strong> {claimableReward} aVIX
        </p>
        <p className="trade-card-trading-volume">
          <strong>Locked Rewards:</strong> {lockedReward} aVIX
        </p>
        <p className="trade-card-trading-volume">
          <strong>Locked Until:</strong> {moment(lockedUntil).format("ll")}
        </p>
        <p className="trade-card-trading-volume">
          <strong>Estimated APY:</strong> {estAPY}%
        </p>
        <div className="trading-buttons">
          <button
            className="btn regular-btn border-rad-05 mr-3"
            type="button"
            onClick={stakeFn}
            style={{ fontWeight: "bold" }}
          >
            Stake
          </button>
          <button
            className="btn regular-btn border-rad-05 mr-3"
            type="button"
            onClick={() => {
              claimRewards(claimString);
            }}
            style={{ fontWeight: "bold" }}
          >
            Claim
          </button>
          <button
            className="btn regular-btn border-rad-05"
            type="button"
            onClick={() => {
              exitRewards(exitString);
            }}
            style={{ fontWeight: "bold" }}
          >
            Exit
          </button>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`${
        !isDarkMode ? "trade-container" : "trade-container-dark-mode"
      } mb-5`}
    >
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />

      {/* @NOTE: DELETE EARLY ADOPTER REWARDS PART 3 MONTHS AFTER THE LAUNCH! */}
      <h1
        className="text-center bold mb-5 mt-5"
        style={{ fontSize: "2.75rem" }}
      >
        Early Adopter (Minting) Rewards
      </h1>

      <p
        className={`text-mute text-center ml-5 mr-5 mb-5 ${
          isDarkMode ? "early-adopter-note-dark-mode" : "early-adopter-note"
        }`}
      >
        <strong>
          Early adopter rewards are issued over the 3 month period after the
          launch of Avix Finance,
        </strong>{" "}
        for a total of 900,000 aVIX (9% of the max supply). This reward is{" "}
        <strong>
          split across the dVIX minters (debtors), with 100% of the reward being
          immediately available.
        </strong>{" "}
        The main aim of the Early Adopter Rewards program is to bootstrap the{" "}
        <strong>Avix decentralized governance system.</strong>
      </p>

      <br />
      <br />

      <div className="trade-grid">
        <EarlyCard
          icon={avax}
          vaultName="AVAX"
          myCurrentMint={
            <NumberFormat
              className=""
              value={avaxDebt}
              displayType="text"
              thousandSeparator
              prefix=""
              decimalScale={2}
            />
          }
          myCurrentReward={
            <NumberFormat
              className=""
              value={avaxRewards}
              displayType="text"
              thousandSeparator
              prefix=""
              decimalScale={2}
            />
          }
          estAPY={
            <NumberFormat
              className=""
              value={avaxVaultAPY}
              displayType="text"
              thousandSeparator
              prefix=""
              decimalScale={0}
            />
          } // Set it to "Inactive" after early adopter rewards expire (30 days after the launch)
        />
        <EarlyCard
          hasE
          icon={eth}
          vaultName="WETH"
          myCurrentMint={
            <NumberFormat
              className=""
              value={ethDebt}
              displayType="text"
              thousandSeparator
              prefix=""
              decimalScale={2}
            />
          }
          myCurrentReward={
            <NumberFormat
              className=""
              value={ethRewards}
              displayType="text"
              thousandSeparator
              prefix=""
              decimalScale={2}
            />
          }
          estAPY={
            <NumberFormat
              className=""
              value={ethVaultAPY}
              displayType="text"
              thousandSeparator
              prefix=""
              decimalScale={0}
            />
          } // Set it to "Inactive" after early adopter rewards expire (30 days after the launch)
        />
        {/* <EarlyCard
          icon={wbtc}
          vaultName="WBTC Vault"
          myCurrentMint={0.0}
          myCurrentReward={0.0}
          estAPY={255.39}
        /> */}
        <EarlyCard
          hasE
          icon={dai}
          vaultName="DAI"
          myCurrentMint={
            <NumberFormat
              className=""
              value={daiDebt}
              displayType="text"
              thousandSeparator
              prefix=""
              decimalScale={2}
            />
          }
          myCurrentReward={
            <NumberFormat
              className=""
              value={daiRewards}
              displayType="text"
              thousandSeparator
              prefix=""
              decimalScale={2}
            />
          }
          estAPY={
            <NumberFormat
              className=""
              value={daiVaultAPY}
              displayType="text"
              thousandSeparator
              prefix=""
              decimalScale={0}
            />
          } // Set it to "Inactive" after early adopter rewards expire (30 days after the launch)
        />
        {/* <EarlyCard
          icon={usdt}
          vaultName="USDT Vault"
          myCurrentMint={0.0}
          myCurrentReward={0.0}
          estAPY={255.39} 
        /> */}
      </div>

      <br />
      <br />

      {/* @NOTE: DELETE LIQUIDITY MINING REWARDS PART & THE ENTIRE FARM
      TAB 4 YEARS AFTER THE LAUNCH! */}
      <h1 className="text-center bold mb-5 mt-5" style={{ fontSize: "2.5rem" }}>
        Liquidity Rewards
      </h1>

      <p
        className={`text-mute text-center ml-5 mr-5 mb-5 ${
          isDarkMode ? "early-adopter-note-dark-mode" : "early-adopter-note"
        }`}
      >
        {" "}
        You can <strong>earn aVIX governance tokens</strong> by staking your LP
        tokens for any of the pairs listed below.{" "}
        <strong>Claimable Rewards</strong> (20% of total rewards) are available
        to claim immediately. <strong>Locked Rewards</strong> (80% of total
        rewards) are unlocked 6 months after the start of the pool. To learn
        more about how aVIX rewards are distributed, check out{" "}
        <a
          target="_blank"
          rel="noreferrer"
          href="https://docs.avix.finance/tokenomics/avix-distribution"
          style={{ color: "#e84142" }}
          className="doc-link"
        >
          <strong>our official documentation.</strong>
        </a>
      </p>

      <br />
      <br />

      <div className="trade-grid">
        <MiningCard
          addLiquidityLink={"0x..."}
          stakeFn={() => {
            setStakeBalance(avixPoolBalance);
            setSelectedPoolTitle("Trader Joe aVIX/AVAX Pool");

            if (rewards.avixPoolReward) {
              setSelectedPool(rewards.avixPoolReward);
              setSelectedPoolToken(tokens.avixPoolToken);
            }

            setStakeShow(true);
          }}
          claimString="AVIXPOOL"
          exitString="AVIXPOOL"
          icon1={avix}
          icon2={avax}
          tradingPair="aVIX / AVAX"
          dex="Trader Joe"
          myBalance={
            <NumberFormat
              className=""
              value={avixPoolBalance}
              displayType="text"
              thousandSeparator
              prefix=""
              decimalScale={2}
            />
          }
          stakedBalance={
            <NumberFormat
              className=""
              value={avixPoolStake}
              displayType="text"
              thousandSeparator
              prefix=""
              decimalScale={2}
            />
          }
          claimableReward={
            <NumberFormat
              className=""
              value={avixPoolRewards}
              displayType="text"
              thousandSeparator
              prefix=""
              decimalScale={2}
            />
          }
          lockedReward={
            <NumberFormat
              className=""
              value={vavixPoolRewards}
              displayType="text"
              thousandSeparator
              prefix=""
              decimalScale={2}
            />
          }
          lockedUntil={tsToDateString(avixVestingEndTime)}
          estAPY={
            <NumberFormat
              className=""
              value={avixPoolAPY}
              displayType="text"
              thousandSeparator
              prefix=""
              decimalScale={0}
            />
          }
        />
        <MiningCard
          addLiquidityLink={"0x..."}
          stakeFn={() => {
            setStakeBalance(avaxPoolBalance);
            setSelectedPoolTitle("Trader Joe dVIX/AVAX Pool");

            if (rewards.avaxPoolReward) {
              setSelectedPool(rewards.avaxPoolReward);
              setSelectedPoolToken(tokens.avaxPoolToken);
            }

            setStakeShow(true);
          }}
          claimString="AVAXPOOL"
          exitString="AVAXPOOL"
          icon1={dvix}
          icon2={avax}
          tradingPair="dVIX / AVAX"
          dex="Trader Joe"
          myBalance={
            <NumberFormat
              className=""
              value={avaxPoolBalance}
              displayType="text"
              thousandSeparator
              prefix=""
              decimalScale={2}
            />
          }
          stakedBalance={
            <NumberFormat
              className=""
              value={avaxPoolStake}
              displayType="text"
              thousandSeparator
              prefix=""
              decimalScale={2}
            />
          }
          claimableReward={
            <NumberFormat
              className=""
              value={avaxPoolRewards}
              displayType="text"
              thousandSeparator
              prefix=""
              decimalScale={2}
            />
          }
          lockedReward={
            <NumberFormat
              className=""
              value={vavaxPoolRewards}
              displayType="text"
              thousandSeparator
              prefix=""
              decimalScale={2}
            />
          }
          lockedUntil={tsToDateString(avaxVestingEndTime)}
          estAPY={
            <NumberFormat
              className=""
              value={avaxPoolAPY}
              displayType="text"
              thousandSeparator
              prefix=""
              decimalScale={0}
            />
          }
        />
        <MiningCard
          addLiquidityLink={"0x..."}
          stakeFn={() => {
            setStakeBalance(ethPoolBalance);
            setSelectedPoolTitle("Trader Joe aVIX/WETH.e Pool");

            if (rewards.ethPoolReward) {
              setSelectedPool(rewards.ethPoolReward);
              setSelectedPoolToken(tokens.ethPoolToken);
            }

            setStakeShow(true);
          }}
          claimString="WETHPOOL"
          exitString="WETHPOOL"
          icon1={dvix}
          icon2={eth}
          tradingPair="dVIX / WETH.e"
          dex="Trader Joe"
          myBalance={
            <NumberFormat
              className=""
              value={ethPoolBalance}
              displayType="text"
              thousandSeparator
              prefix=""
              decimalScale={2}
            />
          }
          stakedBalance={
            <NumberFormat
              className=""
              value={ethPoolStake}
              displayType="text"
              thousandSeparator
              prefix=""
              decimalScale={2}
            />
          }
          claimableReward={
            <NumberFormat
              className=""
              value={ethPoolRewards}
              displayType="text"
              thousandSeparator
              prefix=""
              decimalScale={2}
            />
          }
          lockedReward={
            <NumberFormat
              className=""
              value={vethPoolRewards}
              displayType="text"
              thousandSeparator
              prefix=""
              decimalScale={2}
            />
          }
          lockedUntil={tsToDateString(ethVestingEndTime)}
          estAPY={
            <NumberFormat
              className=""
              value={ethPoolAPY}
              displayType="text"
              thousandSeparator
              prefix=""
              decimalScale={0}
            />
          }
        />
        <MiningCard
          addLiquidityLink={"0x..."}
          stakeFn={() => {
            setStakeBalance(daiPoolBalance);
            setSelectedPoolTitle("Trader Joe aVIX/DAI.e Pool");

            if (rewards.daiPoolReward) {
              setSelectedPool(rewards.daiPoolReward);
              setSelectedPoolToken(tokens.daiPoolToken);
            }

            setStakeShow(true);
          }}
          claimString="DAIPOOL"
          exitString="DAIPOOL"
          icon1={dvix}
          icon2={dai}
          tradingPair="dVIX / DAI.e"
          dex="Trader Joe"
          myBalance={
            <NumberFormat
              className=""
              value={daiPoolBalance}
              displayType="text"
              thousandSeparator
              prefix=""
              decimalScale={2}
            />
          }
          stakedBalance={
            <NumberFormat
              className=""
              value={daiPoolStake}
              displayType="text"
              thousandSeparator
              prefix=""
              decimalScale={2}
            />
          }
          claimableReward={
            <NumberFormat
              className=""
              value={daiPoolRewards}
              displayType="text"
              thousandSeparator
              prefix=""
              decimalScale={2}
            />
          }
          lockedReward={
            <NumberFormat
              className=""
              value={vdaiPoolRewards}
              displayType="text"
              thousandSeparator
              prefix=""
              decimalScale={2}
            />
          }
          lockedUntil={tsToDateString(daiVestingEndTime)}
          estAPY={
            <NumberFormat
              className=""
              value={daiPoolAPY}
              displayType="text"
              thousandSeparator
              prefix=""
              decimalScale={0}
            />
          }
        />
        {/* <MiningCard
          icon1={dvix}
          icon2={usdt}
          tradingPair="dVIX / USDT"
          dex="Trader Joe"
          myBalance={0.0}
          stakedBalance={0.0}
          claimableReward={0.0}
          lockedReward={0.0}
          lockedUntil={new Date()}
          estAPY={123.47}
        /> */}
      </div>
      <Stake
        pool={selectedPool}
        poolTitle={selectedPoolTitle}
        poolToken={selectedPoolToken}
        balance={stakeBalance}
        show={stakeShow}
        onHide={() => setStakeShow(false)}
        refresh={() => refresh()}
      />

      <br />
      <br />
      <br />
    </div>
  );
};

export default Farm;
