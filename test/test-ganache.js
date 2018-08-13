
const DApp = require('..')
const client = new DApp.client({
  privateKey: 'a48e81f7413ebaee990234a0d5ca0d1907b125fb7fbcb395ffd87ece4eb2ad65',
  network: 'custom',
  provider: {
    type: 'web3/http',
    url: 'http://127.0.0.1:7545'
  }
})

async function test() {

  //const value = await client.service('ds-value')
  //console.log('value:', await value.get('0x1174C2dB72ED3C5845F389E7A35d096365C1B9c6'))

  const sample = await client.service('custom')

  //console.log('set value:', await sample.set('0x7655107fE6fD3347E220fB2445a7f00747333b84', 1234567890, '0xc840493fb3835a26de50c10D65d6556F2177b934'))

  console.log('value:', await sample.get('0x7655107fE6fD3347E220fB2445a7f00747333b84'))

  const contract = await sample.contract('0x7655107fE6fD3347E220fB2445a7f00747333b84')
  console.log('value:', await contract.get())
  console.log('value:', await contract.getId())

}

test()
