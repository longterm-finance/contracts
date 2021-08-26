import { ethers as ethershardhat, hardhatArguments } from 'hardhat'
require('dotenv').config()

module.exports = async ({ deployments }) => {
  let initial_run = process.env.INITIAL_RUN === 'true' ? true : false
  if (
    (hardhatArguments.network === 'fuji' ||
      hardhatArguments.network === 'hardhat') &&
    initial_run
  ) {
    let DAIHandler = await deployments.get('DAIVaultHandler')
    let WBTCHandler = await deployments.get('WBTCVaultHandler')
    let WETHHandler = await deployments.get('WETHVaultHandler')
    let AVAXHandler = await deployments.get('AVAXVaultHandler')
    let USDTHandler = await deployments.get('USDTVaultHandler')
    let OrchestratorDeployment = await deployments.get('Orchestrator')
    let dvix = await deployments.get('DVIX')

    let orchestrator = await ethershardhat.getContractAt(
      'Orchestrator',
      OrchestratorDeployment.address,
    )

    console.log('Adding vault Handlers')
    await orchestrator.addDVIXVault(dvix.address, DAIHandler.address)
    await orchestrator.addDVIXVault(dvix.address, WBTCHandler.address)
    await orchestrator.addDVIXVault(dvix.address, WETHHandler.address)
    await orchestrator.addDVIXVault(dvix.address, AVAXHandler.address)
    await orchestrator.addDVIXVault(dvix.address, USDTHandler.address)
  }
}
module.exports.tags = ['Initialize']
