const Service = require('../../lib/service')

class SampleContract extends Service {

  async get(addr) {
    return await this._call(addr, 'SampleContract', 'get')
  }

  async set(addr, value, from) {
    return await this._send(addr, 'SampleContract', 'set', [value], { from })
  }
}

Service.createChild(SampleContract, 'contract', [
  'get',
  'set'
])

module.exports = {
  name: 'Sample Contract',
  api: SampleContract
}
