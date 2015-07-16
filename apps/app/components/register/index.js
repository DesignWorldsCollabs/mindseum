module.exports = Register;
function Register() {}
Register.prototype = require('derby-login/components/base').prototype;

Register.prototype.name = 'auth:register';
Register.prototype.view = __dirname;
Register.prototype.fields = ['name', 'email', 'password'];
Register.prototype.route = 'register';
