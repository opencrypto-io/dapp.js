## Usage

### As Library
```javascript

const DApp = require('dapp.js')
const client = new DApp.client()

const ens = await client.service('ens')
const addr = await ens.lookup('apt-get.eth')
console.log('resolved address:', addr)

```

### From [command-line](/cli)

```
dapp-cli ens lookup apt-get.eth
dapp-cli ens reverse 0xD1220A0cf47c7B9Be7A2E6BA89F429762e7b9aDb
dapp-cli ens resolver michalzalecki.test -n rinkeby
```
