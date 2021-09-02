import { useState, useCallback } from "react";

export const useVaults = () => {
  const [avaxVault, setAVAXVault] = useState();
  const [usdtVault, setUSDTVault] = useState();
  const [wethVault, setWETHVault] = useState();
  const [daiVault, setDAIVault] = useState();
  const [wbtcVault, setWBTCVault] = useState();

  const [avaxVaultRead, setAVAXVaultRead] = useState();
  const [usdtVaultRead, setUSDTVaultRead] = useState();
  const [wethVaultRead, setWETHVaultRead] = useState();
  const [daiVaultRead, setDAIVaultRead] = useState();
  const [wbtcVaultRead, setWBTCVaultRead] = useState();

  const setCurrentAVAXVault = useCallback((currentAVAXVault) => {
    setAVAXVault(currentAVAXVault);
  }, []);

  const setCurrentUSDTVault = useCallback((currentUSDTVault) => {
    setUSDTVault(currentUSDTVault);
  }, []);

  const setCurrentWETHVault = useCallback((currentWETHVault) => {
    setWETHVault(currentWETHVault);
  }, []);

  const setCurrentDAIVault = useCallback((currentDAIVault) => {
    setDAIVault(currentDAIVault);
  }, []);

  const setCurrentWBTCVault = useCallback((currentWBTCVault) => {
    setWBTCVault(currentWBTCVault);
  }, []);

  const setCurrentAVAXVaultRead = useCallback((currentAVAXVaultRead) => {
    setAVAXVaultRead(currentAVAXVaultRead);
  }, []);

  const setCurrentUSDTVaultRead = useCallback((currentUSDTVaultRead) => {
    setUSDTVaultRead(currentUSDTVaultRead);
  }, []);

  const setCurrentWETHVaultRead = useCallback((currentWETHVaultRead) => {
    setWETHVaultRead(currentWETHVaultRead);
  }, []);

  const setCurrentDAIVaultRead = useCallback((currentDAIVaultRead) => {
    setDAIVaultRead(currentDAIVaultRead);
  }, []);

  const setCurrentWBTCVaultRead = useCallback((currentWBTCVaultRead) => {
    setWBTCVaultRead(currentWBTCVaultRead);
  }, []);

  return {
    wethVault,
    setCurrentWETHVault,
    daiVault,
    setCurrentDAIVault,
    wbtcVault,
    setCurrentWBTCVault,
    wethVaultRead,
    setCurrentWETHVaultRead,
    daiVaultRead,
    setCurrentDAIVaultRead,
    wbtcVaultRead,
    setCurrentWBTCVaultRead,
    avaxVault,
    setCurrentAVAXVault,
    usdtVault,
    setCurrentUSDTVault,
    avaxVaultRead,
    setCurrentAVAXVaultRead,
    usdtVaultRead,
    setCurrentUSDTVaultRead,
  };
};
