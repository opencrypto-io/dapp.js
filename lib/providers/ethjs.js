const Ethjs = require('ethjs')
const Provider = require('../provider')

class EthjsProvider extends Provider {
  create() {
    this._api = new Ethjs(this.subprovider())
  }
  contract (abi, addr, opts) {
    return new this._api.contract(abi).at(addr)
  }
  async call (contract, method, opts) {
    return contract[method].apply(null, opts)
      .then(res => {
        return res[0]
      })
  }
  async send (contract, method, opts, sendOpts) {
  }
  addPrivateKeyAccount (key) {}
}

class EthjsHttpProvider extends EthjsProvider {
  defaultConfig () {
    return {
      url: 'http://localhost:8545'
    }
  }
  subprovider () {
    return new Ethjs.HttpProvider(this.endpoint())
  }
  endpoint () {
    return this._config.url
  }
}

class EthjsInfuraProvider extends EthjsHttpProvider {
  defaultConfig () {
    return {
      apiKey: ''
    }
  }
  endpoint () {
    return 'https://' + this._engine._config.network + '.infura.io/'
      + (this._config.apiKey ? 'v3/' + this._config.apiKey : '')
  }
}

module.exports = {
  'http':   EthjsHttpProvider,
  'infura': EthjsInfuraProvider
}
