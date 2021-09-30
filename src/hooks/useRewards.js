import { useState, useCallback } from "react";

export const useRewards = () => {
  const [wavaxReward, setWAVAXReward] = useState();
  const [wethReward, setWETHReward] = useState();
  const [daiReward, setDAIReward] = useState();

  const [wavaxPoolReward, setWAVAXPoolReward] = useState();
  const [wethPoolReward, setWETHPoolReward] = useState();
  const [daiPoolReward, setDAIPoolReward] = useState();
  const [avixPoolReward, setAVIXPoolReward] = useState();

  const [wavaxRewardRead, setWAVAXRewardRead] = useState();
  const [wethRewardRead, setWETHRewardRead] = useState();
  const [daiRewardRead, setDAIRewardRead] = useState();

  const [wavaxPoolRewardRead, setWAVAXPoolRewardRead] = useState();
  const [wethPoolRewardRead, setWETHPoolRewardRead] = useState();
  const [daiPoolRewardRead, setDAIPoolRewardRead] = useState();
  const [avixPoolRewardRead, setAVIXPoolRewardRead] = useState();

  const setCurrentWAVAXReward = useCallback((currentWAVAXReward) => {
    setWAVAXReward(currentWAVAXReward);
  }, []);
  const setCurrentWETHReward = useCallback((currentWETHReward) => {
    setWETHReward(currentWETHReward);
  }, []);
  const setCurrentDAIReward = useCallback((currentDAIReward) => {
    setDAIReward(currentDAIReward);
  }, []);

  const setCurrentWAVAXPoolReward = useCallback((currentWAVAXPoolReward) => {
    setWAVAXPoolReward(currentWAVAXPoolReward);
  }, []);
  const setCurrentWETHPoolReward = useCallback((currentWETHPoolReward) => {
    setWETHPoolReward(currentWETHPoolReward);
  }, []);
  const setCurrentDAIPoolReward = useCallback((currentDAIPoolReward) => {
    setDAIPoolReward(currentDAIPoolReward);
  }, []);
  const setCurrentAVIXPoolReward = useCallback((currentAVIXPoolReward) => {
    setAVIXPoolReward(currentAVIXPoolReward);
  }, []);

  const setCurrentWAVAXRewardRead = useCallback((currentWAVAXReward) => {
    setWAVAXRewardRead(currentWAVAXReward);
  }, []);
  const setCurrentWETHRewardRead = useCallback((currentWETHReward) => {
    setWETHRewardRead(currentWETHReward);
  }, []);
  const setCurrentDAIRewardRead = useCallback((currentDAIReward) => {
    setDAIRewardRead(currentDAIReward);
  }, []);

  const setCurrentWAVAXPoolRewardRead = useCallback(
    (currentWAVAXPoolReward) => {
      setWAVAXPoolRewardRead(currentWAVAXPoolReward);
    },
    []
  );
  const setCurrentWETHPoolRewardRead = useCallback((currentWETHPoolReward) => {
    setWETHPoolRewardRead(currentWETHPoolReward);
  }, []);
  const setCurrentDAIPoolRewardRead = useCallback((currentDAIPoolReward) => {
    setDAIPoolRewardRead(currentDAIPoolReward);
  }, []);
  const setCurrentAVIXPoolRewardRead = useCallback((currentAVIXPoolReward) => {
    setAVIXPoolRewardRead(currentAVIXPoolReward);
  }, []);

  return {
    wavaxReward,
    setCurrentWAVAXReward,
    wethReward,
    setCurrentWETHReward,
    daiReward,
    setCurrentDAIReward,

    wavaxPoolReward,
    setCurrentWAVAXPoolReward,
    wethPoolReward,
    setCurrentWETHPoolReward,
    daiPoolReward,
    setCurrentDAIPoolReward,
    avixPoolReward,
    setCurrentAVIXPoolReward,

    wavaxRewardRead,
    setCurrentWAVAXRewardRead,
    wethRewardRead,
    setCurrentWETHRewardRead,
    daiRewardRead,
    setCurrentDAIRewardRead,

    wavaxPoolRewardRead,
    setCurrentWAVAXPoolRewardRead,
    wethPoolRewardRead,
    setCurrentWETHPoolRewardRead,
    daiPoolRewardRead,
    setCurrentDAIPoolRewardRead,
    avixPoolRewardRead,
    setCurrentAVIXPoolRewardRead,
  };
};
