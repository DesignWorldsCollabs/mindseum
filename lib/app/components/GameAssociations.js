module.exports = GameAssociations
function GameAssociations() {}

GameAssociations.prototype.init = function () {
}

GameAssociations.prototype.create = function () {
  this.model.on('all', 'beadIds', this.onBeadIds.bind(this))
}

GameAssociations.prototype.onBeadIds = function (event, index) {
  if (event === 'remove' && index === 0) return this.model.del('associations')
  this.chainsQuery = this.model.root.query('chains', {
    beadIds: this.model.get('beadIds'),
    $or: [
      {sessionId: this.model.scope('$session').get('id')},
      {public: true}
    ]
  })
  this.chainsQuery.subscribe(this.onChainsQuery.bind(this))
}
GameAssociations.prototype.onChainsQuery = function () {
  this.chainsQuery.ref(this.model.path() + '.associations')
}
