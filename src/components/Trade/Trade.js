import React from 'react'
import { Link } from 'react-router-dom'
import './trade.css'
import dai from '../../assets/images/dai.png'
import wbtc from '../../assets/images/wbtc.png'
import eth from '../../assets/images/eth.png'
import avix from '../../assets/images/favicon.png'
import dvix from '../../assets/images/dVIX_favicon.png'

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
      <div className="trade-card-container">
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
          />
        </div>
        <h3 className="trade-card-title">{tradingPair}</h3>
        <p className="trade-card-dex">DEX: {dex}</p>
        <p className="trade-card-trading-volume">24h Volume: {tradingVolume}</p>
        <a
          target="_blank"
          rel="noreferrer"
          href={analyticsLink}
          className="trade-card-analytics-link"
        >
          Analytics
        </a>
        <button className="btn regular-btn">
          <a
            target="_blank"
            rel="noreferrer"
            href={tradeLink}
            className="trade-card-trade-link"
          >
            Trade
          </a>
        </button>
      </div>
    )
  }

  return (
    <div className="trade-container container">
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <div className="trade-grid">
        <TradeCard
          icon1={eth}
          icon2={dvix}
          tradingPair="ETH/dVIX"
          dex="SushiSwap"
          tradingVolume="$755,000"
          analyticsLink="https://analytics.sushi.com/pairs/"
          tradeLink="https://app.sushi.com/#/swap/"
        />
        <TradeCard
          icon1={eth}
          icon2={avix}
          tradingPair="ETH/AVIX"
          dex="SushiSwap"
          tradingVolume="$755,000"
          analyticsLink="https://analytics.sushi.com/pairs/"
          tradeLink="https://app.sushi.com/#/swap/"
        />
        <TradeCard
          icon1={dai}
          icon2={dvix}
          tradingPair="DAI/dVIX"
          dex="SushiSwap"
          tradingVolume="$755,000"
          analyticsLink="https://analytics.sushi.com/pairs/"
          tradeLink="https://app.sushi.com/#/swap/"
        />
        <TradeCard
          icon1={dai}
          icon2={avix}
          tradingPair="DAI/AVIX"
          dex="SushiSwap"
          tradingVolume="$755,000"
          analyticsLink="https://analytics.sushi.com/pairs/"
          tradeLink="https://app.sushi.com/#/swap/"
        />
        <TradeCard
          icon1={wbtc}
          icon2={dvix}
          tradingPair="WBTC/dVIX"
          dex="SushiSwap"
          tradingVolume="$755,000"
          analyticsLink="https://analytics.sushi.com/pairs/"
          tradeLink="https://app.sushi.com/#/swap/"
        />
        <TradeCard
          icon1={wbtc}
          icon2={avix}
          tradingPair="WBTC/AVIX"
          dex="SushiSwap"
          tradingVolume="$755,000"
          analyticsLink="https://analytics.sushi.com/pairs/"
          tradeLink="https://app.sushi.com/#/swap/"
        />
      </div>
    </div>
  )
}

export default Trade
