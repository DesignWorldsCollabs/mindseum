module.exports = Associate
function Associate() {}
Associate.prototype.name = 'associate';
Associate.prototype.view = __dirname;

Associate.prototype.init = function () {
  this.model.ref('offset', this.model.scope('_page.offset'));
  this.model.ref('clippings', this.model.scope('_page.clippings'));
  this.model.start('count', 'clippings', countClippings);

  function countClippings(clippings) {
    return (clippings || []).length;
  }
}

Associate.prototype.prevOffset = function (offset) {
  offset--;
  if (-1 < offset) return offset+'';
}

Associate.prototype.nextOffset = function (offset) {
  offset++;
  if (offset < this.model.get('count')) return offset+'';
}
