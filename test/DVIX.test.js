var { expect, before, describe } = require('chai')
var ethers = require('ethers')
var ethersProvider = ethers

// eslint-disable-next-line
describe('DVIX Token', async function () {
  let dvixInstance
  let orchestratorInstance
  let [owner, addr1, handler, handler2, guardian] = []
  let accounts = []

  before('Set Accounts', async () => {
    let [acc0, acc1, acc3, acc4, acc5, acc6] = await ethers.getSigners()
    owner = acc0
    addr1 = acc1
    handler = acc3
    handler2 = acc4
    guardian = acc6
    if (owner && addr1 && handler) {
      accounts.push(await owner.getAddress())
      accounts.push(await addr1.getAddress())
      accounts.push(await handler.getAddress())
      accounts.push(await handler2.getAddress())
      accounts.push(await acc5.getAddress())
    }
  })

  it('...should deploy the contract', async () => {
    const orchestrator = await ethers.getContractFactory('Orchestrator')
    orchestratorInstance = await orchestrator.deploy(
      await guardian.getAddress(),
    )
    await orchestratorInstance.deployed()
    expect(orchestratorInstance.address).properAddress()

    let cap = ethers.utils.parseEther('100')
    const DVIX = await ethers.getContractFactory('DVIX')
    dvixInstance = await DVIX.deploy(
      'dVIX Token',
      'dVIX',
      cap,
      orchestratorInstance.address,
    )
    await dvixInstance.deployed()
    expect(dvixInstance.address).properAddress()
  })

  it('...should set the correct initial values', async () => {
    const symbol = await dvixInstance.symbol()
    const name = await dvixInstance.name()
    const decimals = await dvixInstance.decimals()
    const defaultOwner = await dvixInstance.owner()
    const cap = await dvixInstance.cap()
    expect(defaultOwner).to().eq(orchestratorInstance.address)
    expect(symbol).to().eq('DVIX', 'Symbol should equal DVIX')
    expect(name).to().eq('Total Market Cap Token')
    expect(decimals).to().eq(18, 'Decimals should be 18')
    expect(cap)
      .to()
      .eq(ethers.utils.parseEther('100'), 'Cap should be 100 Tokens')
  })

  it('...should have the ERC20 standard functions', async () => {
    const totalSupply = await dvixInstance.totalSupply()
    expect(totalSupply).to().eq(0, 'Total supply should be 0')
    const balance = await dvixInstance.balanceOf(accounts[0])
    expect(balance).to().eq(0, 'Balance should be 0')
  })

  it('...should allow to approve tokens', async () => {
    const amount = ethersProvider.utils.parseEther('100')
    await dvixInstance.connect(owner).approve(accounts[1], amount)
    const allowance = await dvixInstance.allowance(accounts[0], accounts[1])
    expect(allowance).to().eq(amount)
  })

  it("...shouldn't allow users to mint", async () => {
    const amount = ethersProvider.utils.parseEther('1000000')
    await expect(dvixInstance.mint(accounts[0], amount))
      .to()
      .be.revertedWith('DVIX::onlyVault: caller is not a vault')
  })

  it("...shouldn't allow users to burn", async () => {
    const amount = ethersProvider.utils.parseEther('1000000')
    await expect(dvixInstance.burn(accounts[1], amount))
      .to()
      .be.revertedWith('DVIX::onlyVault: caller is not a vault')
  })
})
