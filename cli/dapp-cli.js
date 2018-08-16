#!/usr/local/bin/node

const program = require('commander')
const fs = require('fs')
const path = require('path')
const debug = require('debug')

const DApp = require('..')
const pkg = require('../package')

program
  .usage('[options] <service> <method> [args ...]')
  .option('-p, --provider <type>', 'use specified provider')
  .option('-n, --network <name>', 'use specified network')
  .option('-u, --provider-url <address>', 'use specified url for provider')
  .option('-k, --private-key <string>', 'use private key')
  .option('-l, --list-services', 'list available services')
  .option('--debug [scope]', 'Turn on debug mode')
  .version(pkg.version, '-v, --version')

function err(msg) {
  console.error(msg)
  process.exit(1)
}

async function cli(app) {

  const opts = {
    provider: {}
  }

  if (app.debug) {
    opts.debug = app.debug === true ? '*' : app.debug
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
  if (app.privateKey) {
    opts.privateKey = app.privateKey
  }

  const client = new DApp.client(opts)
  var services = client.getServices()

  if (app.args[0] === undefined && !app.listServices) {
    app.outputHelp()
    process.exit(0)
  }

  if (!services[app.args[0]] && app.args[0] !== undefined) {
    const fn = path.join(process.cwd(), app.args[0])
    if (fs.existsSync(fn)) {
      client.addService('custom', fn)
      app.args[0] = 'custom'
      var services = client.getServices()
    } else {
      err('Service not found: ' + app.args[0])
    }
  }

  if (app.listServices) {
    process.stdout.write(`Services:\n`)
    Object.keys(services).forEach(sId => {
      process.stdout.write(`  [${sId}] ${services[sId].name}\n`)
    })
    process.exit(0)
  }

  if (!app.args[1]) {
    err('Please specify method')
  }

  const service = await client.service(app.args[0])
  const result = await service[app.args[1]].apply(service, app.args.slice(2))

  if (result !== null && typeof result === 'object') {
    process.stdout.write(JSON.stringify(result, null, 2) + "\n")
  } else {
    process.stdout.write(result + "\n")
  }
}

cli(program.parse(process.argv))
