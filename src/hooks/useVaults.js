import { useState, useCallback } from "react";

export const useVaults = () => {
  const [avaxVault, setAVAXVault] = useState();
  const [wethVault, setWETHVault] = useState();
  const [daiVault, setDAIVault] = useState();

  const [avaxVaultRead, setAVAXVaultRead] = useState();
  const [wethVaultRead, setWETHVaultRead] = useState();
  const [daiVaultRead, setDAIVaultRead] = useState();

  const setCurrentAVAXVault = useCallback((currentAVAXVault) => {
    setAVAXVault(currentAVAXVault);
  }, []);

  const setCurrentWETHVault = useCallback((currentWETHVault) => {
    setWETHVault(currentWETHVault);
  }, []);

  const setCurrentDAIVault = useCallback((currentDAIVault) => {
    setDAIVault(currentDAIVault);
  }, []);

  const setCurrentAVAXVaultRead = useCallback((currentAVAXVaultRead) => {
    setAVAXVaultRead(currentAVAXVaultRead);
  }, []);

  const setCurrentWETHVaultRead = useCallback((currentWETHVaultRead) => {
    setWETHVaultRead(currentWETHVaultRead);
  }, []);

  const setCurrentDAIVaultRead = useCallback((currentDAIVaultRead) => {
    setDAIVaultRead(currentDAIVaultRead);
  }, []);

  return {
    wethVault,
    setCurrentWETHVault,
    daiVault,
    setCurrentDAIVault,
    wethVaultRead,
    setCurrentWETHVaultRead,
    daiVaultRead,
    setCurrentDAIVaultRead,
    avaxVault,
    setCurrentAVAXVault,
    avaxVaultRead,
    setCurrentAVAXVaultRead,
  };
};
