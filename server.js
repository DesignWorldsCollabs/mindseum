var server = require('./lib/server')
var app = require('./lib/app')

var config = require('./config').generate()
var port = config.get('port')
var ip = config.get('ip')

require('derby').run(createServer)

function createServer() {
  server.setup(app, config, onSetup)
}

function onSetup(err, expressApp) {
  if (err) throw err
  var server = require('http').createServer(expressApp)
  server.listen(port, ip, listenCallback)
}

function listenCallback(err) {
  if (err) throw err
  console.log('%d listening. Go to: http://localhost:%d/', process.pid, port)
}


