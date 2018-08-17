const ethersUtils = require('ethers').utils
const web3 = require('web3')

const utils = {}

Object.assign(utils, web3.utils)
utils.BigNumber = require('bignumber.js')

utils.toDecimal = (num, decimals = 18) => {
  if (!utils.isBigNumber(decimals)) {
    decimals = new utils.BigNumber('1e' + decimals.toString())
  }
  return new utils.BigNumber(num.toString()).dividedBy(decimals)
}


class Currency {
  constructor(symbol, value, shift = 0) {
    const bn = new utils.BigNumber(value.toString()) 
    this._amount = shift ? bn.shiftedBy(shift) : bn
    this._symbol = symbol
  }
  toNumber() {
    return this._amount.toNumber()
  }
  toBigNumber() {
    return this._amount
  }
  toString(decimals = 2) {
    return `${this._amount.toFixed(decimals)} ${this._symbol}`
  }
}

utils.createCurrency = function (symbol, shift) {
  return {
    wei: (value) => {
      return new Currency(symbol, value, -18)
    }
  }
}

utils.Currency = Currency

utils.numberToBytes32 = (num) => {
  const bn = ethersUtils.bigNumberify(num)
  return ethersUtils.hexlify(ethersUtils.padZeros(bn, 32))
}

utils.passthroughExpand = function (obj, idMethod, methods, parentKey = '_parent') {
  Object.assign(
    obj.prototype,
    methods.reduce((obj, name) => {
      obj[name] = async function (...args) {
        return this[parentKey][name](await this[idMethod](), ...args)
      }
      return obj
    }, {})
  )
}

utils.formatHex = function (value, type) {
  if (type === 'Hex') return value
  if (!utils['hexTo' + type]) {
    throw new Error('Unknown hexTo type: ' + type)
  }
  return utils['hexTo' + type](value)
}

module.exports = utils
