import { useState, useCallback } from "react";

export const useGovernance = () => {
  const [governorBeta, setGovernorBeta] = useState();
  const [timelock, setTimelock] = useState();
  const [governorBetaRead, setGovernorBetaRead] = useState();
  const [timelockRead, setTimelockRead] = useState();

  const setCurrentGovernorBeta = useCallback((currentGovernorBeta) => {
    setGovernorBeta(currentGovernorBeta);
  }, []);
  const setCurrentTimelock = useCallback((currentTimelock) => {
    setTimelock(currentTimelock);
  }, []);

  const setCurrentGovernorBetaRead = useCallback((currentGovernorBetaRead) => {
    setGovernorBetaRead(currentGovernorBetaRead);
  }, []);
  const setCurrentTimelockRead = useCallback((currentTimelockRead) => {
    setTimelockRead(currentTimelockRead);
  }, []);

  return {
    governorBeta,
    setCurrentGovernorBeta,
    timelock,
    setCurrentTimelock,
    governorBetaRead,
    setCurrentGovernorBetaRead,
    timelockRead,
    setCurrentTimelockRead,
  };
};
