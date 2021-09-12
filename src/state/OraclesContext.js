import React from "react";

export const ORACLES_DEFAULT_VALUE = {
  setCurrentAVAXOracle: () => {},
  setCurrentWETHOracle: () => {},
  setCurrentDAIOracle: () => {},
  setCurrentDVIXOracle: () => {},

  setCurrentAVAXOracleRead: () => {},
  setCurrentWETHOracleRead: () => {},
  setCurrentDAIOracleRead: () => {},
  setCurrentDVIXOracleRead: () => {},
};

const oraclesContext = React.createContext(ORACLES_DEFAULT_VALUE);

export default oraclesContext;
