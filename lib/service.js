const utils = require('./utils')

class Service {
  constructor (api, index, assets) {
    this._api = api
    this._index = index
    this._assets = assets
    this._debug = this._api._debug('Service:' + this.constructor.name)
    this.$utils = utils
  }

  async $call (...args) {
    return this._api.call(this, ...args)
  }

  async $send (...args) {
    return this._api.send(this, ...args)
  }

  async $mcall (...args) {
    return this._call(null, ...args)
  }

  async $msend (...args) {
    return this._send(null, ...args)
  }
}

Service.generateChild = function (idName = 'id', getFnName = 'getId') {
  return class ServiceChild {
    constructor (service, id) {
      this._parent = service
      this['_' + idName] = Promise.resolve(id)
    }
    async [getFnName] () {
      return this['_' + idName]
    }
  }
}

Service.expandChild = utils.passthroughExpand

Service.createChild = function (name, methods, idName = 'id') {
  const getFnName = 'get' + idName.charAt(0).toUpperCase() + idName.slice(1)
  const Child = Service.generateChild(idName, getFnName)
  this.prototype[name] = function (id) { return new Child(this, id) }
  Service.expandChild(Child, getFnName, methods)
  return Child
}

Service.utils = utils

module.exports = Service
