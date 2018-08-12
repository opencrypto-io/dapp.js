const utils = require('../../lib/utils')

const RAY = new utils.BigNumber('1e27')
const WAD = new utils.BigNumber('1e18')

class Dai {
  constructor(api, index, assets) {
    this._api = api
    this._assets = assets
    this._index = index
    this._cdp = Cdp
  }
  _cdpId(id) {
    return utils.numberToBytes32(id)
  }
  async _call(id, method, opts = []) {
    const contract = await this._api.contract(this, id)
    return contract.methods[method].apply(null, opts).call()
  }
  async _send(id, method, opts = [], sendOpts = {}) {
    const contract = await this._api.contract(this, id)
    const tx = await contract.methods[method].apply(null, opts)
    sendOpts.gas = parseInt(await tx.estimateGas(sendOpts) * 1.5)
    return tx.send(sendOpts)
  }
  async getCdp(id) {
    return new this._cdp(this, id)
  }
  async createCdp() {
    return new this._cdp(this)
  }
  async getTargetPrice() {
    return this._call('vox', 'par')
  }
  async getLiquidationRatio() {
    const value = await this._call('tub', 'mat')
    return new utils.BigNumber(value.toString()).dividedBy(RAY).toNumber()
  }
  async getDebtValue(id) {
    return this._call('tub', 'tab', [this._cdpId(id)])
  }
  async getCollateralValue(id) {
    return this._call('tub', 'ink', [this._cdpId(id)])
  }
  async getInfo(id) {
    return this._call('tub', 'cups', [this._cdpId(id)])
  }
  async draw(id, value, from) {
    return this._send('tub', 'draw', [this._cdpId(id), value], { from })
  }
}

class Cdp {
  constructor(dai, id = null) {
    this._parent = dai

    if (id === null) {
      this.id = this._newCdp()
    } else {
      this.id = Promise.resolve(id)
    }
  }
  async getId() {
    return this.id
  }
}

utils.passthroughExpand(Cdp, 'getId', [
  'getDebtValue',
  'getCollateralValue',
  'getInfo',
  'draw'
])

module.exports = {
  name: 'Dai (MakerDAO)',
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
