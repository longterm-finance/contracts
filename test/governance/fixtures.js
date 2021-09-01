var { expect } = require('chai')
var { Contract } = require('ethers')
var { waffle } = require('hardhat')
var Avix = require('../../artifacts/contracts/governance/Avix.sol/Avix.json')
var Timelock = require('../../artifacts/contracts/governance/Timelock.sol/Timelock.json')
var GovernorAlpha = require('../../artifacts/contracts/governance/GovernorAlpha.sol/GovernorAlpha.json')
var { DELAY } = require('./utils')
var { deployContract } = waffle

module.exports = async function ([wallet], provider) {
  // deploy AVIX, sending the total supply to the deployer
  const { timestamp: now } = await provider.getBlock('latest')
  let nonce = await wallet.getTransactionCount()
  nonce++
  const timelockAddress = Contract.getContractAddress({
    from: wallet.address,
    nonce: nonce++,
  })

  // deploy timelock, controlled by what will be the governor
  const governorAlphaAddress = Contract.getContractAddress({
    from: wallet.address,
    nonce: nonce++,
  })

  const avix = await deployContract(wallet, Avix, [
    wallet.address,
    timelockAddress,
    now + 60 * 60,
  ])

  const timelock = await deployContract(wallet, Timelock, [
    governorAlphaAddress,
    DELAY,
  ])
  expect(timelock.address).to.be.eq(timelockAddress)

  // deploy governorAlpha
  const governorAlpha = await deployContract(wallet, GovernorAlpha, [
    timelock.address,
    avix.address,
  ])
  expect(governorAlpha.address).to.be.eq(governorAlphaAddress)

  return { avix, timelock, governorAlpha }
}
