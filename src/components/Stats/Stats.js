import React, { useContext, useEffect, useState } from "react";
import Card from "react-bootstrap/esm/Card";
import { BigNumber, ethers } from "ethers";
import NumberFormat from "react-number-format";
import { useQuery, gql } from "@apollo/client";
import { ThemeContext } from "../../state/ThemeContext";
import TokensContext from "../../state/TokensContext";
import SignerContext from "../../state/SignerContext";
import OraclesContext from "../../state/OraclesContext";
import avax from "../../assets/images/avax.png";
import eth from "../../assets/images/eth.png";
import dai from "../../assets/images/dai.png";
import avix from "../../assets/images/avix_logo_new.png";
import dvix from "../../assets/images/dvix_logo_new.png";
import percentageIcon from "../../assets/images/ratio.png";
import totalStakedIcon from "../../assets/images/total-staked.png";
import totalSupplyIcon from "../../assets/images/total-supply.png";
import avixJson from "../../contracts/avix.json";
import { getPriceInUSDFromPair, toUSD } from "../../utils/utils";
import Spinner from "../Layout/Spinner";
import "./stats.css";

const Stats = () => {
  const { isDarkMode } = useContext(ThemeContext);

  const tokens = useContext(TokensContext);
  const signer = useContext(SignerContext);
  const oracles = useContext(OraclesContext);

  const [dvixPrice, setDvixPrice] = useState("0.0");
  const [avixPrice, setAvixPrice] = useState("0.0");
  const [WAVAXStake, setWAVAXStake] = useState("0");
  const [WETHStake, setWETHStake] = useState("0");
  const [DAIStake, setDAIStake] = useState("0");
  const [TotalStake, setTotalStake] = useState("0");
  const [totalSupply, setTotalSupply] = useState("0.0");

  const [loading, setLoading] = useState(true);

  const VAULTS_STATE = gql`
    {
      states {
        amountStaked
        id
      }
    }
  `;

  const { data } = useQuery(VAULTS_STATE, {
    notifyOnNetworkStatusChange: true,
    pollInterval: 5000,
    fetchPolicy: "no-cache",
  });

  useEffect(() => {
    const load = async () => {
      if (oracles && tokens && data && signer && oracles.dvixOracleRead) {
        const currentTotalPriceCall = await oracles.dvixOracleRead?.getLatestAnswer();
        const wavaxOraclePriceCall = await oracles.wavaxOracleRead?.getLatestAnswer();
        const wethOraclePriceCall = await oracles.wethOracleRead?.getLatestAnswer();
        const daiOraclePriceCall = await oracles.daiOracleRead?.getLatestAnswer();
        const currentTotalSupplyCall = await tokens.dvixTokenRead?.totalSupply();
        const reservesAvixPoolCall = await tokens.avixPoolTokenRead?.getReserves();

        // @ts-ignore
        const [
          currentTotalPrice,
          wavaxOraclePrice,
          wethOraclePrice,
          daiOraclePrice,
          currentTotalSupply,
          reservesAvixPool,
        ] = await signer.ethcallProvider?.all([
          currentTotalPriceCall,
          wavaxOraclePriceCall,
          wethOraclePriceCall,
          daiOraclePriceCall,
          currentTotalSupplyCall,
          reservesAvixPoolCall,
        ]);

        const TotalDvixPrice = currentTotalPrice.mul(10000000000);

        setDvixPrice(ethers.utils.formatEther(TotalDvixPrice.div(10000000000)));

        let currentWAVAXStake = BigNumber.from(0);
        let currentWETHStake = BigNumber.from(0);
        let currentDAIStake = BigNumber.from(0);

        await data.states.forEach((s) => {
          const networkId = parseInt(process.env.REACT_APP_NETWORK_ID || 43114);
          let contracts;

          switch (networkId) {
            case 43114:
              contracts = avixJson[43114].mainnet.contracts;
              break;
            case 43113:
              contracts = avixJson[43113].fuji.contracts;
              break;
            default:
              contracts = avixJson[43113].fuji.contracts;
              break;
          }
          switch (s.id.toLowerCase()) {
            case contracts.WAVAXVaultHandler.address.toLowerCase():
              currentWAVAXStake = s.amountStaked
                ? s.amountStaked
                : BigNumber.from(0);
              break;
            case contracts.WETHVaultHandler.address.toLowerCase():
              currentWETHStake = s.amountStaked
                ? s.amountStaked
                : BigNumber.from(0);
              break;
            case contracts.DAIVaultHandler.address.toLowerCase():
              currentDAIStake = s.amountStaked
                ? s.amountStaked
                : BigNumber.from(0);
              break;
            default:
              break;
          }
        });

        const formatWAVAX = ethers.utils.formatEther(currentWAVAXStake);
        setWAVAXStake(formatWAVAX);

        const formatWETH = ethers.utils.formatEther(currentWETHStake);
        setWETHStake(formatWETH);

        const formatDAI = ethers.utils.formatEther(currentDAIStake);
        setDAIStake(formatDAI);

        const avaxUSD = ethers.utils.formatEther(
          wavaxOraclePrice.mul(10000000000)
        );
        const ethUSD = ethers.utils.formatEther(
          wethOraclePrice.mul(10000000000)
        );
        const daiUSD = ethers.utils.formatEther(
          daiOraclePrice.mul(10000000000)
        );

        const totalUSD =
          toUSD(avaxUSD, formatWAVAX) +
          toUSD(ethUSD, formatWETH) +
          toUSD(daiUSD, formatDAI);
        setTotalStake(totalUSD.toString());

        setTotalSupply(ethers.utils.formatEther(currentTotalSupply));

        if (signer) {
          const currentPriceAVAX = ethers.utils.formatEther(
            wavaxOraclePrice.mul(10000000000)
          );
          const currentPriceAVIX = getPriceInUSDFromPair(
            reservesAvixPool[0],
            reservesAvixPool[1],
            parseFloat(currentPriceAVAX)
          );
          setAvixPrice(currentPriceAVIX.toString());
        }
      }
      setLoading(false);
    };
    load();
    // eslint-disable-next-line
  }, [data]);

  if (loading) {
    return <Spinner />;
  }

  const Icon = ({ src, alt }) => (
    <img src={src} alt={alt} width="42" height="42" className="trade-icon-1" />
  );

  return (
    <div
      className={`trade-container ${isDarkMode && "trade-container-dark-mode"}`}
    >
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />

      <div className="grid">
        <h1 className="text-center bold">Avix Finance Stats</h1>
        <br />

        {/* ROW 1: aVIX Stats */}
        <h2 className="stats-subtitle text-center">aVIX Stats</h2>
        {/* TODO: aVIX/AVAX Trader Joe LP APY */}
        <Card>
          <Icon src={percentageIcon} alt={"APY Percentage"} />
          <h4>aVIX/AVAX APY (Trader Joe) </h4>
          <h5 className="number neon-blue">
            <NumberFormat
              value={avixPrice}
              displayType="text"
              thousandSeparator
              decimalScale={2}
              prefix="$"
            />{" "}
          </h5>
        </Card>
        <Card>
          {/* TODO: aVIX Total Supply & Max Supply */}
          <Icon src={totalSupplyIcon} alt={"Total Supply"} />
          <h4>Total Supply</h4>
          <h5 className="number neon-blue">
            <NumberFormat
              value={avixPrice}
              displayType="text"
              thousandSeparator
              decimalScale={2}
            />{" "}
            aVIX
          </h5>
        </Card>
        <Card>
          <Icon src={avix} alt={"aVIX"} />
          <h4>aVIX Price</h4>
          <h5 className="number neon-blue">
            <NumberFormat
              value={avixPrice}
              displayType="text"
              thousandSeparator
              decimalScale={2}
              prefix="$"
            />{" "}
          </h5>
        </Card>

        {/* ROW 2:dVIX Stats  */}
        <h2 className="stats-subtitle text-center">dVIX Stats</h2>
        <Card>
          <Icon src={totalStakedIcon} alt={"Total Staked"} />
          <h4>Total Value Locked (TVL) in USD</h4>
          <h5 className="number neon-green">
            <NumberFormat
              value={TotalStake}
              displayType="text"
              thousandSeparator
              decimalScale={2}
              prefix="$"
            />
          </h5>
        </Card>
        <Card>
          <Icon src={totalSupplyIcon} alt={"Total Supply"} />
          <h4>Total Supply</h4>
          <h5 className="number neon-blue">
            <NumberFormat
              value={totalSupply}
              displayType="text"
              thousandSeparator
              decimalScale={2}
            />{" "}
            dVIX
          </h5>
        </Card>
        <Card>
          <Icon src={dvix} alt={"dVIX"} />
          <h4>dVIX Price</h4>
          <h5 className="number neon-highlight">
            <NumberFormat
              value={dvixPrice}
              displayType="text"
              thousandSeparator
              decimalScale={2}
              prefix="$"
            />
          </h5>
        </Card>

        {/* ROW 3: Locked Collateral by Type  */}
        <h2 className="stats-subtitle text-center">
          Locked Collateral by Type
        </h2>
        <Card>
          <Icon src={avax} alt={"AVAX"} />
          <h4>Total Locked in AVAX</h4>
          <h5 className="number neon-highlight">
            <NumberFormat
              value={WAVAXStake}
              displayType="text"
              thousandSeparator
              decimalScale={2}
            />{" "}
            AVAX
          </h5>
        </Card>
        <Card>
          <Icon src={eth} alt={"WETH.e"} />
          <h4>Total Locked in WETH.e</h4>
          <h5 className="number neon-highlight">
            <NumberFormat
              value={WETHStake}
              displayType="text"
              thousandSeparator
              decimalScale={2}
            />{" "}
            WETH.e
          </h5>
        </Card>
        <Card>
          <Icon src={dai} alt={"DAI.e"} />
          <h4>Total Locked in DAI.e</h4>
          <h5 className="number neon-orange">
            <NumberFormat
              value={DAIStake}
              displayType="text"
              thousandSeparator
              decimalScale={2}
            />{" "}
            DAI.e
          </h5>
        </Card>
      </div>
      <br />
      <br />
      <br />
      <br />
    </div>
  );
};

export default Stats;
