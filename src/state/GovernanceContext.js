import React from "react";

export const GOVERNANCE_DEFAULT_VALUE = {
  setCurrentGovernorAlpha: () => {},
  setCurrentTimelock: () => {},
  setCurrentGovernorAlphaRead: () => {},
  setCurrentTimelockRead: () => {},
};

const governanceContext = React.createContext(GOVERNANCE_DEFAULT_VALUE);

export default governanceContext;
