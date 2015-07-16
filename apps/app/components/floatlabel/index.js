module.exports = Floatlabel;
function Floatlabel() {}
Floatlabel.prototype.name = 'floatlabel';
Floatlabel.prototype.view = __dirname;

Floatlabel.prototype.init = function () {
  if (!this.empty()) this.model.set('focused', 'focused');
}

Floatlabel.prototype.create = function () {
  if (this.input === document.activeElement) this.model.set('focused', 'focused');
  if (this.input.autofocus) this.input.focus();
}

Floatlabel.prototype.focus = function () {
  this.model.set('focused', 'focused');
}

Floatlabel.prototype.blur = function () {
  if (this.empty()) this.model.set('focused', '');
}

Floatlabel.prototype.empty = function () {
  return (this.model.get('value') || '').length === 0
}
