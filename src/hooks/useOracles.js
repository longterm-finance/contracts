import { useState, useCallback } from "react";

export const useOracles = () => {
  const [avaxOracle, setAVAXOracle] = useState();
  const [wethOracle, setETHOracle] = useState();
  const [daiOracle, setDAIOracle] = useState();
  const [dvixOracle, setDVIXOracle] = useState();

  const [avaxOracleRead, setAVAXOracleRead] = useState();
  const [wethOracleRead, setETHOracleRead] = useState();
  const [daiOracleRead, setDAIOracleRead] = useState();
  const [dvixOracleRead, setDVIXOracleRead] = useState();

  const setCurrentAVAXOracle = useCallback((currentAVAXOracle) => {
    setAVAXOracle(currentAVAXOracle);
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

  const setCurrentAVAXOracleRead = useCallback((currentAVAXOracleRead) => {
    setAVAXOracleRead(currentAVAXOracleRead);
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
    avaxOracle,
    setCurrentAVAXOracle,
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
    avaxOracleRead,
    setCurrentAVAXOracleRead,
  };
};
