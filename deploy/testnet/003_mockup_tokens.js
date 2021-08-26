import { hardhatArguments } from 'hardhat'
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

    log(`${hardhatArguments.network} found, deploying mockup DAI contracts`)

    //Deploy Mock Tokens
    let DAI, WBTC, WETH, WAVAX, USDT

    try {
      DAI = await deployments.get('DAI')
    } catch (error) {
      log(error.message)

      const deployResult = await deployIfDifferent(
        ['data'],
        'DAI',
        { from: deployer },
        'DAI',
      )
      DAI = await deployments.get('DAI')
      if (deployResult.newlyDeployed) {
        log(
          `DAI deployed at ${DAI.address} for ${deployResult.receipt.gasUsed}`,
        )
      }

      try {
        WBTC = await deployments.get('WBTC')
      } catch (error) {
        log(error.message)

        const deployResult = await deployIfDifferent(
          ['data'],
          'WBTC',
          { from: deployer },
          'WBTC',
        )
        WBTC = await deployments.get('WBTC')
        if (deployResult.newlyDeployed) {
          log(
            `WBTC deployed at ${WBTC.address} for ${deployResult.receipt.gasUsed}`,
          )
        }

        try {
          WETH = await deployments.get('WETH')
        } catch (error) {
          log(error.message)

          const deployResult = await deployIfDifferent(
            ['data'],
            'WETH',
            { from: deployer },
            'WETH',
          )
          WETH = await deployments.get('WETH')
          if (deployResult.newlyDeployed) {
            log(
              `WETH deployed at ${WETH.address} for ${deployResult.receipt.gasUsed}`,
            )
          }
        }

        try {
          WAVAX = await deployments.get('WAVAX')
        } catch (error) {
          log(error.message)

          const deployResult = await deployIfDifferent(
            ['data'],
            'WAVAX',
            { from: deployer },
            'WAVAX',
          )
          WAVAX = await deployments.get('WAVAX')
          if (deployResult.newlyDeployed) {
            log(
              `WAVAX deployed at ${WAVAX.address} for ${deployResult.receipt.gasUsed}`,
            )
          }
        }

        try {
          USDT = await deployments.get('USDT')
        } catch (error) {
          log(error.message)

          const deployResult = await deployIfDifferent(
            ['data'],
            'USDT',
            { from: deployer },
            'USDT',
          )
          USDT = await deployments.get('USDT')
          if (deployResult.newlyDeployed) {
            log(
              `USDT deployed at ${USDT.address} for ${deployResult.receipt.gasUsed}`,
            )
          }
        }
      }
    }
  }
}
module.exports.tags = ['WAVAX', 'WETH', 'WBTC', 'DAI', 'USDT']
