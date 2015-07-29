if (process.env.NEW_RELIC_LICENSE_KEY) require('newrelic');
var derby = require('derby');
var bundle = require('./server/bundle');

derby.run(runner);

function runner() {
  bundle(serve);
}

function serve(server) {
  server.listen(process.env.PORT, function() {
    console.log('%d listening. Go to: http://localhost:%d/',
        process.pid, process.env.PORT);
  });
}
