var request = require('superagent')

module.exports = GameUrl
function GameUrl() {}

GameUrl.prototype.init = function () {
  this.model.set('state', 'empty')
}
GameUrl.prototype.create = function () {}
GameUrl.prototype.validate = function (url) {
  var endpoint = '/check?url=' + encodeURIComponent(url)
  request.head(endpoint).end(this.onValidate.bind(this));
}
GameUrl.prototype.onValidate = function (err, res) {
  if (err) return this.model.set('state', 'error')
  this.model.set('state', 'exists')
}
GameUrl.prototype.disabled = function () {
  return this.model.get('state') === 'exists' ? 'show' : 'hide'
}

