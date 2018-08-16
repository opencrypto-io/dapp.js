# dapp.js CLI

Command-line tool for easy interaction with smart-contracts via [**dapp.js**](https://github.com/opencrypto-io/dapp.js) & their services.

## Usage

Install package with NPM in global mode:

```bash
npm install -g opencrypto-io/dapp.js
```

And you can use it out-of-the-box by command `dapp-cli`: 

```
dapp-cli [options] <service> <method> [args ...]
```

A few simple examples:
```bash
### List available services
dapp-cli -l
#>> Services: ...

### Resolve address for ENS domain name
dapp-cli ens lookup apt-get.eth
#>> 0xD1220A0cf47c7B9Be7A2E6BA89F429762e7b9aDb

### Read value from ds-value contract and decode it as NumberString
### In this example, target is ETH/USD price feed managed by MakerDAO
dapp-cli ds-value get 0x729d19f657bd0614b4985cf1d82531c67569197b NumberString
#>> 285800000000000000000

### Get ERC-20 token symbol on "Kovan" test network
dapp-cli -n kovan erc20 getSymbol 0xc4375b7de8af5a38a93548eb8453a498222c4ff2
#>> DAI
```

## Options

```
  Usage: dapp-cli [options] <service> <method> [args ...]

  Options:

    -p, --provider <type>         Use specified provider
    -n, --network <name>          Use specified network
    -u, --provider-url <address>  Use specified url for provider
    -k, --private-key <string>    Use private key
    -l, --list-services           List available services
    --debug [scope]               Turn on debug mode
    -h, --help                    output usage information
```
