import { hardhatArguments } from 'hardhat'
import { deployments } from 'hardhat'

const USDTVaultHandler = async (hre) => {
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
      handlerContract = await deployments.get('USDTVaultHandler')
    } catch (error) {
      try {
        let dvix = await deployments.get('DVIX')
        let USDTContract = await deployments.get('USDT')
        let divisor = process.env.DIVISOR
        let ratio = process.env.RATIO
        let burnFee = process.env.BURN_FEE
        let liquidationPenalty = process.env.LIQUIDATION_PENALTY
        let vixOracle = await deployments.get('VIXOracle')
        let priceFeedAVAX = await deployments.get('AVAXOracle')
        let priceFeedUSDT = await deployments.get('USDTOracle')
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
        const deployResult = await deployments.deploy('USDTVaultHandler', {
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
            USDTContract.address,
            priceFeedUSDT.address,
            priceFeedAVAX.address,
            rewardAddress,
            timelock.address,
          ],
        })
        handlerContract = await deployments.get('USDTVaultHandler')
        if (deployResult.newlyDeployed) {
          log(
            `USDTVaultHandler deployed at ${handlerContract.address} for ${deployResult.receipt?.gasUsed}`,
          )
        }
        const rewardDeployment = await deployments.deploy('USDTRewardHandler', {
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

export default USDTVaultHandler
