var { expect, describe, before } = require('chai')
var ethers = require('ethers')
var ethersProvider = ethers

// eslint-disable-next-line
describe('Orchestrator Contract', async function () {
  let orchestratorInstance,
    dvixInstance,
    dvixInstance2,
    avaxVaultInstance,
    btcVaultInstance,
    wethTokenInstance
  let [owner, addr1, handler, handler2, guardian] = []
  let accounts = []
  let divisor = '1'
  let ratio = '300'
  let burnFee = '4'
  let liquidationPenalty = '12'
  //
  let collateralAddress, collateralOracle, ethOracle
  //
  let dvixOracle = (collateralAddress = collateralOracle = ethOracle =
    ethersProvider.constants.AddressZero)

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

    //DVIX
    const DVIX = await ethers.getContractFactory('DVIX')
    dvixInstance = await DVIX.deploy(
      'dVIX Token',
      'dVIX',
      18,
      orchestratorInstance.address,
    )
    await dvixInstance.deployed()
    dvixInstance2 = await DVIX.deploy(
      'dVIX Token',
      'dVIX2',
      18,
      orchestratorInstance.address,
    )
    await dvixInstance2.deployed()
    //Chainlink Oracles
    const aggregator = await ethers.getContractFactory('AggregatorInterface')
    let aggregatorInstance = await aggregator.deploy()
    const oracle = await ethers.getContractFactory('ChainlinkOracle')
    let chainlinkInstance = await oracle.deploy(aggregatorInstance.address)
    await chainlinkInstance.deployed()
    dvixOracle = chainlinkInstance.address
    chainlinkInstance = await oracle.deploy(aggregatorInstance.address)
    await chainlinkInstance.deployed()
    collateralOracle = chainlinkInstance.address
    chainlinkInstance = await oracle.deploy(aggregatorInstance.address)
    await chainlinkInstance.deployed()
    ethOracle = chainlinkInstance.address
    //Collateral
    const weth = await ethers.getContractFactory('WETH')
    wethTokenInstance = await weth.deploy()
    collateralAddress = wethTokenInstance.address

    //Timelock
    const threeDays = 359200
    const timelock = await ethers.getContractFactory('Timelock')
    const timelockInstance = await timelock.deploy(
      orchestratorInstance.address,
      threeDays,
    )

    //Vaults
    const wavaxVault = await ethers.getContractFactory('ERC20VaultHandler')
    avaxVaultInstance = await wavaxVault.deploy(
      orchestratorInstance.address,
      divisor,
      ratio,
      burnFee,
      liquidationPenalty,
      dvixOracle,
      dvixInstance.address,
      collateralAddress,
      collateralOracle,
      ethOracle,
      ethers.constants.AddressZero,
      timelockInstance.address,
    )
    await avaxVaultInstance.deployed()
    expect(avaxVaultInstance.address).properAddress()

    btcVaultInstance = await wavaxVault.deploy(
      orchestratorInstance.address,
      divisor,
      ratio,
      burnFee,
      liquidationPenalty,
      dvixOracle,
      dvixInstance.address,
      collateralAddress,
      collateralOracle,
      ethOracle,
      ethers.constants.AddressZero,
      timelockInstance.address,
    )
    await btcVaultInstance.deployed()
    expect(btcVaultInstance.address).properAddress()
  })

  it('...should set the owner', async () => {
    const defaultOwner = await orchestratorInstance.owner()
    expect(defaultOwner).to().eq(accounts[0])
  })

  it('...should set the guardian', async () => {
    const currentGuardian = await orchestratorInstance.guardian()
    expect(currentGuardian)
      .to()
      .eq(await guardian.getAddress())

    await expect(
      orchestratorInstance.connect(addr1).setGuardian(await addr1.getAddress()),
    )
      .to()
      .be.revertedWith('Ownable: caller is not the owner')

    await expect(
      orchestratorInstance
        .connect(owner)
        .setGuardian(ethersProvider.constants.AddressZero),
    )
      .to()
      .be.revertedWith("Orchestrator::setGuardian: guardian can't be zero")

    await expect(
      orchestratorInstance.connect(owner).setGuardian(await addr1.getAddress()),
    )
      .to()
      .emit(orchestratorInstance, 'GuardianSet')
      .withArgs(await owner.getAddress(), await addr1.getAddress())

    await orchestratorInstance.setGuardian(await guardian.getAddress())
  })

  it('...should set vault ratio', async () => {
    let ratio = '190'

    await expect(
      orchestratorInstance
        .connect(addr1)
        .setRatio(avaxVaultInstance.address, 0),
    )
      .to()
      .be.revertedWith('Ownable: caller is not the owner')

    await expect(
      orchestratorInstance.setRatio(ethersProvider.constants.AddressZero, 0),
    )
      .to()
      .be.revertedWith('Orchestrator::validVault: not a valid vault')

    await orchestratorInstance.setRatio(avaxVaultInstance.address, ratio)
    expect(ratio)
      .to()
      .eq(await avaxVaultInstance.ratio())

    await expect(orchestratorInstance.setRatio(avaxVaultInstance.address, 10))
      .to()
      .be.revertedWith('VaultHandler::setRatio: ratio lower than MIN_RATIO')
  })

  it('...should set vault burn fee', async () => {
    let burnFee = '2'

    await expect(
      orchestratorInstance
        .connect(addr1)
        .setBurnFee(avaxVaultInstance.address, 0),
    )
      .to()
      .be.revertedWith('Ownable: caller is not the owner')

    await expect(
      orchestratorInstance.setBurnFee(ethersProvider.constants.AddressZero, 0),
    )
      .to()
      .be.revertedWith('Orchestrator::validVault: not a valid vault')

    await orchestratorInstance.setBurnFee(avaxVaultInstance.address, burnFee)
    expect(burnFee)
      .to()
      .eq(await avaxVaultInstance.burnFee())

    await expect(
      orchestratorInstance.setBurnFee(avaxVaultInstance.address, 100),
    )
      .to()
      .be.revertedWith('VaultHandler::setBurnFee: burn fee higher than MAX_FEE')
  })

  it('...should set vault liquidation penalty', async () => {
    let liquidationPenalty = '15'

    await expect(
      orchestratorInstance
        .connect(addr1)
        .setLiquidationPenalty(avaxVaultInstance.address, 0),
    )
      .to()
      .be.revertedWith('Ownable: caller is not the owner')

    await expect(
      orchestratorInstance.setLiquidationPenalty(
        ethersProvider.constants.AddressZero,
        0,
      ),
    )
      .to()
      .be.revertedWith('Orchestrator::validVault: not a valid vault')

    await orchestratorInstance.setLiquidationPenalty(
      avaxVaultInstance.address,
      liquidationPenalty,
    )
    expect(liquidationPenalty)
      .to()
      .eq(await avaxVaultInstance.liquidationPenalty())
  })

  it('...should prevent liquidation penalty + 100 to be above ratio', async () => {
    let liquidationPenalty = '90'

    await expect(
      orchestratorInstance.setLiquidationPenalty(
        avaxVaultInstance.address,
        liquidationPenalty,
      ),
    )
      .to()
      .be.revertedWith(
        'VaultHandler::setLiquidationPenalty: liquidation penalty too high',
      )
  })

  it('...should pause the Vault', async () => {
    await expect(
      orchestratorInstance.connect(owner).pauseVault(avaxVaultInstance.address),
    )
      .to()
      .be.revertedWith('Orchestrator::onlyGuardian: caller is not the guardian')

    await expect(
      orchestratorInstance
        .connect(guardian)
        .pauseVault(ethersProvider.constants.AddressZero),
    )
      .to()
      .be.revertedWith('Orchestrator::validVault: not a valid vault')

    await orchestratorInstance
      .connect(guardian)
      .pauseVault(avaxVaultInstance.address)
    expect(true)
      .to()
      .eq(await avaxVaultInstance.paused())

    await expect(
      orchestratorInstance
        .connect(guardian)
        .pauseVault(avaxVaultInstance.address),
    )
      .to()
      .be.revertedWith('Orchestrator::pauseVault: emergency call already used')
    await orchestratorInstance
      .connect(guardian)
      .pauseVault(btcVaultInstance.address)
    expect(true)
      .to()
      .eq(await btcVaultInstance.paused())
  })

  it('...should unpause the vault', async () => {
    await expect(
      orchestratorInstance
        .connect(owner)
        .unpauseVault(avaxVaultInstance.address),
    )
      .to()
      .be.revertedWith('Orchestrator::onlyGuardian: caller is not the guardian')

    await expect(
      orchestratorInstance
        .connect(guardian)
        .unpauseVault(ethersProvider.constants.AddressZero),
    )
      .to()
      .be.revertedWith('Orchestrator::validVault: not a valid vault')

    await orchestratorInstance
      .connect(guardian)
      .unpauseVault(avaxVaultInstance.address)
    expect(false)
      .to()
      .eq(await avaxVaultInstance.paused())
  })

  it('...should set the liquidation penalty to 0 on emergency', async () => {
    await expect(
      orchestratorInstance
        .connect(owner)
        .setEmergencyLiquidationPenalty(avaxVaultInstance.address),
    )
      .to()
      .be.revertedWith('Orchestrator::onlyGuardian: caller is not the guardian')
    await expect(
      orchestratorInstance
        .connect(guardian)
        .setEmergencyLiquidationPenalty(ethersProvider.constants.AddressZero),
    )
      .to()
      .be.revertedWith('Orchestrator::validVault: not a valid vault')
    await orchestratorInstance
      .connect(guardian)
      .setEmergencyLiquidationPenalty(avaxVaultInstance.address)
    expect(await avaxVaultInstance.liquidationPenalty())
      .to()
      .eq(0)
    await expect(
      orchestratorInstance
        .connect(guardian)
        .setEmergencyLiquidationPenalty(avaxVaultInstance.address),
    )
      .to()
      .be.revertedWith(
        'Orchestrator::setEmergencyLiquidationPenalty: emergency call already used',
      )
    await orchestratorInstance
      .connect(guardian)
      .setEmergencyLiquidationPenalty(btcVaultInstance.address)
    expect(await btcVaultInstance.liquidationPenalty())
      .to()
      .eq(0)
  })

  it('...should set the burn fee to 0 on emergency', async () => {
    await expect(
      orchestratorInstance
        .connect(owner)
        .setEmergencyBurnFee(avaxVaultInstance.address),
    )
      .to()
      .be.revertedWith('Orchestrator::onlyGuardian: caller is not the guardian')
    await expect(
      orchestratorInstance
        .connect(guardian)
        .setEmergencyBurnFee(ethersProvider.constants.AddressZero),
    )
      .to()
      .be.revertedWith('Orchestrator::validVault: not a valid vault')

    await orchestratorInstance
      .connect(guardian)
      .setEmergencyBurnFee(avaxVaultInstance.address)
    expect(await avaxVaultInstance.burnFee())
      .to()
      .eq(0)
    await expect(
      orchestratorInstance
        .connect(guardian)
        .setEmergencyBurnFee(avaxVaultInstance.address),
    )
      .to()
      .be.revertedWith(
        'Orchestrator::setEmergencyBurnFee: emergency call already used',
      )
    await orchestratorInstance
      .connect(guardian)
      .setEmergencyBurnFee(btcVaultInstance.address)
    expect(await btcVaultInstance.burnFee())
      .to()
      .eq(0)
  })

  it('...should be able to send funds to owner of orchestrator', async () => {
    await expect(orchestratorInstance.connect(addr1).retrieveETH(accounts[0]))
      .to()
      .be.revertedWith('Ownable: caller is not the owner')

    await orchestratorInstance.retrieveETH(accounts[0])
  })

  it('...should enable the DVIX cap', async () => {
    let enableCap = true

    await expect(
      orchestratorInstance
        .connect(addr1)
        .enableDVIXCap(dvixInstance.address, false),
    )
      .to()
      .be.revertedWith('Ownable: caller is not the owner')

    await expect(
      orchestratorInstance.enableDVIXCap(
        ethersProvider.constants.AddressZero,
        false,
      ),
    )
      .to()
      .be.revertedWith('Orchestrator::validDVIX: not a valid DVIX ERC20')

    await expect(
      orchestratorInstance.enableDVIXCap(dvixInstance.address, enableCap),
    )
      .to()
      .emit(dvixInstance, 'NewCapEnabled')
      .withArgs(orchestratorInstance.address, enableCap)

    expect(enableCap)
      .to()
      .eq(await dvixInstance.capEnabled())
  })

  it('...should set the DVIX cap', async () => {
    // eslint-disable-next-line
    let dvixCap = 100

    await expect(
      orchestratorInstance.connect(addr1).setDVIXCap(dvixInstance.address, 0),
    )
      .to()
      .be.revertedWith('Ownable: caller is not the owner')

    await expect(
      orchestratorInstance.setDVIXCap(ethersProvider.constants.AddressZero, 0),
    )
      .to()
      .be.revertedWith('Orchestrator::validDVIX: not a valid DVIX ERC20')

    await expect(orchestratorInstance.setDVIXCap(dvixInstance.address, dvixCap))
      .to()
      .emit(dvixInstance, 'NewCap')
      .withArgs(orchestratorInstance.address, dvixCap)

    expect(dvixCap)
      .to()
      .eq(await dvixInstance.cap())
  })

  it('...should add vault to DVIX token', async () => {
    await expect(
      orchestratorInstance
        .connect(addr1)
        .addDVIXVault(dvixInstance.address, avaxVaultInstance.address),
    )
      .to()
      .be.revertedWith('Ownable: caller is not the owner')

    await expect(
      orchestratorInstance.addDVIXVault(
        ethersProvider.constants.AddressZero,
        avaxVaultInstance.address,
      ),
    )
      .to()
      .be.revertedWith('Orchestrator::validDVIX: not a valid DVIX ERC20')

    await expect(
      orchestratorInstance.addDVIXVault(
        dvixInstance.address,
        ethersProvider.constants.AddressZero,
      ),
    )
      .to()
      .be.revertedWith('Orchestrator::validVault: not a valid vault')

    await expect(
      orchestratorInstance.addDVIXVault(
        dvixInstance.address,
        avaxVaultInstance.address,
      ),
    )
      .to()
      .emit(dvixInstance, 'VaultHandlerAdded')
      .withArgs(orchestratorInstance.address, avaxVaultInstance.address)

    expect(await dvixInstance.vaultHandlers(avaxVaultInstance.address))
      .to()
      .eq(true)
  })

  it('...should remove vault to DVIX token', async () => {
    await expect(
      orchestratorInstance
        .connect(addr1)
        .removeDVIXVault(dvixInstance.address, avaxVaultInstance.address),
    )
      .to()
      .be.revertedWith('Ownable: caller is not the owner')

    await expect(
      orchestratorInstance.removeDVIXVault(
        ethersProvider.constants.AddressZero,
        avaxVaultInstance.address,
      ),
    )
      .to()
      .be.revertedWith('Orchestrator::validDVIX: not a valid DVIX ERC20')

    await expect(
      orchestratorInstance.removeDVIXVault(
        dvixInstance.address,
        ethersProvider.constants.AddressZero,
      ),
    )
      .to()
      .be.revertedWith('Orchestrator::validVault: not a valid vault')

    await expect(
      orchestratorInstance.removeDVIXVault(
        dvixInstance.address,
        avaxVaultInstance.address,
      ),
    )
      .to()
      .emit(dvixInstance, 'VaultHandlerRemoved')
      .withArgs(orchestratorInstance.address, avaxVaultInstance.address)

    expect(await dvixInstance.vaultHandlers(avaxVaultInstance.address))
      .to()
      .eq(false)
  })

  it('...should allow to execute a custom transaction', async () => {
    await orchestratorInstance.addDVIXVault(
      dvixInstance.address,
      avaxVaultInstance.address,
    )

    let currentOwner = await dvixInstance.owner()
    expect(currentOwner).to().eq(orchestratorInstance.address)
    const newOwner = await addr1.getAddress()
    const abi = new ethers.utils.AbiCoder()
    const target = dvixInstance.address
    const value = 0
    const signature = 'transferOwnership(address)'
    const data = abi.encode(['address'], [newOwner])

    await expect(
      orchestratorInstance
        .connect(addr1)
        .executeTransaction(target, value, signature, data),
    )
      .to()
      .be.revertedWith('Ownable: caller is not the owner')

    const wrongData = abi.encode(['address'], [ethers.constants.AddressZero])
    await expect(
      orchestratorInstance.executeTransaction(
        target,
        value,
        signature,
        wrongData,
      ),
    )
      .to()
      .be.revertedWith(
        'Orchestrator::executeTransaction: Transaction execution reverted.',
      )

    await expect(
      orchestratorInstance.executeTransaction(target, value, signature, data),
    )
      .to()
      .emit(orchestratorInstance, 'TransactionExecuted')
      .withArgs(target, value, signature, data)

    currentOwner = await dvixInstance.owner()
    expect(currentOwner).to().eq(newOwner)
  })
})
