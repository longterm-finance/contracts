const { hardhatArguments } = require('hardhat')
const { deployments } = require('hardhat')

const WBTCVaultHandler = async (hre) => {
  let initial_run = process.env.INITIAL_RUN === 'true' ? true : false
  if (
    (hardhatArguments.network === 'fuji' ||
      hardhatArguments.network === 'hardhat') &&
    initial_run
  ) {
    const { log } = deployments
    const namedAccounts = await hre.getNamedAccounts()
    const deployer = namedAccounts.deployer
    const ethers = hre.ethers
    const [owner] = await ethers.getSigners()
    let handlerContract
    let orchestrator = await deployments.get('Orchestrator')
    let avix = await deployments.get('Avix')
    try {
      handlerContract = await deployments.get('WBTCVaultHandler')
    } catch (error) {
      try {
        let dvix = await deployments.get('DVIX')
        let WBTCContract = await deployments.get('WBTC')
        let divisor = process.env.DIVISOR
        let ratio = process.env.RATIO
        let burnFee = process.env.BURN_FEE
        let liquidationPenalty = process.env.LIQUIDATION_PENALTY
        let vixOracle = await deployments.get('VIXOracle')
        let priceFeedAVAX = await deployments.get('AVAXOracle')
        let priceFeedBTC = await deployments.get('BTCOracle')
        let nonce = await owner.getTransactionCount()
        const vaultAddress = ethers.utils.getContractAddress({
          from: deployer,
          nonce: nonce++,
        })
        const rewardAddress = ethers.utils.getContractAddress({
          from: deployer,
          nonce: nonce++,
        })
        const timelock = await deployments.get('Timelock')
        const deployResult = await deployments.deploy('WBTCVaultHandler', {
          from: deployer,
          contract: 'ERC20VaultHandler',
          args: [
            orchestrator.address,
            divisor,
            ratio,
            burnFee,
            liquidationPenalty,
            vixOracle.address,
            dvix.address,
            WBTCContract.address,
            priceFeedBTC.address,
            priceFeedAVAX.address,
            rewardAddress,
            timelock.address,
          ],
        })
        handlerContract = await deployments.get('WBTCVaultHandler')
        if (deployResult.newlyDeployed) {
          log(
            `WBTCVaultHandler deployed at ${handlerContract.address} for ${deployResult.receipt?.gasUsed}`,
          )
        }
        const rewardDeployment = await deployments.deploy('WBTCRewardHandler', {
          contract: 'RewardHandler',
          from: deployer,
          args: [orchestrator.address, avix.address, vaultAddress],
        })
        log(
          `Reward Handler deployed at ${rewardDeployment.address} for ${rewardDeployment.receipt?.gasUsed}`,
        )
      } catch (error) {
        log(error.message)
      }
    }
  }
}

module.exports = WBTCVaultHandler
