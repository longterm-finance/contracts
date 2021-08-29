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

    let VIXOracle, BTCOracle, ETHOracle, DAIOracle, AVAXOracle, USDTOracle

    try {
      VIXOracle = await deployments.get('VIXOracle')
    } catch (error) {
      log(error.message)
      let oracleAddress = process.env.VIX_ORACLE
      const deployResult = await deployIfDifferent(
        ['data'],
        'VIXOracle',
        { from: deployer },
        'ChainlinkOracle',
        oracleAddress,
      )
      VIXOracle = await deployments.get('VIXOracle')
      if (deployResult.newlyDeployed) {
        log(
          `Oracle deployed at ${VIXOracle.address} for ${deployResult.receipt.gasUsed}`,
        )
      }
      try {
        BTCOracle = await deployments.get('BTCOracle')
      } catch (error) {
        log(error.message)
        oracleAddress = process.env.BTC_ORACLE
        const deployResult = await deployIfDifferent(
          ['data'],
          'BTCOracle',
          { from: deployer },
          'ChainlinkOracle',
          oracleAddress,
        )
        BTCOracle = await deployments.get('BTCOracle')
        if (deployResult.newlyDeployed) {
          log(
            `Price Feed Oracle deployed at ${BTCOracle.address} for ${deployResult.receipt.gasUsed}`,
          )
        }
        try {
          ETHOracle = await deployments.get('ETHOracle')
        } catch (error) {
          log(error.message)
          let oracleAddress = process.env.ETH_ORACLE
          const deployResult = await deployIfDifferent(
            ['data'],
            'ETHOracle',
            { from: deployer },
            'ChainlinkOracle',
            oracleAddress,
          )
          ETHOracle = await deployments.get('ETHOracle')
          if (deployResult.newlyDeployed) {
            log(
              `Price Feed Oracle deployed at ${ETHOracle.address} for ${deployResult.receipt.gasUsed}`,
            )
          }
          try {
            DAIOracle = await deployments.get('DAIOracle')
          } catch (error) {
            log(error.message)
            let oracleAddress = process.env.DAI_ORACLE
            const deployResult = await deployIfDifferent(
              ['data'],
              'DAIOracle',
              { from: deployer },
              'ChainlinkOracle',
              oracleAddress,
            )
            DAIOracle = await deployments.get('DAIOracle')
            if (deployResult.newlyDeployed) {
              log(
                `Price Feed Oracle deployed at ${DAIOracle.address} for ${deployResult.receipt.gasUsed}`,
              )
            }
            try {
              AVAXOracle = await deployments.get('AVAXOracle')
            } catch (error) {
              log(error.message)
              let oracleAddress = process.env.AVAX_ORACLE
              const deployResult = await deployIfDifferent(
                ['data'],
                'AVAXOracle',
                { from: deployer },
                'ChainlinkOracle',
                oracleAddress,
              )
              AVAXOracle = await deployments.get('AVAXOracle')
              if (deployResult.newlyDeployed) {
                log(
                  `Price Feed Oracle deployed at ${AVAXOracle.address} for ${deployResult.receipt.gasUsed}`,
                )
              }
              try {
                USDTOracle = await deployments.get('USDTOracle')
              } catch (error) {
                log(error.message)
                let oracleAddress = process.env.USDT_ORACLE
                const deployResult = await deployIfDifferent(
                  ['data'],
                  'USDTOracle',
                  { from: deployer },
                  'ChainlinkOracle',
                  oracleAddress,
                )
                USDTOracle = await deployments.get('USDTOracle')
                if (deployResult.newlyDeployed) {
                  log(
                    `Price Feed Oracle deployed at ${USDTOracle.address} for ${deployResult.receipt.gasUsed}`,
                  )
                }
              }
            }
          }
        }
      }
    }
  }
}

module.exports.tags = ['Oracle', 'ChainlinkOracle']
