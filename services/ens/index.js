
const Service = require('../..').service
const namehash = require('eth-ens-namehash')

const emptyResolver = '0x0000000000000000000000000000000000000000'

/**
 * ENS Service
 */
class ENS extends Service {

  _namehash (domain) {
    return namehash.hash(domain)
  }

  async _resolverHash (hash) {
    return this.$mcall('registry', 'resolver', [hash])
  }

  async _resolveName (name, method = 'addr', resolver = null) {
    const hash = this._namehash(name)
    this.$debug('Resolve name: %s type=%s hash=%s', name, method, hash)
    if (!resolver) {
      resolver = await this._resolverHash(hash)
    }
    this.$debug('Current resolver:', resolver)
    if (resolver === emptyResolver) {
      return null
    }
    return this.$call(resolver, 'resolver', method, [hash])
  }

  /**
   * Get owner (address) of the domain.
   * @param {string} domain - The ENS domain name.
   * @return {promise} Promise (resolves to the owner address)
   */
  async owner (domain) {
    return this.$mcall('registry', 'owner', [this._namehash(domain)])
  }

  /**
   * Get resolver (address) for the domain.
   * @param {string} domain - The ENS domain name.
   * @return {promise} Promise (resolves to the resolver address)
   */
  async resolver (domain) {
    return this._resolverHash(this._namehash(domain))
  }

  /**
   * Resolve domain to address.
   * @param {string} domain - The ENS domain name.
   * @return {promise} Promise (resolves to the address)
   *
   * @example
   * const addr = await ens.lookup('apt-get.eth')
   */
  async lookup (domain) {
    return this._resolveName(domain, 'addr')
  }

  /**
   * Make reverse lookup for domain.
   * @param {string} address - Address
   * @return {promise} Promise (resolves to the domain)
   *
   * @example
   * const domain = await ens.reverse('0xD1220A0cf47c7B9Be7A2E6BA89F429762e7b9aDb')
   */
  async reverse (addr) {
    if (addr.startsWith('0x')) {
      addr = addr.slice(2)
    }
    const name = addr.toLowerCase() + '.addr.reverse'
    this.$debug('Reverse lookup: %s', name)
    return this._resolveName(name, 'name')
  }

  async info (domain) {
    const resolver = await this.resolver(domain)
    const [ owner, addr ] = await Promise.all([
      this.owner(domain),
      this._resolveName(name, 'addr', resolver)
    ])
    return { owner, resolver, addr }
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
