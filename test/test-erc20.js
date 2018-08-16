
async function test () {
  const DApp = require('..')
  const client = new DApp.client({
    provider: {
      type: "ethjs/infura"
    }
  })
  const erc = await client.service('erc20')

  const token = erc.token('0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2')

  console.log('symbol:', await token.symbol())
  console.log('balance:', await token.balance('0xc1691ae1b3a19923ca4ea9d25176092f4112a7f1'))

}

test()

