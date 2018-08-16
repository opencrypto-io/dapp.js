const Service = require('../../lib/service')

class SampleContract extends Service {
  async get (addr) {
    return this.$call(addr, 'SampleContract', 'get')
  }

  async set (addr, value, from) {
    return this.$send(addr, 'SampleContract', 'set', [value], { from })
  }
}

SampleContract.createChild('contract', [
  'get',
  'set'
])

module.exports = {
  name: 'Sample Contract',
  api: SampleContract
}
