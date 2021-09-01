var { BigNumber } = require('ethers')

exports.DELAY = 60 * 60 * 24 * 2

exports.mineBlock = async function mineBlock(provider, timestamp) {
  return provider.send('evm_mine', [timestamp])
}

exports.expandTo18Decimals = function (n) {
  return BigNumber.from(n).mul(BigNumber.from(10).pow(18))
}
