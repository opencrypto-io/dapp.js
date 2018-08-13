const Service = require('../../lib/service')

class DSValue extends Service {

  async set(addr, type = "Hex") {
  }

  async get(addr, type = "Hex") {
    const value = await this._call(addr, 'DSValue', 'read')
    return this._utils.formatHex(value, type)
  }
}

module.exports = {
  name: 'DSValue',
  api: DSValue
}
