var ptyjs = require('pty.js');
var Terminal = require('term.js');
var debounce = require('debounce');
var util = require('util');
var $ = require('atom-space-pen-views').$;
var View = require('atom-space-pen-views').View;
var path = require('path');
var keypather = require('keypather')();
var os = require('os');
// var EventEmitter = require('events').EventEmitter;
var __hasProp = ({}).hasOwnProperty;
var __extends = function __extends(child, parent) {
  for (var key in parent) {
    if (__hasProp.call(parent, key)) child[key] = parent[key];
  }function ctor() {
    this.constructor = child;
  }ctor.prototype = parent.prototype;child.prototype = new ctor();child.__super__ = parent.prototype;return child;
};
var last = function last(str) {
  return str[str.length - 1];
};

module.exports = TermView;

function TermView(opts) {
  opts = opts || {};
  this.opts = opts;
  opts.shell = process.env.SHELL || 'bash';
  var editorPath = keypather.get(atom, 'workspace.getEditorViews[0].getEditor().getPath()');
  opts.cwd = opts.cwd || atom.project.getPaths()[0] || editorPath || process.env.HOME || path.resolve(__dirname, '..', '..', '..', '..'); // back out of .atom/packages/term/lib
  TermView.__super__.constructor.apply(this, arguments);
}

// util.inherits(TermView, EventEmitter);
__extends(TermView, View);

TermView.content = function () {
  return this.div({ 'class': 'term' });
};

TermView.prototype.initialize = function (state) {
  this.state = state;
  var opts = this.opts;
  var dims = this.getDimensions();
  var pty = this.pty = ptyjs.spawn(opts.shell, [], {
    name: 'xterm-color',
    cols: dims.cols,
    rows: dims.rows,
    cwd: opts.cwd,
    env: process.env
  });
  var term = this.term = new Terminal({
    cols: dims.cols,
    rows: dims.rows,
    useStyle: true,
    screenKeys: true
  });
  term.on('data', pty.write.bind(pty));
  term.open(this[0]);
  if (this.opts.runCommand) {
    pty.write(this.opts.runCommand + os.EOL);
  }
  pty.pipe(term);
  term.end = this.destroy.bind(this);
  term.focus();

  this.attachEvents();

  window.term = term;
  window.pty = pty;
};

TermView.prototype.getTitle = function () {
  return '(' + last(this.opts.shell.split('/')) + ')';
};

TermView.prototype.attachEvents = function () {
  this.resizeToPane = this.resizeToPane.bind(this);
  this.attachResizeEvents();
};

TermView.prototype.attachResizeEvents = function () {
  // call immediately (after timeout) for initial sizing
  var self = this;
  setTimeout(function () {
    self.resizeToPane.bind(self);
  }, 10);

  // focus
  this.on('focus', this.resizeToPane);
  var parentPane = atom.workspace.getActivePane();
  // atom missing: no item-activated event :-/, use interval for now
  // parentPane.on('item-activated', function (item) {
  //   if (item === self) self.resizeToPane();
  // });
  this.resizeInterval = setInterval(this.resizeToPane.bind(this), 50);
  // resize
  var resizeHandlers = this.resizeHandlers = [debounce(this.resizeToPane, 10)];
  if (window.onresize) {
    resizeHandlers.push(window.onresize);
  }
  window.onresize = function (evt) {
    resizeHandlers.forEach(function (handler) {
      handler(evt);
    });
  };
};

TermView.prototype.detachResizeEvents = function () {
  window.onresize = this.resizeHandlers.pop();
  this.off('focus', this.resizeToPane);
  this.resizeHandlers = [];
  clearInterval(this.resizeInterval);
};

TermView.prototype.resizeToPane = function () {
  var dims = this.getDimensions();
  if (this.term.rows === dims.rows && this.term.cols === dims.cols) return; // no change
  this.pty.resize(dims.cols, dims.rows);
  this.term.resize(dims.cols, dims.rows);
};

TermView.prototype.getDimensions = function () {
  var term = this.term;
  var colSize = term ? this.find('.terminal').width() / term.cols : 7; // default is 7
  var rowSize = term ? this.find('.terminal').height() / term.rows : 15; // default is 15
  var cols = this.width() / colSize | 0;
  var rows = this.height() / rowSize | 0;

  return {
    cols: cols,
    rows: rows
  };
};

