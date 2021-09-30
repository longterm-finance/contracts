import React, { useContext } from "react";
import "./trade.css";
import dai from "../../assets/images/dai.png";
import eth from "../../assets/images/eth.png";
import avix from "../../assets/images/avix_logo_new.png";
import dvix from "../../assets/images/dvix_logo_new.png";
import avax from "../../assets/images/avax.png";
import { ThemeContext } from "../../state/ThemeContext";

const Trade = () => {
  const { isDarkMode } = useContext(ThemeContext);

  const TradeCard = ({
    icon1,
    icon2,
    tradingPair,
    dex,
    status = "Inactive",
    analyticsLink,
    tradeLink,
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
          <strong>Status:</strong> {status}
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
              href={tradeLink}
              className="trade-card-trade-link"
              style={{ color: "white", fontWeight: "bold" }}
            >
              Trade
            </a>
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

      <h1
        className="text-center bold mb-5 mt-5"
        style={{ fontSize: "2.75rem" }}
      >
        Popular Trading Pairs
      </h1>

      <p
        className={`text-mute text-center ml-5 mr-5 mb-5 ${
          isDarkMode ? "early-adopter-note-dark-mode" : "early-adopter-note"
        }`}
      >
        Avix makes it possible for you to{" "}
        <strong>trade based on volatility</strong>, and not the market
        direction. This enables you to{" "}
        <strong>
          always be profitable, regardless of the current market conditions.
        </strong>{" "}
        Experience the full power of dVIX in action!
      </p>

      <br />
      <br />

      <div className="trade-grid">
        <TradeCard
          icon1={avix}
          icon2={avax}
          tradingPair="aVIX / AVAX"
          dex="Trader Joe"
          status={"Active"}
          analyticsLink={`https://analytics.traderjoexyz.com/pairs/${process?.env?.REACT_APP_POOL_AVIX}`}
          tradeLink={`https://www.traderjoexyz.com/#/trade/${process?.env?.REACT_APP_POOL_AVIX}`}
        />
        <TradeCard
          icon1={dvix}
          icon2={avax}
          tradingPair="dVIX / AVAX"
          dex="Trader Joe"
          status={"Active"}
          analyticsLink={`https://analytics.traderjoexyz.com/pairs/${process?.env?.REACT_APP_POOL_AVAX}`}
          tradeLink={`https://www.traderjoexyz.com/#/trade/${process?.env?.REACT_APP_POOL_AVAX}`}
        />
        {/* <TradeCard
          icon1={dvix}
          icon2={eth}
          tradingPair="dVIX / WETH"
          dex="Trader Joe"
          tradingVolume="$755,000"
          analyticsLink={`https://analytics.traderjoexyz.com/pairs`}
          tradeLink={`https://www.traderjoexyz.com/#/trade/`}
        /> */}
        {/* <TradeCard
          icon1={avix}
          icon2={eth}
          tradingPair="AVIX / WETH"
          dex="Trader Joe"
          tradingVolume="$755,000"
          analyticsLink={`https://analytics.traderjoexyz.com/pairs`}
          tradeLink={`https://www.traderjoexyz.com/#/trade/`}
        /> */}
        {/* <TradeCard
          icon1={dvix}
          icon2={wbtc}
          tradingPair="dVIX / WBTC"
          dex="Trader Joe"
          tradingVolume="$755,000"
          analyticsLink={`https://analytics.traderjoexyz.com/pairs`}
          tradeLink={`https://www.traderjoexyz.com/#/trade/`}
        /> */}
        {/* <TradeCard
          icon1={avix}
          icon2={wbtc}
          tradingPair="AVIX / WBTC"
          dex="Trader Joe"
          tradingVolume="$755,000"
          analyticsLink={`https://analytics.traderjoexyz.com/pairs`}
          tradeLink={`https://www.traderjoexyz.com/#/trade/`}
        /> */}
        <TradeCard
          icon1={dvix}
          icon2={eth}
          tradingPair="dVIX / WETH.e"
          dex="Trader Joe"
          status={"Active"}
          analyticsLink={`https://analytics.traderjoexyz.com/pairs/${process?.env?.REACT_APP_POOL_WETH}`}
          tradeLink={`https://www.traderjoexyz.com/#/trade/${process?.env?.REACT_APP_POOL_WETH}`}
        />
        {/* <TradeCard
          icon1={avix}
          icon2={dai}
          tradingPair="AVIX / DAI"
          dex="Trader Joe"
          tradingVolume="$755,000"
          analyticsLink={`https://analytics.traderjoexyz.com/pairs`}
          tradeLink={`https://www.traderjoexyz.com/#/trade/`}
        /> */}
        <TradeCard
          icon1={dvix}
          icon2={dai}
          tradingPair="dVIX / DAI.e"
          dex="Trader Joe"
          status={"Active"}
          analyticsLink={`https://analytics.traderjoexyz.com/pairs/${process?.env?.REACT_APP_POOL_DAI}`}
          tradeLink={`https://www.traderjoexyz.com/#/trade/${process?.env?.REACT_APP_POOL_DAI}`}
        />
        {/* <TradeCard
          icon1={avix}
          icon2={usdt}
          tradingPair="AVIX / USDT"
          dex="Trader Joe"
          tradingVolume="$755,000"
          analyticsLink={`https://analytics.traderjoexyz.com/pairs`}
          tradeLink={`https://www.traderjoexyz.com/#/trade/`}
        /> */}
      </div>
      <br />
      <br />
      <br />
      <br />
    </div>
  );
};

export default Trade;
