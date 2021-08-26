import React from 'react'
import './trade.css'
import dai from '../../assets/images/dai.png'
import wbtc from '../../assets/images/wbtc.png'
import eth from '../../assets/images/eth.png'
import avix from '../../assets/images/favicon.png'
import dvix from '../../assets/images/dVIX_favicon.png'
import usdc from '../../assets/images/usdc.png'
import matic from '../../assets/images/matic.png'

const Trade = ({ isDarkMode }) => {
  const TradeCard = ({
    icon1,
    icon2,
    tradingPair,
    dex,
    tradingVolume,
    analyticsLink,
    tradeLink,
  }) => {
    return (
      <div
        className={`${
          !isDarkMode
            ? 'trade-card-container'
            : 'trade-card-container-dark-mode'
        }`}
      >
        <div className="trade-card-icons">
          <img
            src={icon1}
            width="42"
            height="42"
            alt={tradingPair && tradingPair.split('/')[0]}
            className="trade-icon-1"
          />
          <img
            src={icon2}
            width="42"
            height="42"
            alt={tradingPair && tradingPair.split('/')[1]}
            className="trade-icon-2"
            style={{
              border: icon2 === matic && '2px solid #2B6DEF',
            }}
          />
        </div>
        <h3 className="trade-card-title">{tradingPair}</h3>
        <br />
        <p className="trade-card-dex">
          <strong>DEX:</strong> {dex}
        </p>
        <p className="trade-card-trading-volume">
          <strong>24h Volume:</strong> {tradingVolume}
        </p>
        <div className="trading-buttons">
          <button className="btn regular-btn border-rad-05 mr-3" type="button">
            <a
              target="_blank"
              rel="noreferrer"
              href={analyticsLink}
              className="trade-card-analytics-link"
              style={{ color: 'white', fontWeight: 'bold' }}
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
              style={{ color: 'white', fontWeight: 'bold' }}
            >
              Trade
            </a>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`${
        !isDarkMode ? 'trade-container' : 'trade-container-dark-mode'
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
        style={{ fontSize: '2.75rem' }}
      >
        Most Popular dVIX & AVIX Trading Pairs
      </h1>
      <br />
      <div className="trade-grid">
        <TradeCard
          icon1={dvix}
          icon2={eth}
          tradingPair="dVIX / WETH"
          dex="SushiSwap"
          tradingVolume="$755,000"
          analyticsLink="https://analytics.sushi.com/pairs/"
          tradeLink="https://app.sushi.com/#/swap/"
        />
        <TradeCard
          icon1={avix}
          icon2={eth}
          tradingPair="AVIX / WETH"
          dex="SushiSwap"
          tradingVolume="$755,000"
          analyticsLink="https://analytics.sushi.com/pairs/"
          tradeLink="https://app.sushi.com/#/swap/"
        />
        <TradeCard
          icon1={dvix}
          icon2={matic}
          tradingPair="dVIX / MATIC"
          dex="SushiSwap"
          tradingVolume="$755,000"
          analyticsLink="https://analytics.sushi.com/pairs/"
          tradeLink="https://app.sushi.com/#/swap/"
        />
        <TradeCard
          icon1={avix}
          icon2={matic}
          tradingPair="AVIX / MATIC"
          dex="SushiSwap"
          tradingVolume="$755,000"
          analyticsLink="https://analytics.sushi.com/pairs/"
          tradeLink="https://app.sushi.com/#/swap/"
        />
        <TradeCard
          icon1={dvix}
          icon2={dai}
          tradingPair="dVIX / DAI"
          dex="SushiSwap"
          tradingVolume="$755,000"
          analyticsLink="https://analytics.sushi.com/pairs/"
          tradeLink="https://app.sushi.com/#/swap/"
        />
        <TradeCard
          icon1={avix}
          icon2={dai}
          tradingPair="AVIX / DAI"
          dex="SushiSwap"
          tradingVolume="$755,000"
          analyticsLink="https://analytics.sushi.com/pairs/"
          tradeLink="https://app.sushi.com/#/swap/"
        />
        <TradeCard
          icon1={dvix}
          icon2={usdc}
          tradingPair="dVIX / USDC"
          dex="SushiSwap"
          tradingVolume="$755,000"
          analyticsLink="https://analytics.sushi.com/pairs/"
          tradeLink="https://app.sushi.com/#/swap/"
        />
        <TradeCard
          icon1={avix}
          icon2={usdc}
          tradingPair="AVIX / USDC"
          dex="SushiSwap"
          tradingVolume="$755,000"
          analyticsLink="https://analytics.sushi.com/pairs/"
          tradeLink="https://app.sushi.com/#/swap/"
        />
        <TradeCard
          icon1={dvix}
          icon2={wbtc}
          tradingPair="dVIX / WBTC"
          dex="SushiSwap"
          tradingVolume="$755,000"
          analyticsLink="https://analytics.sushi.com/pairs/"
          tradeLink="https://app.sushi.com/#/swap/"
        />
        <TradeCard
          icon1={avix}
          icon2={wbtc}
          tradingPair="AVIX / WBTC"
          dex="SushiSwap"
          tradingVolume="$755,000"
          analyticsLink="https://analytics.sushi.com/pairs/"
          tradeLink="https://app.sushi.com/#/swap/"
        />
      </div>
      <br />
      <br />
      <br />
    </div>
  )
}

export default Trade
