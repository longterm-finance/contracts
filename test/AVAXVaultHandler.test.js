var { expect, before, describe } = require('chai')
var ethers = require('ethers')

// eslint-disable-next-line
describe('AVAX Vault', async function () {
  let avaxVaultHanndler,
    wAVAXTokenInstance,
    dvixInstance,
    dvixOracleInstance,
    priceOracleInstance,
    aggregatorDVIXInstance,
    orchestratorInstance,
    rewardHandlerInstance,
    rewardTokenInstance
  let [owner, addr1, addr2, addr3, lq, guardian, treasury] = []
  let accounts = []
  let divisor = '1'
  let ratio = '300'
  let burnFee = '4'
  let liquidationPenalty = '12'
  const ONE_DAY = 86400

  before('Set Accounts', async () => {
    // eslint-disable-next-line
    let [acc0, acc1, acc3, acc4, acc5, acc6, acc7] = await ethers.getSigners()
    owner = acc0
    addr1 = acc1
    addr2 = acc3
    addr3 = acc4

    lq = acc5
    guardian = acc6
    if (owner && addr1) {
      accounts.push(await owner.getAddress())
      accounts.push(await addr1.getAddress())
      accounts.push(await addr2.getAddress())
      accounts.push(await addr3.getAddress())
      accounts.push(await lq.getAddress())
    }
  })

  it('...should deploy the contract', async () => {
    const orchestrator = await ethers.getContractFactory('Orchestrator')
    orchestratorInstance = await orchestrator.deploy(
      await guardian.getAddress(),
    )
    await orchestratorInstance.deployed()
    expect(orchestratorInstance.address).properAddress()

    const threeDays = 259200
    const timelock = await ethers.getContractFactory('Timelock')
    const timelockInstance = await timelock.deploy(
      orchestratorInstance.address,
      threeDays,
    )

    const DVIX = await ethers.getContractFactory('DVIX')
    dvixInstance = await DVIX.deploy(
      'dVIX Token',
      'dVIX',
      18,
      orchestratorInstance.address,
    )
    await dvixInstance.deployed()

    const collateralOracle = await ethers.getContractFactory('ChainlinkOracle')
    const oracle = await ethers.getContractFactory('ChainlinkOracle')
    const aggregator = await ethers.getContractFactory('AggregatorInterface')
    const aggregatorDvix = await ethers.getContractFactory(
      'AggregatorInterfaceDVIX',
    )
    let aggregatorInstance = await aggregator.deploy()
    aggregatorDVIXInstance = await aggregatorDvix.deploy()
    priceOracleInstance = await collateralOracle.deploy(
      aggregatorInstance.address,
    )
    dvixOracleInstance = await oracle.deploy(aggregatorDVIXInstance.address)
    await priceOracleInstance.deployed()
    const wAVAX = await ethers.getContractFactory('WAVAX')
    wAVAXTokenInstance = await wAVAX.deploy()

    const rewardToken = await ethers.getContractFactory('DAI')
    rewardTokenInstance = await rewardToken.deploy()

    let nonce = await owner.getTransactionCount()

    const rewardHandlerAddress = ethers.utils.getContractAddress({
      from: accounts[0],
      nonce: nonce + 1,
    })

    const avaxVault = await ethers.getContractFactory('AVAXVaultHandler')
    avaxVaultHanndler = await avaxVault.deploy(
      orchestratorInstance.address,
      divisor,
      ratio,
      burnFee,
      liquidationPenalty,
      dvixOracleInstance.address,
      dvixInstance.address,
      wAVAXTokenInstance.address,
      priceOracleInstance.address,
      priceOracleInstance.address,
      rewardHandlerAddress,
      timelockInstance.address,
    )
    await avaxVaultHanndler.deployed()
    expect(avaxVaultHanndler.address).properAddress()

    // set reward handler
    const reward = await ethers.getContractFactory('RewardHandler')
    rewardHandlerInstance = await reward.deploy(
      orchestratorInstance.address,
      rewardTokenInstance.address,
      avaxVaultHanndler.address,
    )
    await rewardHandlerInstance.deployed()
    await orchestratorInstance.addDVIXVault(
      dvixInstance.address,
      avaxVaultHanndler.address,
    )
  })

  it('...should allow the owner to set the treasury address', async () => {
    const abi = new ethers.utils.AbiCoder()
    const target = avaxVaultHanndler.address
    const value = 0
    const signature = 'setTreasury(address)'

    const threeDays = 259200
    const timelock = await ethers.getContractFactory('Timelock')
    const timelockInstance = await timelock.deploy(
      orchestratorInstance.address,
      threeDays,
    )

    treasury = timelockInstance.address
    const data = abi.encode(['address'], [treasury])
    await expect(
      orchestratorInstance
        .connect(owner)
        .executeTransaction(target, value, signature, data),
    )
      .to()
      .emit(avaxVaultHanndler, 'NewTreasury')
      .withArgs(orchestratorInstance.address, treasury)

    expect(await avaxVaultHanndler.treasury())
      .to()
      .eq(treasury)
  })

  it('...should return the token price', async () => {
    let dvixPrice = await avaxVaultHanndler.DVIXPrice()
    let vixPrice = (await dvixOracleInstance.getLatestAnswer()).mul(10000000000)
    let result = vixPrice.div(divisor)
    expect(dvixPrice).to().eq(result)
  })

  it('...should allow users to create a vault', async () => {
    let vaultId = await avaxVaultHanndler.userToVault(accounts[1])
    expect(vaultId).eq(0)
    await expect(avaxVaultHanndler.connect(addr1).createVault())
      .to()
      .emit(avaxVaultHanndler, 'VaultCreated')
      .withArgs(accounts[1], 1)
    vaultId = await avaxVaultHanndler.userToVault(accounts[1])
    expect(vaultId).eq(1)
    vaultId = await avaxVaultHanndler.userToVault(accounts[2])
    expect(vaultId).eq(0)
    await expect(avaxVaultHanndler.connect(addr1).createVault())
      .to()
      .be.revertedWith('VaultHandler::createVault: vault already created')
  })

  it('...should get vault by id', async () => {
    let vault = await avaxVaultHanndler.getVault(1)
    expect(vault[0]).to().eq(1)
    expect(vault[1]).to().eq(0)
    expect(vault[2]).to().eq(accounts[1])
    expect(vault[3]).to().eq(0)
    vault = await avaxVaultHanndler.getVault(100)
    expect(vault[0]).to().eq(0)
    expect(vault[1]).to().eq(0)
    expect(vault[2]).to().eq(ethers.constants.AddressZero)
    expect(vault[3]).to().eq(0)
  })

  it('...should allow user to stake WAVAX as collateral', async () => {
    const amount = ethers.utils.parseEther('375')
    await expect(avaxVaultHanndler.connect(addr3).addCollateral(amount))
      .to()
      .be.revertedWith('VaultHandler::vaultExists: no vault created')
    let balance = await wAVAXTokenInstance.balanceOf(accounts[1])
    expect(balance).to().eq(0)

    await expect(avaxVaultHanndler.connect(addr1).addCollateral(amount))
      .to()
      .be.revertedWith('')
    await wAVAXTokenInstance.connect(addr1).deposit({ value: amount })
    let wAVAXbalance = await wAVAXTokenInstance.balanceOf(accounts[1])
    expect(wAVAXbalance).to().eq(amount)

    await expect(avaxVaultHanndler.connect(addr1).addCollateral(amount))
      .to()
      .be.revertedWith('')
    await wAVAXTokenInstance
      .connect(addr1)
      .approve(avaxVaultHanndler.address, amount)
    balance = await wAVAXTokenInstance.balanceOf(accounts[1])
    expect(balance).to().eq(amount)

    await expect(avaxVaultHanndler.connect(addr1).addCollateral(0))
      .to()
      .be.revertedWith("VaultHandler::notZero: value can't be 0")
    await expect(avaxVaultHanndler.connect(addr1).addCollateral(amount))
      .to()
      .emit(avaxVaultHanndler, 'CollateralAdded')
      .withArgs(accounts[1], 1, amount)
    let vault = await avaxVaultHanndler.getVault(1)
    expect(vault[0]).to().eq(1)
    expect(vault[1]).to().eq(amount)
    expect(vault[2]).to().eq(accounts[1])
    expect(vault[3]).to().eq(0)
    balance = await wAVAXTokenInstance.balanceOf(accounts[1])
    expect(balance).to().eq(0)
    balance = await wAVAXTokenInstance.balanceOf(avaxVaultHanndler.address)
    expect(balance).to().eq(amount)
    await wAVAXTokenInstance.connect(addr1).deposit({ value: amount })
    await wAVAXTokenInstance
      .connect(addr1)
      .approve(avaxVaultHanndler.address, amount)
    await avaxVaultHanndler.connect(addr1).addCollateral(amount)
    vault = await avaxVaultHanndler.getVault(1)
    expect(vault[0]).to().eq(1)
    expect(vault[1]).to().eq(amount.add(amount))
    expect(vault[2]).to().eq(accounts[1])
    expect(vault[3]).to().eq(0)
    balance = await wAVAXTokenInstance.balanceOf(avaxVaultHanndler.address)
    expect(balance).to().eq(amount.add(amount))
  })

  it('...should allow user to stake AVAX collateral', async () => {
    let balance = await ethers.provider.getBalance(accounts[1])
    const amount = ethers.utils.parseEther('375')
    let vault = await avaxVaultHanndler.getVault(1)
    let vaultBalance = vault[1]

    await expect(avaxVaultHanndler.connect(addr1).addCollateralAVAX())
      .to()
      .be.revertedWith("AVAXVaultHandler::addCollateralAVAX: value can't be 0")

    await expect(
      avaxVaultHanndler.connect(addr1).addCollateralAVAX({ value: amount }),
    )
      .to()
      .emit(avaxVaultHanndler, 'CollateralAdded')
      .withArgs(accounts[1], 1, amount)
    vault = await avaxVaultHanndler.getVault(1)
    expect(vault[0]).to().eq(1)
    expect(vault[1]).to().eq(vaultBalance.add(amount))
    expect(vault[2]).to().eq(accounts[1])
    expect(vault[3]).to().eq(0)

    let currentBalance = await ethers.provider.getBalance(accounts[1])
    expect(currentBalance).to().lt(balance.sub(amount))
    balance = await wAVAXTokenInstance.balanceOf(avaxVaultHanndler.address)
    expect(balance).to().eq(vaultBalance.add(amount))

    await wAVAXTokenInstance.connect(addr1).deposit({ value: amount })
    await wAVAXTokenInstance
      .connect(addr1)
      .approve(avaxVaultHanndler.address, amount)
    await avaxVaultHanndler.connect(addr1).addCollateral(amount)
    vault = await avaxVaultHanndler.getVault(1)
    expect(vault[0]).to().eq(1)
    expect(vault[1])
      .to()
      .eq(vaultBalance.add(amount.add(amount)))
    expect(vault[2]).to().eq(accounts[1])
    expect(vault[3]).to().eq(0)
    balance = await wAVAXTokenInstance.balanceOf(avaxVaultHanndler.address)
    expect(balance)
      .to()
      .eq(vaultBalance.add(amount.add(amount)))
  })

  it('...should allow user to retrieve unused collateral on AVAX', async () => {
    const amount = ethers.utils.parseEther('375')
    const bigAmount = ethers.utils.parseEther('100375')
    let userBalance = await ethers.provider.getBalance(accounts[1])
    let vault = await avaxVaultHanndler.getVault(1)
    let vaultBalance = vault[1]
    let contractBalance = await wAVAXTokenInstance.balanceOf(
      avaxVaultHanndler.address,
    )
    await expect(avaxVaultHanndler.connect(addr3).removeCollateralAVAX(amount))
      .to()
      .be.revertedWith('VaultHandler::vaultExists: no vault created')
    await expect(
      avaxVaultHanndler.connect(addr1).removeCollateralAVAX(bigAmount),
    )
      .to()
      .be.revertedWith(
        'AVAXVaultHandler::removeCollateralAVAX: retrieve amount higher than collateral',
      )
    await expect(avaxVaultHanndler.connect(addr1).removeCollateralAVAX(0))
      .to()
      .be.revertedWith(
        "AVAXVaultHandler::removeCollateralAVAX: value can't be 0",
      )
    await expect(avaxVaultHanndler.connect(addr1).removeCollateralAVAX(amount))
      .to()
      .emit(avaxVaultHanndler, 'CollateralRemoved')
      .withArgs(accounts[1], 1, amount)

    vault = await avaxVaultHanndler.getVault(1)
    expect(vault[0]).to().eq(1)
    expect(vault[1]).to().eq(vaultBalance.sub(amount))
    expect(vault[2]).to().eq(accounts[1])
    expect(vault[3]).to().eq(0)
    let currentBalance = await ethers.provider.getBalance(accounts[1])
    expect(userBalance.add(amount)).to().gt(currentBalance)
    let balance = await wAVAXTokenInstance.balanceOf(avaxVaultHanndler.address)
    expect(balance).to().eq(contractBalance.sub(amount))
    await avaxVaultHanndler.connect(addr1).removeCollateralAVAX(amount)
    vault = await avaxVaultHanndler.getVault(1)
    expect(vault[0]).to().eq(1)
    expect(vault[1]).to().eq(vaultBalance.sub(amount).sub(amount))
    expect(vault[2]).to().eq(accounts[1])
    expect(vault[3]).to().eq(0)

    currentBalance = await ethers.provider.getBalance(accounts[1])
    expect(userBalance.add(amount).add(amount)).to().gt(currentBalance)
    balance = await wAVAXTokenInstance.balanceOf(avaxVaultHanndler.address)
    expect(balance).to().eq(vaultBalance.sub(amount).sub(amount))
  })

  it('...should allow user to retrieve unused collateral on wAVAX', async () => {
    const amount = ethers.utils.parseEther('375')
    const bigAmount = ethers.utils.parseEther('100375')
    let balance = await wAVAXTokenInstance.balanceOf(accounts[1])
    expect(balance).to().eq(0)

    await expect(avaxVaultHanndler.connect(addr3).removeCollateral(amount))
      .to()
      .be.revertedWith('VaultHandler::vaultExists: no vault created')
    await expect(avaxVaultHanndler.connect(addr1).removeCollateral(bigAmount))
      .to()
      .be.revertedWith(
        'VaultHandler::removeCollateral: retrieve amount higher than collateral',
      )
    await expect(avaxVaultHanndler.connect(addr1).removeCollateral(0))
      .to()
      .be.revertedWith("VaultHandler::notZero: value can't be 0")
    await expect(avaxVaultHanndler.connect(addr1).removeCollateral(amount))
      .to()
      .emit(avaxVaultHanndler, 'CollateralRemoved')
      .withArgs(accounts[1], 1, amount)

    let vault = await avaxVaultHanndler.getVault(1)
    expect(vault[0]).to().eq(1)
    expect(vault[1]).to().eq(amount)
    expect(vault[2]).to().eq(accounts[1])
    expect(vault[3]).to().eq(0)
    balance = await wAVAXTokenInstance.balanceOf(accounts[1])
    expect(balance).to().eq(amount)
    balance = await wAVAXTokenInstance.balanceOf(avaxVaultHanndler.address)
    expect(balance).to().eq(amount)
    await avaxVaultHanndler.connect(addr1).removeCollateral(amount)
    vault = await avaxVaultHanndler.getVault(1)
    expect(vault[0]).to().eq(1)
    expect(vault[1]).to().eq(0)
    expect(vault[2]).to().eq(accounts[1])
    expect(vault[3]).to().eq(0)
    balance = await wAVAXTokenInstance.balanceOf(accounts[1])
    expect(balance).to().eq(amount.add(amount))
    balance = await wAVAXTokenInstance.balanceOf(avaxVaultHanndler.address)
    expect(balance).to().eq(0)
  })

  it('...should return the correct minimal collateral required', async () => {
    let amount = ethers.utils.parseEther('1')
    const reqAmount = await avaxVaultHanndler.requiredCollateral(amount)
    const AVAXPrice = (await priceOracleInstance.getLatestAnswer()).mul(
      10000000000,
    )
    const dvixPrice = await avaxVaultHanndler.DVIXPrice()
    const ratio = await avaxVaultHanndler.ratio()
    let result = dvixPrice.mul(amount).mul(ratio).div(100).div(AVAXPrice)
    expect(reqAmount).to().eq(result)
  })

  it('...should allow to earn fees if reward address is set', async () => {
    let rewardAmount = ethers.utils.parseEther('100')
    await rewardTokenInstance.mint(accounts[0], rewardAmount)
    await rewardTokenInstance
      .connect(owner)
      .transfer(rewardHandlerInstance.address, rewardAmount)
    const abi = new ethers.utils.AbiCoder()
    const target = rewardHandlerInstance.address
    const value = 0
    const signature = 'notifyRewardAmount(uint256)'
    const data = abi.encode(['uint256'], [rewardAmount])
    await expect(
      orchestratorInstance
        .connect(owner)
        .executeTransaction(target, value, signature, data),
    )
      .to()
      .emit(rewardHandlerInstance, 'RewardAdded')
      .withArgs(rewardAmount)

    expect(await rewardTokenInstance.balanceOf(rewardHandlerInstance.address))
      .to()
      .eq(rewardAmount)
  })

  it('...should allow user to mint tokens', async () => {
    const amount = ethers.utils.parseEther('10')
    const amount2 = ethers.utils.parseEther('11')
    const lowAmount = ethers.utils.parseEther('1')
    const bigAmount = ethers.utils.parseEther('100')
    const reqAmount2 = await avaxVaultHanndler.requiredCollateral(amount2)

    await wAVAXTokenInstance.connect(addr1).deposit({ value: reqAmount2 })
    let dvixBalance = await dvixInstance.balanceOf(accounts[1])
    expect(dvixBalance).to().eq(0)
    await wAVAXTokenInstance
      .connect(addr1)
      .approve(avaxVaultHanndler.address, reqAmount2)
    await avaxVaultHanndler.connect(addr1).addCollateral(reqAmount2)
    await expect(avaxVaultHanndler.connect(addr3).mint(amount))
      .to()
      .be.revertedWith('VaultHandler::vaultExists: no vault created')
    await expect(avaxVaultHanndler.connect(addr1).mint(bigAmount))
      .to()
      .be.revertedWith('VaultHandler::mint: not enough collateral')
    await expect(avaxVaultHanndler.connect(addr1).mint(amount))
      .to()
      .emit(avaxVaultHanndler, 'TokensMinted')
      .withArgs(accounts[1], 1, amount)
    dvixBalance = await dvixInstance.balanceOf(accounts[1])
    expect(dvixBalance).to().eq(amount)
    let vault = await avaxVaultHanndler.getVault(1)
    expect(vault[0]).to().eq(1)
    expect(vault[1]).to().eq(reqAmount2)
    expect(vault[2]).to().eq(accounts[1])
    expect(vault[3]).to().eq(amount)
    await expect(avaxVaultHanndler.connect(addr1).mint(lowAmount))
      .to()
      .be.revertedWith(
        'VaultHandler::mint: collateral below min required ratio',
      )
  })

  it('...should allow user to earn rewards', async () => {
    //fast-forward
    let _before = await rewardHandlerInstance.earned(accounts[1])
    await ethers.provider.send('evm_increaseTime', [ONE_DAY])
    await ethers.provider.send('evm_mine', [])
    let _after = await rewardHandlerInstance.earned(accounts[1])
    expect(_after.gt(_before)).to().be().true()
    expect(_after > 0)
      .to()
      .be()
      .true()
  })

  it('...should allow users to get collateral ratio', async () => {
    let ratio = await avaxVaultHanndler.getVaultRatio(2)
    expect(ratio).to().eq(0)
    ratio = await avaxVaultHanndler.getVaultRatio(1)
    expect(ratio).to().eq(164)
  })

  it("...shouln't allow users to retrieve stake unless debt is paid", async () => {
    let vault = await avaxVaultHanndler.getVault(1)
    await expect(avaxVaultHanndler.connect(addr1).removeCollateral(vault[1]))
      .to()
      .be.revertedWith(
        'VaultHandler::removeCollateral: collateral below min required ratio',
      )
  })

  it('...should calculate the burn fee', async () => {
    let amount = ethers.utils.parseEther('10')
    let divisor = 100
    let dvixPrice = await avaxVaultHanndler.DVIXPrice()
    let AVAXPrice = (await priceOracleInstance.getLatestAnswer()).mul(
      10000000000,
    )
    let result = dvixPrice.mul(amount).div(divisor).div(AVAXPrice)
    let fee = await avaxVaultHanndler.getFee(amount)
    expect(fee).to().eq(result)
    amount = ethers.utils.parseEther('100')
    result = dvixPrice.mul(amount).div(divisor).div(AVAXPrice)
    fee = await avaxVaultHanndler.getFee(amount)
    expect(fee).to().eq(result)
  })

  it('...should allow users to burn tokens', async () => {
    let beforeReward = await rewardTokenInstance.balanceOf(accounts[1])
    const amount = ethers.utils.parseEther('10')
    const amount2 = ethers.utils.parseEther('11')
    const bigAmount = ethers.utils.parseEther('100')
    // eslint-disable-next-line
    const AVAXHighAmount = ethers.utils.parseEther('50')
    const reqAmount2 = await avaxVaultHanndler.requiredCollateral(amount2)
    const AVAXAmount = await avaxVaultHanndler.getFee(amount)
    const AVAXAmount2 = await avaxVaultHanndler.getFee(bigAmount)

    await expect(avaxVaultHanndler.connect(addr3).burn(amount))
      .to()
      .be.revertedWith('VaultHandler::vaultExists: no vault created')
    await expect(avaxVaultHanndler.connect(addr1).burn(amount))
      .to()
      .be.revertedWith('VaultHandler::burn: burn fee less than required')
    await expect(
      avaxVaultHanndler.connect(addr1).burn(bigAmount, { value: AVAXAmount2 }),
    )
      .to()
      .be.revertedWith('VaultHandler::burn: amount greater than debt')

    await expect(
      avaxVaultHanndler.connect(addr1).burn(amount, { value: AVAXAmount }),
    )
      .to()
      .emit(avaxVaultHanndler, 'TokensBurned')
      .withArgs(accounts[1], 1, amount)
    let dvixBalance = await dvixInstance.balanceOf(accounts[1])
    expect(dvixBalance).to().eq(0)
    let vault = await avaxVaultHanndler.getVault(1)
    expect(vault[0]).to().eq(1)
    expect(vault[1]).to().eq(reqAmount2)
    expect(vault[2]).to().eq(accounts[1])
    expect(vault[3]).to().eq(0)

    let afterReward = await rewardTokenInstance.balanceOf(accounts[1])
    expect(afterReward).to().be.gt(beforeReward)
  })

  it('...should update the collateral ratio', async () => {
    let ratio = await avaxVaultHanndler.getVaultRatio(1)
    expect(ratio).to().eq(0)
  })

  it('...should allow users to retrieve stake when debt is paid', async () => {
    let vault = await avaxVaultHanndler.getVault(1)
    await expect(avaxVaultHanndler.connect(addr1).removeCollateral(vault[1]))
      .to()
      .emit(avaxVaultHanndler, 'CollateralRemoved')
      .withArgs(accounts[1], 1, vault[1])
    vault = await avaxVaultHanndler.getVault(1)
    expect(vault[0]).to().eq(1)
    expect(vault[1]).to().eq(0)
    expect(vault[2]).to().eq(accounts[1])
    expect(vault[3]).to().eq(0)
  })

  it('...should test liquidation requirements', async () => {
    //Prepare for liquidation tests
    let amount = ethers.utils.parseEther('10')

    const reqAmount = await avaxVaultHanndler.requiredCollateral(
      ethers.utils.parseEther('11'),
    )

    //liquidated
    await avaxVaultHanndler.connect(lq).createVault()
    await wAVAXTokenInstance.connect(lq).deposit({ value: reqAmount })
    await wAVAXTokenInstance
      .connect(lq)
      .approve(avaxVaultHanndler.address, reqAmount)
    await avaxVaultHanndler.connect(lq).addCollateral(reqAmount)
    await avaxVaultHanndler.connect(lq).mint(amount)
    await expect(avaxVaultHanndler.connect(addr3).liquidateVault(99, 0))
      .to()
      .be.revertedWith('VaultHandler::liquidateVault: no vault created')
    await expect(avaxVaultHanndler.connect(addr3).liquidateVault(2, 0))
      .to()
      .be.revertedWith('VaultHandler::liquidateVault: vault is not liquidable')
    const vixPrice = '43129732288636297500'
    await aggregatorDVIXInstance.connect(owner).setLatestAnswer(vixPrice)
  })

  it('...should get the required collateral for liquidation', async () => {
    let reqLiquidation = await avaxVaultHanndler.requiredLiquidationDVIX(2)
    let liquidationPenalty = await avaxVaultHanndler.liquidationPenalty()
    let ratio = await avaxVaultHanndler.ratio()
    let collateralPrice = (await priceOracleInstance.getLatestAnswer()).mul(
      10000000000,
    )
    let dvixPrice = await avaxVaultHanndler.DVIXPrice()
    let vault = await avaxVaultHanndler.getVault(2)
    let collateralDvix = vault[1].mul(collateralPrice).div(dvixPrice)
    let reqDividend = vault[3].mul(ratio).div(100).sub(collateralDvix).mul(100)
    let reqDivisor = ratio.sub(liquidationPenalty.add(100))
    let result = reqDividend.div(reqDivisor)
    expect(result).to().eq(reqLiquidation)
  })

  it('...should get the liquidation reward', async () => {
    let reqLiquidation = await avaxVaultHanndler.requiredLiquidationDVIX(2)
    let liquidationReward = await avaxVaultHanndler.liquidationReward(2)
    let liquidationPenalty = await avaxVaultHanndler.liquidationPenalty()
    let collateralPrice = (await priceOracleInstance.getLatestAnswer()).mul(
      10000000000,
    )
    let dvixPrice = await avaxVaultHanndler.DVIXPrice()

    let result = reqLiquidation.mul(liquidationPenalty.add(100)).div(100)
    result = result.mul(dvixPrice).div(collateralPrice)
    expect(result).to().eq(liquidationReward)
  })

  it('...should allow liquidators to return profits', async () => {
    const divisor = ethers.utils.parseEther('1')
    const liquidationReward = await avaxVaultHanndler.liquidationReward(2)
    const reqLiquidation = await avaxVaultHanndler.requiredLiquidationDVIX(2)
    const dvixPrice = await avaxVaultHanndler.DVIXPrice()
    const collateralPrice = (await priceOracleInstance.getLatestAnswer()).mul(
      10000000000,
    )
    const rewardUSD = liquidationReward.mul(collateralPrice).div(divisor)
    const collateralUSD = reqLiquidation.mul(dvixPrice).div(divisor)
    expect(rewardUSD)
      .to()
      .be.gte(
        collateralUSD,
        'reward should be greater than collateral paid to liquidate',
      )
  })
  it('...should allow users to liquidate users on vault ratio less than ratio', async () => {
    const treasuryAddress = treasury
    const beforeTreasury = await ethers.provider.getBalance(treasuryAddress)
    let vaultRatio = await avaxVaultHanndler.getVaultRatio(2)

    //liquidator setup
    let liquidatorAmount = ethers.utils.parseEther('20')
    const reqLiquidatorAmount = await avaxVaultHanndler.requiredCollateral(
      ethers.utils.parseEther('110'),
    )
    await avaxVaultHanndler.connect(addr3).createVault()
    await wAVAXTokenInstance
      .connect(addr3)
      .deposit({ value: reqLiquidatorAmount })
    await wAVAXTokenInstance
      .connect(addr3)
      .approve(avaxVaultHanndler.address, reqLiquidatorAmount)
    await avaxVaultHanndler.connect(addr3).addCollateral(reqLiquidatorAmount)
    await avaxVaultHanndler.connect(addr3).mint(liquidatorAmount)

    let liquidationReward = await avaxVaultHanndler.liquidationReward(2)
    let reqLiquidation = await avaxVaultHanndler.requiredLiquidationDVIX(2)
    let dvixBalance = await dvixInstance.balanceOf(accounts[3])
    let collateralBalance = await wAVAXTokenInstance.balanceOf(accounts[3])
    let vault = await avaxVaultHanndler.getVault(2)
    const burnAmount = await avaxVaultHanndler.getFee(reqLiquidation)
    const fakeBurn = await avaxVaultHanndler.getFee(1)
    await expect(
      avaxVaultHanndler.connect(addr3).liquidateVault(2, reqLiquidation),
    )
      .to()
      .be.revertedWith(
        'VaultHandler::liquidateVault: burn fee less than required',
      )
    await expect(
      avaxVaultHanndler
        .connect(addr3)
        .liquidateVault(2, 1, { value: fakeBurn }),
    )
      .to()
      .be.revertedWith(
        'VaultHandler::liquidateVault: liquidation amount different than required',
      )
    await expect(
      avaxVaultHanndler
        .connect(addr3)
        .liquidateVault(2, reqLiquidation, { value: burnAmount }),
    )
      .to()
      .emit(avaxVaultHanndler, 'VaultLiquidated')
      .withArgs(2, accounts[3], reqLiquidation, liquidationReward)

    vaultRatio = await avaxVaultHanndler.getVaultRatio(2)
    let newDvixBalance = await dvixInstance.balanceOf(accounts[3])
    let newCollateralBalance = await wAVAXTokenInstance.balanceOf(accounts[3])
    let updatedVault = await avaxVaultHanndler.getVault(2)
    let currentAVAXBalance = await ethers.provider.getBalance(
      avaxVaultHanndler.address,
    )
    expect(currentAVAXBalance).to().eq(0)
    expect(updatedVault[1]).to().eq(vault[1].sub(liquidationReward))
    expect(updatedVault[3]).to().eq(vault[3].sub(reqLiquidation))
    expect(newCollateralBalance)
      .to()
      .eq(collateralBalance.add(liquidationReward))
    expect(dvixBalance).to().eq(newDvixBalance.add(reqLiquidation)) //increase earnings
    expect(vaultRatio).to().be.gte(parseInt(ratio)) // set vault back to ratio
    const afterTreasury = await ethers.provider.getBalance(treasuryAddress)
    expect(afterTreasury.gt(beforeTreasury)).eq(true)
  })

  it('...should allow owner to pause contract', async () => {
    await expect(avaxVaultHanndler.connect(addr1).pause())
      .to()
      .be.revertedWith('Ownable: caller is not the owner')
    await expect(
      orchestratorInstance
        .connect(guardian)
        .pauseVault(avaxVaultHanndler.address),
    )
      .to()
      .emit(avaxVaultHanndler, 'Paused')
      .withArgs(orchestratorInstance.address)
    let paused = await avaxVaultHanndler.paused()
    expect(paused).to().eq(true)
  })

  it("...shouldn't allow contract calls if contract is paused", async () => {
    await expect(avaxVaultHanndler.connect(addr1).createVault())
      .to()
      .be.revertedWith('Pausable: paused')
    await expect(avaxVaultHanndler.connect(addr1).addCollateral(0))
      .to()
      .be.revertedWith('Pausable: paused')
    await expect(avaxVaultHanndler.connect(addr1).mint(0))
      .to()
      .be.revertedWith('Pausable: paused')
    await expect(avaxVaultHanndler.connect(addr1).removeCollateral(0))
      .to()
      .be.revertedWith('Pausable: paused')
  })

  it('...should allow owner to unpause contract', async () => {
    await expect(avaxVaultHanndler.connect(addr1).unpause())
      .to()
      .be.revertedWith('Ownable: caller is not the owner')
    await expect(
      orchestratorInstance
        .connect(guardian)
        .unpauseVault(avaxVaultHanndler.address),
    )
      .to()
      .emit(avaxVaultHanndler, 'Unpaused')
      .withArgs(orchestratorInstance.address)
    let paused = await avaxVaultHanndler.paused()
    expect(paused).to().eq(false)
  })
})
