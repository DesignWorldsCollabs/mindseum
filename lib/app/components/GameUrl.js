var request = require('superagent')

module.exports = GameUrl
function GameUrl() {}

GameUrl.prototype.init = function () {
  this.model.set('state', 'empty')
}
GameUrl.prototype.create = function () {
  this.model.on('all', 'url', this.validate.bind(this))
}
GameUrl.prototype.validate = function () {
  if (this.req) this.req.abort()
  var url = encodeURIComponent(this.model.get('url'))
  var endpoint = '/check?url=' + url
  this.req = request.head(endpoint).end(this.onValidation.bind(this));
}
GameUrl.prototype.onValidation = function (err, res) {
  this.req = null
  if (err) return this.model.set('state', 'error')
  if (res.status !== 200) return this.model.set('state', 'error')
  this.model.set('state', 'exists')
}
GameUrl.prototype.onBlur = function (err, res) {
  this.model.set('touched', true)
}
GameUrl.prototype.disabled = function () {
  return this.model.get('state') === 'exists' ? 'show' : 'hide'
}

