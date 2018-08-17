# dapp.js

**EXPERIMENTAL VERSION - Don't use on production**

**dapp.js** is a JavaScript library & framework that provides a single, common abstraction interface of smart-contracts. Framework makes easy to build applications on top of Ethereum decentralized applications ([DApps](https://en.wikipedia.org/wiki/Decentralized_application)).

## Features

* **Works out-of-the-box**
* **Minimalistic, human-friendly API**
* **Provider-library agnostic** - currently supported [web3.js 1.x](https://github.com/ethereum/web3.js/) (default) and [ethjs](https://github.com/ethjs/ethjs) (planned: [ethers.js](https://github.com/ethers-io/ethers.js))
* **Basic services included** in the standart library - `ens`, `erc20` .. [show all](https://github.com/opencrypto-io/dapp.js/tree/master/services)
* **[Command-line interface (CLI)](/cli)**

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

const service = await client.service('price-feed')
const value = await service.get('0x729D19f657BD0614b4985Cf1D82531c67569197B')
console.log('Current ETH/USD price:', value)
```

Or you can use promises:

```js
client.service('price-feed').then(service => {
  service.get('0x729D19f657BD0614b4985Cf1D82531c67569197B')
    .then(value => console.log('Current ETH/USD price:', value))
})
```


## Command-line interface (CLI)

```bash
npm i -g opencrypto-io/dapp.js     # Install CLI via NPM
dapp-cli -l                        # List available services
dapp-cli -h                        # Show help
dapp-cli ens lookup apt-get.eth    # Use 'ens' module for ENS lookup
dapp-cli ./your_service [..]       # Use your own service
```

Please follow [dapp.js-cli](cli/) for more informations.

## Authors

* Jan Stránský &lt;jan.stransky@arnal.cz&gt;

## License
MIT

