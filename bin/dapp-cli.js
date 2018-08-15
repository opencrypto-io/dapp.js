#!/usr/local/bin/node

const DApp = require('..')
const program = require('commander')

program
  .usage('[options] <service> <method> <args ...>')
  .option('-p, --provider <type>', 'Use specified provider')
  .option('-n, --network <name>', 'Use specified network')

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
   
  const opts = {}
  if (app.network) {
    opts.network = app.network
  }
  if (app.provider) {
    opts.provider = {
      type: app.provider
    }
  }

  const client = new DApp.client(opts)
  const service = await client.service(app.args[0])

  process.stdout.write(await service[app.args[1]].apply(service, app.args.slice(2)) + "\n")
  
}

cli(program.parse(process.argv))
