import React, { useContext } from "react";
import "./farm.css";
import { Link } from "react-router-dom";
import moment from "moment";
import dai from "../../assets/images/dai.png";
import wbtc from "../../assets/images/wbtc.png";
import eth from "../../assets/images/eth.png";
import avix from "../../assets/images/favicon.png";
import dvix from "../../assets/images/dVIX_favicon.png";
import avax from "../../assets/images/avax.png";
import usdt from "../../assets/images/usdt.png";
import { ThemeContext } from "../../state/ThemeContext";

const Farm = () => {
  const { isDarkMode } = useContext(ThemeContext);

  function claimEarlyAdopterRewards(vaultName) {
    alert(
      `Early adopter rewards claimed for the ${
        vaultName && vaultName.split(" ")[0]
      } vault.`
    );
  }

  const EarlyCard = ({
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
            alt={vaultName && vaultName.split(" ")[0]}
            className="trade-icon-1"
            style={{
              border: "none",
            }}
          />
        </div>
        <h3 className="trade-card-title">{vaultName}</h3>
        <br />
        <p className="trade-card-dex">
          <strong>My Current Mint:</strong> {myCurrentMint} dVIX
        </p>
        <p className="trade-card-trading-volume">
          <strong>My Current Reward:</strong> {myCurrentReward} AVIX
        </p>
        <p className="trade-card-dex">
          <strong>Estimated APY:</strong> {estAPY}%
        </p>
        <div className="trading-buttons">
          <button className="btn regular-btn border-rad-05 mr-3" type="button">
            <Link
              to={
                vaultName === "AVAX Vault"
                  ? "/"
                  : `/${vaultName && vaultName.split(" ")[0]}`
              }
              className="trade-card-analytics-link"
              style={{ color: "white", fontWeight: "bold" }}
            >
              Mint
            </Link>
          </button>
          <button
            className="btn regular-btn border-rad-05"
            type="button"
            onClick={() => claimEarlyAdopterRewards(vaultName)}
            style={{ fontWeight: "bold" }}
          >
            Claim
          </button>
        </div>
      </div>
    );
  };

  function stakeForLiquidityMiningRewards(tradingPair, dex) {
    alert(
      `Staked ${tradingPair} ${dex} LP tokens to earn liquidity mining rewards.`
    );
  }

  function claimLiquidityMiningRewards(tradingPair, dex) {
    alert(`Liquidity mining rewards claimed for the ${tradingPair} ${dex} LP.`);
  }

  function unstakeLiquidityMiningStake(tradingPair, dex) {
    alert(
      `${tradingPair} ${dex} LP tokens withdrawn from the Avix's liquidity mining farm.`
    );
  }

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
        <h3 className="trade-card-title">{tradingPair + " LP Token"}</h3>
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
          <strong>Claimable Rewards:</strong> {claimableReward} AVIX
        </p>
        <p className="trade-card-trading-volume">
          <strong>Locked Rewards:</strong> {lockedReward} AVIX
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
            onClick={() => stakeForLiquidityMiningRewards(tradingPair, dex)}
            style={{ fontWeight: "bold" }}
          >
            Stake
          </button>
          <button
            className="btn regular-btn border-rad-05 mr-3"
            type="button"
            onClick={() => claimLiquidityMiningRewards(tradingPair, dex)}
            style={{ fontWeight: "bold" }}
          >
            Claim
          </button>
          <button
            className="btn regular-btn border-rad-05"
            type="button"
            onClick={() => unstakeLiquidityMiningStake(tradingPair, dex)}
            style={{ fontWeight: "bold" }}
          >
            Unstake
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

      {/* @NOTE: DELETE EARLY ADOPTER REWARDS PART 30 DAYS AFTER THE LAUNCH! */}
      <h1
        className="text-center bold mb-5 mt-5"
        style={{ fontSize: "2.75rem" }}
      >
        Early Adopter Rewards
      </h1>

      <p
        className={`text-muted text-center ml-5 mr-5 mb-5 ${
          isDarkMode ? "early-adopter-note-dark-mode" : "early-adopter-note"
        }`}
      >
        <strong>
          Early adopter rewards are issued over the 30 day period after the
          launch of Avix Finance,
        </strong>{" "}
        for a total of 50,000 AVIX (5% of the max supply). This reward is{" "}
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
          vaultName="AVAX Vault"
          myCurrentMint={0.0}
          myCurrentReward={0.0}
          estAPY={255.39}
        />
        <EarlyCard
          icon={eth}
          vaultName="WETH Vault"
          myCurrentMint={0.0}
          myCurrentReward={0.0}
          estAPY={255.39}
        />
        <EarlyCard
          icon={wbtc}
          vaultName="WBTC Vault"
          myCurrentMint={0.0}
          myCurrentReward={0.0}
          estAPY={255.39}
        />
        <EarlyCard
          icon={dai}
          vaultName="DAI Vault"
          myCurrentMint={0.0}
          myCurrentReward={0.0}
          estAPY={255.39}
        />
        <EarlyCard
          icon={usdt}
          vaultName="USDT Vault"
          myCurrentMint={0.0}
          myCurrentReward={0.0}
          estAPY={255.39}
        />
      </div>

      <br />
      <br />

      {/* @NOTE: DELETE LIQUIDITY MINING REWARDS PART & THE ENTIRE FARM
      TAB 2 YEARS AFTER THE LAUNCH! */}
      <h1 className="text-center bold mb-5 mt-5" style={{ fontSize: "2.5rem" }}>
        Liquidity Mining Rewards
      </h1>

      <p
        className={`text-muted text-center ml-5 mr-5 mb-5 ${
          isDarkMode ? "early-adopter-note-dark-mode" : "early-adopter-note"
        }`}
      >
        {" "}
        You can <strong>earn AVIX governance tokens</strong> by staking your LP
        tokens for any of the pairs listed below.
        <strong>Claimable Rewards</strong> (20% of total rewards) are available
        to claim immediately. <strong>Locked Rewards</strong> (80% of total
        rewards) are unlocked after the 6 month vesting period. To learn more
        about how AVIX rewards are distributed, check out{" "}
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
          icon1={avix}
          icon2={avax}
          tradingPair="AVIX / AVAX"
          dex="Trader Joe"
          myBalance={0.0}
          stakedBalance={0.0}
          claimableReward={0.0}
          lockedReward={0.0}
          lockedUntil={new Date()}
          estAPY={123.47}
        />
        <MiningCard
          icon1={dvix}
          icon2={avax}
          tradingPair="dVIX / AVAX"
          dex="Trader Joe"
          myBalance={0.0}
          stakedBalance={0.0}
          claimableReward={0.0}
          lockedReward={0.0}
          lockedUntil={new Date()}
          estAPY={123.47}
        />
        <MiningCard
          icon1={dvix}
          icon2={eth}
          tradingPair="dVIX / WETH"
          dex="Trader Joe"
          myBalance={0.0}
          stakedBalance={0.0}
          claimableReward={0.0}
          lockedReward={0.0}
          lockedUntil={new Date()}
          estAPY={123.47}
        />
        <MiningCard
          icon1={dvix}
          icon2={wbtc}
          tradingPair="dVIX / WBTC"
          dex="Trader Joe"
          myBalance={0.0}
          stakedBalance={0.0}
          claimableReward={0.0}
          lockedReward={0.0}
          lockedUntil={new Date()}
          estAPY={123.47}
        />
        <MiningCard
          icon1={dvix}
          icon2={dai}
          tradingPair="dVIX / DAI"
          dex="Trader Joe"
          myBalance={0.0}
          stakedBalance={0.0}
          claimableReward={0.0}
          lockedReward={0.0}
          lockedUntil={new Date()}
          estAPY={123.47}
        />
        <MiningCard
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
        />
      </div>
      <br />
      <br />
      <br />
    </div>
  );
};

export default Farm;
