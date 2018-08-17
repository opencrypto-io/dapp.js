# dapp.js-ens

ENS (Ethereum Name Service)

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

### **lookup** (domain)

```javascript
const addr = await ens.lookup('apt-get.eth')
```

* **Params:** domain
* **Returns:** promise (resolves to the target address)

`ens.lookup()` returns the target address of specified domain.


### **reverse** (address)

```
const domain = await ens.reverse('0xD1220A0cf47c7B9Be7A2E6BA89F429762e7b9aDb')
```

* **Params:** address
* **Returns:** promise (resolves to the domain)

`ens.reverse()` returns the domain of specified address.


### **resolver** (domain)

```
const resolver = await ens.resolver('atp-get.eth')
```

* **Params:** domain
* **Returns:** promise (resolves to the resolver address)

`ens.resolver()` returns the resolver address of specified domain.
