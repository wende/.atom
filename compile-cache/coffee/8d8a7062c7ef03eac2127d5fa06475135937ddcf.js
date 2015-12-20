(function() {
  var BOB, CLOSERS, CursorTools, Mark, OPENERS, escapeRegExp;

  Mark = require('./mark');

  OPENERS = {
    '(': ')',
    '[': ']',
    '{': '}',
    '\'': '\'',
    '"': '"',
    '`': '`'
  };

  CLOSERS = {
    ')': '(',
    ']': '[',
    '}': '{',
    '\'': '\'',
    '"': '"',
    '`': '`'
  };

  CursorTools = (function() {
    function CursorTools(cursor) {
      this.cursor = cursor;
      this.editor = this.cursor.editor;
    }

    CursorTools.prototype.locateBackward = function(regExp) {
      return this._locateBackwardFrom(this.cursor.getBufferPosition(), regExp);
    };

    CursorTools.prototype.locateForward = function(regExp) {
      return this._locateForwardFrom(this.cursor.getBufferPosition(), regExp);
    };

    CursorTools.prototype.locateWordCharacterBackward = function() {
      return this.locateBackward(this._getWordCharacterRegExp());
    };

    CursorTools.prototype.locateWordCharacterForward = function() {
      return this.locateForward(this._getWordCharacterRegExp());
    };

    CursorTools.prototype.locateNonWordCharacterBackward = function() {
      return this.locateBackward(this._getNonWordCharacterRegExp());
    };

    CursorTools.prototype.locateNonWordCharacterForward = function() {
      return this.locateForward(this._getNonWordCharacterRegExp());
    };

    CursorTools.prototype.goToMatchStartBackward = function(regExp) {
      var _ref;
      return this._goTo((_ref = this.locateBackward(regExp)) != null ? _ref.start : void 0);
    };

    CursorTools.prototype.goToMatchStartForward = function(regExp) {
      var _ref;
      return this._goTo((_ref = this.locateForward(regExp)) != null ? _ref.start : void 0);
    };

    CursorTools.prototype.goToMatchEndBackward = function(regExp) {
      var _ref;
      return this._goTo((_ref = this.locateBackward(regExp)) != null ? _ref.end : void 0);
    };

    CursorTools.prototype.goToMatchEndForward = function(regExp) {
      var _ref;
      return this._goTo((_ref = this.locateForward(regExp)) != null ? _ref.end : void 0);
    };

    CursorTools.prototype.skipCharactersBackward = function(characters) {
      var regexp;
      regexp = new RegExp("[^" + (escapeRegExp(characters)) + "]");
      return this.skipBackwardUntil(regexp);
    };

    CursorTools.prototype.skipCharactersForward = function(characters) {
      var regexp;
      regexp = new RegExp("[^" + (escapeRegExp(characters)) + "]");
      return this.skipForwardUntil(regexp);
    };

    CursorTools.prototype.skipWordCharactersBackward = function() {
      return this.skipBackwardUntil(this._getNonWordCharacterRegExp());
    };

    CursorTools.prototype.skipWordCharactersForward = function() {
      return this.skipForwardUntil(this._getNonWordCharacterRegExp());
    };

    CursorTools.prototype.skipNonWordCharactersBackward = function() {
      return this.skipBackwardUntil(this._getWordCharacterRegExp());
    };

    CursorTools.prototype.skipNonWordCharactersForward = function() {
      return this.skipForwardUntil(this._getWordCharacterRegExp());
    };

    CursorTools.prototype.skipBackwardUntil = function(regexp) {
      if (!this.goToMatchEndBackward(regexp)) {
        return this._goTo(BOB);
      }
    };

    CursorTools.prototype.skipForwardUntil = function(regexp) {
      if (!this.goToMatchStartForward(regexp)) {
        return this._goTo(this.editor.getEofBufferPosition());
      }
    };

    CursorTools.prototype._nextCharacterFrom = function(position) {
      var lineLength;
      lineLength = this.editor.lineTextForBufferRow(position.row).length;
      if (position.column === lineLength) {
        if (position.row === this.editor.getLastBufferRow()) {
          return null;
        } else {
          return this.editor.getTextInBufferRange([position, [position.row + 1, 0]]);
        }
      } else {
        return this.editor.getTextInBufferRange([position, position.translate([0, 1])]);
      }
    };

    CursorTools.prototype._previousCharacterFrom = function(position) {
      var column;
      if (position.column === 0) {
        if (position.row === 0) {
          return null;
        } else {
          column = this.editor.lineTextForBufferRow(position.row - 1).length;
          return this.editor.getTextInBufferRange([[position.row - 1, column], position]);
        }
      } else {
        return this.editor.getTextInBufferRange([position.translate([0, -1]), position]);
      }
    };

    CursorTools.prototype.nextCharacter = function() {
      return this._nextCharacterFrom(this.cursor.getBufferPosition());
    };

    CursorTools.prototype.previousCharacter = function() {
      return this._nextCharacterFrom(this.cursor.getBufferPosition());
    };

    CursorTools.prototype.skipSexpForward = function() {
      var point, target;
      point = this.cursor.getBufferPosition();
      target = this._sexpForwardFrom(point);
      return this.cursor.setBufferPosition(target);
    };

    CursorTools.prototype.skipSexpBackward = function() {
      var point, target;
      point = this.cursor.getBufferPosition();
      target = this._sexpBackwardFrom(point);
      return this.cursor.setBufferPosition(target);
    };

    CursorTools.prototype.markSexp = function() {
      var mark, newTail, range;
      mark = Mark["for"](this.cursor);
      if (!mark.isActive()) {
        mark.activate();
      }
      range = mark.getSelectionRange();
      newTail = this._sexpForwardFrom(range.end);
      return mark.setSelectionRange(range.start, newTail);
    };

    CursorTools.prototype._sexpForwardFrom = function(point) {
      var character, eob, eof, quotes, re, result, stack, _ref, _ref1;
      eob = this.editor.getEofBufferPosition();
      point = ((_ref = this._locateForwardFrom(point, /[\w()[\]{}'"]/i)) != null ? _ref.start : void 0) || eob;
      character = this._nextCharacterFrom(point);
      if (OPENERS.hasOwnProperty(character) || CLOSERS.hasOwnProperty(character)) {
        result = null;
        stack = [];
        quotes = 0;
        eof = this.editor.getEofBufferPosition();
        re = /[^()[\]{}"'`\\]+|\\.|[()[\]{}"'`]/g;
        this.editor.scanInBufferRange(re, [point, eof], (function(_this) {
          return function(hit) {
            var closer;
            if (hit.matchText === stack[stack.length - 1]) {
              stack.pop();
              if (stack.length === 0) {
                result = hit.range.end;
                return hit.stop();
              } else if (/^["'`]$/.test(hit.matchText)) {
                return quotes -= 1;
              }
            } else if ((closer = OPENERS[hit.matchText])) {
              if (!(/^["'`]$/.test(closer) && quotes > 0)) {
                stack.push(closer);
                if (/^["'`]$/.test(closer)) {
                  return quotes += 1;
                }
              }
            } else if (CLOSERS[hit.matchText]) {
              if (stack.length === 0) {
                return hit.stop();
              }
            }
          };
        })(this));
        return result || point;
      } else {
        return ((_ref1 = this._locateForwardFrom(point, /\W/i)) != null ? _ref1.start : void 0) || eob;
      }
    };

    CursorTools.prototype._sexpBackwardFrom = function(point) {
      var character, quotes, re, result, stack, _ref, _ref1;
      point = ((_ref = this._locateBackwardFrom(point, /[\w()[\]{}'"]/i)) != null ? _ref.end : void 0) || BOB;
      character = this._previousCharacterFrom(point);
      if (OPENERS.hasOwnProperty(character) || CLOSERS.hasOwnProperty(character)) {
        result = null;
        stack = [];
        quotes = 0;
        re = /[^()[\]{}"'`\\]+|\\.|[()[\]{}"'`]/g;
        this.editor.backwardsScanInBufferRange(re, [BOB, point], (function(_this) {
          return function(hit) {
            var opener;
            if (hit.matchText === stack[stack.length - 1]) {
              stack.pop();
              if (stack.length === 0) {
                result = hit.range.start;
                return hit.stop();
              } else if (/^["'`]$/.test(hit.matchText)) {
                return quotes -= 1;
              }
            } else if ((opener = CLOSERS[hit.matchText])) {
              if (!(/^["'`]$/.test(opener) && quotes > 0)) {
                stack.push(opener);
                if (/^["'`]$/.test(opener)) {
                  return quotes += 1;
                }
              }
            } else if (OPENERS[hit.matchText]) {
              if (stack.length === 0) {
                return hit.stop();
              }
            }
          };
        })(this));
        return result || point;
      } else {
        return ((_ref1 = this._locateBackwardFrom(point, /\W/i)) != null ? _ref1.end : void 0) || BOB;
      }
    };

    CursorTools.prototype.extractWord = function(cursorTools) {
      var range, word, wordEnd, wordRange;
      this.skipWordCharactersBackward();
      range = this.locateNonWordCharacterForward();
      wordEnd = range ? range.start : this.editor.getEofBufferPosition();
      wordRange = [this.cursor.getBufferPosition(), wordEnd];
      word = this.editor.getTextInBufferRange(wordRange);
      this.editor.setTextInBufferRange(wordRange, '');
      return word;
    };

    CursorTools.prototype._locateBackwardFrom = function(point, regExp) {
      var result;
      result = null;
      this.editor.backwardsScanInBufferRange(regExp, [BOB, point], function(hit) {
        return result = hit.range;
      });
      return result;
    };

    CursorTools.prototype._locateForwardFrom = function(point, regExp) {
      var eof, result;
      result = null;
      eof = this.editor.getEofBufferPosition();
      this.editor.scanInBufferRange(regExp, [point, eof], function(hit) {
        return result = hit.range;
      });
      return result;
    };

    CursorTools.prototype._getWordCharacterRegExp = function() {
      var nonWordCharacters;
      nonWordCharacters = atom.config.get('editor.nonWordCharacters');
      return new RegExp('[^\\s' + escapeRegExp(nonWordCharacters) + ']');
    };

    CursorTools.prototype._getNonWordCharacterRegExp = function() {
      var nonWordCharacters;
      nonWordCharacters = atom.config.get('editor.nonWordCharacters');
      return new RegExp('[\\s' + escapeRegExp(nonWordCharacters) + ']');
    };

    CursorTools.prototype._goTo = function(point) {
      if (point) {
        this.cursor.setBufferPosition(point);
        return true;
      } else {
        return false;
      }
    };

    return CursorTools;

  })();

  escapeRegExp = function(string) {
    if (string) {
      return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    } else {
      return '';
    }
  };

  BOB = {
    row: 0,
    column: 0
  };

  module.exports = CursorTools;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvaXJhYXN0YS8uYXRvbS9wYWNrYWdlcy9hdG9taWMtZW1hY3MvbGliL2N1cnNvci10b29scy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsc0RBQUE7O0FBQUEsRUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLFFBQVIsQ0FBUCxDQUFBOztBQUFBLEVBRUEsT0FBQSxHQUFVO0FBQUEsSUFBQyxHQUFBLEVBQUssR0FBTjtBQUFBLElBQVcsR0FBQSxFQUFLLEdBQWhCO0FBQUEsSUFBcUIsR0FBQSxFQUFLLEdBQTFCO0FBQUEsSUFBK0IsSUFBQSxFQUFNLElBQXJDO0FBQUEsSUFBMkMsR0FBQSxFQUFLLEdBQWhEO0FBQUEsSUFBcUQsR0FBQSxFQUFLLEdBQTFEO0dBRlYsQ0FBQTs7QUFBQSxFQUdBLE9BQUEsR0FBVTtBQUFBLElBQUMsR0FBQSxFQUFLLEdBQU47QUFBQSxJQUFXLEdBQUEsRUFBSyxHQUFoQjtBQUFBLElBQXFCLEdBQUEsRUFBSyxHQUExQjtBQUFBLElBQStCLElBQUEsRUFBTSxJQUFyQztBQUFBLElBQTJDLEdBQUEsRUFBSyxHQUFoRDtBQUFBLElBQXFELEdBQUEsRUFBSyxHQUExRDtHQUhWLENBQUE7O0FBQUEsRUFNTTtBQUNTLElBQUEscUJBQUUsTUFBRixHQUFBO0FBQ1gsTUFEWSxJQUFDLENBQUEsU0FBQSxNQUNiLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxNQUFELEdBQVUsSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUFsQixDQURXO0lBQUEsQ0FBYjs7QUFBQSwwQkFNQSxjQUFBLEdBQWdCLFNBQUMsTUFBRCxHQUFBO2FBQ2QsSUFBQyxDQUFBLG1CQUFELENBQXFCLElBQUMsQ0FBQSxNQUFNLENBQUMsaUJBQVIsQ0FBQSxDQUFyQixFQUFrRCxNQUFsRCxFQURjO0lBQUEsQ0FOaEIsQ0FBQTs7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

//# sourceURL=/home/iraasta/.atom/packages/atomic-emacs/lib/cursor-tools.coffee
