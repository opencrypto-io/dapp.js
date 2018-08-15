const Web3 = require('web3')
const Ethjs = require('ethjs')

class Provider {
  constructor (engine) {
    this._engine = engine
    this._config = Object.assign(this.defaultConfig(), this._engine._config.provider)
    this._api = null
    this.create()
  }
  create () {}
  defaultConfig () {}
}

class Web3Provider extends Provider {
  create () {
    this._api = new Web3(this.subprovider())
  }
  contract (abi, addr, opts) {
    return new this._api.eth.Contract(abi, addr, opts)
  }
  async call (contract, method, opts) {
    return contract.methods[method].apply(null, opts).call()
  }
  async send (contract, method, opts, sendOpts) {
    const tx = await contract.methods[method].apply(null, opts)
    sendOpts.gas = parseInt(await tx.estimateGas(sendOpts) * 1.5)
    return tx.send(sendOpts)
  }
  addPrivateKeyAccount (key) {
    const account = this._api.eth.accounts.privateKeyToAccount('0x' + key)
    this._api.eth.accounts.wallet.add(account)
  }
}

class Web3HttpProvider extends Web3Provider {
  defaultConfig () {
    return {
      url: 'http://localhost:8545'
    }
  }
  subprovider () {
    return new Web3.providers.HttpProvider(this.endpoint())
  }
  endpoint () {
    return this._config.url
  }
}

class Web3InfuraProvider extends Web3HttpProvider {
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

class EthjsProvider extends Provider {
  create() {
    this._api = new Ethjs(this.subprovider())
  }
  contract (abi, addr, opts) {
    return new this._api.contract(abi).at(addr)
  }
  async call (contract, method, opts) {
    return contract[method](opts[0])
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
  'web3/http':    Web3HttpProvider,
  'web3/infura':  Web3InfuraProvider,
  'ethjs/http':   EthjsHttpProvider,
  'ethjs/infura': EthjsInfuraProvider
}
