import React, { useContext } from "react";
import "./nft.css";
import demoImg from "../../assets/images/coming-soon.jpg";
import avax from "../../assets/images/avax.png";
import exclusiveNFT from "../../assets/other/avix-exclusive-nft.gif";
import { ThemeContext } from "../../state/ThemeContext";

const NFT = () => {
  const { isDarkMode } = useContext(ThemeContext);

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
        className={`${isDarkMode ? "nft-card-dark-mode" : "nft-card"}
         ${isExclusive && "exclusive-nft"}
        `}
      >
        {/* eslint-disable-next-line */}
        <a
          target={!isDisabled && "_blank"}
          href={`https://opensea.io/assets/${buyLink}`}
          rel="noreferrer"
        >
          <div
            className="nft-image"
            style={{
              backgroundImage: `url(${nftSrc ? nftSrc : demoImg})`,
              cursor: isDisabled && "not-allowed",
              backgroundRepeat: isExclusive && "no-repeat",
              backgroundPosition: isExclusive && "center top",
            }}
          />
        </a>

        <div className="nft-card-block-1">
          <span className="nft-name bold ml-3 mt-3">{name}</span>
          <span
            className={`nft-status bold mr-3 mt-3 ${
              status === "On Sale"
                ? "badge badge-success"
                : "badge badge-secondary"
            }`}
          >
            {status}
          </span>
        </div>

        <hr />

        <div className="nft-card-block-2">
          <span className="nft-price ml-3">
            <img width="22" height="22" alt="AVAX" src={avax} />{" "}
            <span
              className="bold"
              style={{
                marginLeft: "5px",
                position: "relative",
                top: "1px",
              }}
            >
              {price} AVAX
            </span>
          </span>
          <button
            type="button"
            className={`mr-3 btn regular-btn bold border-rad-05 ${
              isDisabled && "buy-nft-disabled"
            }`}
            style={{
              height: "40px",
              fontWeight: "bold",
            }}
          >
            {/* eslint-disable-next-line */}
            <a
              target={!isDisabled && "_blank"}
              rel="noreferrer"
              style={{
                color: "#fff",
                fontWeight: "bold",
                fontSize: "1.25rem",
              }}
              href={
                isDisabled
                  ? // eslint-disable-next-line
                    "javascript:void(0)"
                  : `https://opensea.io/assets/${buyLink}`
              }
              className={isDisabled && "buy-nft-disabled"}
            >
              Buy
            </a>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`${isDarkMode ? "nft-container-dark-mode" : "nft-container"}`}
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
          isDarkMode ? "nft-title-dark-mode" : "nft-title"
        }`}
      >
        Avix Collectibles
      </h1>

      <p
        className={`community-link text-center mt-4 ${
          isDarkMode ? "nft-subtitle-dark-mode" : "nft-subtitle"
        }`}
      >
        For the latest news about the launch of the new NFTs (collectibles),
        make sure to keep an eye on our{" "}
        <a
          href="https://twitter.com/AvixFinance"
          className="doc-link bold"
          target="_blank"
          rel="noreferrer community-link-inner"
          style={{ color: "#e84142" }}
        >
          Twitter Page!
        </a>{" "}
        <br />
        <small>
          <strong>Note: </strong> There will only ever be 10 NFTs as a part of
          the original Avix NFT collection, and all of them come with 10%
          royalty on future sales for the art creators (Avix creative team &
          community members).
        </small>
      </p>

      <br />
      <br />

      <h2
        className={`text-center bold mt-5 mb-5 ${
          isDarkMode ? "collection-title-dark-mode" : "collection-title"
        }`}
      >
        Exclusive (One of a Kind)
      </h2>

      <p
        className={`text-mute text-center ml-5 mr-5 mb-5 ${
          isDarkMode ? "early-adopter-note-dark-mode" : "early-adopter-note"
        }`}
      >
        <strong>The original Avix logo in its full flory,</strong> neatly
        engraved in the rotating gold coin. Rotation is there to remind us that
        there's always opportunity to come on top in any market situation and{" "}
        <strong>turn volatility to our advantage.</strong>
      </p>

      <br />
      <br />
      <br />

      <div className="exclusive-container">
        <NFTCard
          name="Golden aVIX Coin"
          status="Soon"
          price={225}
          buyLink="0x..."
          isExclusive
          isDisabled
          nftSrc={exclusiveNFT}
        />
      </div>

      <br />
      <br />
      <br />
      <br />

      <h2
        className={`text-center bold mt-5 mb-5 ${
          isDarkMode ? "collection-title-dark-mode" : "collection-title"
        }`}
      >
        Genesis Edition (Total Supply: 9)
      </h2>

      <p
        className={`text-mute text-center ml-5 mr-5 mb-5 ${
          isDarkMode ? "early-adopter-note-dark-mode" : "early-adopter-note"
        }`}
      >
        <strong>The Avix Genesis Edition of NFTs</strong> represents a great
        example of newly popularized{" "}
        <strong>
          <i>generative art.</i>
        </strong>{" "}
        In a nutshell, it's a type of art that's created by machines, not
        humans, with a predefined set of inputs that are stored on-chain. Each
        of the below NFTs is{" "}
        <strong>
          algorithmically generated to be provably unique in its own way,
        </strong>{" "}
        making it virtually impossible for anyone to generate the same one ever
        again.
      </p>

      <br />
      <br />
      <br />

      <div className="premium-container">
        <NFTCard
          name="Genesis NFT #1"
          status="Soon"
          price={25}
          buyLink="0x..."
          isDisabled
        />
        <NFTCard
          name="Genesis NFT #2"
          status="Soon"
          price={25}
          buyLink="0x..."
          isDisabled
        />
        <NFTCard
          name="Genesis NFT #3"
          status="Soon"
          price={25}
          buyLink="0x..."
          isDisabled
        />
        <NFTCard
          name="Genesis NFT #4"
          status="Soon"
          price={25}
          buyLink="0x..."
          isDisabled
        />
        <NFTCard
          name="Genesis NFT #5"
          status="Soon"
          price={25}
          buyLink="0x..."
          isDisabled
        />
        <NFTCard
          name="Genesis NFT #6"
          status="Soon"
          price={25}
          buyLink="0x..."
          isDisabled
        />
        <NFTCard
          name="Genesis NFT #7"
          status="Soon"
          price={25}
          buyLink="0x..."
          isDisabled
        />
        <NFTCard
          name="Genesis NFT #8"
          status="Soon"
          price={25}
          buyLink="0x..."
          isDisabled
        />
        <NFTCard
          name="Genesis NFT #9"
          status="Soon"
          price={25}
          buyLink="0x..."
          isDisabled
        />
      </div>

      <br />
      <br />
      <br />
    </div>
  );
};

export default NFT;
