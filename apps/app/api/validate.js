var request = require('superagent');
var url = require('url');
var app = require('../');

module.exports = validate;

function validate(req, res, next) {
  var method = 'HEAD';
  var timeout = 8000;
  var redirects = 5;
  var agent = request.agent();
  if (/^http/.test(req.query.url) === false) req.query.url = 'http://' + req.query.url
  res.set('Queried-URL', req.query.url);
  agent.head(req.query.url).timeout(timeout).end(onResponse);
  function onResponse(err, response) {
    if (((response || {}).header || {}).location) {
      if (!redirects) return res.sendStatus(500);
      redirects--;
      var query = url.parse(req.query.url)
      res.set('Queried-URL', response.header.location);
      return agent.head(response.header.location).timeout(timeout).end(onResponse);
    }
    if (err && err.status === 405 && method === 'HEAD') {
      method = 'GET';
      return agent.get(req.query.url).timeout(timeout).end(onResponse);
    }
    if (err && err.status) return res.sendStatus(err.status)
    if (err) return res.sendStatus(500)
    res.sendStatus(response.status)
  }
}

function getPath(protocol, host, path) {
  return app.pathFor('api:validate', {
    $query: {
      url: protocol + '//' + host + path
    }
  })
}
