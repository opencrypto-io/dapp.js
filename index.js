const fs = require('fs')
const path = require('path')
const providers = require('./lib/providers')
const debug = require('debug')

class DAppClient {

  constructor (config = {}) {
    this._defaultConfig = {
      network: 'mainnet',
      servicesDir: path.join(__dirname, 'services'),
      services: [
        'dai',
        'erc20',
        'ds-value',
        'ens'
      ]
    }
    this._defaultProviderConfig = {
      type: 'web3/infura'
    }
    this._config = Object.assign(this._defaultConfig, config)
    if (!this._config.provider) {
      this._config.provider = this._defaultProviderConfig
    }
    this._services = {}
    this._provider = null
    this._debug = debug

    // Load services
    this._config.services.forEach(id => {
      const servicePath = path.join(this._config.servicesDir, id)
      this._services[id] = {
        path: servicePath,
        pkg: require(servicePath)
      }
    })
    // Load provider
    this._provider = new providers[this._config.provider.type](this)
    // Load account
    if (this._config.privateKey) {
      this._provider.addPrivateKeyAccount(this._config.privateKey)
    }
  }

  services () {
    return Object.keys(this._services).map(id => {
      const s = this._services[id]
      return {
        id,
        path: s.path,
        name: s.pkg.name
      }
    })
  }

  addService (name, path) {
    this._services[name] = {
      path,
      pkg: require(path)
    }
  }

  async service (id) {
    return new this._services[id].pkg.api(this, this._services[id], await this.assets(id))
  }

  async assets (serviceId) {
    const assets = { abi: {} }
    const abiDir = path.join(this._services[serviceId].path, 'abi')
    if (fs.existsSync(abiDir)) {
      fs.readdirSync(abiDir).forEach(f => {
        assets.abi[path.parse(f).name] = JSON.parse(fs.readFileSync(path.join(abiDir, f)))
      })
    }
    return assets
  }

  async contract (service, id, opts = {}, localOpts = {}) {
    const args = {
      abi: null,
      addr: null
    }
    const defaultProp = (prop) => {
      switch (prop) {
        case 'abi':
          return service._assets.abi[id]
        case 'addr':
          return service._index.contracts[this._config.network][id]
      }
    }
    Object.keys(args).forEach(prop => {
      args[prop] = localOpts[prop] || defaultProp(prop, service)
    })
    return this._provider.contract(args.abi, args.addr, opts)
  }
}

module.exports = {
  client: DAppClient
}
