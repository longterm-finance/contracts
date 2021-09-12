import React from "react";

export const VAULTS_DEFAULT_VALUE = {
  setCurrentAVAXVault: () => {},
  setCurrentWETHVault: () => {},
  setCurrentDAIVault: () => {},

  setCurrentAVAXVaultRead: () => {},
  setCurrentWETHVaultRead: () => {},
  setCurrentDAIVaultRead: () => {},
};

const vaultsContext = React.createContext(VAULTS_DEFAULT_VALUE);

export default vaultsContext;
