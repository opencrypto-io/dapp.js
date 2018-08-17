const Service = require('../..').service

// MakerDAO Price-Feed
// https://github.com/makerdao/price-feed
//
// Source: https://github.com/makerdao/price-feed/blob/master/src/price-feed.sol

class PriceFeed extends Service {
  async get (addr, ray = 18) {
    const value = await this.$call(addr, 'PriceFeed', 'read')
    return this.$utils.toDecimal(value, 18)
  }

  async setFeed (addr, pos, feed) {
  }

  async authority (addr) {
    return this.$call(addr, 'PriceFeed', 'authority')
  }

  async owner (addr) {
    return this.$call(addr, 'PriceFeed', 'owner')
  }

  async values (addr) {
    return this.$call(addr, 'PriceFeed', 'values', ['0x000000000000000000000001'])
  }

  async watch (addr, events = 'LogNote', callback) {
    await this.$events(addr, 'PriceFeed', events, (err, res) => {
      if (err) throw err
      this.get(addr).then(value => {
        console.log('have event: block=%s tx=%s value=%s', res.blockNumber, res.transactionHash, value)
      })
      if (callback) callback(err, res)
    })
  }
}

PriceFeed.createChild('contract', [
  'set',
  'get'
])

module.exports = {
  name: 'Price Feed (MakerDAO)',
  api: PriceFeed
}
