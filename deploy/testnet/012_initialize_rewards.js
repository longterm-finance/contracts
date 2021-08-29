const { ethers, hardhatArguments } = require('hardhat')
const ethershardhat = ethers
require('dotenv').config()

module.exports = async ({ deployments }) => {
  let initial_run = process.env.INITIAL_RUN === 'true' ? true : false
  if (
    (hardhatArguments.network === 'fuji' ||
      hardhatArguments.network === 'hardhat') &&
    initial_run
  ) {
    let rDAIHandler = await deployments.get('DAIRewardHandler')
    let rWBTCHandler = await deployments.get('WBTCRewardHandler')
    let rWETHHandler = await deployments.get('WETHRewardHandler')
    let rWAVAXHandler = await deployments.get('WAVAXRewardHandler')
    let rUSDTHandler = await deployments.get('USDTRewardHandler')
    let OrchestratorDeployment = await deployments.get('Orchestrator')
    let avixDeployment = await deployments.get('Avix')

    let rewardAmount = ethershardhat.utils.parseEther('500000')
    const abi = new ethershardhat.utils.AbiCoder()

    const value = 0
    const signature = 'notifyRewardAmount(uint256)'
    const data = abi.encode(['uint256'], [rewardAmount])
    let orchestrator = await ethershardhat.getContractAt(
      'Orchestrator',
      OrchestratorDeployment.address,
    )

    console.log('Adding rewards')

    let avix = await ethershardhat.getContractAt('Avix', avixDeployment.address)
    let target = rDAIHandler.address

    await avix.transfer(target, rewardAmount)
    await orchestrator.executeTransaction(target, value, signature, data)

    target = rWBTCHandler.address

    await avix.transfer(target, rewardAmount)
    await orchestrator.executeTransaction(target, value, signature, data)

    target = rWETHHandler.address

    await avix.transfer(target, rewardAmount)
    await orchestrator.executeTransaction(target, value, signature, data)

    target = rWAVAXHandler.address

    await avix.transfer(target, rewardAmount)
    await orchestrator.executeTransaction(target, value, signature, data)

    target = rUSDTHandler.address

    await avix.transfer(target, rewardAmount)
    await orchestrator.executeTransaction(target, value, signature, data)

    console.log('no transfer')
  }
}

module.exports.tags = ['Initialize']
