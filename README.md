# dapp.js

*dapp.js* is a JavaScript library that provides a single, common abstraction interface of smart-contracts. Library makes easy to build applications on top of Ethereum blockchain.

## Usage

Use NPM to install library:
```bash
npm install opencrypto-io/dapp.js
```

Include it:
```js
const DApp = require('dapp.js')
```

Example:
```js
const DApp = require('dapp.js')
const client = new DApp.client()

const service = await client.service('ds-value')
const value = await service.get('0x729D19f657BD0614b4985Cf1D82531c67569197B', 'NumberString')
console.log('Current ETH/USD price:', value)
```

Or you can use promises:

```js
client.service('ds-value').then(service => {
  service.get('0x729D19f657BD0614b4985Cf1D82531c67569197B', 'NumberString')
    .then(value => console.log('Current ETH/USD price:', value))
})
```

## License
MIT

