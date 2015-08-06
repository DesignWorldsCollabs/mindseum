module.exports = function(app, options) {
  app.component(require('./associate'));
  app.component(require('./board'));
  app.component(require('./clipping'));
  app.component(require('./collect'));
  app.component(require('./curate'));
  app.component(require('./floatlabel'));
  app.component(require('./preview'));
  app.component(require('./register'));
  app.component(require('./login'));
  app.component(require('./url'));
};
