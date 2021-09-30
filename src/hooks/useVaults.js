import { useState, useCallback } from "react";

export const useVaults = () => {
  const [wavaxVault, setWAVAXVault] = useState();
  const [wethVault, setWETHVault] = useState();
  const [daiVault, setDAIVault] = useState();

  const [wavaxVaultRead, setWAVAXVaultRead] = useState();
  const [wethVaultRead, setWETHVaultRead] = useState();
  const [daiVaultRead, setDAIVaultRead] = useState();

  const setCurrentWAVAXVault = useCallback((currentWAVAXVault) => {
    setWAVAXVault(currentWAVAXVault);
  }, []);

  const setCurrentWETHVault = useCallback((currentWETHVault) => {
    setWETHVault(currentWETHVault);
  }, []);

  const setCurrentDAIVault = useCallback((currentDAIVault) => {
    setDAIVault(currentDAIVault);
  }, []);

  const setCurrentWAVAXVaultRead = useCallback((currentWAVAXVaultRead) => {
    setWAVAXVaultRead(currentWAVAXVaultRead);
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
    wavaxVault,
    setCurrentWAVAXVault,
    wavaxVaultRead,
    setCurrentWAVAXVaultRead,
  };
};
