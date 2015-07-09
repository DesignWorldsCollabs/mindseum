var d3 = require('d3');

module.exports = Board;
function Board() {}
Board.prototype.name = 'board';
Board.prototype.view = __dirname;

Board.prototype.init = function (model) {
  this.model.setNull('width', this.model.get('layout.width'));
  this.model.setNull('height', this.model.get('layout.height'));
  this.model.start('stretch', 'width', 'height', 'layout.width', 'layout.height', calculateStretch);
  this.model.start('points', 'stretch', 'layout.beads', pluckPoints);
  this.model.start('radius', 'points', calculateRadius);
  this.model.start('beads', 'points', 'radius', 'layout.beads', drawBeads);
  this.model.start('patterns', 'beads', drawPatterns);
  this.model.start('polygons', 'width', 'height', 'points', 'layout.beads', drawPolygons);
  function calculateStretch(w, h, lw, lh) {
    return {
      x: w / lw,
      y: h / lh
    }
  }
  function pluckPoints(stretch, beads) {
    return beads.map(function each(bead) {
      return [bead.x * stretch.x, bead.y * stretch.y]
    })
  }
  function calculateRadius(layout) {
    var shortest = undefined;
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
    return shortest - 2;
  }
  function drawBeads(points, radius, beads) {
    return beads.map(function each(bead, i) {
      return {
        id: bead.id,
        cx: points[i][0],
        cy: points[i][1],
        r: radius
      }
    });
  }
  function drawPatterns(beads) {
    return beads.map(function each(bead, i) {
      return {
        id: bead.id,
        x: bead.cx - bead.r,
        y: bead.cy - bead.r,
        width: bead.r * 2,
        height: bead.r * 2,
        cx: bead.cx,
        cy: bead.cy,
        r: bead.r
      }
    });
  }
  function drawPolygons(w, h, layout, beads) {
    return d3.geom.voronoi().clipExtent([[0,0],[w,h]])(layout).map(function(l, i){
      return {
        id: beads[i].id,
        points: l.map(function(c){
          return c.join(',')
        }).join(' ')
      }
    })
  }
}

Board.prototype.create = function (model, dom) {
  dom.on('touchstart', this.svg, this.touch.bind(this));
  dom.on('touchmove', this.svg, this.touch.bind(this));
  dom.on('touchend', this.svg, this.touch.bind(this));
  dom.on('resize', window, this.resize.bind(this));
  this.resize();
}

Board.prototype.touch = function (evt) {
  if (evt.preventDefault) evt.preventDefault();
  if (evt.type === 'touchend' && this.touchId) {
    this.click(this.touchId);
    delete this.touchId;
  }
  if (evt.type === 'touchend') return this.model.del('hover');
  var x = evt.touches[0].clientX;
  var y = evt.touches[0].clientY;
  var el = document.elementFromPoint(x, y);
  if (el && el.id) this.touchId = el.id;
  if (this.touchId) return this.model.set('hover', el.id);
  this.model.del('hover');
}

Board.prototype.resize = function () {
  if (!this.svg) return;
  var rect = this.svg.getBoundingClientRect();
  this.model.set('width', rect.width);
  this.model.set('height', rect.height);
}

Board.prototype.url = function (id) {
  return this.model.scope('$render.url').get() + '/' + id
}

Board.prototype.active = function (connections, beadId) {
  if (connections.indexOf(beadId) !== -1) return 'active';
  return '';
}

Board.prototype.click = function (id) {
  this.model.del('hover')
  this.model.set('preview', id);
  if (this.model.at('connections').get().indexOf(id) === -1)
    this.preview.show();
}

Board.prototype.hovered = function (hover, id) {
  if (hover === id) return 'hover'
  return '';
}

Board.prototype.mouseover = function (id) {
  this.model.set('hover', id)
}

Board.prototype.mouseout = function (id) {
  this.model.del('hover')
}
