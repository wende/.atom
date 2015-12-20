(function() {
  var AtomicEmacs, CompositeDisposable, CursorTools, Mark, capitalize, deactivateCursors, endLineIfNecessary, horizontalSpaceRange, transformNextWord,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  CompositeDisposable = require('atom').CompositeDisposable;

  CursorTools = require('./cursor-tools');

  Mark = require('./mark');

  horizontalSpaceRange = function(cursor) {
    var cursorTools, end, start;
    cursorTools = new CursorTools(cursor);
    cursorTools.skipCharactersBackward(' \t');
    start = cursor.getBufferPosition();
    cursorTools.skipCharactersForward(' \t');
    end = cursor.getBufferPosition();
    return [start, end];
  };

  endLineIfNecessary = function(cursor) {
    var editor, length, row;
    row = cursor.getBufferPosition().row;
    editor = cursor.editor;
    if (row === editor.getLineCount() - 1) {
      length = cursor.getCurrentBufferLine().length;
      return editor.setTextInBufferRange([[row, length], [row, length]], "\n");
    }
  };

  deactivateCursors = function(editor) {
    var cursor, _i, _len, _ref, _results;
    _ref = editor.getCursors();
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      cursor = _ref[_i];
      _results.push(Mark["for"](cursor).deactivate());
    }
    return _results;
  };

  transformNextWord = function(editor, transformation) {
    return editor.moveCursors(function(cursor) {
      var end, range, start, text, tools;
      tools = new CursorTools(cursor);
      tools.skipNonWordCharactersForward();
      start = cursor.getBufferPosition();
      tools.skipWordCharactersForward();
      end = cursor.getBufferPosition();
      range = [start, end];
      text = editor.getTextInBufferRange(range);
      return editor.setTextInBufferRange(range, transformation(text));
    });
  };

  capitalize = function(string) {
    return string.slice(0, 1).toUpperCase() + string.slice(1).toLowerCase();
  };

  AtomicEmacs = (function() {
    function AtomicEmacs() {
      this.deleteIndentation = __bind(this.deleteIndentation, this);
      this.previousCommand = null;
      this.recenters = 0;
    }

    AtomicEmacs.prototype.commandDispatched = function(event) {
      return this.previousCommand = event.type;
    };

    AtomicEmacs.prototype.editor = function(event) {
      var _ref;
      if ((_ref = event.target) != null ? _ref.getModel : void 0) {
        return event.target.getModel();
      } else {
        return atom.workspace.getActiveTextEditor();
      }
    };

    AtomicEmacs.prototype.upcaseWordOrRegion = function(event) {
      var editor;
      editor = this.editor(event);
      if (editor.getSelections().filter(function(s) {
        return !s.isEmpty();
      }).length > 0) {
        return editor.mutateSelectedText(function(selection) {
          var range;
          range = selection.getBufferRange();
          return editor.setTextInBufferRange(range, selection.getText().toUpperCase());
        });
      } else {
        return transformNextWord(editor, function(word) {
          return word.toUpperCase();
        });
      }
    };

    AtomicEmacs.prototype.downcaseWordOrRegion = function(event) {
      var editor;
      editor = this.editor(event);
      if (editor.getSelections().filter(function(s) {
        return !s.isEmpty();
      }).length > 0) {
        return editor.mutateSelectedText(function(selection) {
          var range;
          range = selection.getBufferRange();
          return editor.setTextInBufferRange(range, selection.getText().toLowerCase());
        });
      } else {
        return transformNextWord(editor, function(word) {
          return word.toLowerCase();
        });
      }
    };

    AtomicEmacs.prototype.capitalizeWordOrRegion = function(event) {
      var editor;
      editor = this.editor(event);
      if (editor.getSelections().filter(function(selection) {
        return !selection.isEmpty();
      }).length > 0) {
        return editor.mutateSelectedText(function(selection) {
          var selectionRange;
          if (!selection.isEmpty()) {
            selectionRange = selection.getBufferRange();
            return editor.scanInBufferRange(/\w+/g, selectionRange, function(hit) {
              return hit.replace(capitalize(hit.matchText));
            });
          }
        });
      } else {
        return transformNextWord(editor, capitalize);
      }
    };

    AtomicEmacs.prototype.openLine = function(event) {
      var editor;
      editor = this.editor(event);
      editor.insertNewline();
      return editor.moveUp();
    };

    AtomicEmacs.prototype.transposeChars = function(event) {
      var bob_cursor_ids, editor;
      editor = this.editor(event);
      bob_cursor_ids = {};
      editor.moveCursors(function(cursor) {
        var column, line, row, _ref;
        _ref = cursor.getBufferPosition(), row = _ref.row, column = _ref.column;
        if (row === 0 && column === 0) {
          bob_cursor_ids[cursor.id] = 1;
        }
        line = editor.lineTextForBufferRow(row);
        if (column === line.length) {
          return cursor.moveLeft();
        }
      });
      editor.transpose();
      return editor.moveCursors(function(cursor) {
        if (bob_cursor_ids.hasOwnProperty(cursor.id)) {
          return cursor.moveLeft();
        } else if (cursor.getBufferColumn() > 0) {
          return cursor.moveRight();
        }
      });
    };

    AtomicEmacs.prototype.transposeWords = function(event) {
      var editor;
      editor = this.editor(event);
      return editor.transact((function(_this) {
        return function() {
          var cursor, cursorTools, word1, word1Pos, word2, word2Pos, _i, _len, _ref, _results;
          _ref = editor.getCursors();
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            cursor = _ref[_i];
            cursorTools = new CursorTools(cursor);
            cursorTools.skipNonWordCharactersBackward();
            word1 = cursorTools.extractWord();
            word1Pos = cursor.getBufferPosition();
            cursorTools.skipNonWordCharactersForward();
            if (editor.getEofBufferPosition().isEqual(cursor.getBufferPosition())) {
              editor.setTextInBufferRange([word1Pos, word1Pos], word1);
              cursorTools.skipNonWordCharactersBackward();
            } else {
              word2 = cursorTools.extractWord();
              word2Pos = cursor.getBufferPosition();
              editor.setTextInBufferRange([word2Pos, word2Pos], word1);
              editor.setTextInBufferRange([word1Pos, word1Pos], word2);
            }
            _results.push(cursor.setBufferPosition(cursor.getBufferPosition()));
          }
          return _results;
        };
      })(this));
    };

    AtomicEmacs.prototype.transposeLines = function(event) {
      var cursor, editor, row;
      editor = this.editor(event);
      cursor = editor.getLastCursor();
      row = cursor.getBufferRow();
      return editor.transact((function(_this) {
        return function() {
          var text;
          if (row === 0) {
            endLineIfNecessary(cursor);
            cursor.moveDown();
            row += 1;
          }
          endLineIfNecessary(cursor);
          text = editor.getTextInBufferRange([[row, 0], [row + 1, 0]]);
          editor.deleteLine(row);
          return editor.setTextInBufferRange([[row - 1, 0], [row - 1, 0]], text);
        };
      })(this));
    };

    AtomicEmacs.prototype.markWholeBuffer = function(event) {
      return this.editor(event).selectAll();
    };

    AtomicEmacs.prototype.setMark = function(event) {
      var cursor, _i, _len, _ref, _results;
      _ref = this.editor(event).getCursors();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        cursor = _ref[_i];
        _results.push(Mark["for"](cursor).set().activate());
      }
      return _results;
    };

    AtomicEmacs.prototype.keyboardQuit = function(event) {
      return deactivateCursors(this.editor(event));
    };

    AtomicEmacs.prototype.exchangePointAndMark = function(event) {
      return this.editor(event).moveCursors(function(cursor) {
        return Mark["for"](cursor).exchange();
      });
    };

    AtomicEmacs.prototype.copy = function(event) {
      var editor;
      editor = this.editor(event);
      editor.copySelectedText();
      return deactivateCursors(editor);
    };

    AtomicEmacs.prototype.closeOtherPanes = function(event) {
      var activePane, pane, _i, _len, _ref, _results;
      activePane = atom.workspace.getActivePane();
      if (!activePane) {
        return;
      }
      _ref = atom.workspace.getPanes();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        pane = _ref[_i];
        if (pane !== activePane) {
          _results.push(pane.close());
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    AtomicEmacs.prototype.forwardChar = function(event) {
      if (atom.config.get('atomic-emacs.useNativeNavigationKeys')) {
        event.abortKeyBinding();
        return;
      }
      return this.editor(event).moveCursors(function(cursor) {
        return cursor.moveRight();
      });
    };

    AtomicEmacs.prototype.backwardChar = function(event) {
      return this.editor(event).moveCursors(function(cursor) {
        var mark;
        mark = Mark["for"](cursor);
        if (mark != null ? mark.isActive() : void 0) {
          cursor.selection.selectLeft();
          return;
        }
        if (atom.config.get('atomic-emacs.useNativeNavigationKeys')) {
          return event.abortKeyBinding();
        } else {
          return cursor.moveLeft();
        }
      });
    };

    AtomicEmacs.prototype.forwardWord = function(event) {
      return this.editor(event).moveCursors(function(cursor) {
        var tools;
        tools = new CursorTools(cursor);
        tools.skipNonWordCharactersForward();
        return tools.skipWordCharactersForward();
      });
    };

    AtomicEmacs.prototype.backwardWord = function(event) {
      return this.editor(event).moveCursors(function(cursor) {
        var tools;
        tools = new CursorTools(cursor);
        tools.skipNonWordCharactersBackward();
        return tools.skipWordCharactersBackward();
      });
    };

    AtomicEmacs.prototype.forwardSexp = function(event) {
      return this.editor(event).moveCursors(function(cursor) {
        return new CursorTools(cursor).skipSexpForward();
      });
    };

    AtomicEmacs.prototype.backwardSexp = function(event) {
      return this.editor(event).moveCursors(function(cursor) {
        return new CursorTools(cursor).skipSexpBackward();
      });
    };

    AtomicEmacs.prototype.markSexp = function(event) {
      return this.editor(event).moveCursors(function(cursor) {
        return new CursorTools(cursor).markSexp();
      });
    };

    AtomicEmacs.prototype.backToIndentation = function(event) {
      var editor;
      editor = this.editor(event);
      return editor.moveCursors(function(cursor) {
        var line, position, targetColumn;
        position = cursor.getBufferPosition();
        line = editor.lineTextForBufferRow(position.row);
        targetColumn = line.search(/\S/);
        if (targetColumn === -1) {
          targetColumn = line.length;
        }
        if (position.column !== targetColumn) {
          return cursor.setBufferPosition([position.row, targetColumn]);
        }
      });
    };

    AtomicEmacs.prototype.nextLine = function(event) {
      if (atom.config.get('atomic-emacs.useNativeNavigationKeys')) {
        event.abortKeyBinding();
        return;
      }
      return this.editor(event).moveCursors(function(cursor) {
        return cursor.moveDown();
      });
    };

    AtomicEmacs.prototype.previousLine = function(event) {
      if (atom.config.get('atomic-emacs.useNativeNavigationKeys')) {
        event.abortKeyBinding();
        return;
      }
      return this.editor(event).moveCursors(function(cursor) {
        return cursor.moveUp();
      });
    };

    AtomicEmacs.prototype.scrollUp = function(event) {
      var currentRow, editor, firstRow, lastRow, rowCount, _ref;
      editor = this.editor(event);
      _ref = editor.getVisibleRowRange(), firstRow = _ref[0], lastRow = _ref[1];
      currentRow = editor.cursors[0].getBufferRow();
      rowCount = (lastRow - firstRow) - 2;
      return editor.moveDown(rowCount);
    };

    AtomicEmacs.prototype.scrollDown = function(event) {
      var currentRow, editor, firstRow, lastRow, rowCount, _ref;
      editor = this.editor(event);
      _ref = editor.getVisibleRowRange(), firstRow = _ref[0], lastRow = _ref[1];
      currentRow = editor.cursors[0].getBufferRow();
      rowCount = (lastRow - firstRow) - 2;
      return editor.moveUp(rowCount);
    };

    AtomicEmacs.prototype.backwardParagraph = function(event) {
      return this.editor(event).moveCursors(function(cursor) {
        var cursorTools, position;
        position = cursor.getBufferPosition();
        if (position.row !== 0) {
          cursor.setBufferPosition([position.row - 1, 0]);
        }
        cursorTools = new CursorTools(cursor);
        return cursorTools.goToMatchStartBackward(/^\s*$/) || cursor.moveToTop();
      });
    };

    AtomicEmacs.prototype.forwardParagraph = function(event) {
      var editor, lastRow;
      editor = this.editor(event);
      lastRow = editor.getLastBufferRow();
      return editor.moveCursors(function(cursor) {
        var cursorTools, position;
        position = cursor.getBufferPosition();
        if (position.row !== lastRow) {
          cursor.setBufferPosition([position.row + 1, 0]);
        }
        cursorTools = new CursorTools(cursor);
        return cursorTools.goToMatchStartForward(/^\s*$/) || cursor.moveToBottom();
      });
    };

    AtomicEmacs.prototype.backwardKillWord = function(event) {
      var editor;
      editor = this.editor(event);
      return editor.transact((function(_this) {
        return function() {
          var selection, _i, _len, _ref, _results;
          _ref = editor.getSelections();
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            selection = _ref[_i];
            _results.push(selection.modifySelection(function() {
              var cursorTools;
              if (selection.isEmpty()) {
                cursorTools = new CursorTools(selection.cursor);
                cursorTools.skipNonWordCharactersBackward();
                cursorTools.skipWordCharactersBackward();
              }
              return selection.deleteSelectedText();
            }));
          }
          return _results;
        };
      })(this));
    };

    AtomicEmacs.prototype.killWord = function(event) {
      var editor;
      editor = this.editor(event);
      return editor.transact((function(_this) {
        return function() {
          var selection, _i, _len, _ref, _results;
          _ref = editor.getSelections();
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            selection = _ref[_i];
            _results.push(selection.modifySelection(function() {
              var cursorTools;
              if (selection.isEmpty()) {
                cursorTools = new CursorTools(selection.cursor);
                cursorTools.skipNonWordCharactersForward();
                cursorTools.skipWordCharactersForward();
              }
              return selection.deleteSelectedText();
            }));
          }
          return _results;
        };
      })(this));
    };

    AtomicEmacs.prototype.justOneSpace = function(event) {
      var cursor, editor, range, _i, _len, _ref, _results;
      editor = this.editor(event);
      _ref = editor.cursors;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        cursor = _ref[_i];
        range = horizontalSpaceRange(cursor);
        _results.push(editor.setTextInBufferRange(range, ' '));
      }
      return _results;
    };

    AtomicEmacs.prototype.deleteHorizontalSpace = function(event) {
      var cursor, editor, range, _i, _len, _ref, _results;
      editor = this.editor(event);
      _ref = editor.cursors;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        cursor = _ref[_i];
        range = horizontalSpaceRange(cursor);
        _results.push(editor.setTextInBufferRange(range, ''));
      }
      return _results;
    };

    AtomicEmacs.prototype.recenterTopBottom = function(event) {
      var c, editor, editorElement, maxOffset, maxRow, minOffset, minRow;
      if (this.previousCommand === 'atomic-emacs:recenter-top-bottom') {
        this.recenters = (this.recenters + 1) % 3;
      } else {
        this.recenters = 0;
      }
      editor = this.editor(event);
      if (!editor) {
        return;
      }
      editorElement = atom.views.getView(editor);
      minRow = Math.min.apply(Math, (function() {
        var _i, _len, _ref, _results;
        _ref = editor.getCursors();
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          c = _ref[_i];
          _results.push(c.getBufferRow());
        }
        return _results;
      })());
      maxRow = Math.max.apply(Math, (function() {
        var _i, _len, _ref, _results;
        _ref = editor.getCursors();
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          c = _ref[_i];
          _results.push(c.getBufferRow());
        }
        return _results;
      })());
      minOffset = editorElement.pixelPositionForBufferPosition([minRow, 0]);
      maxOffset = editorElement.pixelPositionForBufferPosition([maxRow, 0]);
      switch (this.recenters) {
        case 0:
          return editor.setScrollTop((minOffset.top + maxOffset.top - editor.getHeight()) / 2);
        case 1:
          return editor.setScrollTop(minOffset.top - 2 * editor.getLineHeightInPixels());
        case 2:
          return editor.setScrollTop(maxOffset.top + 3 * editor.getLineHeightInPixels() - editor.getHeight());
      }
    };

    AtomicEmacs.prototype.deleteIndentation = function() {
      var editor;
      editor = this.editor(event);
      if (!editor) {
        return;
      }
      return editor.transact(function() {
        editor.moveUp();
        return editor.joinLines();
      });
    };

    return AtomicEmacs;

  })();

  module.exports = {
    AtomicEmacs: AtomicEmacs,
    Mark: Mark,
    activate: function() {
      var atomicEmacs, _ref, _ref1;
      atomicEmacs = new AtomicEmacs();
      if ((_ref = document.getElementsByTagName('atom-workspace')[0]) != null) {
        if ((_ref1 = _ref.classList) != null) {
          _ref1.add('atomic-emacs');
        }
      }
      this.disposable = new CompositeDisposable;
      this.disposable.add(atom.commands.onDidDispatch(function(event) {
        return atomicEmacs.commandDispatched(event);
      }));
      return this.disposable.add(atom.commands.add('atom-text-editor', {
        "atomic-emacs:backward-char": function(event) {
          return atomicEmacs.backwardChar(event);
        },
        "atomic-emacs:backward-kill-word": function(event) {
          return atomicEmacs.backwardKillWord(event);
        },
        "atomic-emacs:backward-paragraph": function(event) {
          return atomicEmacs.backwardParagraph(event);
        },
        "atomic-emacs:backward-word": function(event) {
          return atomicEmacs.backwardWord(event);
        },
        "atomic-emacs:beginning-of-buffer": function(event) {
          return atomicEmacs.beginningOfBuffer(event);
        },
        "atomic-emacs:capitalize-word-or-region": function(event) {
          return atomicEmacs.capitalizeWordOrRegion(event);
        },
        "atomic-emacs:close-other-panes": function(event) {
          return atomicEmacs.closeOtherPanes(event);
        },
        "atomic-emacs:copy": function(event) {
          return atomicEmacs.copy(event);
        },
        "atomic-emacs:delete-horizontal-space": function(event) {
          return atomicEmacs.deleteHorizontalSpace(event);
        },
        "atomic-emacs:delete-indentation": atomicEmacs.deleteIndentation,
        "atomic-emacs:downcase-word-or-region": function(event) {
          return atomicEmacs.downcaseWordOrRegion(event);
        },
        "atomic-emacs:end-of-buffer": function(event) {
          return atomicEmacs.endOfBuffer(event);
        },
        "atomic-emacs:exchange-point-and-mark": function(event) {
          return atomicEmacs.exchangePointAndMark(event);
        },
        "atomic-emacs:forward-char": function(event) {
          return atomicEmacs.forwardChar(event);
        },
        "atomic-emacs:forward-paragraph": function(event) {
          return atomicEmacs.forwardParagraph(event);
        },
        "atomic-emacs:forward-word": function(event) {
          return atomicEmacs.forwardWord(event);
        },
        "atomic-emacs:forward-sexp": function(event) {
          return atomicEmacs.forwardSexp(event);
        },
        "atomic-emacs:backward-sexp": function(event) {
          return atomicEmacs.backwardSexp(event);
        },
        "atomic-emacs:mark-sexp": function(event) {
          return atomicEmacs.markSexp(event);
        },
        "atomic-emacs:just-one-space": function(event) {
          return atomicEmacs.justOneSpace(event);
        },
        "atomic-emacs:kill-word": function(event) {
          return atomicEmacs.killWord(event);
        },
        "atomic-emacs:mark-whole-buffer": function(event) {
          return atomicEmacs.markWholeBuffer(event);
        },
        "atomic-emacs:back-to-indentation": function(event) {
          return atomicEmacs.backToIndentation(event);
        },
        "atomic-emacs:next-line": function(event) {
          return atomicEmacs.nextLine(event);
        },
        "atomic-emacs:open-line": function(event) {
          return atomicEmacs.openLine(event);
        },
        "atomic-emacs:previous-line": function(event) {
          return atomicEmacs.previousLine(event);
        },
        "atomic-emacs:recenter-top-bottom": function(event) {
          return atomicEmacs.recenterTopBottom(event);
        },
        "atomic-emacs:scroll-down": function(event) {
          return atomicEmacs.scrollDown(event);
        },
        "atomic-emacs:scroll-up": function(event) {
          return atomicEmacs.scrollUp(event);
        },
        "atomic-emacs:set-mark": function(event) {
          return atomicEmacs.setMark(event);
        },
        "atomic-emacs:transpose-chars": function(event) {
          return atomicEmacs.transposeChars(event);
        },
        "atomic-emacs:transpose-lines": function(event) {
          return atomicEmacs.transposeLines(event);
        },
        "atomic-emacs:transpose-words": function(event) {
          return atomicEmacs.transposeWords(event);
        },
        "atomic-emacs:upcase-word-or-region": function(event) {
          return atomicEmacs.upcaseWordOrRegion(event);
        },
        "core:cancel": function(event) {
          return atomicEmacs.keyboardQuit(event);
        }
      }));
    },
    deactivate: function() {
      var _ref, _ref1, _ref2;
      if ((_ref = document.getElementsByTagName('atom-workspace')[0]) != null) {
        if ((_ref1 = _ref.classList) != null) {
          _ref1.remove('atomic-emacs');
        }
      }
      if ((_ref2 = this.disposable) != null) {
        _ref2.dispose();
      }
      return this.disposable = null;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvaXJhYXN0YS8uYXRvbS9wYWNrYWdlcy9hdG9taWMtZW1hY3MvbGliL2F0b21pYy1lbWFjcy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsK0lBQUE7SUFBQSxrRkFBQTs7QUFBQSxFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFBRCxDQUFBOztBQUFBLEVBQ0EsV0FBQSxHQUFjLE9BQUEsQ0FBUSxnQkFBUixDQURkLENBQUE7O0FBQUEsRUFFQSxJQUFBLEdBQU8sT0FBQSxDQUFRLFFBQVIsQ0FGUCxDQUFBOztBQUFBLEVBSUEsb0JBQUEsR0FBdUIsU0FBQyxNQUFELEdBQUE7QUFDckIsUUFBQSx1QkFBQTtBQUFBLElBQUEsV0FBQSxHQUFrQixJQUFBLFdBQUEsQ0FBWSxNQUFaLENBQWxCLENBQUE7QUFBQSxJQUNBLFdBQVcsQ0FBQyxzQkFBWixDQUFtQyxLQUFuQyxDQURBLENBQUE7QUFBQSxJQUVBLEtBQUEsR0FBUSxNQUFNLENBQUMsaUJBQVAsQ0FBQSxDQUZSLENBQUE7QUFBQSxJQUdBLFdBQVcsQ0FBQyxxQkFBWixDQUFrQyxLQUFsQyxDQUhBLENBQUE7QUFBQSxJQUlBLEdBQUEsR0FBTSxNQUFNLENBQUMsaUJBQVAsQ0FBQSxDQUpOLENBQUE7V0FLQSxDQUFDLEtBQUQsRUFBUSxHQUFSLEVBTnFCO0VBQUEsQ0FKdkIsQ0FBQTs7QUFBQSxFQVlBLGtCQUFBLEdBQXFCLFNBQUMsTUFBRCxHQUFBO0FBQ25CLFFBQUEsbUJBQUE7QUFBQSxJQUFBLEdBQUEsR0FBTSxNQUFNLENBQUMsaUJBQVAsQ0FBQSxDQUEwQixDQUFDLEdBQWpDLENBQUE7QUFBQSxJQUNBLE1BQUEsR0FBUyxNQUFNLENBQUMsTUFEaEIsQ0FBQTtBQUVBLElBQUEsSUFBRyxHQUFBLEtBQU8sTUFBTSxDQUFDLFlBQVAs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

//# sourceURL=/home/iraasta/.atom/packages/atomic-emacs/lib/atomic-emacs.coffee
