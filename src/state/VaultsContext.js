import React from "react";

export const VAULTS_DEFAULT_VALUE = {
  setCurrentWAVAXVault: () => {},
  setCurrentWETHVault: () => {},
  setCurrentDAIVault: () => {},

  setCurrentWAVAXVaultRead: () => {},
  setCurrentWETHVaultRead: () => {},
  setCurrentDAIVaultRead: () => {},
};

const vaultsContext = React.createContext(VAULTS_DEFAULT_VALUE);

export default vaultsContext;
