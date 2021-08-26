import { deployments, hardhatArguments } from 'hardhat'

const governorBeta = async function (hre) {
  const ethers = hre.ethers
  const provider = ethers.getDefaultProvider()
  const blockN = await provider.getBlockNumber()
  // eslint-disable-next-line
  const currentBlock = await provider.getBlock(blockN)

  if (hardhatArguments.network === 'mainnet') {
    const governorBeta = await deployments.getOrNull('GovernorBeta')
    const { log } = deployments
    if (!governorBeta) {
      // eslint-disable-next-line
      const ethers = hre.ethers

      const namedAccounts = await hre.getNamedAccounts()
      const avix = '0x...'
      const timelock = '0x...'
      const guardian = '0x...'

      const governorDeployment = await deployments.deploy('GovernorBeta', {
        contract: 'GovernorBeta',
        from: namedAccounts.deployer,
        args: [timelock, avix, guardian],
        skipIfAlreadyDeployed: true,
        log: true,
        nonce: 46,
      })

      log(
        `Governor Beta deployed at ${governorDeployment.address} for ${governorDeployment.receipt?.gasUsed}`,
      )
    } else {
      log('Governor Beta already deployed')
    }
  }
}
export default governorBeta
