module.exports.load = load

function load() {
  var connections = this.params.connections;
  connections = (connections ? connections.split('/') : []);
  this.model.set('_page.connections', connections);
}
