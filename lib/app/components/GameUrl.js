var request = require('superagent')

module.exports = GameUrl
function GameUrl() {}

GameUrl.prototype.init = function () {
  this.model.set('state', 'empty')
  this.apiPrefix = ((this.app.config || {}).apiPrefix || '')
}
GameUrl.prototype.create = function () {
  this.model.on('all', 'url', this.validate.bind(this))
}
GameUrl.prototype.onBlur = function () {
  this.model.set('touched', true)
}
GameUrl.prototype.onSubmit = function () {
  console.log('onSubmit');
  this.summarize()
}
GameUrl.prototype.validate = function () {
  if (this.req) this.req.abort()
  this.model.set('state', 'validating')
  this.req = request.head(this.endpoint()).end(this.onValidation.bind(this));
}
GameUrl.prototype.onValidation = function (err, res) {
  this.req = null
  if (err || res.error) {
    this.model.set('exists', false)
    return this.model.set('state', 'error')
  }
  this.model.set('exists', true)
  this.model.set('state', 'valid')
  this.model.setDiff('url', res.header['queried-url']);
}
GameUrl.prototype.summarize = function () {
  this.model.set('state', 'summarizing')
  if (this.req) this.req.abort()
  this.req = request.get(this.endpoint()).timeout(5000).end(this.onSummary.bind(this));
}
GameUrl.prototype.onSummary = function (err, res) {
  this.req = null
  // if (err || res.error) return this.model.set('state', 'exists')
  if (err || res.error) console.log(err || res.error);
  this.model.set('state', 'summarized')
  this.model.set('title', res.body.title)
  this.model.set('summary', (res.body.summary || []).join(''))
  this.model.set('source', res.body.source)
}
GameUrl.prototype.disabled = function () {
  return this.model.get('state') === 'exists' ? 'show' : 'hide'
}
GameUrl.prototype.endpoint = function () {
  return this.apiPrefix + summaryQuery(this.model.get('url'))
}
function summaryQuery(url) {
  return '/summarize?url=' + encodeURIComponent(url)
}
