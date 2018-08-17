# <pkg-id>ens</pkg-id>

<pkg-title>Ethereum Name Service (ENS)</pkg-title>

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

## API

<pkg-api>

### owner

* **Params:** 
  * {string} domain - The ENS domain name. 
* **Returns:** {promise} Promise (resolves to the owner address)

Get owner (address) of the domain.


### resolver

* **Params:** 
  * {string} domain - The ENS domain name. 
* **Returns:** {promise} Promise (resolves to the resolver address)

Get resolver (address) for the domain.


### lookup

```js
const addr = await ens.lookup('apt-get.eth')
```

* **Params:** 
  * {string} domain - The ENS domain name. 
* **Returns:** {promise} Promise (resolves to the address)

Resolve domain to address.


### reverse

```js
const domain = await ens.reverse('0xD1220A0cf47c7B9Be7A2E6BA89F429762e7b9aDb')
```

* **Params:** 
  * {string} address - Address 
* **Returns:** {promise} Promise (resolves to the domain)

Make reverse lookup for domain.
</pkg-api>
