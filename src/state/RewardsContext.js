import React from "react";

export const REWARDS_DEFAULT_VALUE = {
  setCurrentWAVAXReward: () => {},
  setCurrentWETHReward: () => {},
  setCurrentDAIReward: () => {},

  setCurrentWAVAXPoolReward: () => {},
  setCurrentWETHPoolReward: () => {},
  setCurrentDAIPoolReward: () => {},
  setCurrentAVIXPoolReward: () => {},

  setCurrentWAVAXRewardRead: () => {},
  setCurrentWETHRewardRead: () => {},
  setCurrentDAIRewardRead: () => {},

  setCurrentWAVAXPoolRewardRead: () => {},
  setCurrentWETHPoolRewardRead: () => {},
  setCurrentDAIPoolRewardRead: () => {},
  setCurrentAVIXPoolRewardRead: () => {},
};

const rewardsContext = React.createContext(REWARDS_DEFAULT_VALUE);

export default rewardsContext;
