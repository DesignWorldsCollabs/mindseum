var url = require('url')

module.exports = Collect
function Collect() {}
Collect.prototype.name = 'collect';
Collect.prototype.view = __dirname;

Collect.prototype.newClipping = function (url) {
  this.model.root.add('clippings', {
    userId: this.model.root.get('_session.userId'),
    url: url
  })
}

Collect.prototype.hostname = function (u) {
  return url.parse(u).hostname.replace(/^www\./, '');
}

Collect.prototype.pathname = function (u) {
  return url.parse(u).pathname.replace(/\/$/, '');
}
