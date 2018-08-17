#!/usr/local/bin/node

const program = require('commander')
const fs = require('fs')
const path = require('path')
const debug = require('debug')

const DApp = require('..')
const pkg = require('../package')

const coreServices = DApp.coreServices

program
  .usage('[options] <service> <method> [args ...]')
  .option('-p, --provider <type>', 'use specified provider')
  .option('-n, --network <name>', 'use specified network')
  .option('-u, --provider-url <address>', 'use specified url for provider')
  .option('-k, --private-key <string>', 'use private key')
  .option('--api-key <string>', 'Specify API key for Infura provider')
  .option('-l, --list-services', 'list available services')
  .option('--debug [scope]', 'Turn on debug mode')
  .version(pkg.version, '-v, --version')

function err(msg) {
  console.error(msg)
  process.exit(1)
}

async function cli(app) {

  if (app.listServices) {
    process.stdout.write(`Services:\n`)
    const client = new DApp.client()
    const services = client.getServices()
    coreServices.forEach(sId => {
      process.stdout.write(`  [${sId}] ${services[sId].name}\n`)
    })
    process.exit(0)
  }

  const opts = {
    provider: {}
  }

  if (app.debug) {
    opts.debug = app.debug === true ? '*' : app.debug
    debug.enable(opts.debug)
  }
  if (app.network) {
    opts.network = app.network
  }
  if (app.provider) {
    opts.provider.type = app.provider
  }
  if (app.providerUrl) {
    opts.provider.url = app.providerUrl
  }
  if (app.apiKey) {
    opts.provider.apiKey = app.apiKey
  }
  if (app.privateKey) {
    opts.privateKey = app.privateKey
  }

  if (coreServices.indexOf(app.args[0]) !== -1) {
    opts.services = [ app.args[0] ]
  } else {
    opts.services = []
  }

  debug('dapp-cli')('Options: %s', JSON.stringify(opts))

  const client = new DApp.client(opts)

  if (app.args[0] === undefined && !app.listServices) {
    app.outputHelp()
    process.exit(0)
  }

  if (coreServices.indexOf(app.args[0]) === -1 && app.args[0] !== undefined) {
    const fn = path.join(process.cwd(), app.args[0])
    if (fs.existsSync(fn)) {
      client.addService('custom', fn)
      app.args[0] = 'custom'
    } else {
      err('Service not found: ' + app.args[0])
    }
  }

  if (!app.args[1]) {
    err('Please specify method')
  }

  const service = await client.service(app.args[0])

  if (!service[app.args[1]]) {
    err('Method not found: ' + app.args[1] + ' [service=' + app.args[0] + ']')
  }

  const result = await service[app.args[1]].apply(service, app.args.slice(2))
  let output = result
  if (result !== null && typeof result === 'object') {
    if (result.toString && result.toString() !== '[object Object]') {
      output = result.toString()
    } else {
      output = JSON.stringify(result, null, 2)
    }
  }
  process.stdout.write(output + '\n')
}

cli(program.parse(process.argv))
