module.exports.load = load
module.exports.setup = setup

function load() {
  var loggedIn = this.model.get('_session.loggedIn');
  var userId = this.model.get('_session.userId');
  this.scope = this.model.scope('users').at(userId)
  if (loggedIn) this.addSubscriptions(this.scope);
}

function setup() {
  this.model.ref('_session.user', this.scope);
}

