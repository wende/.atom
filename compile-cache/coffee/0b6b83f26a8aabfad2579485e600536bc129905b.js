(function() {
  var $, PATH_REGEX, Point, fs, path;

  fs = require('fs');

  path = require('path');

  Point = require('atom').Point;

  $ = require('atom-space-pen-views').$;

  PATH_REGEX = /((?:\w:)?[^:\s\(\)]+):(\d+):(\d+)/g;

  module.exports.link = function(line) {
    if (line == null) {
      return null;
    }
    return line.replace(PATH_REGEX, '<a class="flink">$&</a>');
  };

  module.exports.attachClickHandler = function() {
    return $(document).on('click', '.flink', module.exports.clicked);
  };

  module.exports.removeClickHandler = function() {
    return $(document).off('click', '.flink', module.exports.clicked);
  };

  module.exports.clicked = function() {
    var extendedPath;
    extendedPath = this.innerHTML;
    return module.exports.open(extendedPath);
  };

  module.exports.open = function(extendedPath) {
    var col, filename, parts, projectPath, row, _ref, _ref1;
    parts = PATH_REGEX.exec(extendedPath);
    if (parts == null) {
      return;
    }
    _ref = parts.slice(1), filename = _ref[0], row = _ref[1], col = _ref[2];
    if (filename == null) {
      return;
    }
    projectPath = (_ref1 = atom.project) != null ? _ref1.getPath() : void 0;
    if (projectPath != null) {
      filename = path.resolve(projectPath, filename);
    }
    if (!fs.existsSync(filename)) {
      alert("File not found: " + filename);
      return;
    }
    return atom.workspace.open(filename).then(function() {
      var editor, position;
      if (row == null) {
        return;
      }
      row = Math.max(row - 1, 0);
      col = Math.max(~~col - 1, 0);
      position = new Point(row, col);
      editor = atom.workspace.getActiveTextEditor();
      if (editor == null) {
        return;
      }
      editor.scrollToBufferPosition(position, {
        center: true
      });
      return editor.setCursorBufferPosition(position);
    });
  };

}).call(this);
