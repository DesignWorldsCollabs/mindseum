module.exports = {
  // db collection
  collection: 'auths',
  // projection of db collection
  publicCollection: 'users',
  user: {
    id: true,
    email: true
  },
  confirmRegistration: false,
  // passportjs options
  passport: {
    successRedirect: '/',
    failureRedirect: '/'
  },
  strategies: {
  },
  hooks: {
    parseRegisterRequest: function parseRegisterRequest(req, res, done) {
      var name = req.body.name;
      var email = req.body.email;
      var password = req.body.password;

      if (!name || !email || !password) return done('All fields are required.');
      // There is no good way to test emails by regex. The only good way is to send confirmation letter
      // This regex should pass all correct emails, but can pass some incorrect emails also
      if (!this.options.emailRegex.test(email)) return done('Invalid email address.');
      if (password.length < 6) return done('Password should be at least 6 letters.');

      // You can pass custom values to new user with help of userData parameter
      // For example we can pass userId from session
      var userData = {name: name};

      done(null, email, password, userData);
    },
    request: function(req, res, userId, isAuthenticated, done) {
      done();
    }
  }
};
