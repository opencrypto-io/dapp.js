const fs = require('fs')
const path = require('path')
const { exec } = require('child_process')
const _ = require('lodash')
const handlebars = require('handlebars')

const readmeTemplate = `
# {{id}}
**{{title}}**

{{{description}}}

{{{docs}}}

{{#if api}}
## API
{{{api}}}
{{/if}}

{{#if contracts}}
## Contracts mapping
{{{contracts}}}
{{/if}}

`

function renderExample (arr) {
  if (arr.length === 0) {
    return ''
  }
  return `
\`\`\`js
${arr.join('\n')}
\`\`\`
`
}

function renderReadme (str, vars, replace = true) {
  const template = handlebars.compile(str)
  /*Object.keys(vars).forEach((key) => {
    let value = vars[key] !== undefined ? vars[key] : ''
    const re = new RegExp(`<pkg\-${key}>([^]*)<\/pkg\-${key}>`, 'gm')
    str = str.replace(re, (replace ? value : `<pkg-${key}>${value}</pkg-${key}>`))
  })
  return str.replace(/\n\n\n/gm, '\n\n')*/
  return template(vars)
}

function renderParams (params) {
  let out = params.map(p => {
    return `  * {${p.type}} ${p.name} - ${p.description}`
  })
  return '\n' + out.join('\n')
}

function makeContracts (pkg) {
  if (!pkg.contracts) {
    return null
  }
  let out = []
  Object.keys(pkg.contracts).forEach(net => {
    const nc = pkg.contracts[net]
    out.push(`\n### ${net.substring(0, 1).toUpperCase() + net.slice(1)}`)
    out.push(`Name | Address | ABI`)
    out.push(`--- | --- | ---`)
    Object.keys(nc).forEach(c => {
      const addr = nc[c]
      out.push(`${c} | [${addr}](https://${net !== 'mainnet' ? net + '.' : ''}etherscan.io/address/${addr}) | [${c}.json](abi/${c}.json)`)
    })
  })
  return out.join('\n')
}

function makeApi (defs) {
  // console.log(JSON.stringify(defs, null, 2))
  let output = [ '' ]
  _.sortBy(defs.functions, 'name').forEach(fn => {
    output.push(`
### ${fn.name} (${fn.parameters.map(p => p.optional ? `[${p.name}]` : p.name).join(', ')})
${renderExample(fn.examples)}
* **Params:** ${renderParams(fn.parameters)} 
* **Returns:**
  * {${fn.returns.type}} ${fn.returns.description}

${fn.description}
`)
  })
  return output.join('\n')
}

function jsdocDefs (dir) {
  console.log('Getting jsdoc definitions ..')
  const jsdocPath = path.resolve(__dirname, '../node_modules', 'jsdoc')
  const jsdocBin = path.join(jsdocPath, 'jsdoc.js')
  const jsdocTemplate = path.join(jsdocPath, 'templates/haruki')
  console.log('jsdoc bin: %s', jsdocBin)
  console.log('jsdoc template: %s', jsdocTemplate)

  return new Promise((resolve, reject) => {
    exec(`${jsdocBin} -d console -t ${jsdocTemplate} ${path.join(dir, '*')}`, (err, stdout, stderr) => {
      if (err) {
        throw new Error('jsdoc command failed', err)
      }

      console.log('jsdoc done')
      resolve(JSON.parse(stdout))
    })
  })
}

async function build (dir) {
  console.log('Building service-docs ..')
  console.log('Services path: %s', dir)

  dir = path.resolve(dir)
  const defs = await jsdocDefs(dir)

  console.log('Starting processing services ..')
  fs.readdirSync(dir).forEach(id => {
    console.log('Processing service: %s', id)
    const readmeFn = path.join(dir, id, 'README.md')
    if (fs.existsSync(readmeFn)) {
    }
    const pkg = require(path.join(dir, id))
    const pkgDefs = _.find(defs.classes, { name: pkg.api.name })
    if (!pkgDefs) {
      console.log('No jsdoc defs found, skipping ..')
      return null
    }
    const docsFn = path.join(dir, id, 'doc', 'index.md')
    const docs = fs.existsSync(docsFn) ? ('\n\n' + fs.readFileSync(docsFn).toString()) : ''

    const vars = {
      id,
      title: pkg.name,
      description: pkgDefs.description,
      docs,
      api: makeApi(pkgDefs),
      contracts: makeContracts(pkg)
    }

    const rendered = renderReadme(readmeTemplate, vars)
    console.log('README.md writed: %s', readmeFn)
    fs.writeFileSync(readmeFn, rendered)
  })
  console.log('done')
}

module.exports = {
  build
}
