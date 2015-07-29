if (process.env.NODE_ENV !== 'production') return

var bundle = require('./server/bundle')(bundled);

function bundled() {
  process.exit();
}
