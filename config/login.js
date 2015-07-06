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
    request: function(req, res, userId, isAuthenticated, done) {
      done();
    }
  }
};