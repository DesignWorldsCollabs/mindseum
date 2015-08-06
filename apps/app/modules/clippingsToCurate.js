module.exports.load = load
module.exports.setup = setup

function load() {
  this.query = this.model.query('clippings', {
    associations: {$exists: true}
  })
  this.addSubscriptions(this.query);
}

function setup() {
  this.query.ref('_page.clippings');
}



