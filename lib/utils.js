const ethersUtils = require('ethers').utils
const BigNumber = require('bignumber.js')
const web3utils = require('web3').utils

function numberToBytes32(num) {
  const bn = ethersUtils.bigNumberify(num);
  return ethersUtils.hexlify(ethersUtils.padZeros(bn, 32));
}

function passthroughExpand(obj, idMethod, methods, parentKey = '_parent') { 
  Object.assign(
    obj.prototype,
    methods.reduce((obj, name) => {
      obj[name] = async function(...args) {
        return this[parentKey][name](await this[idMethod](), ...args)
      }
      return obj
    }, {})
  )
}

module.exports = {
  BigNumber,
  numberToBytes32,
  web3utils,
  passthroughExpand
}
