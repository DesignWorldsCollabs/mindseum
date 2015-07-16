module.exports.load = load
module.exports.setup = setup

function load() {
  var userId = this.model.get('_session.userId');
  var boardId = this.params.boardId;
  var query = {
    userId: userId,
    title: {$exists: true},
    summary: {$exists: true},
  }
  query['associations.' + boardId] = {$exists: false}
  this.query = this.model.query('clippings', query)
  this.addSubscriptions(this.query);
}

function setup() {
  this.query.ref('_page.clippings');
}


