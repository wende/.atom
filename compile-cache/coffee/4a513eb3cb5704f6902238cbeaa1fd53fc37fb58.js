(function() {
  var Point;

  Point = require('atom').Point;

  module.exports = {
    open: function(state) {
      return atom.workspace.open().then((function(_this) {
        return function(editor) {
          return _this.set(editor, state);
        };
      })(this));
    },
    set: function(editor, state) {
      var cursor, descriptor, descriptors, head, i, re, reversed, tail, _i, _j, _len, _len1, _ref;
      editor.setText(state);
      re = /\[(\d+)\]|\((\d+)\)/g;
      descriptors = [];
      editor.scan(re, function(hit) {
        var i;
        i = parseInt(hit.match[0].slice(1, 2), 10);
        if (descriptors[i] == null) {
          descriptors[i] = {};
        }
        if (hit.match[1] != null) {
          descriptors[i].head = hit.range.start;
        } else {
          descriptors[i].tail = hit.range.start;
        }
        return hit.replace('');
      });
      for (i = _i = 0, _len = descriptors.length; _i < _len; i = ++_i) {
        descriptor = descriptors[i];
        head = (descriptor || {}).head;
        if (!head) {
          throw "missing head of cursor " + i;
        }
        cursor = editor.getCursors()[i];
        if (!cursor) {
          cursor = editor.addCursorAtBufferPosition(head);
        } else {
          cursor.setBufferPosition(head);
        }
      }
      for (i = _j = 0, _len1 = descriptors.length; _j < _len1; i = ++_j) {
        descriptor = descriptors[i];
        _ref = descriptor || {}, head = _ref.head, tail = _ref.tail;
        if (tail) {
          cursor = editor.getCursors()[i];
          reversed = Point.min(head, tail) === head;
          cursor.selection.setBufferRange([head, tail], {
            reversed: reversed
          });
        }
      }
      return editor;
    },
    get: function(editor) {
      var buffer, column, cursor, ending, head, i, insertions, line, lineWithEnding, linesWithEndings, row, tail, text, _i, _j, _len, _len1, _ref, _ref1, _ref2, _ref3;
      buffer = editor.getBuffer();
      linesWithEndings = (function() {
        var _i, _ref, _results;
        _results = [];
        for (i = _i = 0, _ref = buffer.getLineCount(); 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
          _results.push([buffer.lineForRow(i), buffer.lineEndingForRow(i)]);
        }
        return _results;
      })();
      insertions = [];
      _ref = editor.getCursors();
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        cursor = _ref[i];
        head = cursor.marker.getHeadBufferPosition();
        tail = cursor.marker.getTailBufferPosition();
        insertions.push([head.row, head.column, "[" + i + "]"]);
        if (!head.isEqual(tail)) {
          insertions.push([tail.row, tail.column, "(" + i + ")"]);
        }
      }
      _ref1 = insertions.sort().reverse();
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        _ref2 = _ref1[_j], row = _ref2[0], column = _ref2[1], text = _ref2[2];
        _ref3 = linesWithEndings[row], line = _ref3[0], ending = _ref3[1];
        line = line.slice(0, column) + text + line.slice(column);
        linesWithEndings[row] = [line, ending];
      }
      return ((function() {
        var _k, _len2, _results;
        _results = [];
        for (_k = 0, _len2 = linesWithEndings.length; _k < _len2; _k++) {
          lineWithEnding = linesWithEndings[_k];
          _results.push(lineWithEnding.join(''));
        }
        return _results;
      })()).join('');
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvaXJhYXN0YS8uYXRvbS9wYWNrYWdlcy9hdG9taWMtZW1hY3Mvc3BlYy9lZGl0b3Itc3RhdGUuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLEtBQUE7O0FBQUEsRUFBQyxRQUFTLE9BQUEsQ0FBUSxNQUFSLEVBQVQsS0FBRCxDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsSUFBQSxFQUFNLFNBQUMsS0FBRCxHQUFBO2FBQ0osSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQUEsQ0FBcUIsQ0FBQyxJQUF0QixDQUEyQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxNQUFELEdBQUE7aUJBQ3pCLEtBQUMsQ0FBQSxHQUFELENBQUssTUFBTCxFQUFhLEtBQWIsRUFEeUI7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUEzQixFQURJO0lBQUEsQ0FBTjtBQUFBLElBV0EsR0FBQSxFQUFLLFNBQUMsTUFBRCxFQUFTLEtBQVQsR0FBQTtBQUNILFVBQUEsdUZBQUE7QUFBQSxNQUFBLE1BQU0sQ0FBQyxPQUFQLENBQWUsS0FBZixDQUFBLENBQUE7QUFBQSxNQUNBLEVBQUEsR0FBSyxzQkFETCxDQUFBO0FBQUEsTUFHQSxXQUFBLEdBQWMsRUFIZCxDQUFBO0FBQUEsTUFJQSxNQUFNLENBQUMsSUFBUCxDQUFZLEVBQVosRUFBZ0IsU0FBQyxHQUFELEdBQUE7QUFDZCxZQUFBLENBQUE7QUFBQSxRQUFBLENBQUEsR0FBSSxRQUFBLENBQVMsR0FBRyxDQUFDLEtBQU0sQ0FBQSxDQUFBLENBQUUsQ0FBQyxLQUFiLENBQW1CLENBQW5CLEVBQXNCLENBQXRCLENBQVQsRUFBbUMsRUFBbkMsQ0FBSixDQUFBOztVQUNBLFdBQVksQ0FBQSxDQUFBLElBQU07U0FEbEI7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

//# sourceURL=/home/iraasta/.atom/packages/atomic-emacs/spec/editor-state.coffee
