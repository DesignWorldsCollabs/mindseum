var request = require('superagent')

module.exports = GameClip
function GameClip() {}

GameClip.prototype.init = function () {
  this.apiPrefix = ((this.app.config || {}).apiPrefix || '')
}

GameClip.prototype.create = function () {
  if (this.model.get('clip.state') !== 'summarized') this.summarize()
}

GameClip.prototype.del = function () {
  this.model.scope('clippings').at(this.model.get('clip.id')).del()
}

GameClip.prototype.summarize = function () {
  this.model.set('clip.state', 'summarizing')
  if (this.req) this.req.abort()
  this.req = request.get(this.endpoint()).timeout(5000).end(this.onSummary.bind(this));
}

GameClip.prototype.onSummary = function (err, res) {
  this.req = null
  console.log(res)
  // if (err || res.error) return this.model.set('state', 'exists')
  if (err || res.error) console.log(err || res.error);
  this.model.set('clip.state', 'summarized')
  this.model.set('clip.title', res.body.title)
  this.model.set('clip.summary', (res.body.summary || []).join(''))
  this.model.set('clip.source', res.body.source)
}

GameClip.prototype.endpoint = function () {
  return this.apiPrefix + summaryQuery(this.model.get('clip.url'))
}
function summaryQuery(url) {
  return '/summarize?url=' + encodeURIComponent(url)
}
