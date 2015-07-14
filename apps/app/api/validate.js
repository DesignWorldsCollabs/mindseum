var request = require('superagent');
var url = require('url');
var app = require('../');

module.exports = validate;

function validate(req, res, next) {
  var method = 'HEAD';
  var timeout = 8000;
  if (/^http/.test(req.query.url) === false) req.query.url = 'http://' + req.query.url
  request.head(req.query.url).timeout(timeout).end(onResponse);
  function onResponse(err, response) {
    res.append('Queried-URL', req.query.url);
    if (((response || {}).header || {}).location) {
      var query = url.parse(req.query.url)
      var redirect = url.parse(response.header.location)
      var protocol = redirect.protocol || query.protocol;
      var host = redirect.host || query.host;
      var path = getPath(protocol, host, redirect.path);
      res.location((process.env.PROTOCOL || req.protocol) + '://' + req.get('host') + path);
    }
    if (err && err.status === 405 && method === 'HEAD') {
      method = 'GET';
      return request.get(req.query.url).timeout(timeout).end(onResponse);
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
