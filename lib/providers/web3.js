const Web3 = require('web3')
const Provider = require('../provider')

class Web3Provider extends Provider {
  create () {
    this._api = new Web3(this.subprovider())
    this.init()
  }
  init () {}
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
  contractEvents (contract, eventName, callback) {
    return new Promise((resolve, reject) => {
      contract.events[eventName]((err, res) => {
        callback(err, res)
        resolve()
      })
    })
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

class Web3WsProvider extends Web3HttpProvider {
  defaultConfig () {
    return {
      url: 'ws://localhost:8545'
    }
  }
  subprovider () {
    return new Web3.providers.WebsocketProvider(this.endpoint())
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

class Web3WsInfuraProvider extends Web3WsProvider {
  defaultConfig () {
    return {
      apiKey: ''
    }
  }
  endpoint () {
    return 'wss://' + this._engine._config.network + '.infura.io/ws'
      + (this._config.apiKey ? 'v3/' + this._config.apiKey : '')
  }
}


module.exports = {
  'http':    Web3HttpProvider,
  'ws':      Web3WsProvider,
  'infura':  Web3InfuraProvider,
  'infura-ws': Web3WsInfuraProvider
}
