(function() {
  var findFile, log, moveToLine, moveToNextMessage, moveToPreviousMessage, warn,
    __slice = [].slice;

  findFile = require('./util');

  log = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    if (atom.config.get('linter.lintDebug')) {
      return console.log.apply(console, args);
    }
  };

  warn = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    if (atom.config.get('linter.lintDebug')) {
      return console.warn.apply(console, args);
    }
  };

  moveToPreviousMessage = function(messages, editor) {
    var cursorLine, lastLine, line, previousLine, _i, _len, _ref;
    cursorLine = editor.getCursorBufferPosition().row + 1;
    previousLine = -1;
    lastLine = -1;
    _ref = messages != null ? messages : [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      line = _ref[_i].line;
      if (line < cursorLine) {
        previousLine = Math.max(line - 1, previousLine);
      }
      lastLine = Math.max(line - 1, lastLine);
    }
    if (previousLine === -1) {
      previousLine = lastLine;
    }
    return moveToLine(editor, previousLine);
  };

  moveToNextMessage = function(messages, editor) {
    var cursorLine, firstLine, line, nextLine, _i, _len, _ref;
    cursorLine = editor.getCursorBufferPosition().row + 1;
    nextLine = null;
    firstLine = null;
    _ref = messages != null ? messages : [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      line = _ref[_i].line;
      if (line > cursorLine) {
        if (nextLine == null) {
          nextLine = line - 1;
        }
        nextLine = Math.min(line - 1, nextLine);
      }
      if (firstLine == null) {
        firstLine = line - 1;
      }
      firstLine = Math.min(line - 1, firstLine);
    }
    if (nextLine == null) {
      nextLine = firstLine;
    }
    return moveToLine(editor, nextLine);
  };

  moveToLine = function(editor, n) {
    if (n == null) {
      n = -1;
    }
    if (n >= 0) {
      editor.setCursorBufferPosition([n, 0]);
      return editor.moveToFirstCharacterOfLine();
    }
  };

  module.exports = {
    log: log,
    warn: warn,
    findFile: findFile,
    moveToPreviousMessage: moveToPreviousMessage,
    moveToNextMessage: moveToNextMessage
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHlFQUFBO0lBQUEsa0JBQUE7O0FBQUEsRUFBQSxRQUFBLEdBQVcsT0FBQSxDQUFRLFFBQVIsQ0FBWCxDQUFBOztBQUFBLEVBRUEsR0FBQSxHQUFNLFNBQUEsR0FBQTtBQUNKLFFBQUEsSUFBQTtBQUFBLElBREssOERBQ0wsQ0FBQTtBQUFBLElBQUEsSUFBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isa0JBQWhCLENBQUg7YUFDRSxPQUFPLENBQUMsR0FBUixnQkFBWSxJQUFaLEVBREY7S0FESTtFQUFBLENBRk4sQ0FBQTs7QUFBQSxFQU1BLElBQUEsR0FBTyxTQUFBLEdBQUE7QUFDTCxRQUFBLElBQUE7QUFBQSxJQURNLDhEQUNOLENBQUE7QUFBQSxJQUFBLElBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGtCQUFoQixDQUFIO2FBQ0UsT0FBTyxDQUFDLElBQVIsZ0JBQWEsSUFBYixFQURGO0tBREs7RUFBQSxDQU5QLENBQUE7O0FBQUEsRUFXQSxxQkFBQSxHQUF3QixTQUFDLFFBQUQsRUFBVyxNQUFYLEdBQUE7QUFDdEIsUUFBQSx3REFBQTtBQUFBLElBQUEsVUFBQSxHQUFhLE1BQU0sQ0FBQyx1QkFBUCxDQUFBLENBQWdDLENBQUMsR0FBakMsR0FBdUMsQ0FBcEQsQ0FBQTtBQUFBLElBQ0EsWUFBQSxHQUFlLENBQUEsQ0FEZixDQUFBO0FBQUEsSUFFQSxRQUFBLEdBQVcsQ0FBQSxDQUZYLENBQUE7QUFHQTtBQUFBLFNBQUEsMkNBQUEsR0FBQTtBQUNFLE1BREcsZ0JBQUEsSUFDSCxDQUFBO0FBQUEsTUFBQSxJQUFHLElBQUEsR0FBTyxVQUFWO0FBQ0UsUUFBQSxZQUFBLEdBQWUsSUFBSSxDQUFDLEdBQUwsQ0FBUyxJQUFBLEdBQU8sQ0FBaEIsRUFBbUIsWUFBbkIsQ0FBZixDQURGO09BQUE7QUFBQSxNQUdBLFFBQUEsR0FBVyxJQUFJLENBQUMsR0FBTCxDQUFTLElBQUEsR0FBTyxDQUFoQixFQUFtQixRQUFuQixDQUhYLENBREY7QUFBQSxLQUhBO0FBVUEsSUFBQSxJQUEyQixZQUFBLEtBQWdCLENBQUEsQ0FBM0M7QUFBQSxNQUFBLFlBQUEsR0FBZSxRQUFmLENBQUE7S0FWQTtXQWFBLFVBQUEsQ0FBVyxNQUFYLEVBQW1CLFlBQW5CLEVBZHNCO0VBQUEsQ0FYeEIsQ0FBQTs7QUFBQSxFQTRCQSxpQkFBQSxHQUFvQixTQUFDLFFBQUQsRUFBVyxNQUFYLEdBQUE7QUFDbEIsUUFBQSxxREFBQTtBQUFBLElBQUEsVUFBQSxHQUFhLE1BQU0sQ0FBQyx1QkFBUCxDQUFBLENBQWdDLENBQUMsR0FBakMsR0FBdUMsQ0FBcEQsQ0FBQTtBQUFBLElBQ0EsUUFBQSxHQUFXLElBRFgsQ0FBQTtBQUFBLElBRUEsU0FBQSxHQUFZLElBRlosQ0FBQTtBQUdBO0FBQUEsU0FBQSwyQ0FBQSxHQUFBO0FBQ0UsTUFERyxnQkFBQSxJQUNILENBQUE7QUFBQSxNQUFBLElBQUcsSUFBQSxHQUFPLFVBQVY7O1VBQ0UsV0FBWSxJQUFBLEdBQU87U0FBbkI7QUFBQSxRQUNBLFFBQUEsR0FBVyxJQUFJLENBQUMsR0FBTCxDQUFTLElBQUEsR0FBTyxDQUFoQixFQUFtQixRQUFuQixDQURYLENBREY7T0FBQTs7UUFJQSxZQUFhLElBQUEsR0FBTztPQUpwQjtBQUFBLE1BS0EsU0FBQSxHQUFZLElBQUksQ0FBQyxHQUFMLENBQVMsSUFBQSxHQUFPLENBQWhCLEVBQW1CLFNBQW5CLENBTFosQ0FERjtBQUFBLEtBSEE7QUFZQSxJQUFBLElBQTRCLGdCQUE1QjtBQUFBLE1BQUEsUUFBQSxHQUFXLFNBQVgsQ0FBQTtLQVpBO1dBZUEsVUFBQSxDQUFXLE1BQVgsRUFBbUIsUUFBbkIsRUFoQmtCO0VBQUEsQ0E1QnBCLENBQUE7O0FBQUEsRUErQ0EsVUFBQSxHQUFhLFNBQUMsTUFBRCxFQUFTLENBQVQsR0FBQTs7TUFBUyxJQUFJLENBQUE7S0FDeEI7QUFBQSxJQUFBLElBQUcsQ0FBQSxJQUFLLENBQVI7QUFDRSxNQUFBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CLENBQUEsQ0FBQTthQUNBLE1BQU0sQ0FBQywwQkFBUCxDQUFBLEVBRkY7S0FEVztFQUFBLENBL0NiLENBQUE7O0FBQUEsRUFvREEsTUFBTSxDQUFDLE9BQVAsR0FBaUI7QUFBQSxJQUFDLEtBQUEsR0FBRDtBQUFBLElBQU0sTUFBQSxJQUFOO0FBQUEsSUFBWSxVQUFBLFFBQVo7QUFBQSxJQUFzQix1QkFBQSxxQkFBdEI7QUFBQSxJQUE2QyxtQkFBQSxpQkFBN0M7R0FwRGpCLENBQUE7QUFBQSIKfQ==
//# sourceURL=/home/iraasta/.atom/packages/linter/lib/utils.coffee