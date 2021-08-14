import React from 'react'
import { Link } from 'react-router-dom'
import './learn.css'

const Learn = ({ isDarkMode }) => {
  const WhatIsAvix = () => {
    return (
      <div className="what-is-avix-container">
        <h2 className="what-is-avix-title">What is Avix Finance?</h2>
        <p className="what-is-avix-desc">
          <strong>
            Avix Finance makes it possible for everyone to mint derived VIX
            (dVIX),
          </strong>{' '}
          the world’s first token that tracks the CBOE Volatility Index (VIX) in
          1:1 ratio.{' '}
          <strong>
            dVIX does not experience any time decay as it never expires,
          </strong>{' '}
          which makes it a much more reliable hedge for the broader market
          volatility. dVIX is{' '}
          <strong>safely overcollateralized by at least 150%,</strong> using
          crypto assets such as WETH, MATIC, DAI, USDC and WBTC. Avix Finance is
          currently deployed on the Polygon (Matic) network, with plans for
          expansion onto other networks over time. To learn more about Avix
          Finance, please visit{' '}
          <a
            target="_blank"
            rel="noreferrer"
            href="https://avix.finance"
            className="doc-link"
          >
            our official website
          </a>{' '}
          and check out the available resources on this page.
        </p>
      </div>
    )
  }

  const Video = () => {
    return (
      <div className="video-container">
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/TDGq4aeevgY"
          title="YouTube Video Player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    )
  }

  const Instructions = () => {
    return (
      <div className="instructions-container">
        <h1>Instructions</h1>
        <p>
          <strong>1.) Ideas: </strong>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://docs.avix.finance/platform-overview/how-to-use-dvix"
            className="doc-link"
          >
            How to Use dVIX
          </a>
        </p>

        <p>
          <strong>2.) Tutorial: </strong>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://docs.avix.finance/platform-overview/tutorial-how-to-mint-and-burn-dvix"
            className="doc-link"
          >
            How to Mint & Burn dVIX
          </a>
        </p>

        <p>
          <strong>3.) Tutorial: </strong>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://docs.avix.finance/platform-overview/tutorial-advanced-trading-strategies"
            className="doc-link"
          >
            Advanced Trading Strategies
          </a>
        </p>
      </div>
    )
  }

  const Resources = () => {
    return <div className="resources-container"></div>
  }

  const Support = () => {
    return <div className="support-container"></div>
  }

  const Community = () => {
    return <div className="community-container"></div>
  }

  return (
    <div
      className={`${
        !isDarkMode ? 'learn-container' : 'learn-container-dark-mode'
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
        About Avix Finance
      </h1>

      <div className="learn-grid">
        <WhatIsAvix />
        <Video />
        <Instructions />
        <Resources />
        <Support />
        <Community />
      </div>
    </div>
  )
}

export default Learn
