import React from "react";

export const ORACLES_DEFAULT_VALUE = {
  setCurrentAVAXOracle: () => {},
  setCurrentUSDTOracle: () => {},
  setCurrentWETHOracle: () => {},
  setCurrentDAIOracle: () => {},
  setCurrentWBTCOracle: () => {},
  setCurrentDVIXOracle: () => {},

  setCurrentAVAXOracleRead: () => {},
  setCurrentUSDTOracleRead: () => {},
  setCurrentWETHOracleRead: () => {},
  setCurrentDAIOracleRead: () => {},
  setCurrentWBTCOracleRead: () => {},
  setCurrentDVIXOracleRead: () => {},
};

const oraclesContext = React.createContext(ORACLES_DEFAULT_VALUE);

export default oraclesContext;
