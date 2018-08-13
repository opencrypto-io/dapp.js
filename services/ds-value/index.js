const Service = require('../../lib/service')

class DSValue extends Service {

  async set(addr, type = "") {
  }

  async get(addr, type = "Hex") {

    const value = await this._call(addr, 'DSValue', 'read')
    if (type === "Hex") {
      return value
    }
    return this._utils['hexTo' + type](value)
  }
}

module.exports = {
  name: 'DSValue',
  api: DSValue
}
