import React from "react";

export const VAULTS_DEFAULT_VALUE = {
  setCurrentAVAXVault: () => {},
  setCurrentUSDTVault: () => {},
  setCurrentWETHVault: () => {},
  setCurrentDAIVault: () => {},
  setCurrentWBTCVault: () => {},
  setCurrentAVAXVaultRead: () => {},
  setCurrentUSDTVaultRead: () => {},
  setCurrentWETHVaultRead: () => {},
  setCurrentDAIVaultRead: () => {},
  setCurrentWBTCVaultRead: () => {},
};

const vaultsContext = React.createContext(VAULTS_DEFAULT_VALUE);

export default vaultsContext;
