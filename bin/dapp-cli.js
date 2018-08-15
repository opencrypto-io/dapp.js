#!/usr/local/bin/node

const DApp = require('..')
const program = require('commander')

program.usage('[options] <service> <method> <args ...>')

function err(msg) {
  console.error(msg)
  process.exit(1)
}

async function cli(app) {

  if (!app.args[0]) {
    err('Please specify service')
  }

  const client = new DApp.client()
  const service = await client.service(app.args[0])

  console.log('Value:', await service[app.args[1]].apply(service, app.args.slice(2)))
  
}

cli(program.parse(process.argv))
