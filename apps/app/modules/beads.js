module.exports.load = ['board', 'connections', load];
module.exports.setup = setup;

function load() {
  this.beads = (this.model.get('_page.board.beads') || []);
  this.query = [];
  var beadIds, beadId, query;
  for (var i = this.beads.length; i--;) {
    beadIds = this.model.get('_page.connections').slice();
    beadId = this.beads[i].id
    if (beadIds.indexOf(beadId) === -1) beadIds.push(beadId);
    query = {$count: true, $query: {}};
    query['$query']['associations.default-board'] = {$all: beadIds}
    this.query[i] = this.model.query('clippings', query);
    this.addFetches(this.query[i])
  }
}

function setup() {
  var count;
  for (var i = this.beads.length; i--;) {
    count = this.query[i].getExtra();
    if (count > 0) this.model.at('_page.beads').push(this.beads[i])
  }
}
