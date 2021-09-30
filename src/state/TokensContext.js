import React from "react";

export const TOKENS_DEFAULT_VALUE = {
  setCurrentWAVAXToken: () => {},
  setCurrentWETHToken: () => {},
  setCurrentDAIToken: () => {},
  setCurrentDVIXToken: () => {},
  setCurrentAvixToken: () => {},

  setCurrentWAVAXPoolToken: () => {}, // dVIX/WAVAX LP Token
  setCurrentWETHPoolToken: () => {}, // dVIX/WETH LP Token
  setCurrentDAIPoolToken: () => {}, // dVIX/DAI LP Token
  setCurrentAVIXPoolToken: () => {}, // aVIX/WAVAX LP Token (initial liquidity IDO pair)

  setCurrentWAVAXTokenRead: () => {},
  setCurrentWETHTokenRead: () => {},
  setCurrentDAITokenRead: () => {},
  setCurrentDVIXTokenRead: () => {},
  setCurrentAvixTokenRead: () => {},

  setCurrentWAVAXPoolTokenRead: () => {}, // dVIX/WAVAX LP Token
  setCurrentWETHPoolTokenRead: () => {}, // dVIX/WETH LP Token
  setCurrentDAIPoolTokenRead: () => {}, // dVIX/DAI LP Token
  setCurrentAVIXPoolTokenRead: () => {}, // aVIX/WAVAX LP Token (initial liquidity IDO pair)
};

const tokensContext = React.createContext(TOKENS_DEFAULT_VALUE);

export default tokensContext;
