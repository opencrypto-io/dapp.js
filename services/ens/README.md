
# ens
**Ethereum Name Service (ENS)**



## Contracts

### Mainnet
Name | Address | ABI
--- | --- | ---
registry | [314159265dd8dbb310642f98f50c066173c1259b](https://etherscan.io/address/314159265dd8dbb310642f98f50c066173c1259b) | [ABI](abi/registry.json)

### Ropsten
Name | Address | ABI
--- | --- | ---
registry | [0x112234455c3a32fd11230c42e7bccd4a84e02010](https://etherscan.io/address/0x112234455c3a32fd11230c42e7bccd4a84e02010) | [ABI](abi/registry.json)

### Rinkeby
Name | Address | ABI
--- | --- | ---
registry | [0xe7410170f87102df0055eb195163a03b7f2bff4a](https://etherscan.io/address/0xe7410170f87102df0055eb195163a03b7f2bff4a) | [ABI](abi/registry.json)



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


### lookup (domain)

```js
const addr = await ens.lookup('apt-get.eth')
```

* **Params:** 
  * {string} domain - The ENS domain name. 
* **Returns:**
  * {promise} Promise (resolves to the address)

Resolve domain to address.


### owner (domain)

* **Params:** 
  * {string} domain - The ENS domain name. 
* **Returns:**
  * {promise} Promise (resolves to the owner address)

Get owner (address) of the domain.


### resolver (domain)

* **Params:** 
  * {string} domain - The ENS domain name. 
* **Returns:**
  * {promise} Promise (resolves to the resolver address)

Get resolver (address) for the domain.


### reverse (address)

```js
const domain = await ens.reverse('0xD1220A0cf47c7B9Be7A2E6BA89F429762e7b9aDb')
```

* **Params:** 
  * {string} address - Address 
* **Returns:**
  * {promise} Promise (resolves to the domain)

Make reverse lookup for domain.

