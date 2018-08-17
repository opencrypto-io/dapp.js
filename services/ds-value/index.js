const Service = require('../../lib/service')

/**
 * ds-value - Set and get a value.
 * Source: https://github.com/dapphub/ds-value
 */
class DSValue extends Service {

  /**
   * Set a value.
   * @param {string} address - The address of target contract
   * @param {string} [type=Hex] Format of the input (Hex, String, NumberString..)
   * @returns {promise} Promise (resolves to transaction promise)
   */
  async set (addr, value, type = 'Hex') {
    return this.$send(addr, 'DSValue', 'set', [value], { })
  }

  /**
   * Get a value.
   * @param {string} address - The address of target contract
   * @param {string} [type=Hex] Format of the results (Hex, String, NumberString..)
   * @returns {promise} Promise (resolves to value)
   */
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
