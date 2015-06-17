module.exports = GameChain
function GameChain() {}

GameChain.prototype.init = function () {
}

GameChain.prototype.del = function () {
  this.model.scope('chains').at(this.model.get('chain.id')).del()
}
