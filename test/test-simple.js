
async function test() {
  const DApp = require('..')
  const client = new DApp.client()

  // async/await
  const service = await client.service('ds-value')
  const value = await service.get('0x729D19f657BD0614b4985Cf1D82531c67569197B', 'NumberString')
  console.log('Current ETH/USD price:', value)

  // promises
  client.service('ds-value')
    .then(service => service.get('0x729D19f657BD0614b4985Cf1D82531c67569197B', 'NumberString'))
    .then(value => console.log('Current ETH/USD price:', value))
}
test()

