var url = require('url')

module.exports = Clipping
function Clipping() {}
Clipping.prototype.name = 'clipping';
Clipping.prototype.view = __dirname;

Clipping.prototype.init = function () {
  this.model.setNull('hostname', this.parsed().hostname.replace(/^www\./, ''));
  this.model.setNull('pathname', this.parsed().pathname.replace(/\/$/, ''));
}

Clipping.prototype.parsed = function () {
  if (this._parsed) return this._parsed;
  return this._parsed = url.parse(this.model.get('clipping.url'));
}

Clipping.prototype.rm = function (id) {
  this.model.scope('clippings').del(id);
}
