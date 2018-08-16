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

### Resolve address for ENS domain name
dapp-cli ens lookup apt-get.eth
dapp-cli ens reverse 0xD1220A0cf47c7B9Be7A2E6BA89F429762e7b9aDb
dapp-cli ens resolver michalzalecki.test -n rinkeby

### Read value from ds-value contract and decode it as NumberString
### In this example, target is ETH/USD price feed managed by MakerDAO
dapp-cli ds-value get 0x729d19f657bd0614b4985cf1d82531c67569197b NumberString

### Play with ERC-20 tokens
dapp-cli erc20 getBalance 0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2 0xe4a8dfca175cdca4ae370f5b7aaff24bd1c9c8ef
dapp-cli erc20 getSymbol 0xc4375b7de8af5a38a93548eb8453a498222c4ff2 -n kovan
```

## Options

```
  Usage: dapp-cli [options] <service> <method> [args ...]

  Options:

    -p, --provider <type>         use specified provider
    -n, --network <name>          use specified network
    -u, --provider-url <address>  use specified url for provider
    -k, --private-key <string>    use private key
    -l, --list-services           list available services
    --debug [scope]               Turn on debug mode
    -v, --version                 output the version number
    -h, --help                    output usage information
```
