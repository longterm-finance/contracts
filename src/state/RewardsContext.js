import React from "react";

export const REWARDS_DEFAULT_VALUE = {
  setCurrentAVAXReward: () => {},
  setCurrentUSDTReward: () => {},
  setCurrentWETHReward: () => {},
  setCurrentDAIReward: () => {},
  setCurrentWBTCReward: () => {},

  setCurrentAVAXPoolReward: () => {},
  setCurrentUSDTPoolReward: () => {},
  setCurrentWETHPoolReward: () => {},
  setCurrentDAIPoolReward: () => {},
  setCurrentWBTCPoolReward: () => {},
  setCurrentAVIXPoolReward: () => {},

  setCurrentAVAXRewardRead: () => {},
  setCurrentUSDTrewardRead: () => {},
  setCurrentWETHRewardRead: () => {},
  setCurrentDAIRewardRead: () => {},
  setCurrentWBTCRewardRead: () => {},

  setCurrentAVAXPoolRewardRead: () => {},
  setCurrentUSDTPoolRewardRead: () => {},
  setCurrentWETHPoolRewardRead: () => {},
  setCurrentDAIPoolRewardRead: () => {},
  setCurrentWBTCPoolRewardRead: () => {},
  setCurrentAVIXPoolRewardRead: () => {},
};

const rewardsContext = React.createContext(REWARDS_DEFAULT_VALUE);

export default rewardsContext;
