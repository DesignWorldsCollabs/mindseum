module.exports = function(app, options) {
  app.module('user', require('./user'));
  app.module('clippings', require('./clippings'))
  app.module('connections', require('./connections'))
  app.module('board', require('./board'))
}
