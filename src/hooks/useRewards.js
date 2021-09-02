import { useState, useCallback } from "react";

export const useRewards = () => {
  const [avaxReward, setAVAXReward] = useState();
  const [usdtReward, setUSDTReward] = useState();
  const [wethReward, setWETHReward] = useState();
  const [daiReward, setDAIReward] = useState();
  const [wbtcReward, setWBTCReward] = useState();

  const [avaxPoolReward, setAVAXPoolReward] = useState();
  const [usdtPoolReward, setUSDTPoolReward] = useState();
  const [wethPoolReward, setWETHPoolReward] = useState();
  const [daiPoolReward, setDAIPoolReward] = useState();
  const [wbtcPoolReward, setWBTCPoolReward] = useState();
  const [avixPoolReward, setAVIXPoolReward] = useState();

  const [avaxRewardRead, setAVAXRewardRead] = useState();
  const [usdtRewardRead, setUSDTRewardRead] = useState();
  const [wethRewardRead, setWETHRewardRead] = useState();
  const [daiRewardRead, setDAIRewardRead] = useState();
  const [wbtcRewardRead, setWBTCRewardRead] = useState();

  const [avaxPoolRewardRead, setAVAXPoolRewardRead] = useState();
  const [usdtPoolRewardRead, setUSDTPoolRewardRead] = useState();
  const [wethPoolRewardRead, setWETHPoolRewardRead] = useState();
  const [daiPoolRewardRead, setDAIPoolRewardRead] = useState();
  const [wbtcPoolRewardRead, setWBTCPoolRewardRead] = useState();
  const [avixPoolRewardRead, setAVIXPoolRewardRead] = useState();

  const setCurrentAVAXReward = useCallback((currentAVAXReward) => {
    setAVAXReward(currentAVAXReward);
  }, []);
  const setCurrentUSDTReward = useCallback((currentUSDTReward) => {
    setUSDTReward(currentUSDTReward);
  }, []);
  const setCurrentWETHReward = useCallback((currentWETHReward) => {
    setWETHReward(currentWETHReward);
  }, []);
  const setCurrentDAIReward = useCallback((currentDAIReward) => {
    setDAIReward(currentDAIReward);
  }, []);
  const setCurrentWBTCReward = useCallback((currentWBTCReward) => {
    setWBTCReward(currentWBTCReward);
  }, []);

  const setCurrentAVAXPoolReward = useCallback((currentAVAXPoolReward) => {
    setAVAXPoolReward(currentAVAXPoolReward);
  }, []);
  const setCurrentUSDTPoolReward = useCallback((currentUSDTPoolReward) => {
    setUSDTPoolReward(currentUSDTPoolReward);
  }, []);
  const setCurrentWETHPoolReward = useCallback((currentWETHPoolReward) => {
    setWETHPoolReward(currentWETHPoolReward);
  }, []);
  const setCurrentDAIPoolReward = useCallback((currentDAIPoolReward) => {
    setDAIPoolReward(currentDAIPoolReward);
  }, []);
  const setCurrentWBTCPoolReward = useCallback((currentWBTCPoolReward) => {
    setWBTCPoolReward(currentWBTCPoolReward);
  }, []);
  const setCurrentAVIXPoolReward = useCallback((currentAVIXPoolReward) => {
    setAVIXPoolReward(currentAVIXPoolReward);
  }, []);

  const setCurrentAVAXRewardRead = useCallback((currentAVAXReward) => {
    setAVAXRewardRead(currentAVAXReward);
  }, []);
  const setCurrentUSDTRewardRead = useCallback((currentUSDTReward) => {
    setUSDTRewardRead(currentUSDTReward);
  }, []);
  const setCurrentWETHRewardRead = useCallback((currentWETHReward) => {
    setWETHRewardRead(currentWETHReward);
  }, []);
  const setCurrentDAIRewardRead = useCallback((currentDAIReward) => {
    setDAIRewardRead(currentDAIReward);
  }, []);
  const setCurrentWBTCRewardRead = useCallback((currentWBTCReward) => {
    setWBTCRewardRead(currentWBTCReward);
  }, []);

  const setCurrentAVAXPoolRewardRead = useCallback((currentAVAXPoolReward) => {
    setAVAXPoolRewardRead(currentAVAXPoolReward);
  }, []);
  const setCurrentUSDTPoolRewardRead = useCallback((currentUSDTPoolReward) => {
    setUSDTPoolRewardRead(currentUSDTPoolReward);
  }, []);
  const setCurrentWETHPoolRewardRead = useCallback((currentWETHPoolReward) => {
    setWETHPoolRewardRead(currentWETHPoolReward);
  }, []);
  const setCurrentDAIPoolRewardRead = useCallback((currentDAIPoolReward) => {
    setDAIPoolRewardRead(currentDAIPoolReward);
  }, []);
  const setCurrentWBTCPoolRewardRead = useCallback((currentWBTCPoolReward) => {
    setWBTCPoolRewardRead(currentWBTCPoolReward);
  }, []);
  const setCurrentAVIXPoolRewardRead = useCallback((currentAVIXPoolReward) => {
    setAVIXPoolRewardRead(currentAVIXPoolReward);
  }, []);

  return {
    avaxReward,
    setCurrentAVAXReward,
    usdtReward,
    setCurrentUSDTReward,
    wethReward,
    setCurrentWETHReward,
    daiReward,
    setCurrentDAIReward,
    wbtcReward,
    setCurrentWBTCReward,

    avaxPoolReward,
    setCurrentAVAXPoolReward,
    usdtPoolReward,
    setCurrentUSDTPoolReward,
    wethPoolReward,
    setCurrentWETHPoolReward,
    daiPoolReward,
    setCurrentDAIPoolReward,
    wbtcPoolReward,
    setCurrentWBTCPoolReward,
    avixPoolReward,
    setCurrentAVIXPoolReward,

    avaxRewardRead,
    setCurrentAVAXRewardRead,
    usdtRewardRead,
    setCurrentUSDTRewardRead,
    wethRewardRead,
    setCurrentWETHRewardRead,
    daiRewardRead,
    setCurrentDAIRewardRead,
    wbtcRewardRead,
    setCurrentWBTCRewardRead,

    avaxPoolRewardRead,
    setCurrentAVAXPoolRewardRead,
    usdtPoolRewardRead,
    setCurrentUSDTPoolRewardRead,
    wethPoolRewardRead,
    setCurrentWETHPoolRewardRead,
    daiPoolRewardRead,
    setCurrentDAIPoolRewardRead,
    wbtcPoolRewardRead,
    setCurrentWBTCPoolRewardRead,
    avixPoolRewardRead,
    setCurrentAVIXPoolRewardRead,
  };
};
