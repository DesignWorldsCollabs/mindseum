module.exports = function(app, options) {
  app.module('associate', require('./associate'))
  app.module('associatable', require('./associatable'))
  app.module('associations', require('./associations'))
  app.module('beads', require('./beads'))
  app.module('board', require('./board'))
  app.module('clippings', require('./clippings'))
  app.module('connections', require('./connections'))
  app.module('offset', require('./offset'))
  app.module('user', require('./user'));
}
