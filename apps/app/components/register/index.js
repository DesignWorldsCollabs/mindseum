module.exports = Register;
function Register() {}
Register.prototype = require('derby-login/components/base').prototype;

Register.prototype.name = 'auth:register';
Register.prototype.view = __dirname;
Register.prototype.fields = ['name', 'email', 'password'];
Register.prototype.route = 'register';

Register.prototype.display = function (scoped) {
  return scoped.get() ? 'inherit' : 'none';
}

Register.prototype.focus = function (ns) {
  this.model.at('focus').set(ns, true);
}

Register.prototype.blur = function (ns) {
  this.model.at('focus').del(ns);
}
