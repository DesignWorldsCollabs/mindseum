var derby = require('derby');
var path = require('path')

var errorApp = module.exports = derby.createApp('mindseumError', __filename)

errorApp.loadViews(path.join(__dirname, 'views/error'))
errorApp.loadStyles(path.join(__dirname, 'styles/reset'))
errorApp.loadStyles(path.join(__dirname, 'styles/error'))

