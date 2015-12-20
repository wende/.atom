(function() {
  var DiffLine, DiffView, View, fmtNum,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('atom').View;

  DiffLine = (function(_super) {
    __extends(DiffLine, _super);

    function DiffLine() {
      return DiffLine.__super__.constructor.apply(this, arguments);
    }

    DiffLine.content = function(line) {
      return this.div({
        "class": "line " + line.type
      }, (function(_this) {
        return function() {
          _this.pre({
            "class": "lineno " + (!line.lineno ? 'invisible' : '')
          }, line.lineno);
          return _this.pre(line.text);
        };
      })(this));
    };

    return DiffLine;

  })(View);

  fmtNum = function(num) {
    return ("     " + (num || '') + " ").slice(-6);
  };

  module.exports = DiffView = (function(_super) {
    __extends(DiffView, _super);

    function DiffView() {
      return DiffView.__super__.constructor.apply(this, arguments);
    }

    DiffView.content = function() {
      return this.div({
        "class": 'diff'
      });
    };

    DiffView.prototype.clearAll = function() {
      this.find('>.line').remove();
    };

    DiffView.prototype.addAll = function(diffs) {
      this.clearAll();
      diffs.forEach((function(_this) {
        return function(diff) {
          var file, noa, nob;
          if ((file = diff['+++']) === '+++ /dev/null') {
            file = diff['---'];
          }
          _this.append(new DiffLine({
            type: 'heading',
            text: file
          }));
          noa = 0;
          nob = 0;
          diff.lines.forEach(function(line) {
            var atend, atstart, klass, linea, lineb, lineno, _ref;
            klass = '';
            lineno = void 0;
            if (/^@@ /.test(line)) {
              _ref = line.replace(/-|\+/g, '').split(' '), atstart = _ref[0], linea = _ref[1], lineb = _ref[2], atend = _ref[3];
              noa = parseInt(linea, 10);
              nob = parseInt(lineb, 10);
              klass = 'subtle';
            } else {
              lineno = "" + (fmtNum(noa)) + (fmtNum(nob));
              if (/^-/.test(line)) {
                klass = 'red';
                lineno = "" + (fmtNum(noa)) + (fmtNum(0));
                noa++;
              } else if (/^\+/.test(line)) {
                klass = 'green';
                lineno = "" + (fmtNum(0)) + (fmtNum(nob));
                nob++;
              } else {
                noa++;
                nob++;
              }
            }
            _this.append(new DiffLine({
              type: klass,
              text: line,
              lineno: lineno
            }));
          });
        };
      })(this));
    };

    return DiffView;

  })(View);

}).call(this);
