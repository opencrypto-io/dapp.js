const Service = require('../..').service

class ETH extends Service {

  async send (value, to, from) {
    return this._api._provider._api.eth.sendTransaction({ value, to, from })
  }
}

module.exports = {
  name: 'Ethereum Core',
  api: ETH
}
