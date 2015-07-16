var request = require('superagent')

module.exports = Url
function Url() {}
Url.prototype.name = 'url';
Url.prototype.view = __dirname;

Url.prototype.create = function () {
  this.model.on('change', 'url', this.change.bind(this));
  this.on('validated', this.collect.bind(this));
}

Url.prototype.change = function () {
  this.model.del('suggested');
  this.model.del('valid');
}

Url.prototype.submit = function () {
  if (this.model.get('suggested')) return this.correct();
  if (this.model.get('valid') === true) return this.collect();
  this.validate();
}

Url.prototype.focus = function () {
  this.model.set('focused', 'focused');
}

Url.prototype.blur = function () {
  if ((this.model.get('url') || '').length === 0) this.model.del('focused');
}

Url.prototype.validate = function () {
  if (this.req) this.req.abort()
  this.model.del('validating')
  this.model.del('error');
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
  if (this.model.get('url') !== url) return this.model.set('suggested', url)
  this.model.set('valid', true);
  this.emit('validated');
}

Url.prototype.correct = function (shortcut) {
  this.model.setDiff('url', this.model.del('suggested'));
  this.model.set('valid', true);
  if (!shortcut) return;
  this.collect();
}

Url.prototype.collect = function () {
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
