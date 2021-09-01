const { hardhatArguments } = require('hardhat')
const { deployments } = require('hardhat')

const AVAXVaultHandler = async (hre) => {
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
      handlerContract = await deployments.get('WAVAXVaultHandler')
    } catch (error) {
      log(error.message)
      try {
        let dvix = await deployments.get('DVIX')

        let WAVAXContract = await deployments.get('WAVAX')

        let divisor = process.env.DIVISOR
        let ratio = process.env.RATIO
        let burnFee = process.env.BURN_FEE
        let liquidationPenalty = process.env.LIQUIDATION_PENALTY

        let vixOracle = await deployments.get('VIXOracle')
        let priceFeedAVAX = await deployments.get('AVAXOracle')
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
        const deployResult = await deployments.deploy('AVAXVaultHandler', {
          from: deployer,
          contract: 'AVAXVaultHandler',
          args: [
            orchestrator.address,
            divisor,
            ratio,
            burnFee,
            liquidationPenalty,
            vixOracle.address,
            dvix.address,
            WAVAXContract.address,
            priceFeedAVAX.address,
            priceFeedAVAX.address,
            rewardAddress,
            timelock.address,
          ],
        })
        handlerContract = await deployments.get('AVAXVaultHandler')
        if (deployResult.newlyDeployed) {
          log(
            `AVAXVaultHandler deployed at ${handlerContract.address} for ${deployResult.receipt?.gasUsed}`,
          )
        }
        const rewardDeployment = await deployments.deploy('AVAXRewardHandler', {
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

module.exports = AVAXVaultHandler