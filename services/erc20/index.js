const Service = require('../..').service

class ERC20 extends Service {

  async decimals (addr) {
    return this.$call(addr, 'v1', 'decimals')
  }

  async symbol (addr) {
    const symbolHex = await this.$call(addr, 'v1', 'symbol')
    return this.$utils.hexToAscii(symbolHex)
  }

  async balance (addr, owner) {
    const [ decimals, balance ] = await Promise.all([
      this.decimals(addr),
      this.$call(addr, 'v1', 'balanceOf', [owner])
    ])
    return balance / Math.pow(10, decimals)
  }
}

ERC20.createChild('token', [
  'decimals',
  'symbol',
  'balance'
])

module.exports = {
  name: 'ERC-20 Token',
  api: ERC20
}
