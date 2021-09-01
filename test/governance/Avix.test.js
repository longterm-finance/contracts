var { expect, describe, beforeEach } = require('chai')
var { BigNumber, constants, utils } = require('ethers')
// var { MockProvider, createFixtureLoader, deployContract } = require("ethereum-waffle")
var { ecsign } = require('ethereumjs-util')
var { governanceFixture } = require('./fixtures')
var { expandTo18Decimals, mineBlock } = require('./utils')
var { ethers, waffle } = require('hardhat')
var Avix = require('../../artifacts/contracts/governance/avix.sol/Avix.json')

const DOMAIN_TYPEHASH = utils.keccak256(
  utils.toUtf8Bytes(
    'EIP712Domain(string name,uint256 chainId,address verifyingContract)',
  ),
)

const PERMIT_TYPEHASH = utils.keccak256(
  utils.toUtf8Bytes(
    'Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)',
  ),
)

describe('Avix', () => {
  // const provider = new MockProvider({
  // 	ganacheOptions: {
  // 		hardfork: "istanbul",
  // 		mnemonic: "horn horn horn horn horn horn horn horn horn horn horn horn",
  // 		gasLimit: 800000000,
  // 	},
  // });

  const [wallet, other0, other1] = waffle.provider.getWallets()
  const loadFixture = waffle.createFixtureLoader([wallet], waffle.provider)

  let avix

  beforeEach(async () => {
    const fixture = await loadFixture(governanceFixture)
    avix = fixture.avix
  })

  it('...should permit', async () => {
    const domainSeparator = utils.keccak256(
      utils.defaultAbiCoder.encode(
        ['bytes32', 'bytes32', 'uint256', 'address'],
        [
          DOMAIN_TYPEHASH,
          utils.keccak256(utils.toUtf8Bytes('Avix')),
          31337,
          avix.address,
        ],
      ),
    )

    const owner = wallet.address
    const spender = other0.address
    const value = 123
    const nonce = await avix.nonces(wallet.address)
    const deadline = constants.MaxUint256
    const digest = utils.keccak256(
      utils.solidityPack(
        ['bytes1', 'bytes1', 'bytes32', 'bytes32'],
        [
          '0x19',
          '0x01',
          domainSeparator,
          utils.keccak256(
            utils.defaultAbiCoder.encode(
              [
                'bytes32',
                'address',
                'address',
                'uint256',
                'uint256',
                'uint256',
              ],
              [PERMIT_TYPEHASH, owner, spender, value, nonce, deadline],
            ),
          ),
        ],
      ),
    )

    const { v, r, s } = ecsign(
      Buffer.from(digest.slice(2), 'hex'),
      Buffer.from(wallet.privateKey.slice(2), 'hex'),
    )

    await avix.permit(
      owner,
      spender,
      value,
      deadline,
      v,
      utils.hexlify(r),
      utils.hexlify(s),
    )
    expect(await avix.allowance(owner, spender))
      .to()
      .eq(value)
    expect(await avix.nonces(owner))
      .to()
      .eq(1)

    await avix.connect(other0).transferFrom(owner, spender, value)
  })

  it('...should changes allowance', async () => {
    const amount = ethers.utils.parseEther('10')
    await avix.connect(other0).approve(other1.address, amount)
    expect(await avix.allowance(other0.address, other1.address))
      .to()
      .eq(amount)

    await avix.connect(other0).increaseAllowance(other1.address, amount)
    expect(await avix.allowance(other0.address, other1.address))
      .to()
      .eq(amount.add(amount))

    await avix.connect(other0).decreaseAllowance(other1.address, amount)
    expect(await avix.allowance(other0.address, other1.address))
      .to()
      .eq(amount)
  })

  it('...should allow nested delegation', async () => {
    await avix.transfer(other0.address, expandTo18Decimals(1))
    await avix.transfer(other1.address, expandTo18Decimals(2))

    let currectVotes0 = await avix.getCurrentVotes(other0.address)
    let currectVotes1 = await avix.getCurrentVotes(other1.address)
    expect(currectVotes0).to().be.eq(0)
    expect(currectVotes1).to().be.eq(0)

    await avix.connect(other0).delegate(other1.address)
    currectVotes1 = await avix.getCurrentVotes(other1.address)
    expect(currectVotes1).to().be.eq(expandTo18Decimals(1))

    await avix.connect(other1).delegate(other1.address)
    currectVotes1 = await avix.getCurrentVotes(other1.address)
    expect(currectVotes1)
      .to()
      .be.eq(expandTo18Decimals(1).add(expandTo18Decimals(2)))

    await avix.connect(other1).delegate(wallet.address)
    currectVotes1 = await avix.getCurrentVotes(other1.address)
    expect(currectVotes1).to().be.eq(expandTo18Decimals(1))
  })

  it('...should mint', async () => {
    const { timestamp: now } = await waffle.provider.getBlock('latest')
    const avix = await waffle.deployContract(wallet, Avix, [
      wallet.address,
      wallet.address,
      now + 60 * 60,
    ])
    const supply = await avix.totalSupply()

    await expect(avix.mint(wallet.address, 1))
      .to()
      .be.revertedWith('avix::mint: minting not allowed yet')

    let timestamp = await avix.mintingAllowedAfter()
    await mineBlock(waffle.provider, parseInt(timestamp.toString()))

    await expect(avix.connect(other1).mint(other1.address, 1))
      .to()
      .be.revertedWith('avix::mint: only the minter can mint')
    await expect(avix.mint('0x0000000000000000000000000000000000000000', 1))
      .to()
      .be.revertedWith('avix::mint: cannot transfer to the zero address')
    await expect(avix.mint(avix.address, 1))
      .to()
      .be.revertedWith('avix::mint: cannot transfer to the avix address')

    // can mint up to 2%
    const mintCap = BigNumber.from(await avix.mintCap())
    const amount = supply.mul(mintCap).div(100)
    await avix.mint(wallet.address, amount)
    expect(await avix.balanceOf(wallet.address))
      .to()
      .be.eq(supply.add(amount))

    timestamp = await avix.mintingAllowedAfter()
    await mineBlock(waffle.provider, parseInt(timestamp.toString()))
    // cannot mint 2.01%
    await expect(avix.mint(wallet.address, supply.mul(mintCap.add(1))))
      .to()
      .be.revertedWith('Avix::mint: exceeded mint cap')
  })
})
