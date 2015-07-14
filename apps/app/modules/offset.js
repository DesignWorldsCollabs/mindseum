module.exports.load = load

function load() {
  var offset = (this.params || {}).offset;
  if (!offset) offset = 0;
  this.model.set('_page.offset', offset);
}

