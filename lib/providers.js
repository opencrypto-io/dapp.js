const Web3 = require('web3')

class Provider {
  constructor(engine) {
    this._engine = engine
    this._config = Object.assign(this.defaultConfig(), this._engine._config.provider)
    this._api = null
    this.create()
  }
  create() {}
  defaultConfig() {}
}

class Web3Provider extends Provider {
  create() {
    this._api = new Web3(this.web3provider())
  }
  contract(abi, addr, opts) {
    return new this._api.eth.Contract(abi, addr, opts)
  }
  addPrivateKeyAccount(key) {
    const account = this._api.eth.accounts.privateKeyToAccount('0x' + key)
    console.log(account, '@@@')
    this._api.eth.accounts.wallet.add(account)
  }
}

class Web3HttpProvider extends Web3Provider {
  defaultConfig() {
    return {
      url: 'http://localhost:8545'
    }
  }
  web3provider() {
    return new Web3.providers.HttpProvider(this.endpoint())
  }
  endpoint() {
    return this._config.url
  }
}

class Web3InfuraProvider extends Web3HttpProvider {
  defaultConfig() {
    return {
      apiKey: null
    }
  }
  endpoint() {
    return 'https://' + this._engine._config.network + '.infura.io/v3/' + this._config.apiKey
  }
}

module.exports = {
  'web3/http': Web3HttpProvider,
  'web3/infura': Web3InfuraProvider
}
