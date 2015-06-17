var path = require('path')

var app = module.exports = require('derby').createApp('mindseumApp', __filename)
app.serverUse(module, './stylus')
app.loadViews(path.join(__dirname, 'views'))
app.loadStyles(path.join(__dirname, 'styles'))
app.component(require('d-connection-alert'))
app.component(require('d-before-unload'))

app.on('ready', function (page) {
  // for debugging only
  global.app = app
  global.model = page.model
})

app.get('/', serve(require('./controllers/GameController')))
app.component('game:bead', require('./components/GameBead'))
app.component('game:connect', require('./components/GameConnect'))
app.component('game:url', require('./components/GameUrl'))
app.component('game:associations', require('./components/GameAssociations'))
app.component('game:chain', require('./components/GameChain'))

function serve(ctor) {
  return ctor.bind(Object.create(ctor.prototype))
}
