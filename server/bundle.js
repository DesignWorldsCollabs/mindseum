if (process.env.NEW_RELIC_LICENSE_KEY) require('newrelic');
var async = require('async');
var derby = require('derby');

var http  = require('http');
var chalk = require('chalk');
var path = require('path');

var fs = require('fs');
var publicDir = path.resolve(__dirname, '../public');
var manifest = path.resolve(publicDir, 'derby/manifest.json');

module.exports = bundle;

function bundle(serve) {
  if (typeof serve !== 'function') serve = function () {};

  require('coffee-script/register');
  require('yamlify/register');

  require('./config');

  var apps = [
    require('../apps/app')
    // <end of app list> - don't remove this comment
  ];

  var express = require('./express');
  var store = require('./store')(derby, publicDir);

  var error = require('./error');

  express(store, apps, error, publicDir, function(expressApp, upgrade){
    var server = http.createServer(expressApp);

    server.on('upgrade', upgrade);

    async.each(apps, bundleApp, function(){
      serve(server);
    });

    function bundleApp (app, cb) {
      if (process.env.NODE_ENV === 'production') {
        try {
          var m = require(manifest);
          for (var k in m) {
            app[k] = m[k];
          }
          return cb();
        } catch (err) {
        }
      }
      app.writeScripts(store, publicDir, {extensions: ['.coffee']}, function(err){
        if (err) {
          console.log('Bundle failure:', chalk.red(app.name), ', error:', err);
          cb();
        } else {
          console.log('Bundle created:', chalk.blue(app.name));
          fs.writeFile(manifest, JSON.stringify({
            scriptUrl: app.scriptUrl,
            scriptFilename: app.scriptFilename,
            scriptMapUrl: app.scriptMapUrl,
            scriptMapFilename: app.scriptMapFilename
          }, null, 2), cb)
        }
      });
    }

  });
}
