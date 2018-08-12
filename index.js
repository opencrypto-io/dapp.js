const fs = require('fs')
const path = require('path')
const providers = require('./lib/providers')

class UELClient {
  constructor(config = {}) {
    this._configDefault = {
      network: 'mainnet',
      servicesDir: path.join(__dirname, 'services'),
      services: [
        'dai'
      ]
    }
    this._defaultProviderConfig = {
      type: 'web3/infura',
      apiKey: '3adefb225509451f87d745e281e2e165'
    }
    this._config = Object.assign(this._configDefault, config)
    if (!this._config.provider) {
      this._config.provider = this._defaultProviderConfig
    }
    this._services = {}
    this._provider = null

    // Load services
    this._config.services.forEach(id => {
      this._services[id] = require(path.join(this._config.servicesDir, id, 'index'))
    })
    // Load provider
    this._provider = new providers[this._config.provider.type](this)
    // Load account
    console.log(this._config)
    if (this._config.privateKey) {
      this._provider.addPrivateKeyAccount(this._config.privateKey)
    }
  }
  services() {
    return Object.keys(this._services).map(id => {
      const { name } = this._services[id]
      return {
        id,
        name
      }
    })
  }
  async service(id) {
    return new this._services[id].api(this, this._services[id], await this.assets(id))
  }
  async assets(serviceId) {
    let assets = { abi: {} }
    const abiDir = path.join(this._config.servicesDir, serviceId, 'abi')
    if (fs.existsSync(abiDir)) {
      fs.readdirSync(abiDir).forEach(f => {
        assets.abi[path.parse(f).name] = JSON.parse(fs.readFileSync(path.join(abiDir, f)))
      })
    }
    return assets
  }
  async contract(service, id, opts = {}) {
    const addr = service._index.contracts[this._config.network][id]
    const abi = service._assets.abi[id]
    return this._provider.contract(abi, addr, opts)
  }
}

module.exports = {
  client: UELClient
}

