import { useState, useCallback } from "react";

export const useOracles = () => {
  const [wavaxOracle, setWAVAXOracle] = useState();
  const [wethOracle, setETHOracle] = useState();
  const [daiOracle, setDAIOracle] = useState();
  const [dvixOracle, setDVIXOracle] = useState();

  const [wavaxOracleRead, setWAVAXOracleRead] = useState();
  const [wethOracleRead, setETHOracleRead] = useState();
  const [daiOracleRead, setDAIOracleRead] = useState();
  const [dvixOracleRead, setDVIXOracleRead] = useState();

  const setCurrentWAVAXOracle = useCallback((currentWAVAXOracle) => {
    setWAVAXOracle(currentWAVAXOracle);
  }, []);
  const setCurrentWETHOracle = useCallback((currentWETHOracle) => {
    setETHOracle(currentWETHOracle);
  }, []);
  const setCurrentDAIOracle = useCallback((currentDAIOracle) => {
    setDAIOracle(currentDAIOracle);
  }, []);
  const setCurrentDVIXOracle = useCallback((currentDVIXOracle) => {
    setDVIXOracle(currentDVIXOracle);
  }, []);

  const setCurrentWAVAXOracleRead = useCallback((currentWAVAXOracleRead) => {
    setWAVAXOracleRead(currentWAVAXOracleRead);
  }, []);
  const setCurrentWETHOracleRead = useCallback((currentWETHOracleRead) => {
    setETHOracleRead(currentWETHOracleRead);
  }, []);
  const setCurrentDAIOracleRead = useCallback((currentDAIOracleRead) => {
    setDAIOracleRead(currentDAIOracleRead);
  }, []);
  const setCurrentDVIXOracleRead = useCallback((currentDVIXOracleRead) => {
    setDVIXOracleRead(currentDVIXOracleRead);
  }, []);

  return {
    wavaxOracle,
    setCurrentWAVAXOracle,
    wethOracle,
    setCurrentWETHOracle,
    daiOracle,
    setCurrentDAIOracle,
    dvixOracle,
    setCurrentDVIXOracle,
    wethOracleRead,
    setCurrentWETHOracleRead,
    daiOracleRead,
    setCurrentDAIOracleRead,
    dvixOracleRead,
    setCurrentDVIXOracleRead,
    wavaxOracleRead,
    setCurrentWAVAXOracleRead,
  };
};
