var request = require('superagent')

module.exports = GameUrl
function GameUrl() {}

GameUrl.prototype.init = function () {
  this.model.set('state', 'empty')
}
GameUrl.prototype.create = function () {
  this.model.on('all', 'url', this.validate.bind(this))
}
GameUrl.prototype.onBlur = function () {
  this.model.set('touched', true)
}
GameUrl.prototype.onSubmit = function () {
  this.summarize()
}
GameUrl.prototype.validate = function () {
  var endpoint = summaryQuery(this.model.get('url'))
  if (this.req) this.req.abort()
  this.req = request.head(endpoint).end(this.onValidation.bind(this));
}
GameUrl.prototype.onValidation = function (err, res) {
  this.req = null
  if (err || res.error) return this.model.set('state', 'error')
  this.model.set('state', 'exists')
}
GameUrl.prototype.summarize = function () {
  this.model.set('state', 'summarizing')
  var endpoint = summaryQuery(this.model.get('url'))
  if (this.req) this.req.abort()
  this.req = request.get(endpoint).end(this.onSummary.bind(this));
}
GameUrl.prototype.onSummary = function (err, res) {
  this.req = null
  console.log(err, res)
  if (err || res.error) return this.model.set('state', 'exists')
  this.model.set('state', 'summarized')
  this.model.set('title', res.body.title)
  this.model.set('summary', res.body.summary.join(''))
  this.model.set('source', res.body.source)
}
GameUrl.prototype.disabled = function () {
  return this.model.get('state') === 'exists' ? 'show' : 'hide'
}

function summaryQuery(url) {
  return '/summarize?url=' + encodeURIComponent(url)
}
