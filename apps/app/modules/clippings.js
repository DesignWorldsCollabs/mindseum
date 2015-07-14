module.exports.load = load
module.exports.setup = setup

function load() {
  var userId = this.model.get('_session.userId');
  this.query = this.model.query('clippings', {
    $query: {
      userId: userId
    },
    $orderby: {
      '_m.ctime': -1
    }
  })
  this.addSubscriptions(this.query);
}

function setup() {
  this.query.ref('_page.clippings');
}


