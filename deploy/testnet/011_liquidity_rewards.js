import { ethers as ethershardhat, hardhatArguments } from 'hardhat'
import { deployments } from 'hardhat'
require('dotenv').config()

module.exports = async (hre) => {
  let initial_run = process.env.INITIAL_RUN === 'false' ? true : false

  if (
    (hardhatArguments.network === 'fuji' ||
      hardhatArguments.network === 'hardhat') &&
    initial_run
  ) {
    const ethers = hre.ethers
    const namedAccounts = await hre.getNamedAccounts()
    const deployer = namedAccounts.deployer
    const { log } = deployments
    let OrchestratorDeployment = await deployments.get('Orchestrator')
    let avixDeployment = await deployments.get('Avix')
    // eslint-disable-next-line
    let timelock = await deployments.get('Timelock')

    let vestingRatio = process.env.VESTING_RATIO
    const { timestamp: now } = await ethers.provider.getBlock('latest')
    const vestingBegin = now + 60
    const vestingEnd = vestingBegin + 60 * 60 * 24 * 182
    let rewardsToken = avixDeployment.address
    let stakingToken = process.env.LP_DVIX_AVAX

    let rewardAmount = ethershardhat.utils.parseEther('400000')
    const abi = new ethershardhat.utils.AbiCoder()

    // eslint-disable-next-line
    const value = 0
    // eslint-disable-next-line
    const signature = 'notifyRewardAmount(uint256)'
    // eslint-disable-next-line
    const data = abi.encode(['uint256'], [rewardAmount])
    // eslint-disable-next-line
    let orchestrator = await ethershardhat.getContractAt(
      'Orchestrator',
      OrchestratorDeployment.address,
    )

    console.log('deploying liquidity rewards')

    // AVAX
    let rewardDeployment = await deployments.deploy('AVAXLiquidityReward', {
      contract: 'LiquidityReward',
      from: deployer,
      args: [
        OrchestratorDeployment.address,
        rewardsToken,
        stakingToken,
        vestingEnd,
        vestingRatio,
      ],
    })
    log(
      `Liquidity Reward deployed at ${rewardDeployment.address} for ${rewardDeployment.receipt?.gasUsed}`,
    )

    console.log('Adding rewards')

    // let avix = await ethershardhat.getContractAt(
    //     "Avix",
    //     avixDeployment.address
    // );
    // let target = rewardDeployment.address;

    // await avix.transfer(target, rewardAmount);
    // await orchestrator.executeTransaction(target, value, signature, data);

    // /// WBTC
    // stakingToken = process.env.LP_DVIX_WBTC;
    // rewardDeployment = await deployments.deploy("WBTCLiquidityReward", {
    //     contract: "LiquidityReward",
    //     from: deployer,
    //     args: [
    //         OrchestratorDeployment.address,
    //         rewardsToken,
    //         stakingToken,
    //         vestingEnd,
    //         vestingRatio,
    //     ],
    // });
    // log(
    //     `Liquidity Reward deployed at ${rewardDeployment.address} for ${rewardDeployment.receipt?.gasUsed}`
    // );

    // console.log("Adding rewards");

    // target = rewardDeployment.address;

    // await avix.transfer(target, rewardAmount);
    // await orchestrator.executeTransaction(target, value, signature, data);

    // /// WETH
    // stakingToken = process.env.LP_DVIX_WETH;
    // rewardDeployment = await deployments.deploy("WETHLiquidityReward", {
    //     contract: "LiquidityReward",
    //     from: deployer,
    //     args: [
    //         OrchestratorDeployment.address,
    //         rewardsToken,
    //         stakingToken,
    //         vestingEnd,
    //         vestingRatio,
    //     ],
    // });
    // log(
    //     `Liquidity Reward deployed at ${rewardDeployment.address} for ${rewardDeployment.receipt?.gasUsed}`
    // );

    // console.log("Adding rewards");

    // target = rewardDeployment.address;

    // await avix.transfer(target, rewardAmount);
    // await orchestrator.executeTransaction(target, value, signature, data);

    // /// USDT
    // stakingToken = process.env.LP_DVIX_USDT;
    // rewardDeployment = await deployments.deploy("USDTLiquidityReward", {
    //     contract: "LiquidityReward",
    //     from: deployer,
    //     args: [
    //         OrchestratorDeployment.address,
    //         rewardsToken,
    //         stakingToken,
    //         vestingEnd,
    //         vestingRatio,
    //     ],
    // });
    // log(
    //     `Liquidity Reward deployed at ${rewardDeployment.address} for ${rewardDeployment.receipt?.gasUsed}`
    // );

    // console.log("Adding rewards");

    // target = rewardDeployment.address;

    // await avix.transfer(target, rewardAmount);
    // await orchestrator.executeTransaction(target, value, signature, data);

    // // DAI
    // stakingToken = process.env.LP_DVIX_DAI;
    // rewardDeployment = await deployments.deploy("DAILiquidityReward", {
    //     contract: "LiquidityReward",
    //     from: deployer,
    //     args: [
    //         OrchestratorDeployment.address,
    //         rewardsToken,
    //         stakingToken,
    //         vestingEnd,
    //         vestingRatio,
    //     ],
    // });
    // log(
    //     `Liquidity Reward deployed at ${rewardDeployment.address} for ${rewardDeployment.receipt?.gasUsed}`
    // );

    // console.log("Adding rewards");

    // target = rewardDeployment.address;

    // await avix.transfer(target, rewardAmount);
    // await orchestrator.executeTransaction(target, value, signature, data);

    // // AVIX
    // stakingToken = process.env.LP_AVIX_AVAX;
    // rewardDeployment = await deployments.deploy("AVIXLiquidityReward", {
    //     contract: "LiquidityReward",
    //     from: deployer,
    //     args: [
    //         OrchestratorDeployment.address,
    //         rewardsToken,
    //         stakingToken,
    //         vestingEnd,
    //         vestingRatio,
    //     ],
    // });
    // log(
    //     `Liquidity Reward deployed at ${rewardDeployment.address} for ${rewardDeployment.receipt?.gasUsed}`
    // );

    // console.log("Adding rewards");

    // target = rewardDeployment.address;

    // await avix.transfer(target, rewardAmount);
    // await orchestrator.executeTransaction(target, value, signature, data);

    // //Transfer ownership
    // await orchestrator.transferOwnership(timelock.address);
  }
}

module.exports.tags = ['Initialize']
