import React from 'react'
import './nft.css'
import demoImg from '../../assets/images/coming-soon.jpg'
import eth from '../../assets/images/eth.png'

const NFT = ({ isDarkMode }) => {
  const NFTCard = ({
    name,
    status,
    price,
    buyLink,
    isExclusive,
    isDisabled,
    nftSrc,
  }) => {
    return (
      <div
        className={`${isDarkMode ? 'nft-card-dark-mode' : 'nft-card'}
         ${isExclusive && 'exclusive-nft'}
        `}
      >
        {/* eslint-disable-next-line */}
        <a
          target={!isDisabled && '_blank'}
          href={
            isDisabled
              ? // eslint-disable-next-line
                'javascript:void(0)'
              : `https://opensea.io/assets/${buyLink}`
          }
          rel="noreferrer"
        >
          <div
            className="nft-image"
            style={{
              backgroundImage: `url(${nftSrc ? nftSrc : demoImg})`,
              cursor: isDisabled && 'not-allowed',
            }}
          />
        </a>

        <div className="nft-card-block-1">
          <span className="nft-name bold ml-3 mt-3">{name}</span>
          <span
            className={`nft-status bold mr-3 mt-3 ${
              status === 'On Sale'
                ? 'badge badge-success'
                : 'badge badge-secondary'
            }`}
          >
            {status}
          </span>
        </div>

        <hr />

        <div className="nft-card-block-2">
          <span className="nft-price ml-3">
            <img width="22" height="22" alt="ETH" src={eth} />{' '}
            <span
              className="bold"
              style={{
                marginLeft: '5px',
                position: 'relative',
                top: '1px',
              }}
            >
              {price} ETH
            </span>
          </span>
          <button
            type="button"
            className={`mr-3 btn regular-btn bold border-rad-05 ${
              isDisabled && 'buy-nft-disabled'
            }`}
            style={{
              height: '40px',
              fontWeight: 'bold',
            }}
          >
            {/* eslint-disable-next-line */}
            <a
              target={!isDisabled && '_blank'}
              rel="noreferrer"
              style={{
                color: '#fff',
                fontWeight: 'bold',
                fontSize: '1.25rem',
              }}
              href={
                isDisabled
                  ? // eslint-disable-next-line
                    'javascript:void(0)'
                  : `https://opensea.io/assets/${buyLink}`
              }
              className={isDisabled && 'buy-nft-disabled'}
            >
              Buy
            </a>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`${isDarkMode ? 'nft-container-dark-mode' : 'nft-container'}`}
    >
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />

      <h1
        className={`text-center bold ${
          isDarkMode ? 'nft-title-dark-mode' : 'nft-title'
        }`}
      >
        Avix Collectibles
      </h1>

      <p
        className={`community-link text-center mt-4 ${
          isDarkMode ? 'nft-subtitle-dark-mode' : 'nft-subtitle'
        }`}
      >
        For the latest news about the launch of the new NFTs (collectibles),
        make sure to keep an eye on our{' '}
        <a
          href="https://twitter.com/AvixFinance"
          className="doc-link bold"
          target="_blank"
          rel="noreferrer community-link-inner"
          style={{ color: '#e84142' }}
        >
          Twitter
        </a>
        !
      </p>

      <br />

      <h2
        className={`text-center bold mt-5 mb-5 ${
          isDarkMode ? 'collection-title-dark-mode' : 'collection-title'
        }`}
      >
        Exclusive (One of a Kind)
      </h2>
      <div className="exclusive-container">
        <NFTCard
          name="Exclusive NFT"
          status="Soon"
          price={11}
          buyLink="0x..."
          isExclusive
          isDisabled
        />
      </div>

      <br />
      <br />
      <br />

      <h2
        className={`text-center bold mt-5 mb-5 ${
          isDarkMode ? 'collection-title-dark-mode' : 'collection-title'
        }`}
      >
        Premium Edition (Total Supply: 9)
      </h2>
      <div className="premium-container">
        <NFTCard
          name="3D Avix Token"
          status="Soon"
          price={1}
          buyLink="0x..."
          isDisabled
        />
        <NFTCard
          name="3D Avix Token (Light)"
          status="Soon"
          price={1}
          buyLink="0x..."
          isDisabled
        />
        <NFTCard
          name="Premium NFT #3"
          status="Soon"
          price={1}
          buyLink="0x..."
          isDisabled
        />
        <NFTCard
          name="Premium NFT #4"
          status="Soon"
          price={1}
          buyLink="0x..."
          isDisabled
        />
        <NFTCard
          name="Premium NFT #5"
          status="Soon"
          price={1}
          buyLink="0x..."
          isDisabled
        />
        <NFTCard
          name="Premium NFT #6"
          status="Soon"
          price={1}
          buyLink="0x..."
          isDisabled
        />
        <NFTCard
          name="Premium NFT #7"
          status="Soon"
          price={1}
          buyLink="0x..."
          isDisabled
        />
        <NFTCard
          name="Premium NFT #8"
          status="Soon"
          price={1}
          buyLink="0x..."
          isDisabled
        />
        <NFTCard
          name="Premium NFT #9"
          status="Soon"
          price={1}
          buyLink="0x..."
          isDisabled
        />
      </div>

      <br />
      <br />
      <br />
    </div>
  )
}

export default NFT
