'use strict'

const chalk = require('chalk')
const path = require('path')
const { say } = require('cfonts')
const { spawn } = require('child_process')
const webpack = require('webpack')
const koaWebpack = require('koa-webpack')
const MemoryFs = require('memory-fs')
const _fs = new MemoryFs()

const serverConfig = require('./webpack.server.config')
const clientConfig = require('./webpack.client.config')

function logStats (proc, data) {
  let log = ''

  log += chalk.yellow.bold(`┏ ${proc} Process ${new Array((19 - proc.length) + 1).join('-')}`)
  log += '\n\n'

  if (typeof data === 'object') {
    data.toString({
      colors: true,
      chunks: false
    }).split(/\r?\n/).forEach(line => {
      log += '  ' + line + '\n'
    })
  } else {
    log += `  ${data}\n`
  }

  log += '\n' + chalk.yellow.bold(`┗ ${new Array(28 + 1).join('-')}`) + '\n'

  console.log(log)
}

async function startClient () {
  clientConfig.output.publicPath = '/'
  clientConfig.entry.client = [].concat(clientConfig.entry.client)
  logStats('start client')
  let compiler = webpack(clientConfig)
  compiler.hooks.compilation.tap('done', stats => {
    logStats('Client done')
  })

  return koaWebpack({compiler})
}

async function startServer () {
  logStats('start Server')
  const compiler = webpack(serverConfig)
  const koaPack = await startClient()
  const serverGenerator = initServer(koaPack)

  compiler.outputFileSystem = _fs

  compiler.hooks.watchRun.tapAsync('watch-run', (compilation, next) => {
    logStats('Server watch run', chalk.white.bold('compiling...'))
    next()
  })

  compiler.hooks.compilation.tap('done', stats => {
    logStats('Server done')
  })
  
  compiler.watch({}, (err, stats) => {
    logStats('Server watch', stats)
    if (err) {
      console.log(err)
      return
    }
    serverGenerator.next(stats)
  })
}

function* initServer (mid) {
  do {
    let serverjs = _fs.readFileSync(path.resolve(__dirname, '../dist/server.js')).toString()
    let m = new module.constructor()
    m.paths = module.paths
    m._compile(serverjs, path.resolve(__dirname, '../dist/server.js'))
    let { app } = m.exports
    app.use(async (ctx, next) => {
      serverLog(ctx.request.url, 'yellow')
      next()
    })
    app.use(mid)
    let httpServer = app.listen(3000)
    serverLog('Server listening at http://localhost:3000', 'green')
    yield [app, httpServer]
    httpServer.close()
  } while (true)
}


function serverLog(data, color = 'blue') {
  let log = ''
  data = data.toString().split(/\r?\n/)
  data.forEach(line => {
    log += `  ${line}\n`
  })
  if (/[0-9A-z]+/.test(log)) {
    console.log(
      chalk[color].bold('┏ Server ---------------------') +
      '\n\n' +
      log +
      '\n' +
      chalk[color].bold('┗ ----------------------------') +
      '\n'
    )
  }
}

function greeting() {
  const cols = process.stdout.columns
  let text = ''

  if (cols > 104) text = 'koa-vue'
  else if (cols > 76) text = 'koa-|vue'
  else text = false

  if (text) {
    say(text, {
      colors: ['yellow'],
      font: 'simple3d',
      space: false
    })
  } else console.log(chalk.yellow.bold('\n  koa-vue'))
  console.log(chalk.blue('  getting ready...') + '\n')
}

async function init () {
  greeting()

  await startServer()
}

init()
  .catch(error => {
    console.log('dev-runner error', error)
  })
