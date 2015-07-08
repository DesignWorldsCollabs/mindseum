module.exports = Modal;
function Modal() {}
Modal.prototype.name = 'modal';
Modal.prototype.view = __dirname;

Modal.prototype.create = function(model, dom) {
  var modal = this;
  var render = model.scope('$render.modal')
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

Modal.prototype.show = function() {
  var render = this.model.scope('$render.modal')
  this.emitDelayable('show', function() {
    render.set('show', true);
    setTimeout(function() {
      render.set('faded', true);
    }, 0);
  });
};

Modal.prototype.hide = function(action) {
  var cancelled = this.emitCancellable('hide', action);
  if (cancelled) return;
  var render = this.model.scope('$render.modal')
  render.set('faded', false);
  setTimeout(function() {
    render.set('show', false);
  }, 300);
};
