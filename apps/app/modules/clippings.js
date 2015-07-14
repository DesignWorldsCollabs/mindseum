module.exports.load = load
module.exports.setup = setup

function load() {
  var userId = this.model.get('_session.userId');
  this.query = this.model.query('clippings', {userId: userId})
  this.addSubscriptions(this.query);
}

function setup() {
  this.query.ref('_page.clippings');
}


