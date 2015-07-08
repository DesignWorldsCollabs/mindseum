module.exports = Preview;
function Preview() {}
Preview.prototype.name = 'preview';
Preview.prototype.view = __dirname;

Preview.prototype.create = function(model, dom) {
  var modal = this;
  var render = model.scope('$render.preview')
  dom.on('keydown', function(e) {
    if (!render.get('show')) return;
    if (e.keyCode === 27) {  // Escape
      modal.hide('escape');
    }
  });
  dom.on('load', this.img, function(e) {
    model.set('width', this.offsetWidth);
  });
};

Preview.prototype.show = function() {
  var render = this.model.scope('$render.preview')
  this.emitDelayable('show', function() {
    render.set('show', true);
    setTimeout(function() {
      render.set('faded', true);
    }, 0);
  });
};

Preview.prototype.hide = function(action) {
  var cancelled = this.emitCancellable('hide', action);
  if (cancelled) return;
  var render = this.model.scope('$render.preview')
  render.set('faded', false);
  setTimeout(function() {
    render.set('show', false);
  }, 300);
};
