const { hardhatArguments } = require('hardhat')
require('dotenv').config()

module.exports = async ({ getNamedAccounts, deployments }) => {
  let initial_run = process.env.INITIAL_RUN === 'true' ? true : false
  if (
    (hardhatArguments.network === 'fuji' ||
      hardhatArguments.network === 'hardhat') &&
    initial_run
  ) {
    const { deployIfDifferent, log } = deployments
    const { deployer } = await getNamedAccounts()
    const name = process.env.NAME
    const symbol = process.env.SYMBOL

    let orchestrator = await deployments.get('Orchestrator')

    let AVIX
    try {
      AVIX = await deployments.get('AVIX')
    } catch (error) {
      log(error.message)

      const deployResult = await deployIfDifferent(
        ['data'],
        'AVIX',
        { from: deployer },
        'AVIX',
        name,
        symbol,
        0,
        orchestrator.address,
      )
      AVIX = await deployments.get('AVIX')
      if (deployResult.newlyDeployed) {
        log(
          `AVIX deployed at ${AVIX.address} for ${deployResult.receipt.gasUsed}`,
        )
      }
    }
  }
}

module.exports.tags = ['AVIX']
