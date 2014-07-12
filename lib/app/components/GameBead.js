module.exports = GameBead
function GameBead() {}

GameBead.prototype.init = function () {
  this.id = this.model.get('id')
}
GameBead.prototype.create = function () {}

GameBead.prototype.click = function () {
  this.toggle()
  this.updateClass()
}

GameBead.prototype.toggle = function () {
  if (this.indexOf() !== -1) return this.unlink()
  if (this.beadIds().length > 3) return false
  this.link()
}

GameBead.prototype.id = function () {
  return this.model.get('id')
}

GameBead.prototype.beadIds = function () {
  return (this.model.get('beadIds') || [])
}

GameBead.prototype.indexOf = function () {
  return this.beadIds().indexOf(this.id)
}

GameBead.prototype.link = function () {
  this.model.push('beadIds', this.id)
}

GameBead.prototype.unlink = function () {
  this.model.remove('beadIds', this.indexOf())
}

GameBead.prototype.updateClass = function () {
  this.indexOf() === -1 ? this.delClass() : this.setClass()
}

GameBead.prototype.setClass = function () {
  this.model.set('class', 'linked')
}
GameBead.prototype.delClass = function () {
  this.model.del('class')
}

