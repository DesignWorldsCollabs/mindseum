var derby = require('derby')
derby.use(require('racer-bundle'));

var request = require('superagent')
var tldr = require('node-tldr')
var path = require('path')
var express = require('express')
var racerBrowserChannel = require('racer-browserchannel')
var errorApp = require('../error')
var createStore = require('./createStore')

module.exports.setup = function setup(app, config, cb) {
  var store = createStore(derby, config)

  var expressApp = express()
    .use(require('morgan')('combined'))
    .use(require('serve-favicon')(path.join(config.get('public'), 'favicon.ico')))
    .use(require('compression')())

  config.get('static').forEach(function serveStatic(mount) {
    expressApp.use(mount.route, require('serve-static')(mount.dir));
  });

  expressApp
    .head('/summarize', function checkUrl(req, res, next) {
      request.head(req.query.url).timeout(5000).end(onResponse)
      function onResponse(err, response) {
        if (((response || {}).header || {}).location) {
          var location = encodeURIComponent(response.header.location)
          res.location(req.protocol + '://' + req.get('host') + '/summarize?url=' + location);
        }
        if (err && err.status) return res.sendStatus(err.status)
        if (err) return res.sendStatus(500)
        res.sendStatus(response.status)
      }
    })
    .get('/summarize', function summarizeUrl(req, res, next) {
      var url = req.query.url
      tldr.summarize(req.query.url, function onSummary(result, failure) {
        if (failure) return res.sendStatus(500).json(result)
        res.json(result);
      })
    })
    .use(racerBrowserChannel(store))
    .use(store.modelMiddleware())
    // .use(require('body-parser').urlencoded({extended: true}))
    // .use(express.methodOverride())
    .use(require('cookie-parser')(config.get('session.secret')))
    .use(cookieMiddleware(config))
    .use(sessionMiddleware)

  expressApp.use(app.router()) // propagation should stop here
  expressApp.use('*', function (req, res, next) {
    var page = errorApp.createPage(req, res, next);
    page.renderStatic(404, '404');
  })
  expressApp.use(errorMiddleware)

  app.writeScripts(store, config.get('public'), {}, function onWriteScripts(err) {
    cb(err, expressApp);
  });
}

function cookieMiddleware(config) {
  var session = require('express-session')
  var opts = {
    name: 'session.id',
    rolling: true,
    resave: true,
    saveUninitialized: true,
    secret: config.get('session.secret'),
    cookie: config.get('session.cookie'),
    proxy: config.get('session.proxy')
  }
  if (config.get('redis.enabled')) {
    var RedisStore = require('connect-redis')(session)
    opts.store = new RedisStore({
      host: config.get('redis.host'),
      port: config.get('redis.port'),
      pass: config.get('redis.password')
    });
  }
  return session(opts)
}

// without redis, session will be reset on every server restart
function sessionMiddleware(req, res, next) {
  var model = req.getModel()
  req.session.sid || (req.session.sid = model.id())
  model.set('$session.id', req.session.sid)
  next()
}

function errorMiddleware(err, req, res, next) {
  if (!err) return next()

  var message = err.message || err.toString();
  var status = parseInt(message);
  status = ((status >= 400) && (status < 600)) ? status : 500;

  if (status < 500) {
    console.log(err.message || err);
  } else {
    console.log(err.stack || err);
  }

  var page = errorApp.createPage(req, res, next);
  page.renderStatic(status, status.toString());
}

