var derby = require('derby');

var app = module.exports = derby.createApp('app', __filename);


app.use(require('d-bootstrap'));
app.use(require('derby-login/components'));
app.use(require('derby-router'));
app.use(require('derby-debug'));
app.use(require('./components'));
app.serverUse(module,'derby-jade');
app.serverUse(module, 'derby-stylus');
app.serverUse(module, 'derby-markdown');

app.loadViews(__dirname + '/views');
app.loadStyles(__dirname + '/styles');

app.get('home', '/');

app.get('explore', '/explore/:connections*', ['connections']);
app.get('collect', '/collect');
app.get('associate', '/associate');

app.get('login', '/login');
app.get('register', '/register');

app.module('connections', {
  load: function () {
    var connections = this.params.connections;
    connections = (connections ? connections.split('/') : []);
    this.model.set('_page.connections', connections);
  }
})
