const fs = require('fs')
const path = require('path')
const { exec } = require('child_process')
const _ = require('lodash')

const readmeTemplate = `
# <pkg-id></pkg-id>
<pkg-title></pkg-title>

## API
<pkg-api></pkg-api>
`

function renderExample (arr) {
  if (arr.length === 0) {
    return ''
  }
  return `
\`\`\`js
${arr.join("\n")}
\`\`\`
`
}

function renderReadme (str, vars) {
  Object.keys(vars).forEach((key) => {
    const re = new RegExp(`<pkg\-${key}>([^]*)<\/pkg\-${key}>`, 'gm')
    str = str.replace(re, `<pkg-${key}>${vars[key]}</pkg-${key}>`)
  })
  return str
}

function renderParams (params) {
  let out = params.map(p => {
    return `\n  * {${p.type}} ${p.name} - ${p.description}`
  })
  return out.join("\n")
}

function renderApi (defs) {
  //console.log(JSON.stringify(defs, null, 2))
  let output = [ "" ]
  defs.functions.forEach(fn => {
    output.push(`
### ${fn.name}
${renderExample(fn.examples)}
* **Params:** ${renderParams(fn.parameters)} 
* **Returns:** {${fn.returns.type}} ${fn.returns.description}

${fn.description}
`)
  })
  return output.join("\n")
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

async function build(dir) {
  console.log('Building service-docs ..')
  console.log('Services path: %s', dir)

  const defs = await jsdocDefs(dir)

  console.log('Starting processing services ..')
  fs.readdirSync(dir).forEach(id => {
    console.log('Processing service: %s', id)
    const readmeFn = path.join(dir, id, 'README.md')
    if (fs.existsSync(readmeFn)) {
      console.log('[service=%s] readme found: %s', id, readmeFn)
      const readme = fs.readFileSync(readmeFn).toString()
      const pkg = require(path.join(dir, id))
      const pkgDefs = _.find(defs.classes, { name: pkg.api.name })
      if (!pkgDefs) {
        console.log('No jsdoc defs found, skipping ..')
        return null
      }

      const vars = {
        id,
        title: pkg.name,
        api: renderApi(pkgDefs)
      }

      const rendered = renderReadme(readme, vars)
      if (rendered !== readme) {
        console.log('Readme changed, updating: %s', readmeFn)
        fs.writeFileSync(readmeFn, rendered)
      }
    }
  })
  console.log('done')
}

module.exports = {
  build
}
