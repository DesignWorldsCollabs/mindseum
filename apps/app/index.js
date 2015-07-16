var derby = require('derby');

var app = module.exports = derby.createApp('app', __filename);

app.component(require('d-connection-alert'));
app.component(require('d-before-unload'));
app.use(require('d-bootstrap'), {loadStyles: false});
app.use(require('derby-login/components'));
app.use(require('derby-router'));
app.use(require('derby-debug'));
app.use(require('./api'));
app.use(require('./components'));
app.use(require('./modules'));
app.serverUse(module,'derby-jade');
app.serverUse(module, 'derby-stylus');
app.serverUse(module, 'derby-less');
app.serverUse(module, 'derby-markdown');

app.loadViews(__dirname + '/views');
app.loadStyles(__dirname + '/styles/bootstrap');
app.loadStyles(__dirname + '/styles');

app.get('home', '/', ['user']);

app.get('explore', '/explore/:boardId/:connections*', [
  'user', 'board', 'connections'
]);
app.get('collect', '/collect', [
  'user', 'clippings'
]);
app.get('collect', '/collect/:clippingId', [
  'user', 'clippings'
]);
app._post('/collect/:clippingId', function deleteClipping(page, model, params, next) {
  model.at('clippings').del(this.params.clippingId)
  page.redirect('/collect');
});
app.get('associate:create', '/a/c/:boardId/:offset/:clippingId/:connections*', [
  'connections', 'associate'
]);
app.get('associate', '/a/:boardId/:offset/:connections*', [
  'user', 'offset', 'board', 'associatable', 'connections'
]);

app.get('login', '/login');
app.get('register', '/register');
