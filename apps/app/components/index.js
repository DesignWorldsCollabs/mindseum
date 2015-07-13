module.exports = function(app, options) {
  app.component(require('./board'));
  app.component(require('./preview'));
  app.component(require('./register'));
  app.component(require('./login'));
};
