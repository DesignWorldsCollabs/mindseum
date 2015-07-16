module.exports.load = load
module.exports.setup = setup

function load() {
  var clippingId = (this.params || {}).clippingId;
  this.scope = this.model.scope('clippings').at(clippingId)
  this.addSubscriptions(this.scope);
}

function setup() {
  var connections = (this.model.get('_page.connections') || []);
  if (connections.length === 0) return this.page.redirect('back');
  this.scope.at('associations').set(this.params.boardId, connections);
  var offset = parseInt(this.params.offset);
  if (offset > 0) offset--;
  this.redirect('associate', {boardId: this.params.boardId, offset: offset+''});
}
