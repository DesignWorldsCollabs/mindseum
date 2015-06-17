module.exports = GameClippings
function GameClippings() {}

GameClippings.prototype.init = function () {
}

GameClippings.prototype.create = function () {
  this.model.on('all', 'chain', this.onBeadIds.bind(this))
}

GameClippings.prototype.onBeadIds = function (event, index) {
  if (event === 'remove' && index === 0) return this.model.removeRef('clippings')
  this.chainsQuery = this.model.root.query('clippings', {
    chain: this.model.get('chain'),
    $or: [
      {sessionId: this.model.scope('$session').get('id')},
      {public: true}
    ]
  })
  this.chainsQuery.subscribe(this.onChainsQuery.bind(this))
}
GameClippings.prototype.onChainsQuery = function () {
  this.chainsQuery.ref(this.model.path() + '.clippings')
}
