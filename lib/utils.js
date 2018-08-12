const ethersUtils = require('ethers').utils
const BigNumber = require('bignumber.js')

function numberToBytes32(num) {
  const bn = ethersUtils.bigNumberify(num);
  return ethersUtils.hexlify(ethersUtils.padZeros(bn, 32));
}

module.exports = {
  BigNumber,
  numberToBytes32
}
