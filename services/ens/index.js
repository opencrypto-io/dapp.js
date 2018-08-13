
const Service = require('../../lib/service')
const namehash = require('eth-ens-namehash')

class ENS extends Service {
  _namehash (domain) {
    return namehash.hash(domain)
  }
  async _resolverHash (hash) {
    return this._mcall('registry', 'resolver', [hash])
  }
  async resolver (domain) {
    return this._resolverHash(this._namehash(domain))
  }
  async lookup (domain) {
    const hash = this._namehash(domain)
    const resolver = await this._resolverHash(hash)
    if (resolver === '0x0000000000000000000000000000000000000000') {
      return null
    }
    return this._call(resolver, 'resolver', 'addr', [hash])
  }
}

module.exports = {
  name: 'Ethereum Name Service (ENS)',
  contracts: {
    mainnet: {
      registry: '314159265dd8dbb310642f98f50c066173c1259b'
    }
  },
  api: ENS
}
