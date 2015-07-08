var d3 = require('d3');

module.exports = Explore;
function Explore() {}
Explore.prototype.name = 'explore';
Explore.prototype.view = __dirname;

Explore.prototype.init = function (model) {
  this.model.setNull('width', 1440);
  this.model.setNull('height', 755);
  this.model.setNull('beadIds', [
    '6b8bcfa5-8186-4014-840b-293b577f8353',
    '4f7f7c3f-f204-43ba-b5b0-11e2552a3822',
    'bd6b38f2-3753-463b-a88b-ac77c0d4a8df',
    'c325b208-449d-494e-8c4e-3026ffdb329f',
    'f11c214b-0c20-48e8-b4ba-13d160e36e38',
    '94ed4df9-900a-4c24-95d3-b966bba36135',
    '16b52788-6fde-449b-b2b5-466335cbef12',
    '46e97356-b17f-4f57-956a-94025d4af997',
    '0ee0b35c-1076-4915-9692-076bece8bfdf',
    '3351af07-4fbe-4a70-8ce4-608cbfe6ee17',
    '903491f6-e996-4b49-90f4-30754a2f703d',
    '039a77a9-877e-4e97-8445-effa5200835d',
    '10a4b243-c451-4226-9dbf-abf63a1ab8dc',
    'b5698776-73f5-4699-833d-799b4c5f158e',
    '289332c3-398a-4a63-b125-f92d7c0bd8ee',
    '2ce7334c-674d-428c-a0b8-94814615b789',
    '98d384b0-bc9c-40c1-9a3b-0530fd5853fc',
    'af057217-390c-488f-a060-0f0612e1ba45',
    '7f869ddc-6eb6-433f-9760-a437cd929e9d',
    '2d053ba8-035c-424b-bc3c-9527192c001c',
    '3d0084ab-cde8-4c48-b50d-9279d4b17ad8',
    '69be0e87-0e22-4c38-b011-010f151d9405',
    'db85d9dc-2e65-4d9d-a19c-e608e87af535',
    '2488b848-166e-4332-8b98-2b162f363be4'
  ]);
  this.draw();
}

Explore.prototype.create = function (model, dom) {
  dom.on('resize', window, this.setDimensions.bind(this));
  this.setDimensions();
}

Explore.prototype.setDimensions = function () {
  this.model.set('width', this.svg.clientWidth);
  this.model.set('height', this.svg.clientHeight);
  this.draw();
}

Explore.prototype.mousemove = function (event) {
  console.log(arguments);
  console.log(this);
}

Explore.prototype.click = function (bead) {
  if (!bead.get('active')) return bead.set('active', 'active');
  bead.del('active');
  bead.del('hover');
}

Explore.prototype.mouseover = function (bead) {
  bead.set('hover', 'hover')
}

Explore.prototype.mouseout = function (bead) {
  bead.del('hover')
}

Explore.prototype.draw = function () {
  var beads = [];
  var layout = this.defaultLayout();
  var polygons = this.voronoi();
  var radius = this.shortestDistance() * 0.9;
  var beadIds = this.model.get('beadIds');
  for (var i = 0; i < beadIds.length; i++) {
    beads.push({
      id: beadIds[i],
      cx: layout[i][0],
      cy: layout[i][1],
      r: radius,
      p: polygons[i]
    })
  }
  this.model.setDiff('beads', beads);
}

Explore.prototype.defaultLayout = function () {
  var size = 5;
  var center = Math.floor(size/2);
  var gridX = this.model.get('width') / size;
  var gridY = this.model.get('height') / size;
  var layout = [];

  for (var row = 0; row < size; row++) {
    for (var column = 0; column < size; column++) {
      if (row !== center || column !== center) {
        layout.push([
          (column + 0.5) * gridX,
          (row + 0.5) * gridY
        ])
      }
    }
  }
  return layout;
}

Explore.prototype.voronoi = function () {
  var layout = this.defaultLayout();
  var w = this.model.get('width');
  var h = this.model.get('height');
  return d3.geom.voronoi().clipExtent([[0,0],[w,h]])(layout).map(function(l){
    return l.map(function(c){
      return c.join(',')
    }).join(' ')
  })
}

Explore.prototype.shortestDistance = function () {
  var shortest = undefined;
  var layout = this.defaultLayout();
  var links = d3.geom.voronoi().links(layout);
  var d, dx, dy, s, t;
  for (var i = 0; i < links.length; i++) {
    s = links[i].source
    t = links[i].target
    dx = s[0] - t[0]
    dy = s[1] - t[1]
    d = Math.floor(Math.sqrt(dx*dx + dy*dy) / 2);
    shortest = shortest ? Math.min(d, shortest) : d
  }
  return shortest;
}
