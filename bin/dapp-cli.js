#!/usr/local/bin/node

const program = require('commander')
const fs = require('fs')
const path = require('path')

const DApp = require('..')

program
  .usage('[options] <service> <method> <args ...>')
  .option('-p, --provider <type>', 'Use specified provider')
  .option('-n, --network <name>', 'Use specified network')
  .option('-u, --provider-url <address>', 'Use specified url for provider')
  .option('-k, --private-key <string>', 'Use private key')

function err(msg) {
  console.error(msg)
  process.exit(1)
}

async function cli(app) {

  if (!app.args[0]) {
    err('Please specify service')
  }

  if (!app.args[1]) {
    err('Please specify method')
  }
   
  const opts = {
    provider: {}
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
  const services = client.getServices()

  if (!services[app.args[0]]) {
    const fn = path.join(process.cwd(), app.args[0])
    if (fs.existsSync(fn)) {
      client.addService('custom', fn)
      app.args[0] = 'custom'
    } else {
      err('Service not found: ' + app.args[0])
    }
  }

  const service = await client.service(app.args[0])

  process.stdout.write(await service[app.args[1]].apply(service, app.args.slice(2)) + "\n")
  
}

cli(program.parse(process.argv))
