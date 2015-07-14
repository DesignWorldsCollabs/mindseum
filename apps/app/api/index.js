var derby = require('derby');

var routes = {};
routes.validate = derby.util.serverRequire(module, './validate');

module.exports = function(app, options) {
  app.serverHead('api:validate', '/api/summarize', routes.validate);
}
