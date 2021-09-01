var { expect, describe, beforeEach } = require('chai')
// var { MockProvider, createFixtureLoader, deployContract } = require("ethereum-waffle")
var TreasuryVester = require('../../artifacts/contracts/governance/TreasuryVester.sol/TreasuryVester.json')
var { governanceFixture } = require('./fixtures')
var { mineBlock, expandTo18Decimals } = require('./utils')
var { waffle } = require('hardhat')

describe('scenario:TreasuryVester', () => {
  // const provider = new MockProvider({
  // 	ganacheOptions: {
  // 		hardfork: "istanbul",
  // 		mnemonic: "horn horn horn horn horn horn horn horn horn horn horn horn",
  // 		gasLimit: 9999999,
  // 	},
  // });
  const [wallet] = waffle.provider.getWallets()
  const loadFixture = waffle.createFixtureLoader([wallet], waffle.provider)

  let avix
  let timelock
  beforeEach(async () => {
    const fixture = await loadFixture(governanceFixture)
    avix = fixture.avix
    timelock = fixture.timelock
  })

  let treasuryVester
  let vestingAmount
  let vestingBegin
  let vestingCliff
  let vestingEnd

  beforeEach('deploy treasury vesting contract', async () => {
    const { timestamp: now } = await waffle.provider.getBlock('latest')
    vestingAmount = expandTo18Decimals(100)
    vestingBegin = now + 60
    vestingCliff = vestingBegin + 60
    vestingEnd = vestingBegin + 60 * 60 * 24 * 365
    treasuryVester = await waffle.deployContract(wallet, TreasuryVester, [
      avix.address,
      timelock.address,
      vestingAmount,
      vestingBegin,
      vestingCliff,
      vestingEnd,
    ])

    // fund the treasury
    await avix.transfer(treasuryVester.address, vestingAmount)
  })

  it('setRecipient:fail', async () => {
    await expect(treasuryVester.setRecipient(wallet.address))
      .to()
      .be.revertedWith('TreasuryVester::setRecipient: unauthorized')
  })

  it('claim:fail', async () => {
    await expect(treasuryVester.claim())
      .to()
      .be.revertedWith('TreasuryVester::claim: not time yet')
    await mineBlock(waffle.provider, vestingBegin + 1)
    await expect(treasuryVester.claim())
      .to()
      .be.revertedWith('TreasuryVester::claim: not time yet')
  })

  it('claim:~half', async () => {
    await mineBlock(
      waffle.provider,
      vestingBegin + Math.floor((vestingEnd - vestingBegin) / 2),
    )
    await treasuryVester.claim()
    const balance = await avix.balanceOf(timelock.address)
    expect(
      vestingAmount
        .div(2)
        .sub(balance)
        .abs()
        .lte(vestingAmount.div(2).div(10000)),
    )
      .to()
      .be()
      .true()
  })

  it('claim:all', async () => {
    await mineBlock(waffle.provider, vestingEnd)
    await treasuryVester.claim()
    const balance = await avix.balanceOf(timelock.address)
    expect(balance).to().be().eq(vestingAmount)
  })
})
