const Service = require('../../lib/service')

class DSValue extends Service {

  async set (addr, type = 'Hex') {
  }

  async get (addr, type = 'Hex') {
    const value = await this.$call(addr, 'DSValue', 'read')
    return this.$utils.formatHex(value, type)
  }
}

DSValue.createChild('contract', [
  'set',
  'get'
])

module.exports = {
  name: 'DSValue',
  api: DSValue
}
