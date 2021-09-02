import { useState, useCallback } from "react";

export const useGovernance = () => {
  const [governorAlpha, setGovernorAlpha] = useState();
  const [timelock, setTimelock] = useState();
  const [governorAlphaRead, setGovernorAlphaRead] = useState();
  const [timelockRead, setTimelockRead] = useState();

  const setCurrentGovernorAlpha = useCallback((currentGovernorAlpha) => {
    setGovernorAlpha(currentGovernorAlpha);
  }, []);
  const setCurrentTimelock = useCallback((currentTimelock) => {
    setTimelock(currentTimelock);
  }, []);

  const setCurrentGovernorAlphaRead = useCallback(
    (currentGovernorAlphaRead) => {
      setGovernorAlphaRead(currentGovernorAlphaRead);
    },
    []
  );
  const setCurrentTimelockRead = useCallback((currentTimelockRead) => {
    setTimelockRead(currentTimelockRead);
  }, []);

  return {
    governorAlpha,
    setCurrentGovernorAlpha,
    timelock,
    setCurrentTimelock,
    governorAlphaRead,
    setCurrentGovernorAlphaRead,
    timelockRead,
    setCurrentTimelockRead,
  };
};
