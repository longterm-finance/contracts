import React from "react";

export const TOKENS_DEFAULT_VALUE = {
  setCurrentAVAXToken: () => {},
  setCurrentUSDTToken: () => {},
  setCurrentWETHToken: () => {},
  setCurrentDAIToken: () => {},
  setCurrentWBTCToken: () => {},
  setCurrentDVIXToken: () => {},
  setCurrentAvixToken: () => {},

  setCurrentAVAXPoolToken: () => {}, // dVIX/WAVAX LP Token
  setCurrentUSDTPoolToken: () => {}, // dVIX/USDT LP Token
  setCurrentWETHPoolToken: () => {}, // dVIX/WETH LP Token
  setCurrentDAIPoolToken: () => {}, // dVIX/DAI LP Token
  setCurrentWBTCPoolToken: () => {}, // dVIX/WBTC LP Token
  setCurrentAVIXPoolToken: () => {}, // AVIX/WAVAX LP Token (initial liquidity IDO pair)

  setCurrentAVAXTokenRead: () => {},
  setCurrentUSDTTokenRead: () => {},
  setCurrentWETHTokenRead: () => {},
  setCurrentDAITokenRead: () => {},
  setCurrentWBTCTokenRead: () => {},
  setCurrentDVIXTokenRead: () => {},
  setCurrentAvixTokenRead: () => {},

  setCurrentAVAXPoolTokenRead: () => {}, // dVIX/WAVAX LP Token
  setCurrentUSDTPoolTokenRead: () => {}, // dVIX/USDT LP Token
  setCurrentWETHPoolTokenRead: () => {}, // dVIX/WETH LP Token
  setCurrentDAIPoolTokenRead: () => {}, // dVIX/DAI LP Token
  setCurrentWBTCPoolTokenRead: () => {}, // dVIX/WBTC LP Token
  setCurrentAVIXPoolTokenRead: () => {}, // AVIX/WAVAX LP Token (initial liquidity IDO pair)
};

const tokensContext = React.createContext(TOKENS_DEFAULT_VALUE);

export default tokensContext;
