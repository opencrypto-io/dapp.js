const utils = require('../../lib/utils')

class DSValue {
  constructor(api, index, assets) {
    this._api = api
    this._index = index
    this._assets = assets
  }

  async _call(addr, id, method, opts = []) {
    console.log(addr, id, method)
    const contract = await this._api.contract(this, id, {}, { addr })
    return contract.methods[method].apply(null, opts).call()
  }

  async get(addr) {
    return utils.web3utils.hexToNumberString(await this._call(addr, 'DSValue', 'read'))
  }
}

module.exports = {
  name: 'DSValue',
  api: DSValue
}
