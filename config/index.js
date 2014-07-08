var convict = require('convict');
var path = require('path');
var url = require('url');
var check = require('convict/node_modules/validator').check

module.exports.generate = function generate(options) {
  envAlias('MONGOHQ_URL', 'MONGO_URL');
  envAlias('MONGOLAB_URI', 'MONGO_URL');

  envAlias('OPENREDIS_URL', 'REDIS_URL');
  envAlias('REDISTOGO_URL', 'REDIS_URL');
  envAlias('REDISCLOUD_URL', 'REDIS_URL');

  var config = convict({
    env: {
      doc: 'The application environment',
      format: [
        'development',
        'test',
        'production'
      ],
      default: 'development',
      env: 'NODE_ENV'
    },
    port: {
      doc: 'The ipv4 address to bind.',
      format: 'port',
      default: 3000,
      env: 'PORT'
    },
    ip: {
      doc: 'The ipv4 address to bind.',
      format: 'ipaddress',
      default: '0.0.0.0',
      env: 'IP'
    },
    public: {
      doc: 'The writeScripts folder to serve app bundles.',
      default: path.resolve('public')
    },
    static: {
      doc: 'The folders express.static should serve.',
      format: mountPoints,
      default: []
    },
    mongo: {
      url: {
        format: mongoUrl,
        default: undefined,
        env: 'MONGO_URL'
      },
      host: {
        format: String,
        default: 'localhost',
        env: 'MONGO_HOST'
      },
      port: {
        format: 'port',
        default: 27017,
        env: 'MONGO_PORT'
      },
      db: {
        format: String,
        default: undefined,
        env: 'MONGO_DB'
      },
      opts: {
        safe: {
          format: Boolean,
          default: true,
          env: 'MONGO_SAFE'
        }
      }
    },
    redis: {
      enabled: {
        doc: 'Livedb will use the redisDriver when true and the inprocessDriver when false.',
        format: Boolean,
        default: false,
        env: 'REDIS_ENABLED'
      },
      url: {
        // format: 'url',
        format: String,
        default: undefined,
        env: 'REDIS_URL'
      },
      host: {
        format: String,
        default: '127.0.0.1',
        env: 'REDIS_HOST'
      },
      port: {
        format: 'port',
        default: 6379,
        env: 'REDIS_PORT'
      },
      password: {
        format: optionalSecret(16),
        default: undefined,
        env: 'REDIS_PASSWORD'
      },
      options: {
        format: Object,
        default: {'no_ready_check': true}
      },
      db: {
        format: 'int',
        default: 0,
        env: 'REDIS_DB'
      }
    },
    session: {
      secret: {
        doc: 'Secret used to sign the session cookie',
        format: secret(16),
        default: undefined,
        env: 'SESSION_SECRET'
      },
      cookie: {
        maxAge: {
          default: 365 * 24 * 60 * 60 * 1000
        },
        httpOnly: {
          default: true
        },
        secure: {
          default: false
        }
      },
      proxy: {
        doc: 'trust the reverse proxy x-forwarded-proto',
        default: false
      }
    }
  });

  if (options) config.load(options);
  config.loadFile(path.join(__dirname, config.get('env') + '.json'));

  if (config.has('mongo.url') === false) setMongoUrl(config);
  if (config.has('redis.url') === true) parseRedisUrl(config);
  mountPublic(config);

  config.validate();
  return config;
}

function mountPublic(config) {
  var s = config.get('static');
  var p = config.get('public');
  if (s.map(extractDir).indexOf(p) === -1) {
    s.unshift({route: '/', dir: p});
    config.set('static', s)
  }
}

function extractDir(mount) {
  return mount.dir
}

function staticFolders(config) {
  config.get()
}

function setMongoUrl(config) {
  var m = config.get('mongo');
  config.set('mongo.url', 'mongodb://' + m.host + ':' + m.port + '/' + m.db);
}

function parseRedisUrl(config) {
  var r = url.parse(config.get('redis.url'))
  config.set('redis.host', r.hostname)
  config.set('redis.port', r.port)
  config.set('redis.password', r.auth.split(':')[1])
}

function secret(length) {
  return function (val) {
    check(val).notEmpty().len(length);
  }
}

function optionalSecret(length) {
  return function (val) {
    if (val) secret(length)(val);
  }
}

function checkUrl(protocol, attributes) {
  return function (val) {
    var u = url.parse(val);
    check(u.protocol, 'Wrong protocol.').equals(protocol)
    attributes.forEach(function (attr) {
      check(u[attr]).notEmpty()
    })
  }
}

function mongoUrl(val) {
  checkUrl('mongodb:', ['hostname','port','path'])(val)
}

function envAlias(source, target) {
  if (process.env[source]) process.env[target] = process.env[source];
}

function mountPoints(val) {
  val.forEach(function (el) {
    check(el.route).contains('/');
    check(el.dir).notEmpty();
  })
}

