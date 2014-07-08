var stylus = require('stylus');
var autoprefixer = require('autoprefixer-stylus');
var jeet = require('jeet');

module.exports = function(app) {
  app.styleExtensions.push('.styl');
  app.compilers['.styl'] = stylusCompiler;
};

function stylusCompiler(file, filename, options) {
  options || (options = {});
  options._imports || (options._imports = []);
  var out = {};
  stylus(file, options)
    .use(autoprefixer())
    .use(jeet())
    .set('filename', filename)
    .set('compress', options.compress)
    .set('include css', true)
    .render(function(err, value) {
      if (err) throw err;
      out.css = value;
    });
  out.files = options._imports.map(function(item) {
    return item.path;
  });
  out.files.push(filename);
  return out;
}
