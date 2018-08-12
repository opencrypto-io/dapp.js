const utils = require('../../lib/utils')

class ERC20 {
  constructor(api, index, assets) {
    this._api = api
    this._index = index
    this._assets = assets
  }

  async token(addr) {
    return new Token(this, addr)
  }

  async _call(addr, id, method, opts = []) {
    const contract = await this._api.contract(this, id, {}, { addr })
    return contract.methods[method].apply(null, opts).call()
  }

  async getDecimals(tokenAddr) {
    return this._call(tokenAddr, 'v1', 'decimals')
  }

  async getSymbol(tokenAddr) {
    const symbol = await this._call(tokenAddr, 'v1', 'symbol')
    return utils.web3utils.hexToAscii(symbol)
  }

  async getBalance(tokenAddr, owner) {
    const ret = await Promise.all([
      this.getDecimals(tokenAddr),
      this._call(tokenAddr, 'v1', 'balanceOf', [owner])
    ])
    return ret[1] / Math.pow(10, ret[0])
  }
}

class Token {
  constructor(erc20, addr) {
    this._parent = erc20
    this.addr = Promise.resolve(addr)
  }
  async getAddr() {
    return this.addr
  }
}

utils.passthroughExpand(Token, 'getAddr', [
  'getDecimals',
  'getSymbol',
  'getBalance'
])

module.exports = {
  name: 'ERC-20 Tokens',
  api: ERC20
}
