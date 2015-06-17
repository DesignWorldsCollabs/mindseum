var inherits = require('inherits')
var async = require('async')

module.exports = GameController

inherits(GameController, require('./ApplicationController'))

function GameController(args) {
  GameController.super_.apply(this, arguments)
  this.subscribe()
}

GameController.prototype.ns = 'game'

GameController.prototype.subscribe = function () {
  async.parallel([
    this.currentMeta.bind(this),
    this.currentSession.bind(this),
    this.defaultBoard.bind(this)
  ],
  this.subscribed.bind(this))
}

GameController.prototype.refs = function () {
  this.model.ref('_page.meta', this.meta)
  this.model.ref('_page.board', this.board)
}

GameController.prototype.subscribed = function () {
  this.refs()
  this.render()
}

GameController.prototype.center = '9ce0639f-acd3-4b24-adce-c4a2492741c5'

GameController.prototype.defaultBoard = function (cb) {
  (this.board = this.model.at('boards.default')).subscribe(cb)
}
