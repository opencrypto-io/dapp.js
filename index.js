const fs = require('fs')
const path = require('path')
const debug = require('debug')

// const providers = require('./lib/providers')
const Provider = require('./lib/provider')
const Service = require('./lib/service')

const coreServices = [
  'eth',
  'erc20',
  'ds-value',
  'ens',
  'dai',
  'price-feed'
]

class DAppClient {
  constructor (config = {}) {
    this._defaultConfig = {
      network: 'mainnet',
      servicesDir: path.join(__dirname, 'services'),
      services: coreServices,
      debug: false
    }
    this._defaultProviderConfig = {
      type: 'web3/infura'
    }
    this._config = Object.assign(this._defaultConfig, config)
    if (!this._config.provider) {
      this._config.provider = {}
    }
    this._config.provider = Object.assign(this._defaultProviderConfig, this._config.provider)

    this._services = {}
    this._provider = null
    this._eventHandlers = {}
    this._debug = debug
    this._debugPrefix = 'dappjs:'

    // End of variable & config initialization

    if (this._config.debug) {
      this.enableDebug(this._config.debug)
    }

    // Load selected provider
    const [ providerName, providerSubType ] = this._config.provider.type.split('/')
    this.debug('core', 'Loading provider: %s', providerName)
    const provider = require('./lib/providers/' + providerName)
    this._provider = new provider[providerSubType](this)

    // Load services
    this.addServices(this._config.servicesDir, this._config.services)
    // Load account
    if (this._config.privateKey) {
      this._provider.addPrivateKeyAccount(this._config.privateKey)
    }
  }

  async addServices (dir, whitelist = null) {
    this.debug('core', 'Loading services from dir: ' + dir)
    return Promise.all(fs.readdirSync(dir).map(id => {
      const servicePath = path.join(dir, id)
      if (whitelist && whitelist.indexOf(id) === -1) {
        return null
      }
      return this.addService(id, servicePath)
    }))
      .then(() => {
        return this.emit('servicesLoaded', this.getServices())
      })
  }

  async addService (id, path) {
    this.debug('core', 'Loading service: id=' + id + ', path=' + path)
    this._services[id] = {
      id,
      path,
      pkg: require(path)
    }
    return Promise.resolve(this._services[id])
  }

  getServices () {
    const out = {}
    Object.keys(this._services).map(id => {
      const s = this._services[id]
      out[id] = {
        path: s.path,
        name: s.pkg.name
      }
    })
    return out
  }

  async service (id) {
    await this.once('servicesLoaded')
    this.debug('core:service', 'service=%s', id)
    if (!this._services[id].instance) {
      this._services[id].instance = new this._services[id].pkg.api(this, this._services[id], await this.assets(id))
    }
    return this._services[id].instance
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
    // this._debug('Contract')(service, id, opts, localOpts)
    const args = {
      abi: null,
      addr: null
    }
    const defaultProp = (prop) => {
      switch (prop) {
        case 'abi':
          return service._assets.abi[id]
        case 'addr':
          return service._index.pkg.contracts[this._config.network][id]
      }
    }
    Object.keys(args).forEach(prop => {
      args[prop] = localOpts[prop] || defaultProp(prop, service)
    })
    this.debug('core:contract', 'provider=%s, network=%s, service=%s, abi=%s, addr=%s, opts=%s', this._config.provider.type, this._config.network, service._index.id, id, args.addr, JSON.stringify(opts))
    return this._provider.contract(args.abi, args.addr, opts)
  }

  async call (service, addr, id, method, opts = []) {
    this.debug('core:call', 'provider=%s, network=%s, service=%s, method=%s, addr=%s, opts=%s', this._config.provider.type, this._config.network, service._index.id, method, addr, JSON.stringify(opts))
    const contract = await this.contract(service, id, {}, { addr })
    return this._provider.call(contract, method, opts)
      .catch(err => {
        this._debug(err)
        return null
      })
  }

  async send (service, addr, id, method, opts = [], sendOpts = {}) {
    this.debug('core:send', JSON.stringify({ addr, id, method, opts, sendOpts }))
    const contract = await this.contract(service, id, {}, { addr })
    return this._provider.send(contract, method, opts, sendOpts)
  }

  async contractEvents (service, addr, id, name, ...args) {
    this.debug('core:events', JSON.stringify({ addr, id, name }))
    const contract = await this.contract(service, id, {}, { addr })
    return this._provider.contractEvents(contract, name, ...args)
  }

  async emit (eventName, res) {
    this.debug('events:' + eventName, 'Emmited: %s', JSON.stringify(res))
    if (!this._eventHandlers[eventName]) {
      return Promise.resolve(res)
    }
    return Promise.all(this._eventHandlers[eventName].map(fn => fn()))
  }

  async on (eventName, fn = null, once = false) {
    if (!this._eventHandlers[eventName]) {
      this._eventHandlers[eventName] = []
    }
    let i = this._eventHandlers[eventName].length
    return new Promise((resolve, reject) => {
      this._eventHandlers[eventName].push((data) => {
        if (once) {
          if (i > 0) {
            this._eventHandlers[eventName].splice(i, 1)
          } else {
            delete this._eventHandlers[eventName]
          }
        }
        if (fn) fn()
        resolve()
      })
    })
  }

  once (eventName, fn = null) {
    return this.on(eventName, fn, true)
  }

  enableDebug (scope) {
    this._debug.enable(scope === true ? '*' : scope)
    this.debug('core', 'Debug mode enabled')
  }

  debug (scope, ...args) {
    this._debug(this._debugPrefix + scope)(...args)
  }

  allServices () {
    return this._defaultConfig.services
  }
}

module.exports = {
  client: DAppClient,
  service: Service,
  provider: Provider,
  coreServices
}
