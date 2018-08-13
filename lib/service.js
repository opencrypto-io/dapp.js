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
    this._debug('_call', JSON.stringify({ addr, id, method, opts }))
    const contract = await this._api.contract(this, id, {}, { addr })
    return contract.methods[method].apply(null, opts).call()
      .catch(err => {
        this._debug(err)
        return null
      })
  }

  async _send(addr, id, method, opts = [], sendOpts = {}) {
    this._debug('_send', JSON.stringify({ addr, id, method, opts, sendOpts }))
    const contract = await this._api.contract(this, id, {}, { addr })
    const tx = await contract.methods[method].apply(null, opts)
    sendOpts.gas = parseInt(await tx.estimateGas(sendOpts) * 1.5)
    return tx.send(sendOpts)
  }

  async _mcall(...args) {
    return this._call(null, ...args)
  }
  async _msend(...args) {
    return this._send(null, ...args)
  }
}

Service.generateChild = function(idName = 'id', getFnName = 'getId') {
  return class ServiceChild {
    constructor(service, id) {
      this._parent = service
      this['_'+idName] = Promise.resolve(id)
    }
    async [getFnName]() {
      return this['_'+idName]
    }
  }
}

Service.expandChild = utils.passthroughExpand

Service.createChild = function(name, methods, idName = 'id') {
  const getFnName = 'get' + idName.charAt(0).toUpperCase() + idName.slice(1)
  const Child = Service.generateChild(idName, getFnName)
  this.prototype[name] = function (id) { return new Child(this, id) }
  Service.expandChild(Child, getFnName, methods)
  return Child
}

Service.utils = utils


module.exports = Service
