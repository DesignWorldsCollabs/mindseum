module.exports = GameConnect
function GameConnect() {}

GameConnect.prototype.init = function () {
  this.model.set('id', '9ce0639f-acd3-4b24-adce-c4a2492741c5')
  this.updateClass()
}

GameConnect.prototype.create = function () {
  this.model.on('insert', 'beadIds', this.updateClass.bind(this))
  this.model.on('remove', 'beadIds', this.updateClass.bind(this))
}

GameConnect.prototype.beadIds = function () {
  return (this.model.get('beadIds') || [])
}

GameConnect.prototype.updateClass = function () {
  this.beadIds().length > 0 ? this.delClass() : this.setClass()
}

GameConnect.prototype.setClass = function () {
  this.disabled = true
  this.model.set('class', 'disabled')
}

GameConnect.prototype.delClass = function () {
  this.disabled = false
  this.model.del('class')
}

