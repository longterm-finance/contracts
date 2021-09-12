import React from "react";

export const REWARDS_DEFAULT_VALUE = {
  setCurrentAVAXReward: () => {},
  setCurrentWETHReward: () => {},
  setCurrentDAIReward: () => {},

  setCurrentAVAXPoolReward: () => {},
  setCurrentWETHPoolReward: () => {},
  setCurrentDAIPoolReward: () => {},
  setCurrentAVIXPoolReward: () => {},

  setCurrentAVAXRewardRead: () => {},
  setCurrentWETHRewardRead: () => {},
  setCurrentDAIRewardRead: () => {},

  setCurrentAVAXPoolRewardRead: () => {},
  setCurrentWETHPoolRewardRead: () => {},
  setCurrentDAIPoolRewardRead: () => {},
  setCurrentAVIXPoolRewardRead: () => {},
};

const rewardsContext = React.createContext(REWARDS_DEFAULT_VALUE);

export default rewardsContext;
