
const Service = require('../..').service
const namehash = require('eth-ens-namehash')

class ENS extends Service {
  _namehash (domain) {
    return namehash.hash(domain)
  }
  async _resolverHash (hash) {
    return this.$mcall('registry', 'resolver', [hash])
  }
  async resolver (domain) {
    return this._resolverHash(this._namehash(domain))
  }
  async lookup (domain) {
    const hash = this._namehash(domain)
    this.$debug('Resolver hash:', hash)
    const resolver = await this._resolverHash(hash)
    this.$debug('Current resolver:', resolver)
    if (resolver === '0x0000000000000000000000000000000000000000') {
      return null
    }
    return this.$call(resolver, 'resolver', 'addr', [hash])
  }
}

module.exports = {
  name: 'Ethereum Name Service (ENS)',
  contracts: {
    mainnet: {
      registry: '314159265dd8dbb310642f98f50c066173c1259b'
    },
    ropsten: {
      registry: '0x112234455c3a32fd11230c42e7bccd4a84e02010'
    },
    rinkeby: {
      registry: '0xe7410170f87102df0055eb195163a03b7f2bff4a'
    }
  },
  api: ENS
}
