
async function test () {
  const DApp = require('..')
  const client = new DApp.client({ debug: true })

  const ens = await client.service('ens')
  console.log('resolved address:', await ens.lookup('tree.opencrypto.eth'))
}
test()
