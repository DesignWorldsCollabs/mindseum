module.exports = ApplicationController

function ApplicationController() {
  if ((this instanceof ApplicationController) === false)
    throw new Error('function should be called as a constructor')
  this.page = arguments[0]
  this.model = arguments[1]
  this.params = arguments[2]
  this.next = arguments[3]
  this.model.on('error', this.next)
  this.rendered = false
}

ApplicationController.prototype.render = function () {
  if (this.rendered) return this.next(new Error('already rendered'))
  this.page.render(this.ns)
  this.rendered = true
}

ApplicationController.prototype.currentMeta = function (cb) {
  (this.meta = this.model.scope('metadata').at(this.ns)).subscribe(cb)
}

ApplicationController.prototype.currentSession = function (cb) {
  (this.session = this.model.scope('sessions').at(this.model.get('$session.id'))
  ).subscribe(cb)
}

function exists(id) {
  return (typeof id === 'string' && id.length > 0)
}

