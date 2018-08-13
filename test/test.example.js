const UEL = require('./')
const client = new UEL.client({
  privateKey: 'PRIVATE_KEY',
  network: 'kovan',
  provider: {
    type: 'web3/infura',
    apiKey: 'API_KEY'
  }
})

async function test () {
  console.log('Available services: ', JSON.stringify(client.services(), null, 2))

  const dai = await client.service('dai')

  console.log('target price:', await dai.getTargetPrice())
  console.log('liq ratio:', await dai.getLiquidationRatio())
  console.log('------')

  const cdp = await dai.getCdp(143)

  console.log('cdp id:', await cdp.getId())
  console.log('debt value:', await cdp.getDebtValue())
  console.log('collateral value:', await cdp.getCollateralValue())
  // console.log('draw:', await cdp.draw(1000000000000000, '0x971960f103d1098AF94Dc318D494BF6F472D8712'))
}

test()
