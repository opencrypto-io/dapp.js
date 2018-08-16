const Service = require('../..').service

class ERC20 extends Service {

  async getDecimals (tokenAddr) {
    return this.$call(tokenAddr, 'v1', 'decimals')
  }

  async getSymbol (tokenAddr) {
    const symbol = await this.$call(tokenAddr, 'v1', 'symbol')
    return this.$utils.hexToAscii(symbol)
  }

  async getBalance (tokenAddr, owner) {
    const ret = await Promise.all([
      this.getDecimals(tokenAddr),
      this.$call(tokenAddr, 'v1', 'balanceOf', [owner])
    ])
    return ret[1] / Math.pow(10, ret[0])
  }
}

ERC20.createChild('token', [
  'getDecimals',
  'getSymbol',
  'getBalance'
])

module.exports = {
  name: 'ERC-20 Token',
  api: ERC20
}
