import { useState, useCallback } from "react";

export const useOracles = () => {
  const [avaxOracle, setAVAXOracle] = useState();
  const [usdtOracle, setUSDTOracle] = useState();
  const [wethOracle, setETHOracle] = useState();
  const [daiOracle, setDAIOracle] = useState();
  const [wbtcOracle, setWBTCOracle] = useState();
  const [dvixOracle, setDVIXOracle] = useState();

  const [avaxOracleRead, setAVAXOracleRead] = useState();
  const [usdtOracleRead, setUSDTOracleRead] = useState();
  const [wethOracleRead, setETHOracleRead] = useState();
  const [daiOracleRead, setDAIOracleRead] = useState();
  const [wbtcOracleRead, setWBTCOracleRead] = useState();
  const [dvixOracleRead, setDVIXOracleRead] = useState();

  const setCurrentAVAXOracle = useCallback((currentAVAXOracle) => {
    setAVAXOracle(currentAVAXOracle);
  }, []);
  const setCurrentUSDTOracle = useCallback((currentUSDTOracle) => {
    setUSDTOracle(currentUSDTOracle);
  }, []);
  const setCurrentWETHOracle = useCallback((currentWETHOracle) => {
    setETHOracle(currentWETHOracle);
  }, []);
  const setCurrentDAIOracle = useCallback((currentDAIOracle) => {
    setDAIOracle(currentDAIOracle);
  }, []);
  const setCurrentWBTCOracle = useCallback((currentWBTCOracle) => {
    setWBTCOracle(currentWBTCOracle);
  }, []);
  const setCurrentDVIXOracle = useCallback((currentDVIXOracle) => {
    setDVIXOracle(currentDVIXOracle);
  }, []);

  const setCurrentAVAXOracleRead = useCallback((currentAVAXOracleRead) => {
    setAVAXOracleRead(currentAVAXOracleRead);
  }, []);
  const setCurrentUSDTOracleRead = useCallback((currentUSDTOracleRead) => {
    setUSDTOracleRead(currentUSDTOracleRead);
  }, []);
  const setCurrentWETHOracleRead = useCallback((currentWETHOracleRead) => {
    setETHOracleRead(currentWETHOracleRead);
  }, []);
  const setCurrentDAIOracleRead = useCallback((currentDAIOracleRead) => {
    setDAIOracleRead(currentDAIOracleRead);
  }, []);
  const setCurrentWBTCOracleRead = useCallback((currentWBTCOracleRead) => {
    setWBTCOracleRead(currentWBTCOracleRead);
  }, []);
  const setCurrentDVIXOracleRead = useCallback((currentDVIXOracleRead) => {
    setDVIXOracleRead(currentDVIXOracleRead);
  }, []);

  return {
    avaxOracle,
    setCurrentAVAXOracle,
    usdtOracle,
    setCurrentUSDTOracle,
    wethOracle,
    setCurrentWETHOracle,
    daiOracle,
    setCurrentDAIOracle,
    wbtcOracle,
    setCurrentWBTCOracle,
    dvixOracle,
    setCurrentDVIXOracle,
    wethOracleRead,
    setCurrentWETHOracleRead,
    daiOracleRead,
    setCurrentDAIOracleRead,
    wbtcOracleRead,
    setCurrentWBTCOracleRead,
    dvixOracleRead,
    setCurrentDVIXOracleRead,
    avaxOracleRead,
    setCurrentAVAXOracleRead,
    usdtOracleRead,
    setCurrentUSDTOracleRead,
  };
};
