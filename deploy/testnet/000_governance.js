import { deployments, hardhatArguments } from 'hardhat'

const governance = async function (hre) {
  console.log('FUJI TESTNET DEPLOY')

  if (
    hardhatArguments.network === 'fuji' ||
    hardhatArguments.network === 'hardhat'
  ) {
    const Avix = await deployments.getOrNull('Avix')
    const { log } = deployments
    if (!Avix) {
      const ethers = hre.ethers

      const namedAccounts = await hre.getNamedAccounts()
      const oneYear = 1640140333 // Wednesday, December 22, 2021 2:32:13 AM
      const threeDays = 259200
      const [owner] = await ethers.getSigners()
      let nonce = await owner.getTransactionCount()
      const avixAddress = ethers.utils.getContractAddress({
        from: namedAccounts.deployer,
        nonce: nonce++,
      })

      const timelockAddress = ethers.utils.getContractAddress({
        from: namedAccounts.deployer,
        nonce: nonce++,
      })

      const governorAddress = ethers.utils.getContractAddress({
        from: namedAccounts.deployer,
        nonce: nonce++,
      })

      const avixDeployment = await deployments.deploy('Avix', {
        from: namedAccounts.deployer,
        args: [namedAccounts.deployer, timelockAddress, oneYear],
      })

      log(
        `Avix deployed at ${avixDeployment.address} for ${avixDeployment.receipt?.gasUsed}`,
      )

      const timelockDeployment = await deployments.deploy('Timelock', {
        from: namedAccounts.deployer,
        args: [governorAddress, threeDays],
      })

      log(
        `Timelock deployed at ${timelockDeployment.address} for ${timelockDeployment.receipt?.gasUsed}`,
      )

      const governorDeployment = await deployments.deploy('GovernorAlpha', {
        from: namedAccounts.deployer,
        args: [timelockAddress, avixAddress],
      })

      log(
        `Governor Alpha deployed at ${governorDeployment.address} for ${governorDeployment.receipt?.gasUsed}`,
      )
    } else {
      log('Avix Token already deployed')
    }
  }
}
export default governance
