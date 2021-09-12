import { useState, useCallback } from "react";

export const useRewards = () => {
  const [avaxReward, setAVAXReward] = useState();
  const [wethReward, setWETHReward] = useState();
  const [daiReward, setDAIReward] = useState();

  const [avaxPoolReward, setAVAXPoolReward] = useState();
  const [wethPoolReward, setWETHPoolReward] = useState();
  const [daiPoolReward, setDAIPoolReward] = useState();
  const [avixPoolReward, setAVIXPoolReward] = useState();

  const [avaxRewardRead, setAVAXRewardRead] = useState();
  const [wethRewardRead, setWETHRewardRead] = useState();
  const [daiRewardRead, setDAIRewardRead] = useState();

  const [avaxPoolRewardRead, setAVAXPoolRewardRead] = useState();
  const [wethPoolRewardRead, setWETHPoolRewardRead] = useState();
  const [daiPoolRewardRead, setDAIPoolRewardRead] = useState();
  const [avixPoolRewardRead, setAVIXPoolRewardRead] = useState();

  const setCurrentAVAXReward = useCallback((currentAVAXReward) => {
    setAVAXReward(currentAVAXReward);
  }, []);
  const setCurrentWETHReward = useCallback((currentWETHReward) => {
    setWETHReward(currentWETHReward);
  }, []);
  const setCurrentDAIReward = useCallback((currentDAIReward) => {
    setDAIReward(currentDAIReward);
  }, []);

  const setCurrentAVAXPoolReward = useCallback((currentAVAXPoolReward) => {
    setAVAXPoolReward(currentAVAXPoolReward);
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

  const setCurrentAVAXRewardRead = useCallback((currentAVAXReward) => {
    setAVAXRewardRead(currentAVAXReward);
  }, []);
  const setCurrentWETHRewardRead = useCallback((currentWETHReward) => {
    setWETHRewardRead(currentWETHReward);
  }, []);
  const setCurrentDAIRewardRead = useCallback((currentDAIReward) => {
    setDAIRewardRead(currentDAIReward);
  }, []);

  const setCurrentAVAXPoolRewardRead = useCallback((currentAVAXPoolReward) => {
    setAVAXPoolRewardRead(currentAVAXPoolReward);
  }, []);
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
    avaxReward,
    setCurrentAVAXReward,
    wethReward,
    setCurrentWETHReward,
    daiReward,
    setCurrentDAIReward,

    avaxPoolReward,
    setCurrentAVAXPoolReward,
    wethPoolReward,
    setCurrentWETHPoolReward,
    daiPoolReward,
    setCurrentDAIPoolReward,
    avixPoolReward,
    setCurrentAVIXPoolReward,

    avaxRewardRead,
    setCurrentAVAXRewardRead,
    wethRewardRead,
    setCurrentWETHRewardRead,
    daiRewardRead,
    setCurrentDAIRewardRead,

    avaxPoolRewardRead,
    setCurrentAVAXPoolRewardRead,
    wethPoolRewardRead,
    setCurrentWETHPoolRewardRead,
    daiPoolRewardRead,
    setCurrentDAIPoolRewardRead,
    avixPoolRewardRead,
    setCurrentAVIXPoolRewardRead,
  };
};
