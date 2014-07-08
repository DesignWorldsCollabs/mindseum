module.exports = createStore

function createStore(derby, config) {
  var storeOpts = {};
  var db = require('livedb-mongo')(
    config.get('mongo.url') + '?auto_reconnect',
    config.get('mongo.opts')
  )
  if (config.get('redis.enabled')) {
    var rc = redisClient(config)
    var ro = redisClient(config)
    var driver = require('livedb').redisDriver(db, rc, ro)
    storeOpts.backend = require('livedb').client({
      db: db,
      driver: driver
    })
  } else {
    storeOpts.db = db
  }
  return derby.createStore(storeOpts);
}

function redisClient(config) {
  var redis = require('redis').createClient(
    config.get('redis.port'),
    config.get('redis.host'),
    config.get('redis.options')
  )
  if (config.has('redis.password') === true) redis.auth(config.get('redis.password'))
  return redis
}

