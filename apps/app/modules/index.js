module.exports = function(app, options) {
  app.module('user', require('./user'));
  app.module('clippings', require('./clippings'))
  app.module('offset', require('./offset'))
  app.module('associatable', require('./associatable'))
  app.module('connections', require('./connections'))
  app.module('board', require('./board'))
  app.module('associate', require('./associate'))
}
