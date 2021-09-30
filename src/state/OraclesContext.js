import React from "react";

export const ORACLES_DEFAULT_VALUE = {
  setCurrentWAVAXOracle: () => {},
  setCurrentWETHOracle: () => {},
  setCurrentDAIOracle: () => {},
  setCurrentDVIXOracle: () => {},

  setCurrentWAVAXOracleRead: () => {},
  setCurrentWETHOracleRead: () => {},
  setCurrentDAIOracleRead: () => {},
  setCurrentDVIXOracleRead: () => {},
};

const oraclesContext = React.createContext(ORACLES_DEFAULT_VALUE);

export default oraclesContext;
