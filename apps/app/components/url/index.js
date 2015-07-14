var request = require('superagent')

module.exports = Url
function Url() {}
Url.prototype.name = 'url';
Url.prototype.view = __dirname;

Url.prototype.create = function () {
  this.model.on('all', 'url', this.invalidate.bind(this))
  this.on('validated', this.collect.bind(this));
}

Url.prototype.blur = function () {
  this.validate();
}

Url.prototype.submit = function () {
  this.model.set('collect', true);
  if (this.model.get('valid') === true) return this.collect();
  this.validate();
}

Url.prototype.validate = function () {
  if (this.req) this.req.abort()
  this.model.del('validating')
  this.invalidate();
  if ((this.model.get('url') || '').length === 0) return this.req = null;
  this.model.set('validating', true)
  this.req = request.head(this.path()).end(this.onValidation.bind(this));
}

Url.prototype.onValidation = function (err, res) {
  this.req = null
  this.model.del('validating')
  if (err || res.error) {
    return this.model.set('error', true);
  }
  var url = res.header['queried-url'];
  this.model.set('valid', true);
  if (this.model.get('url') !== url) return this.model.pass({silent: true}).setDiff('url', url);
  this.emit('validated');
}

Url.prototype.invalidate = function (type, val, prev, passed) {
  if (passed && passed.silent) return;
  this.model.del('error');
  this.model.del('valid');
}

Url.prototype.collect = function () {
  if (!this.model.del('collect')) return
  this.model.del('error');
  this.model.del('valid');
  this.emit('collect', this.model.del('url'));
}

Url.prototype.path = function () {
  return this.app.pathFor('api:validate', {
    $query: {
      url: this.model.get('url')
    }
  })
}
