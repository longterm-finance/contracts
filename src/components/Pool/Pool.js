import React, { useContext, useState, useEffect } from "react";
import "./pool.css";
import { Link } from "react-router-dom";
import dai from "../../assets/images/dai.png";
import eth from "../../assets/images/eth.png";
import avix from "../../assets/images/avix_logo_new.png";
import dvix from "../../assets/images/dvix_logo_new.png";
import avax from "../../assets/images/avax.png";
import { ThemeContext } from "../../state/ThemeContext";
import { ethers } from "ethers";
import NumberFormat from "react-number-format";
import SignerContext from "../../state/SignerContext";
import TokensContext from "../../state/TokensContext";
import OraclesContext from "../../state/OraclesContext";
import GovernanceContext from "../../state/GovernanceContext";
import { toUSD } from "../../utils/utils";
import Spinner from "../Layout/Spinner";

// Add analytics links and pool links after deployment

const Pool = () => {
  const { isDarkMode } = useContext(ThemeContext);

  const [isLoading, setIsLoading] = useState(true);
  const [avaxLiquidity, setAvaxLiquidity] = useState("0");
  const [wethLiquidity, setWethLiquidity] = useState("0");
  const [daiLiquidity, setDaiLiquidity] = useState("0");
  const [avixLiquidity, setAvixLiquidity] = useState("0");

  const signer = useContext(SignerContext);
  const tokens = useContext(TokensContext);
  const oracles = useContext(OraclesContext);
  const governance = useContext(GovernanceContext);

  const one = ethers.utils.parseEther("1");

  async function getPriceInUSDFromPair(reserves0, reservesAVAX, avaxPrice) {
    // amount of token0 required to buy 1 AVAX
    const amt = parseFloat(
      ethers.utils.formatEther(one.mul(reserves0).div(reservesAVAX))
    );
    return avaxPrice / amt;
  }

  useEffect(() => {
    const loadAddress = async () => {
      if (
        signer &&
        tokens.dvixToken &&
        tokens.avixToken &&
        oracles.dvixOracle &&
        governance.governorAlpha &&
        governance.timelock &&
        tokens.avixTokenRead
      ) {
        const reservesAvixPoolCall = await tokens.avixPoolTokenRead?.getReserves();
        const avaxOraclePriceCall = await oracles.avaxOracleRead?.getLatestAnswer();
        const dvixOraclePriceCall = await oracles.dvixOracleRead?.getLatestAnswer();

        const currentPoolAvaxCall = await tokens.avaxTokenRead?.balanceOf(
          process?.env?.REACT_APP_POOL_AVAX
        );
        const currentAvaxDVIXCall = await tokens.dvixTokenRead?.balanceOf(
          process?.env?.REACT_APP_POOL_AVAX
        );

        const currentPoolWethCall = await tokens.wethTokenRead?.balanceOf(
          process?.env?.REACT_APP_POOL_WETH
        );
        const currentWethDVIXCall = await tokens.dvixTokenRead?.balanceOf(
          process?.env?.REACT_APP_POOL_WETH
        );

        const currentPoolDaiCall = await tokens.daiTokenRead?.balanceOf(
          process?.env?.REACT_APP_POOL_DAI
        );
        const currentDaiDVIXCall = await tokens.dvixTokenRead?.balanceOf(
          process?.env?.REACT_APP_POOL_DAI
        );

        const currentPoolAvaxAvixCall = await tokens.avaxTokenRead?.balanceOf(
          process?.env?.REACT_APP_POOL_AVIX
        );
        const currentPoolAvixCall = await tokens.avixTokenRead?.balanceOf(
          process?.env?.REACT_APP_POOL_AVIX
        );

        const [
          reservesAvixPool,
          avaxOraclePrice,
          dvixOraclePrice,

          currentPoolAvax,
          currentAvaxDVIX,

          currentPoolWeth,
          currentWethDVIX,

          currentPoolDai,
          currentDaiDVIX,

          currentPoolAvaxAvix,
          currentPoolAvix,
        ] = await signer.ethcallProvider?.all([
          reservesAvixPoolCall,
          avaxOraclePriceCall,
          dvixOraclePriceCall,

          currentPoolAvaxCall,
          currentAvaxDVIXCall,

          currentPoolWethCall,
          currentWethDVIXCall,

          currentPoolDaiCall,
          currentDaiDVIXCall,

          currentPoolAvaxAvixCall,
          currentPoolAvixCall,
        ]);

        const avaxUSD = ethers.utils.formatEther(
          avaxOraclePrice.mul(10000000000)
        );

        const currentPriceAVIX = await getPriceInUSDFromPair(
          reservesAvixPool[0],
          reservesAvixPool[1],
          parseFloat(avaxUSD)
        );

        const dvixUSD = ethers.utils.formatEther(dvixOraclePrice);

        let formatPair1 = ethers.utils.formatEther(currentPoolAvax);
        let formatPair2 = ethers.utils.formatEther(currentAvaxDVIX);
        let totalUSD =
          toUSD(formatPair1, avaxUSD) + toUSD(formatPair2, dvixUSD);
        setAvaxLiquidity(totalUSD.toString());

        formatPair1 = ethers.utils.formatEther(currentPoolWeth);
        formatPair2 = ethers.utils.formatEther(currentWethDVIX);
        totalUSD = toUSD(formatPair1, avaxUSD) + toUSD(formatPair2, dvixUSD);
        setWethLiquidity(totalUSD.toString());

        formatPair1 = ethers.utils.formatEther(currentPoolDai);
        formatPair2 = ethers.utils.formatEther(currentDaiDVIX);
        totalUSD = toUSD(formatPair1, avaxUSD) + toUSD(formatPair2, dvixUSD);
        setDaiLiquidity(totalUSD.toString());

        formatPair1 = ethers.utils.formatEther(currentPoolAvaxAvix);
        formatPair2 = ethers.utils.formatEther(currentPoolAvix);
        totalUSD =
          toUSD(formatPair1, avaxUSD) +
          toUSD(formatPair2, currentPriceAVIX.toString());
        setAvixLiquidity(totalUSD.toString());
      }
      setIsLoading(false);
    };

    loadAddress();
    // eslint-disable-next-line
  }, [tokens]);

  const PoolCard = ({
    icon1,
    icon2,
    tradingPair,
    dex,
    liquidity,
    analyticsLink,
    poolLink,
  }) => {
    return (
      <div
        className={`${
          !isDarkMode
            ? "trade-card-container"
            : "trade-card-container-dark-mode"
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
        <h3 className="trade-card-title">{tradingPair}</h3>
        <br />
        <p className="trade-card-dex">
          <strong>DEX:</strong> {dex}
        </p>
        <p className="trade-card-trading-volume">
          <strong>Liquidity:</strong> ${liquidity}
        </p>
        <div className="trading-buttons">
          <button className="btn regular-btn border-rad-05 mr-3" type="button">
            <a
              target="_blank"
              rel="noreferrer"
              href={analyticsLink}
              className="trade-card-analytics-link"
              style={{ color: "white", fontWeight: "bold" }}
            >
              Analytics
            </a>
          </button>
          <button className="btn regular-btn border-rad-05" type="button">
            <a
              target="_blank"
              rel="noreferrer"
              href={poolLink}
              className="trade-card-trade-link"
              style={{ color: "white", fontWeight: "bold" }}
            >
              Pool
            </a>
          </button>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return <Spinner />;
  }

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
      <h1
        className="text-center bold mb-5 mt-5"
        style={{ fontSize: "2.75rem" }}
      >
        Enabled Pools
      </h1>

      <p
        className={`text-mute text-center ml-5 mr-5 mb-5 ${
          isDarkMode ? "early-adopter-note-dark-mode" : "early-adopter-note"
        }`}
      >
        As a popular and frequently traded product, dVIX presents{" "}
        <strong>a very lucrative opportunity for liquidity providers</strong> to
        earn above average yields. Also, you can further boost your returns by{" "}
        <strong>
          depositing your LP tokens into the{" "}
          <Link to="/farm" style={{ color: "#e84142" }} className="doc-link">
            Avix Farm
          </Link>
          ,
        </strong>{" "}
        where you can earn additional rewards in the form of Avix Finance's
        native governance token (aVIX).
      </p>

      <br />
      <br />

      <div className="trade-grid">
        <PoolCard
          icon1={avix}
          icon2={avax}
          tradingPair="aVIX / AVAX"
          dex="Trader Joe"
          liquidity={
            <NumberFormat
              className="number"
              value={avixLiquidity}
              displayType="text"
              thousandSeparator
              prefix=""
              decimalScale={2}
            />
          }
          analyticsLink={`https://analytics.traderjoexyz.com/pairs/${process?.env?.REACT_APP_POOL_AVIX}`}
          poolLink={`https://traderjoexyz.com/#/pool/AVAX/${tokens.avixToken?.address}`}
        />
        <PoolCard
          icon1={dvix}
          icon2={avax}
          tradingPair="dVIX / AVAX"
          dex="Trader Joe"
          liquidity={
            <NumberFormat
              className="number"
              value={avaxLiquidity}
              displayType="text"
              thousandSeparator
              prefix=""
              decimalScale={2}
            />
          }
          analyticsLink={`https://analytics.traderjoexyz.com/pairs/${process?.env?.REACT_APP_POOL_AVAX}`}
          poolLink={`https://traderjoexyz.com/#/pool/AVAX/${tokens.dvixToken?.address}`}
        />
        <PoolCard
          icon1={dvix}
          icon2={eth}
          tradingPair="dVIX / WETH.e"
          dex="Trader Joe"
          liquidity={
            <NumberFormat
              className="number"
              value={wethLiquidity}
              displayType="text"
              thousandSeparator
              prefix=""
              decimalScale={2}
            />
          }
          analyticsLink={`https://analytics.traderjoexyz.com/pairs/${process?.env?.REACT_APP_POOL_WETH}`}
          poolLink={`https://traderjoexyz.com/#/pool/${process?.env?.REACT_APP_POOL_WETH}`}
        />
        <PoolCard
          icon1={dvix}
          icon2={dai}
          tradingPair="dVIX / DAI.e"
          dex="Trader Joe"
          liquidity={
            <NumberFormat
              className="number"
              value={daiLiquidity}
              displayType="text"
              thousandSeparator
              prefix=""
              decimalScale={2}
            />
          }
          analyticsLink={`https://analytics.traderjoexyz.com/pairs/${process?.env?.REACT_APP_POOL_DAI}`}
          poolLink={`https://traderjoexyz.com/#/pool/${process?.env?.REACT_APP_POOL_DAI}`}
        />
        {/* --- */}
        {/* <PoolCard
          icon1={dvix}
          icon2={avax}
          tradingPair="dVIX / AVAX"
          dex="Pangolin"
          liquidity={
            <NumberFormat
              className="number"
              value={avaxLiquidityPNG}
              displayType="text"
              thousandSeparator
              prefix=""
              decimalScale={2}
            />
          }
          analyticsLink={`https://info.pangolin.exchange/#/pairs/${process?.env?.REACT_APP_POOL_AVAX_PNG}`}
          poolLink={`https://app.pangolin.exchange/#/add/AVAX/${tokens.dvixToken?.address}`}
        /> */}
        {/* <PoolCard
          icon1={dvix}
          icon2={eth}
          tradingPair="dVIX / WETH"
          dex="Trader Joe"
          liquidity="$755,000"
          analyticsLink={`https://analytics.traderjoexyz.com/pairs/`}
          poolLink={`https://www.traderjoexyz.com/#/pool/`}
        /> */}
        {/* <PoolCard
          icon1={avix}
          icon2={eth}
          tradingPair="AVIX / WETH"
          dex="Trader Joe"
          liquidity="$755,000"
          analyticsLink={`https://analytics.traderjoexyz.com/pairs/`}
          poolLink={`https://www.traderjoexyz.com/#/pool/`}
        /> */}
        {/* <PoolCard
          icon1={dvix}
          icon2={wbtc}
          tradingPair="dVIX / WBTC"
          dex="Trader Joe"
          liquidity="$755,000"
          analyticsLink={`https://analytics.traderjoexyz.com/pairs/`}
          poolLink={`https://www.traderjoexyz.com/#/pool/`}
        /> */}
        {/* <PoolCard
          icon1={avix}
          icon2={wbtc}
          tradingPair="AVIX / WBTC"
          dex="Trader Joe"
          liquidity="$755,000"
          analyticsLink={`https://analytics.traderjoexyz.com/pairs/`}
          poolLink={`https://www.traderjoexyz.com/#/pool/`}
        /> */}
        {/* <PoolCard
          icon1={dvix}
          icon2={dai}
          tradingPair="dVIX / DAI"
          dex="Trader Joe"
          liquidity="$755,000"
          analyticsLink={`https://analytics.traderjoexyz.com/pairs/`}
          poolLink={`https://www.traderjoexyz.com/#/pool/`}
        /> */}
        {/* <PoolCard
          icon1={avix}
          icon2={dai}
          tradingPair="AVIX / DAI"
          dex="Trader Joe"
          liquidity="$755,000"
          analyticsLink={`https://analytics.traderjoexyz.com/pairs/`}
          poolLink={`https://www.traderjoexyz.com/#/pool/`}
        /> */}
        {/* <PoolCard
          icon1={dvix}
          icon2={usdt}
          tradingPair="dVIX / USDT"
          dex="Trader Joe"
          liquidity="$755,000"
          analyticsLink={`https://analytics.traderjoexyz.com/pairs/`}
          poolLink={`https://www.traderjoexyz.com/#/pool/`}
        /> */}
        {/* <PoolCard
          icon1={avix}
          icon2={usdt}
          tradingPair="AVIX / USDT"
          dex="Trader Joe"
          liquidity="$755,000"
          analyticsLink={`https://analytics.traderjoexyz.com/pairs/`}
          poolLink={`https://www.traderjoexyz.com/#/pool/`}
        /> */}
      </div>
      <br />
      <br />
      <br />
      <br />
    </div>
  );
};

export default Pool;
