const Service = require('../../lib/service')

const RAY = new Service.utils.BigNumber('1e27')
const WAD = new Service.utils.BigNumber('1e18')

const DAI = new Service.utils.createCurrency('DAI')
const PETH = new Service.utils.createCurrency('PETH')

class Dai extends Service {
  _cdpId (id) {
    return this.$utils.numberToBytes32(id)
  }
  // Get Target price
  async targetPrice () {
    return this.$mcall('vox', 'par')
  }
  // Get Liquidation ratio
  async liquidationRatio () {
    const value = await this.$mcall('tub', 'mat')
    return new this.$utils.BigNumber(value.toString()).dividedBy(RAY).toNumber()
  }
  // Get WETH-PETH ratio
  async wethPethRatio () {
    const value = await this.$mcall('tub', 'per')
    return new this.$utils.BigNumber(value.toString()).dividedBy(RAY).toNumber()
  }
  // Get debt value
  async debt (id) {
    const value = await this.$mcall('tub', 'tab', [this._cdpId(id)])
    return DAI.wei(value)
  }
  // Get collateral value
  async collateral (id) {
    const value = await this.$mcall('tub', 'ink', [this._cdpId(id)])
    return PETH.wei(value)
  }
  // Get Liquidation price
  async liquidationPrice (id) {
    const [debt, liqRatio, collateral] = await Promise.all([
      this.debt(id),
      this.liquidationRatio(),
      this.collateral(id)
    ])
    return debt.toBigNumber().times(liqRatio).div(collateral.toBigNumber())
  }
  async cdp (id) {
    return new Cdp(this, id)
  }
  async openCdp (from) {
    return this.$msend('tub', 'open', [], { from })
  }
  async getInfo (id) {
    return this.$mcall('tub', 'cups', [this._cdpId(id)])
  }
  async lock (id, value, from) {
  }
  async draw (id, value, from) {
    return this.$msend('tub', 'draw', [this._cdpId(id), value], { from })
  }
}

class Cdp {
  constructor (dai, id = null) {
    this._parent = dai

    if (id === null) {
      this.id = this._newCdp()
    } else {
      this.id = Promise.resolve(id)
    }
  }
  async _newCdp () {
    console.log('creating cdp ..')
    return { ok: true }
  }
  async getId () {
    return this.id
  }
}

Service.utils.passthroughExpand(Cdp, 'getId', [
  'getDebtValue',
  'getCollateralValue',
  'getInfo',
  'draw'
])

module.exports = {
  name: 'Dai Stablecoin System',
  contracts: {
    mainnet: {
      tub: '0x448a5065aebb8e423f0896e6c5d525c040f59af3',
      vox: '0x9b0f70df76165442ca6092939132bbaea77f2d7a',
      pip: '0xb7092ee7a8c4c85431962662310bbdcd4fd519e9'
    },
    kovan: {
      tub: '0xa71937147b55deb8a530c7229c442fd3f31b7db2',
      vox: '0xbb4339c0ab5b1d9f14bd6e3426444a1e9d86a1d9'
    }
  },
  tokens: {
    mainnet: {
      DAI: '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359'
    }
  },
  api: Dai
}