TermView.prototype.destroy = function () {
  // this.eventElement.trigger('remove');
  this.detachResizeEvents();
  this.pty.destroy();
  this.term.destroy();
  // atom bug: closes all panes
  // atom.workspace.getActivePane().destroyActiveItem();
  var parentPane = atom.workspace.getActivePane();
  if (parentPane.activeItem === this) {
    parentPane.removeItem(parentPane.activeItem);
  }
  this.detach();
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2lyYWFzdGEvLmF0b20vcGFja2FnZXMvdGVybS9saWIvVGVybVZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzlCLElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNsQyxJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDbkMsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzNCLElBQUksQ0FBQyxHQUFHLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMxQyxJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxJQUFJLENBQUM7QUFDaEQsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzNCLElBQUksU0FBUyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDO0FBQ3ZDLElBQUksRUFBRSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFdkIsSUFBSSxTQUFTLEdBQUcsQ0FBQSxHQUFFLENBQUMsY0FBYyxDQUFDO0FBQ2xDLElBQUksU0FBUyxHQUFHLFNBQVosU0FBUyxDQUFZLEtBQUssRUFBRSxNQUFNLEVBQUU7QUFBRSxPQUFLLElBQUksR0FBRyxJQUFJLE1BQU0sRUFBRTtBQUFFLFFBQUksU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLEVBQUUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztHQUFFLEFBQUMsU0FBUyxJQUFJLEdBQUc7QUFBRSxRQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztHQUFFLEFBQUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLEFBQUMs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LFVBQVUsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUM7R0FDOUM7QUFDRCxNQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7Q0FDZixDQUFDIiwiZmlsZSI6Ii9ob21lL2lyYWFzdGEvLmF0b20vcGFja2FnZXMvdGVybS9saWIvVGVybVZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgcHR5anMgPSByZXF1aXJlKCdwdHkuanMnKTtcbnZhciBUZXJtaW5hbCA9IHJlcXVpcmUoJ3Rlcm0uanMnKTtcbnZhciBkZWJvdW5jZSA9IHJlcXVpcmUoJ2RlYm91bmNlJyk7XG52YXIgdXRpbCA9IHJlcXVpcmUoJ3V0aWwnKTtcbnZhciAkID0gcmVxdWlyZSgnYXRvbS1zcGFjZS1wZW4tdmlld3MnKS4kO1xudmFyIFZpZXcgPSByZXF1aXJlKCdhdG9tLXNwYWNlLXBlbi12aWV3cycpLlZpZXc7XG52YXIgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcbnZhciBrZXlwYXRoZXIgPSByZXF1aXJlKCdrZXlwYXRoZXInKSgpO1xudmFyIG9zID0gcmVxdWlyZSgnb3MnKTtcbi8vIHZhciBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKCdldmVudHMnKS5FdmVudEVtaXR0ZXI7XG52YXIgX19oYXNQcm9wID0ge30uaGFzT3duUHJvcGVydHk7XG52YXIgX19leHRlbmRzID0gZnVuY3Rpb24oY2hpbGQsIHBhcmVudCkgeyBmb3IgKHZhciBrZXkgaW4gcGFyZW50KSB7IGlmIChfX2hhc1Byb3AuY2FsbChwYXJlbnQsIGtleSkpIGNoaWxkW2tleV0gPSBwYXJlbnRba2V5XTsgfSBmdW5jdGlvbiBjdG9yKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7IH0gY3Rvci5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlOyBjaGlsZC5wcm90b3R5cGUgPSBuZXcgY3RvcigpOyBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlOyByZXR1cm4gY2hpbGQ7IH07XG52YXIgbGFzdCA9IGZ1bmN0aW9uIChzdHIpIHtcbiAgcmV0dXJuIHN0cltzdHIubGVuZ3RoLTFdO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBUZXJtVmlldztcblxuZnVuY3Rpb24gVGVybVZpZXcgKG9wdHMpIHtcbiAgb3B0cyA9IG9wdHMgfHwge307XG4gIHRoaXMub3B0cyA9IG9wdHM7XG4gIG9wdHMuc2hlbGwgPSBwcm9jZXNzLmVudi5TSEVMTCB8fCAnYmFzaCc7XG4gIHZhciBlZGl0b3JQYXRoID0ga2V5cGF0aGVyLmdldChhdG9tLCAnd29ya3NwYWNlLmdldEVkaXRvclZpZXdzWzBdLmdldEVkaXRvcigpLmdldFBhdGgoKScpO1xuICBvcHRzLmN3ZCA9IG9wdHMuY3dkIHx8IGF0b20ucHJvamVjdC5nZXRQYXRocygpWzBdIHx8XG4gICAgZWRpdG9yUGF0aCB8fCBwcm9jZXNzLmVudi5IT01FIHx8XG4gICAgcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4uJywgJy4uJywgJy4uJywgJy4uJyk7IC8vIGJhY2sgb3V0IG9mIC5hdG9tL3BhY2thZ2VzL3Rlcm0vbGliXG4gIFRlcm1WaWV3Ll9fc3VwZXJfXy5jb25zdHJ1Y3Rvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufVxuXG4vLyB1dGlsLmluaGVyaXRzKFRlcm1WaWV3LCBFdmVudEVtaXR0ZXIpO1xuX19leHRlbmRzKFRlcm1WaWV3LCBWaWV3KTtcblxuVGVybVZpZXcuY29udGVudCA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRoaXMuZGl2KHsgY2xhc3M6ICd0ZXJtJyB9KTtcbn07XG5cblRlcm1WaWV3LnByb3RvdHlwZS5pbml0aWFsaXplID0gZnVuY3Rpb24gKHN0YXRlKSB7XG4gIHRoaXMuc3RhdGUgPSBzdGF0ZTtcbiAgdmFyIG9wdHMgPSB0aGlzLm9wdHM7XG4gIHZhciBkaW1zID0gdGhpcy5nZXREaW1lbnNpb25zKCk7XG4gIHZhciBwdHkgPSB0aGlzLnB0eSA9IHB0eWpzLnNwYXduKG9wdHMuc2hlbGwsIFtdLCB7XG4gICAgbmFtZTogJ3h0ZXJtLWNvbG9yJyxcbiAgICBjb2xzOiBkaW1zLmNvbHMsXG4gICAgcm93czogZGltcy5yb3dzLFxuICAgIGN3ZDogb3B0cy5jd2QsXG4gICAgZW52OiBwcm9jZXNzLmVudlxuICB9KTtcbiAgdmFyIHRlcm0gPSB0aGlzLnRlcm0gPSBuZXcgVGVybWluYWwoe1xuICAgIGNvbHM6IGRpbXMuY29scyxcbiAgICByb3dzOiBkaW1zLnJvd3MsXG4gICAgdXNlU3R5bGU6IHRydWUsXG4gICAgc2NyZWVuS2V5czogdHJ1ZSxcbiAgfSk7XG4gIHRlcm0ub24oJ2RhdGEnLCBwdHkud3JpdGUuYmluZChwdHkpKTtcbiAgdGVybS5vcGVuKHRoaXNbMF0pO1xuICBpZiAodGhpcy5vcHRzLnJ1bkNvbW1hbmQpIHtcbiAgICBwdHkud3JpdGUodGhpcy5vcHRzLnJ1bkNvbW1hbmQgKyBvcy5FT0wpO1xuICB9XG4gIHB0eS5waXBlKHRlcm0pO1xuICB0ZXJtLmVuZCA9IHRoaXMuZGVzdHJveS5iaW5kKHRoaXMpO1xuICB0ZXJtLmZvY3VzKCk7XG5cbiAgdGhpcy5hdHRhY2hFdmVudHMoKTtcblxuICB3aW5kb3cudGVybSA9IHRlcm07XG4gIHdpbmRvdy5wdHkgPSBwdHk7XG59O1xuXG5UZXJtVmlldy5wcm90b3R5cGUuZ2V0VGl0bGUgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiAnKCcgKyBsYXN0KHRoaXMub3B0cy5zaGVsbC5zcGxpdCgnLycpKSArICcpJztcbn07XG5cblRlcm1WaWV3LnByb3RvdHlwZS5hdHRhY2hFdmVudHMgPSBmdW5jdGlvbiAoKSB7XG4gIHRoaXMucmVzaXplVG9QYW5lID0gdGhpcy5yZXNpemVUb1BhbmUuYmluZCh0aGlzKTtcbiAgdGhpcy5hdHRhY2hSZXNpemVFdmVudHMoKTtcbn07XG5cblRlcm1WaWV3LnByb3RvdHlwZS5hdHRhY2hSZXNpemVFdmVudHMgPSBmdW5jdGlvbiAoKSB7XG4gIC8vIGNhbGwgaW1tZWRpYXRlbHkgKGFmdGVyIHRpbWVvdXQpIGZvciBpbml0aWFsIHNpemluZ1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgIHNlbGYucmVzaXplVG9QYW5lLmJpbmQoc2VsZik7XG4gIH0sIDEwKTtcblxuICAvLyBmb2N1c1xuICB0aGlzLm9uKCdmb2N1cycsIHRoaXMucmVzaXplVG9QYW5lKTtcbiAgdmFyIHBhcmVudFBhbmUgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lKCk7XG4gIC8vIGF0b20gbWlzc2luZzogbm8gaXRlbS1hY3RpdmF0ZWQgZXZlbnQgOi0vLCB1c2UgaW50ZXJ2YWwgZm9yIG5vd1xuICAvLyBwYXJlbnRQYW5lLm9uKCdpdGVtLWFjdGl2YXRlZCcsIGZ1bmN0aW9uIChpdGVtKSB7XG4gIC8vICAgaWYgKGl0ZW0gPT09IHNlbGYpIHNlbGYucmVzaXplVG9QYW5lKCk7XG4gIC8vIH0pO1xuICB0aGlzLnJlc2l6ZUludGVydmFsID0gc2V0SW50ZXJ2YWwodGhpcy5yZXNpemVUb1BhbmUuYmluZCh0aGlzKSwgNTApO1xuICAvLyByZXNpemVcbiAgdmFyIHJlc2l6ZUhhbmRsZXJzID0gdGhpcy5yZXNpemVIYW5kbGVycyA9IFtkZWJvdW5jZSh0aGlzLnJlc2l6ZVRvUGFuZSwgMTApXTtcbiAgaWYgKHdpbmRvdy5vbnJlc2l6ZSkge1xuICAgIHJlc2l6ZUhhbmRsZXJzLnB1c2god2luZG93Lm9ucmVzaXplKTtcbiAgfVxuICB3aW5kb3cub25yZXNpemUgPSBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgcmVzaXplSGFuZGxlcnMuZm9yRWFjaChmdW5jdGlvbiAoaGFuZGxlcikge1xuICAgICAgaGFuZGxlcihldnQpO1xuICAgIH0pO1xuICB9O1xufTtcblxuVGVybVZpZXcucHJvdG90eXBlLmRldGFjaFJlc2l6ZUV2ZW50cyA9IGZ1bmN0aW9uICgpIHtcbiAgd2luZG93Lm9ucmVzaXplID0gdGhpcy5yZXNpemVIYW5kbGVycy5wb3AoKTtcbiAgdGhpcy5vZmYoJ2ZvY3VzJywgdGhpcy5yZXNpemVUb1BhbmUpO1xuICB0aGlzLnJlc2l6ZUhhbmRsZXJzID0gW107XG4gIGNsZWFySW50ZXJ2YWwodGhpcy5yZXNpemVJbnRlcnZhbCk7XG59O1xuXG5UZXJtVmlldy5wcm90b3R5cGUucmVzaXplVG9QYW5lID0gZnVuY3Rpb24gKCkge1xuICB2YXIgZGltcyA9IHRoaXMuZ2V0RGltZW5zaW9ucygpO1xuICBpZiAodGhpcy50ZXJtLnJvd3MgPT09IGRpbXMucm93cyAmJiB0aGlzLnRlcm0uY29scyA9PT0gZGltcy5jb2xzKSByZXR1cm47IC8vIG5vIGNoYW5nZVxuICB0aGlzLnB0eS5yZXNpemUoZGltcy5jb2xzLCBkaW1zLnJvd3MpO1xuICB0aGlzLnRlcm0ucmVzaXplKGRpbXMuY29scywgZGltcy5yb3dzKTtcbn07XG5cblRlcm1WaWV3LnByb3RvdHlwZS5nZXREaW1lbnNpb25zID0gZnVuY3Rpb24gKCkge1xuICB2YXIgdGVybSA9IHRoaXMudGVybTtcbiAgdmFyIGNvbFNpemUgPSB0ZXJtID8gdGhpcy5maW5kKCcudGVybWluYWwnKS53aWR0aCgpIC8gdGVybS5jb2xzIDogNzsgLy8gZGVmYXVsdCBpcyA3XG4gIHZhciByb3dTaXplID0gdGVybSA/IHRoaXMuZmluZCgnLnRlcm1pbmFsJykuaGVpZ2h0KCkgLyB0ZXJtLnJvd3MgOiAxNTsgLy8gZGVmYXVsdCBpcyAxNVxuICB2YXIgY29scyA9IHRoaXMud2lkdGgoKSAgLyBjb2xTaXplIHwgMDtcbiAgdmFyIHJvd3MgPSB0aGlzLmhlaWdodCgpIC8gcm93U2l6ZSB8IDA7XG5cbiAgcmV0dXJuIHtcbiAgICBjb2xzOiBjb2xzLFxuICAgIHJvd3M6IHJvd3NcbiAgfTtcbn07XG5cblRlcm1WaWV3LnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24gKCkge1xuICAvLyB0aGlzLmV2ZW50RWxlbWVudC50cmlnZ2VyKCdyZW1vdmUnKTtcbiAgdGhpcy5kZXRhY2hSZXNpemVFdmVudHMoKTtcbiAgdGhpcy5wdHkuZGVzdHJveSgpO1xuICB0aGlzLnRlcm0uZGVzdHJveSgpO1xuICAvLyBhdG9tIGJ1ZzogY2xvc2VzIGFsbCBwYW5lc1xuICAvLyBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lKCkuZGVzdHJveUFjdGl2ZUl0ZW0oKTtcbiAgdmFyIHBhcmVudFBhbmUgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lKCk7XG4gIGlmIChwYXJlbnRQYW5lLmFjdGl2ZUl0ZW0gPT09IHRoaXMpIHtcbiAgICBwYXJlbnRQYW5lLnJlbW92ZUl0ZW0ocGFyZW50UGFuZS5hY3RpdmVJdGVtKTtcbiAgfVxuICB0aGlzLmRldGFjaCgpO1xufTtcbiJdfQ==