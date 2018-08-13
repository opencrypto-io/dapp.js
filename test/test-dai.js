
async function testDai () {
  const DApp = require('..')
  const client = new DApp.client()

  const dai = await client.service('dai')
  const cdp = await dai.getCdp(2715)

  console.log('Current debt of CDP 2715:', await cdp.getDebtValue())
}

testDai()
