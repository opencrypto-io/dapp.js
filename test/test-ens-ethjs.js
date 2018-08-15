
async function test () {
  const DApp = require('..')
  const client = new DApp.client({
    provider: {
      type: 'ethjs/infura'
    }
  })

  const ens = await client.service('ens')
  console.log('resolved address:', await ens.lookup('tree.opencrypto.eth'))
}
test()
