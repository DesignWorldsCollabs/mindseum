module.exports.load = ['connections', load];
module.exports.setup = setup;

function load() {
  var boardId = (this.params.boardId || 'default-board');
  var q = {};
  var connections = this.model.get('_page.connections');
  q['associations.' + boardId] = {$all: connections, $size: connections.length}
  this.query = this.model.query('clippings', q);
  this.addSubscriptions(this.query);
}

function setup() {
  this.query.ref('_page.clippings');
}
