const utils = require('./utils')

class Service {

  constructor(api, index, assets) {
    this._api = api
    this._index = index
    this._assets = assets
    this._utils = utils
    this._debug = this._api._debug('Service:' + this.constructor.name)
  }
  async _call(addr, id, method, opts = []) {
    this._debug('_call', JSON.stringify({ addr, id, method }))
    const contract = await this._api.contract(this, id, {}, { addr })
    return contract.methods[method].apply(null, opts).call()
  }
  async _send(addr, id, method, opts = [], sendOpts = {}) {
    const contract = await this._api.contract(this, id, {}, { addr })
    const tx = await contract.methods[method].apply(null, opts)
    sendOpts.gas = parseInt(await tx.estimateGas(sendOpts) * 1.5)
    return tx.send(sendOpts)
  }
}

module.exports = Service
