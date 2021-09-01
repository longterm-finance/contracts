var { expect, describe, beforeEach } = require('chai')
var { constants } = require('ethers')
var { waffle } = require('hardhat')
var { governanceFixture } = require('./fixtures')
var { DELAY } = require('./utils')

describe('GovernorAlpha', () => {
  // waffle;
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
  let governorAlpha

  beforeEach(async () => {
    const fixture = await loadFixture(governanceFixture)
    avix = fixture.avix
    timelock = fixture.timelock
    governorAlpha = fixture.governorAlpha
  })

  it('...should test avix', async () => {
    const balance = await avix.balanceOf(wallet.address)
    const totalSupply = await avix.totalSupply()
    expect(balance).to().be().eq(totalSupply)
  })

  it('...should set timelock', async () => {
    const admin = await timelock.admin()
    expect(admin).to().be().eq(governorAlpha.address)
    const pendingAdmin = await timelock.pendingAdmin()
    expect(pendingAdmin).to().be().eq(constants.AddressZero)
    const delay = await timelock.delay()
    expect(delay).to().be().eq(DELAY)
  })

  it('...should set governor', async () => {
    const votingPeriod = await governorAlpha.votingPeriod()
    expect(votingPeriod).to().be().eq(17280)
    const timelockAddress = await governorAlpha.timelock()
    expect(timelockAddress).to().be().eq(timelock.address)
    const ctxFromGovernor = await governorAlpha.ctx()
    expect(ctxFromGovernor).to().be().eq(avix.address)
  })
})
