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
  var u = this.model.get('clipping.url');
  if (typeof u !== 'string' || u.length < 1) return {hostname: '', pathname: ''};
  return this._parsed = url.parse(u);
}
