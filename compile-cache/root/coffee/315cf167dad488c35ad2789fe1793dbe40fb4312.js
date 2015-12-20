(function() {
  var CompositeDisposable, Emitter, LinterView, fs, log, moveToNextMessage, moveToPreviousMessage, path, rimraf, temp, warn, _, _ref, _ref1,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  _ = require('lodash');

  fs = require('fs');

  temp = require('temp');

  path = require('path');

  rimraf = require('rimraf');

  _ref = require('atom'), CompositeDisposable = _ref.CompositeDisposable, Emitter = _ref.Emitter;

  _ref1 = require('./utils'), log = _ref1.log, warn = _ref1.warn, moveToPreviousMessage = _ref1.moveToPreviousMessage, moveToNextMessage = _ref1.moveToNextMessage;

  temp.track();

  LinterView = (function() {
    LinterView.prototype.linters = [];

    LinterView.prototype.totalProcessed = 0;

    LinterView.prototype.tempFile = '';

    LinterView.prototype.messages = [];

    function LinterView(editor, statusBarView, statusBarSummaryView, inlineView, allLinters) {
      this.editor = editor;
      this.statusBarView = statusBarView;
      this.statusBarSummaryView = statusBarSummaryView;
      this.inlineView = inlineView;
      this.allLinters = allLinters != null ? allLinters : [];
      this.processMessage = __bind(this.processMessage, this);
      this.handleEditorEvents = __bind(this.handleEditorEvents, this);
      this.emitter = new Emitter;
      this.subscriptions = new CompositeDisposable;
      if (this.editor == null) {
        warn("No editor instance on this editor");
      }
      this.markers = null;
      this.initLinters();
      this.handleEditorEvents();
      this.handleConfigChanges();
      this.subscriptions.add(this.editor.onDidChangeCursorPosition((function(_this) {
        return function() {
          return _this.updateViews();
        };
      })(this)));
    }

    LinterView.prototype.initLinters = function() {
      var grammarName, linter, _i, _len, _ref2, _results;
      this.linters = [];
      grammarName = this.editor.getGrammar().scopeName;
      _ref2 = this.allLinters;
      _results = [];
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        linter = _ref2[_i];
        if (_.isArray(linter.syntax) && __indexOf.call(linter.syntax, grammarName) >= 0 || _.isString(linter.syntax) && grammarName === linter.syntax || linter.syntax instanceof RegExp && linter.syntax.test(grammarName)) {
          _results.push(this.linters.push(new linter(this.editor)));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    LinterView.prototype.handleConfigChanges = function() {
      this.subscriptions.add(atom.config.observe('linter.lintOnSave', (function(_this) {
        return function(lintOnSave) {
          return _this.lintOnSave = lintOnSave;
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('linter.lintOnChangeInterval', (function(_this) {
        return function(lintOnModifiedDelayMS) {
          var delay, intervalMethod;
          delay = parseInt(lintOnModifiedDelayMS);
          if (isNaN(delay)) {
            delay = 1000;
          }
          intervalMethod = atom.config.get('linter.lintOnChangeMethod');
          log("IntervalMethod: " + intervalMethod);
          if (intervalMethod === 'debounce') {
            return _this.boundedLint = (_.debounce(_this.lint, delay)).bind(_this);
          } else {
            return _this.boundedLint = (_.throttle(_this.lint, delay)).bind(_this);
          }
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('linter.lintOnChange', (function(_this) {
        return function(lintOnModified) {
          return _this.lintOnModified = lintOnModified;
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('linter.lintOnEditorFocus', (function(_this) {
        return function(lintOnEditorFocus) {
          return _this.lintOnEditorFocus = lintOnEditorFocus;
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('linter.showGutters', (function(_this) {
        return function(showGutters) {
          _this.showGutters = showGutters;
          return _this.display();
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('linter.statusBar', (function(_this) {
        return function(statusBar) {
          _this.showMessagesAroundCursor = statusBar !== 'None';
          return _this.updateViews();
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('linter.showErrorInline', (function(_this) {
        return function(showErrorInline) {
          _this.showErrorInline = showErrorInline;
          return _this.updateViews();
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('linter.showHighlighting', (function(_this) {
        return function(showHighlighting) {
          _this.showHighlighting = showHighlighting;
          return _this.display();
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('linter.showInfoMessages', (function(_this) {
        return function(showInfoMessages) {
          _this.showInfoMessages = showInfoMessages;
          return _this.display();
        };
      })(this)));
      return this.subscriptions.add(atom.config.observe('linter.clearOnChange', (function(_this) {
        return function(clearOnChange) {
          return _this.clearOnChange = clearOnChange;
        };
      })(this)));
    };

    LinterView.prototype.handleEditorEvents = function() {
      var maybeLintOnSave;
      this.editor.onDidChangeGrammar((function(_this) {
        return function() {
          _this.initLinters();
          return _this.lint();
        };
      })(this));
      maybeLintOnSave = (function(_this) {
        return function() {
          if (_this.lintOnSave) {
            return _this.boundedLint();
          }
        };
      })(this);
      this.subscriptions.add(this.editor.getBuffer().onDidReload(maybeLintOnSave));
      this.subscriptions.add(this.editor.onDidSave(maybeLintOnSave));
      this.subscriptions.add(this.editor.onDidStopChanging((function(_this) {
        return function() {
          if (_this.lintOnModified) {
            return _this.boundedLint();
          } else if (_this.clearOnChange && _this.messages.length > 0) {
            _this.messages = [];
            _this.updateViews();
            return _this.destroyMarkers();
          }
        };
      })(this)));
      this.subscriptions.add(this.editor.onDidDestroy((function(_this) {
        return function() {
          return _this.remove();
        };
      })(this)));
      this.subscriptions.add(atom.workspace.observeActivePaneItem((function(_this) {
        return function() {
          var _ref2;
          if (_this.editor.id === ((_ref2 = atom.workspace.getActiveTextEditor()) != null ? _ref2.id : void 0)) {
            if (_this.lintOnEditorFocus) {
              _this.boundedLint();
            }
            return _this.updateViews();
          } else {
            _this.statusBarView.hide();
            _this.statusBarSummaryView.remove();
            return _this.inlineView.remove();
          }
        };
      })(this)));
      this.subscriptions.add(atom.commands.add("atom-text-editor", "linter:lint", (function(_this) {
        return function() {
          return _this.lint();
        };
      })(this)));
      this.subscriptions.add(atom.commands.add("atom-text-editor", "linter:next-message", (function(_this) {
        return function() {
          return moveToNextMessage(_this.messages, _this.editor);
        };
      })(this)));
      return this.subscriptions.add(atom.commands.add("atom-text-editor", "linter:previous-message", (function(_this) {
        return function() {
          return moveToPreviousMessage(_this.messages, _this.editor);
        };
      })(this)));
    };

    LinterView.prototype.lint = function() {
      if (this.linters.length === 0) {
        return;
      }
      this.totalProcessed = 0;
      this.messages = [];
      this.destroyMarkers();
      return temp.mkdir({
        prefix: 'AtomLinter',
        suffix: this.editor.getGrammar().scopeName
      }, (function(_this) {
        return function(err, tmpDir) {
          var fileName, tempFileInfo;
          if (err != null) {
            throw err;
          }
          fileName = path.basename(_this.editor.getPath());
          tempFileInfo = {
            completedLinters: 0,
            path: path.join(tmpDir, fileName)
          };
          return fs.writeFile(tempFileInfo.path, _this.editor.getText(), function(err) {
            if (err != null) {
              throw err;
            }
            _this.linters.forEach(function(linter) {
              return linter.lintFile(tempFileInfo.path, function(messages) {
                return _this.processMessage(messages, tempFileInfo, linter);
              });
            });
          });
        };
      })(this));
    };

    LinterView.prototype.processMessage = function(messages, tempFileInfo, linter) {
      log("" + linter.linterName + " returned", linter, messages);
      this.messages = this.messages.concat(messages);
      tempFileInfo.completedLinters++;
      if (tempFileInfo.completedLinters === this.linters.length) {
        this.display(this.messages);
        return rimraf(tempFileInfo.path, function(err) {
          if (err != null) {
            throw err;
          }
        });
      }
    };

    LinterView.prototype.destroyMarkers = function() {
      var m, _i, _len, _ref2;
      if (this.markers == null) {
        return;
      }
      _ref2 = this.markers;
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        m = _ref2[_i];
        m.destroy();
      }
      return this.markers = null;
    };

    LinterView.prototype.createMarker = function(message) {
      var klass, marker;
      marker = this.editor.markBufferRange(message.range, {
        invalidate: 'never'
      });
      klass = 'linter-' + message.level;
      if (this.showGutters) {
        this.editor.decorateMarker(marker, {
          type: 'line-number',
          "class": klass
        });
      }
      if (this.showHighlighting) {
        this.editor.decorateMarker(marker, {
          type: 'highlight',
          "class": klass
        });
      }
      return marker;
    };

    LinterView.prototype.sortMessagesByLine = function(messages) {
      var lNum, levels, line, lines, message, msgLevel, _i, _len;
      lines = {};
      levels = ['warning', 'error'];
      if (this.showInfoMessages) {
        levels.unshift('info');
      }
      for (_i = 0, _len = messages.length; _i < _len; _i++) {
        message = messages[_i];
        lNum = message.line;
        line = lines[lNum] || {
          'level': -1
        };
        msgLevel = levels.indexOf(message.level);
        if (!(msgLevel > line.level)) {
          continue;
        }
        line.level = msgLevel;
        line.msg = message;
        lines[lNum] = line;
      }
      return lines;
    };

    LinterView.prototype.display = function(messages) {
      var lNum, line, marker, _ref2;
      if (messages == null) {
        messages = [];
      }
      this.destroyMarkers();
      if (!this.editor.isAlive()) {
        return;
      }
      if (!(this.showGutters || this.showHighlighting)) {
        this.updateViews();
        return;
      }
      if (this.markers == null) {
        this.markers = [];
      }
      _ref2 = this.sortMessagesByLine(messages);
      for (lNum in _ref2) {
        line = _ref2[lNum];
        marker = this.createMarker(line.msg);
        this.markers.push(marker);
      }
      return this.updateViews();
    };

    LinterView.prototype.updateViews = function() {
      this.statusBarSummaryView.render(this.messages, this.editor);
      if (this.showMessagesAroundCursor) {
        this.statusBarView.render(this.messages, this.editor);
      } else {
        this.statusBarView.render([], this.editor);
      }
      if (this.showErrorInline) {
        return this.inlineView.render(this.messages, this.editor);
      } else {
        return this.inlineView.render([], this.editor);
      }
    };

    LinterView.prototype.remove = function() {
      var l, _i, _len, _ref2;
      this.statusBarView.hide();
      this.statusBarSummaryView.remove();
      this.inlineView.remove();
      this.subscriptions.dispose();
      _ref2 = this.linters;
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        l = _ref2[_i];
        l.destroy();
      }
      return this.emitter.emit('did-destroy');
    };

    LinterView.prototype.onDidDestroy = function(callback) {
      return this.emitter.on('did-destroy', callback);
    };

    return LinterView;

  })();

  module.exports = LinterView;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHFJQUFBO0lBQUE7eUpBQUE7O0FBQUEsRUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLFFBQVIsQ0FBSixDQUFBOztBQUFBLEVBQ0EsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBREwsQ0FBQTs7QUFBQSxFQUVBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUZQLENBQUE7O0FBQUEsRUFHQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FIUCxDQUFBOztBQUFBLEVBSUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxRQUFSLENBSlQsQ0FBQTs7QUFBQSxFQUtBLE9BQWlDLE9BQUEsQ0FBUSxNQUFSLENBQWpDLEVBQUMsMkJBQUEsbUJBQUQsRUFBc0IsZUFBQSxPQUx0QixDQUFBOztBQUFBLEVBT0EsUUFBd0QsT0FBQSxDQUFRLFNBQVIsQ0FBeEQsRUFBQyxZQUFBLEdBQUQsRUFBTSxhQUFBLElBQU4sRUFBWSw4QkFBQSxxQkFBWixFQUFtQywwQkFBQSxpQkFQbkMsQ0FBQTs7QUFBQSxFQVVBLElBQUksQ0FBQyxLQUFMLENBQUEsQ0FWQSxDQUFBOztBQUFBLEVBYU07QUFFSix5QkFBQSxPQUFBLEdBQVMsRUFBVCxDQUFBOztBQUFBLHlCQUNBLGNBQUEsR0FBZ0IsQ0FEaEIsQ0FBQTs7QUFBQSx5QkFFQSxRQUFBLEdBQVUsRUFGVixDQUFBOztBQUFBLHlCQUdBLFFBQUEsR0FBVSxFQUhWLENBQUE7O0FBVWEsSUFBQSxvQkFBRSxNQUFGLEVBQVcsYUFBWCxFQUEyQixvQkFBM0IsRUFBa0QsVUFBbEQsRUFBK0QsVUFBL0QsR0FBQTtBQUNYLE1BRFksSUFBQyxDQUFBLFNBQUEsTUFDYixDQUFBO0FBQUEsTUFEcUIsSUFBQyxDQUFBLGdCQUFBLGFBQ3RCLENBQUE7QUFBQSxNQURxQyxJQUFDLENBQUEsdUJBQUEsb0JBQ3RDLENBQUE7QUFBQSxNQUQ0RCxJQUFDLENBQUEsYUFBQSxVQUM3RCxDQUFBO0FBQUEsTUFEeUUsSUFBQyxDQUFBLGtDQUFBLGFBQWEsRUFDdkYsQ0FBQTtBQUFBLDZEQUFBLENBQUE7QUFBQSxxRUFBQSxDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsT0FBRCxHQUFXLEdBQUEsQ0FBQSxPQUFYLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxhQUFELEdBQWlCLEdBQUEsQ0FBQSxtQkFEakIsQ0FBQTtBQUVBLE1BQUEsSUFBTyxtQkFBUDtBQUNFLFFBQUEsSUFBQSxDQUFLLG1DQUFMLENBQUEsQ0FERjtPQUZBO0FBQUEsTUFJQSxJQUFDLENBQUEsT0FBRCxHQUFXLElBSlgsQ0FBQTtBQUFBLE1BTUEsSUFBQyxDQUFBLFdBQUQsQ0FBQSxDQU5BLENBQUE7QUFBQSxNQVFBLElBQUMsQ0FBQSxrQkFBRCxDQUFBLENBUkEsQ0FBQTtBQUFBLE1BU0EsSUFBQyxDQUFBLG1CQUFELENBQUEsQ0FUQSxDQUFBO0FBQUEsTUFXQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBQyxDQUFBLE1BQU0sQ0FBQyx5QkFBUixDQUFtQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUNwRCxLQUFDLENBQUEsV0FBRCxDQUFBLEVBRG9EO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbkMsQ0FBbkIsQ0FYQSxDQURXO0lBQUEsQ0FWYjs7QUFBQSx5QkE0QkEsV0FBQSxHQUFhLFNBQUEsR0FBQTtBQUNYLFVBQUEsOENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxPQUFELEdBQVcsRUFBWCxDQUFBO0FBQUEsTUFDQSxXQUFBLEdBQWMsSUFBQyxDQUFBLE1BQU0sQ0FBQyxVQUFSLENBQUEsQ0FBb0IsQ0FBQyxTQURuQyxDQUFBO0FBRUE7QUFBQTtXQUFBLDRDQUFBOzJCQUFBO0FBQ0UsUUFBQSxJQUFJLENBQUMsQ0FBQyxPQUFGLENBQVUsTUFBTSxDQUFDLE1BQWpCLENBQUEsSUFBNkIsZUFBZSxNQUFNLENBQUMsTUFBdEIsRUFBQSxXQUFBLE1BQTdCLElBQ0EsQ0FBQyxDQUFDLFFBQUYsQ0FBVyxNQUFNLENBQUMsTUFBbEIsQ0FEQSxJQUM4QixXQUFBLEtBQWUsTUFBTSxDQUFDLE1BRHBELElBRUEsTUFBTSxDQUFDLE1BQVAsWUFBeUIsTUFGekIsSUFFb0MsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFkLENBQW1CLFdBQW5CLENBRnhDO3dCQUdFLElBQUMsQ0FBQSxPQUFPLENBQUMsSUFBVCxDQUFrQixJQUFBLE1BQUEsQ0FBTyxJQUFDLENBQUEsTUFBUixDQUFsQixHQUhGO1NBQUEsTUFBQTtnQ0FBQTtTQURGO0FBQUE7c0JBSFc7SUFBQSxDQTVCYixDQUFBOztBQUFBLHlCQXNDQSxtQkFBQSxHQUFxQixTQUFBLEdBQUE7QUFDbkIsTUFBQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFaLENBQW9CLG1CQUFwQixFQUNqQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxVQUFELEdBQUE7aUJBQWdCLEtBQUMsQ0FBQSxVQUFELEdBQWMsV0FBOUI7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQURpQixDQUFuQixDQUFBLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVosQ0FBb0IsNkJBQXBCLEVBQ2pCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLHFCQUFELEdBQUE7QUFFRSxjQUFBLHFCQUFBO0FBQUEsVUFBQSxLQUFBLEdBQVEsUUFBQSxDQUFTLHFCQUFULENBQVIsQ0FBQTtBQUNBLFVBQUEsSUFBZ0IsS0FBQSxDQUFNLEtBQU4sQ0FBaEI7QUFBQSxZQUFBLEtBQUEsR0FBUSxJQUFSLENBQUE7V0FEQTtBQUFBLFVBR0EsY0FBQSxHQUFpQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsMkJBQWhCLENBSGpCLENBQUE7QUFBQSxVQUlBLEdBQUEsQ0FBSyxrQkFBQSxHQUFrQixjQUF2QixDQUpBLENBQUE7QUFLQSxVQUFBLElBQUcsY0FBQSxLQUFrQixVQUFyQjttQkFDRSxLQUFDLENBQUEsV0FBRCxHQUFlLENBQUMsQ0FBQyxDQUFDLFFBQUYsQ0FBVyxLQUFDLENBQUEsSUFBWixFQUFrQixLQUFsQixDQUFELENBQXlCLENBQUMsSUFBMUIsQ0FBK0IsS0FBL0IsRUFEakI7V0FBQSxNQUFBO21CQUdFLEtBQUMsQ0FBQSxXQUFELEdBQWUsQ0FBQyxDQUFDLENBQUMsUUFBRixDQUFXLEtBQUMsQ0FBQSxJQUFaLEVBQWtCLEtBQWxCLENBQUQsQ0FBeUIsQ0FBQyxJQUExQixDQUErQixLQUEvQixFQUhqQjtXQVBGO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FEaUIsQ0FBbkIsQ0FIQSxDQUFBO0FBQUEsTUFnQkEsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBWixDQUFvQixxQkFBcEIsRUFDakIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsY0FBRCxHQUFBO2lCQUFvQixLQUFDLENBQUEsY0FBRCxHQUFrQixlQUF0QztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRGlCLENBQW5CLENBaEJBLENBQUE7QUFBQSxNQW1CQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFaLENBQW9CLDBCQUFwQixFQUNqQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxpQkFBRCxHQUFBO2lCQUF1QixLQUFDLENBQUEsaUJBQUQsR0FBcUIsa0JBQTVDO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FEaUIsQ0FBbkIsQ0FuQkEsQ0FBQTtBQUFBLE1Bc0JBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVosQ0FBb0Isb0JBQXBCLEVBQ2pCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLFdBQUQsR0FBQTtBQUNFLFVBQUEsS0FBQyxDQUFBLFdBQUQsR0FBZSxXQUFmLENBQUE7aUJBQ0EsS0FBQyxDQUFBLE9BQUQsQ0FBQSxFQUZGO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FEaUIsQ0FBbkIsQ0F0QkEsQ0FBQTtBQUFBLE1BMkJBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVosQ0FBb0Isa0JBQXBCLEVBQ2pCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLFNBQUQsR0FBQTtBQUNFLFVBQUEsS0FBQyxDQUFBLHdCQUFELEdBQTRCLFNBQUEsS0FBYSxNQUF6QyxDQUFBO2lCQUNBLEtBQUMsQ0FBQSxXQUFELENBQUEsRUFGRjtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRGlCLENBQW5CLENBM0JBLENBQUE7QUFBQSxNQWdDQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFaLENBQW9CLHdCQUFwQixFQUNqQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxlQUFELEdBQUE7QUFDRSxVQUFBLEtBQUMsQ0FBQSxlQUFELEdBQW1CLGVBQW5CLENBQUE7aUJBQ0EsS0FBQyxDQUFBLFdBQUQsQ0FBQSxFQUZGO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FEaUIsQ0FBbkIsQ0FoQ0EsQ0FBQTtBQUFBLE1BcUNBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVosQ0FBb0IseUJBQXBCLEVBQ2pCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLGdCQUFELEdBQUE7QUFDRSxVQUFBLEtBQUMsQ0FBQSxnQkFBRCxHQUFvQixnQkFBcEIsQ0FBQTtpQkFDQSxLQUFDLENBQUEsT0FBRCxDQUFBLEVBRkY7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQURpQixDQUFuQixDQXJDQSxDQUFBO0FBQUEsTUEwQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBWixDQUFvQix5QkFBcEIsRUFDakIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsZ0JBQUQsR0FBQTtBQUNFLFVBQUEsS0FBQyxDQUFBLGdCQUFELEdBQW9CLGdCQUFwQixDQUFBO2lCQUNBLEtBQUMsQ0FBQSxPQUFELENBQUEsRUFGRjtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRGlCLENBQW5CLENBMUNBLENBQUE7YUErQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBWixDQUFvQixzQkFBcEIsRUFDakIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsYUFBRCxHQUFBO2lCQUFtQixLQUFDLENBQUEsYUFBRCxHQUFpQixjQUFwQztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRGlCLENBQW5CLEVBaERtQjtJQUFBLENBdENyQixDQUFBOztBQUFBLHlCQTBGQSxrQkFBQSxHQUFvQixTQUFBLEdBQUE7QUFDbEIsVUFBQSxlQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsTUFBTSxDQUFDLGtCQUFSLENBQTJCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDekIsVUFBQSxLQUFDLENBQUEsV0FBRCxDQUFBLENBQUEsQ0FBQTtpQkFDQSxLQUFDLENBQUEsSUFBRCxDQUFBLEVBRnlCO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBM0IsQ0FBQSxDQUFBO0FBQUEsTUFJQSxlQUFBLEdBQWtCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFBRyxVQUFBLElBQWtCLEtBQUMsQ0FBQSxVQUFuQjttQkFBQSxLQUFDLENBQUEsV0FBRCxDQUFBLEVBQUE7V0FBSDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBSmxCLENBQUE7QUFBQSxNQUtBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFDLENBQUEsTUFBTSxDQUFDLFNBQVIsQ0FBQSxDQUFtQixDQUFDLFdBQXBCLENBQWdDLGVBQWhDLENBQW5CLENBTEEsQ0FBQTtBQUFBLE1BTUEsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUMsQ0FBQSxNQUFNLENBQUMsU0FBUixDQUFrQixlQUFsQixDQUFuQixDQU5BLENBQUE7QUFBQSxNQVFBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFDLENBQUEsTUFBTSxDQUFDLGlCQUFSLENBQTBCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDM0MsVUFBQSxJQUFHLEtBQUMsQ0FBQSxjQUFKO21CQUNFLEtBQUMsQ0FBQSxXQUFELENBQUEsRUFERjtXQUFBLE1BRUssSUFBRyxLQUFDLENBQUEsYUFBRCxJQUFtQixLQUFDLENBQUEsUUFBUSxDQUFDLE1BQVYsR0FBbUIsQ0FBekM7QUFDSCxZQUFBLEtBQUMsQ0FBQSxRQUFELEdBQVksRUFBWixDQUFBO0FBQUEsWUFDQSxLQUFDLENBQUEsV0FBRCxDQUFBLENBREEsQ0FBQTttQkFFQSxLQUFDLENBQUEsY0FBRCxDQUFBLEVBSEc7V0FIc0M7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUExQixDQUFuQixDQVJBLENBQUE7QUFBQSxNQWdCQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxZQUFSLENBQXFCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQ3RDLEtBQUMsQ0FBQSxNQUFELENBQUEsRUFEc0M7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFyQixDQUFuQixDQWhCQSxDQUFBO0FBQUEsTUFtQkEsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxTQUFTLENBQUMscUJBQWYsQ0FBcUMsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUN0RCxjQUFBLEtBQUE7QUFBQSxVQUFBLElBQUcsS0FBQyxDQUFBLE1BQU0sQ0FBQyxFQUFSLG9FQUFrRCxDQUFFLFlBQXZEO0FBQ0UsWUFBQSxJQUFrQixLQUFDLENBQUEsaUJBQW5CO0FBQUEsY0FBQSxLQUFDLENBQUEsV0FBRCxDQUFBLENBQUEsQ0FBQTthQUFBO21CQUNBLEtBQUMsQ0FBQSxXQUFELENBQUEsRUFGRjtXQUFBLE1BQUE7QUFJRSxZQUFBLEtBQUMsQ0FBQSxhQUFhLENBQUMsSUFBZixDQUFBLENBQUEsQ0FBQTtBQUFBLFlBQ0EsS0FBQyxDQUFBLG9CQUFvQixDQUFDLE1BQXRCLENBQUEsQ0FEQSxDQUFBO21CQUVBLEtBQUMsQ0FBQSxVQUFVLENBQUMsTUFBWixDQUFBLEVBTkY7V0FEc0Q7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFyQyxDQUFuQixDQW5CQSxDQUFBO0FBQUEsTUE0QkEsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixrQkFBbEIsRUFDakIsYUFEaUIsRUFDRixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUFHLEtBQUMsQ0FBQSxJQUFELENBQUEsRUFBSDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBREUsQ0FBbkIsQ0E1QkEsQ0FBQTtBQUFBLE1BK0JBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0Isa0JBQWxCLEVBQ2pCLHFCQURpQixFQUNNLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQUcsaUJBQUEsQ0FBa0IsS0FBQyxDQUFBLFFBQW5CLEVBQTZCLEtBQUMsQ0FBQSxNQUE5QixFQUFIO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FETixDQUFuQixDQS9CQSxDQUFBO2FBa0NBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0Isa0JBQWxCLEVBQ2pCLHlCQURpQixFQUNVLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQUcscUJBQUEsQ0FBc0IsS0FBQyxDQUFBLFFBQXZCLEVBQWlDLEtBQUMsQ0FBQSxNQUFsQyxFQUFIO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FEVixDQUFuQixFQW5Da0I7SUFBQSxDQTFGcEIsQ0FBQTs7QUFBQSx5QkFpSUEsSUFBQSxHQUFNLFNBQUEsR0FBQTtBQUNKLE1BQUEsSUFBVSxJQUFDLENBQUEsT0FBTyxDQUFDLE1BQVQsS0FBbUIsQ0FBN0I7QUFBQSxjQUFBLENBQUE7T0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLGNBQUQsR0FBa0IsQ0FEbEIsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLFFBQUQsR0FBWSxFQUZaLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxjQUFELENBQUEsQ0FIQSxDQUFBO2FBS0EsSUFBSSxDQUFDLEtBQUwsQ0FDRTtBQUFBLFFBQUEsTUFBQSxFQUFRLFlBQVI7QUFBQSxRQUNBLE1BQUEsRUFBUSxJQUFDLENBQUEsTUFBTSxDQUFDLFVBQVIsQ0FBQSxDQUFvQixDQUFDLFNBRDdCO09BREYsRUFHRSxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxHQUFELEVBQU0sTUFBTixHQUFBO0FBQ0EsY0FBQSxzQkFBQTtBQUFBLFVBQUEsSUFBYSxXQUFiO0FBQUEsa0JBQU0sR0FBTixDQUFBO1dBQUE7QUFBQSxVQUNBLFFBQUEsR0FBVyxJQUFJLENBQUMsUUFBTCxDQUFjLEtBQUMsQ0FBQSxNQUFNLENBQUMsT0FBUixDQUFBLENBQWQsQ0FEWCxDQUFBO0FBQUEsVUFFQSxZQUFBLEdBQ0U7QUFBQSxZQUFBLGdCQUFBLEVBQWtCLENBQWxCO0FBQUEsWUFDQSxJQUFBLEVBQU0sSUFBSSxDQUFDLElBQUwsQ0FBVSxNQUFWLEVBQWtCLFFBQWxCLENBRE47V0FIRixDQUFBO2lCQUtBLEVBQUUsQ0FBQyxTQUFILENBQWEsWUFBWSxDQUFDLElBQTFCLEVBQWdDLEtBQUMsQ0FBQSxNQUFNLENBQUMsT0FBUixDQUFBLENBQWhDLEVBQW1ELFNBQUMsR0FBRCxHQUFBO0FBQ2pELFlBQUEsSUFBYSxXQUFiO0FBQUEsb0JBQU0sR0FBTixDQUFBO2FBQUE7QUFBQSxZQUNBLEtBQUMsQ0FBQSxPQUFPLENBQUMsT0FBVCxDQUFpQixTQUFDLE1BQUQsR0FBQTtxQkFDZixNQUFNLENBQUMsUUFBUCxDQUFnQixZQUFZLENBQUMsSUFBN0IsRUFBbUMsU0FBQyxRQUFELEdBQUE7dUJBQ2pDLEtBQUMsQ0FBQSxjQUFELENBQWdCLFFBQWhCLEVBQTBCLFlBQTFCLEVBQXdDLE1BQXhDLEVBRGlDO2NBQUEsQ0FBbkMsRUFEZTtZQUFBLENBQWpCLENBREEsQ0FEaUQ7VUFBQSxDQUFuRCxFQU5BO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FIRixFQU5JO0lBQUEsQ0FqSU4sQ0FBQTs7QUFBQSx5QkE0SkEsY0FBQSxHQUFnQixTQUFDLFFBQUQsRUFBVyxZQUFYLEVBQXlCLE1BQXpCLEdBQUE7QUFDZCxNQUFBLEdBQUEsQ0FBSSxFQUFBLEdBQUcsTUFBTSxDQUFDLFVBQVYsR0FBcUIsV0FBekIsRUFBcUMsTUFBckMsRUFBNkMsUUFBN0MsQ0FBQSxDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsUUFBRCxHQUFZLElBQUMsQ0FBQSxRQUFRLENBQUMsTUFBVixDQUFpQixRQUFqQixDQUZaLENBQUE7QUFBQSxNQUdBLFlBQVksQ0FBQyxnQkFBYixFQUhBLENBQUE7QUFJQSxNQUFBLElBQUcsWUFBWSxDQUFDLGdCQUFiLEtBQWlDLElBQUMsQ0FBQSxPQUFPLENBQUMsTUFBN0M7QUFDRSxRQUFBLElBQUMsQ0FBQSxPQUFELENBQVMsSUFBQyxDQUFBLFFBQVYsQ0FBQSxDQUFBO2VBQ0EsTUFBQSxDQUFPLFlBQVksQ0FBQyxJQUFwQixFQUEwQixTQUFDLEdBQUQsR0FBQTtBQUN4QixVQUFBLElBQWEsV0FBYjtBQUFBLGtCQUFNLEdBQU4sQ0FBQTtXQUR3QjtRQUFBLENBQTFCLEVBRkY7T0FMYztJQUFBLENBNUpoQixDQUFBOztBQUFBLHlCQXVLQSxjQUFBLEdBQWdCLFNBQUEsR0FBQTtBQUNkLFVBQUEsa0JBQUE7QUFBQSxNQUFBLElBQWMsb0JBQWQ7QUFBQSxjQUFBLENBQUE7T0FBQTtBQUNBO0FBQUEsV0FBQSw0Q0FBQTtzQkFBQTtBQUFBLFFBQUEsQ0FBQyxDQUFDLE9BQUYsQ0FBQSxDQUFBLENBQUE7QUFBQSxPQURBO2FBRUEsSUFBQyxDQUFBLE9BQUQsR0FBVyxLQUhHO0lBQUEsQ0F2S2hCLENBQUE7O0FBQUEseUJBNktBLFlBQUEsR0FBYyxTQUFDLE9BQUQsR0FBQTtBQUNaLFVBQUEsYUFBQTtBQUFBLE1BQUEsTUFBQSxHQUFTLElBQUMsQ0FBQSxNQUFNLENBQUMsZUFBUixDQUF3QixPQUFPLENBQUMsS0FBaEMsRUFBdUM7QUFBQSxRQUFBLFVBQUEsRUFBWSxPQUFaO09BQXZDLENBQVQsQ0FBQTtBQUFBLE1BQ0EsS0FBQSxHQUFRLFNBQUEsR0FBWSxPQUFPLENBQUMsS0FENUIsQ0FBQTtBQUVBLE1BQUEsSUFBRyxJQUFDLENBQUEsV0FBSjtBQUNFLFFBQUEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxjQUFSLENBQXVCLE1BQXZCLEVBQStCO0FBQUEsVUFBQSxJQUFBLEVBQU0sYUFBTjtBQUFBLFVBQXFCLE9BQUEsRUFBTyxLQUE1QjtTQUEvQixDQUFBLENBREY7T0FGQTtBQUlBLE1BQUEsSUFBRyxJQUFDLENBQUEsZ0JBQUo7QUFDRSxRQUFBLElBQUMsQ0FBQSxNQUFNLENBQUMsY0FBUixDQUF1QixNQUF2QixFQUErQjtBQUFBLFVBQUEsSUFBQSxFQUFNLFdBQU47QUFBQSxVQUFtQixPQUFBLEVBQU8sS0FBMUI7U0FBL0IsQ0FBQSxDQURGO09BSkE7QUFNQSxhQUFPLE1BQVAsQ0FQWTtJQUFBLENBN0tkLENBQUE7O0FBQUEseUJBeUxBLGtCQUFBLEdBQW9CLFNBQUMsUUFBRCxHQUFBO0FBQ2xCLFVBQUEsc0RBQUE7QUFBQSxNQUFBLEtBQUEsR0FBUSxFQUFSLENBQUE7QUFBQSxNQUNBLE1BQUEsR0FBUyxDQUFDLFNBQUQsRUFBWSxPQUFaLENBRFQsQ0FBQTtBQUVBLE1BQUEsSUFBMEIsSUFBQyxDQUFBLGdCQUEzQjtBQUFBLFFBQUEsTUFBTSxDQUFDLE9BQVAsQ0FBZSxNQUFmLENBQUEsQ0FBQTtPQUZBO0FBR0EsV0FBQSwrQ0FBQTsrQkFBQTtBQUNFLFFBQUEsSUFBQSxHQUFPLE9BQU8sQ0FBQyxJQUFmLENBQUE7QUFBQSxRQUNBLElBQUEsR0FBTyxLQUFNLENBQUEsSUFBQSxDQUFOLElBQWU7QUFBQSxVQUFFLE9BQUEsRUFBUyxDQUFBLENBQVg7U0FEdEIsQ0FBQTtBQUFBLFFBRUEsUUFBQSxHQUFXLE1BQU0sQ0FBQyxPQUFQLENBQWUsT0FBTyxDQUFDLEtBQXZCLENBRlgsQ0FBQTtBQUdBLFFBQUEsSUFBQSxDQUFBLENBQWdCLFFBQUEsR0FBVyxJQUFJLENBQUMsS0FBaEMsQ0FBQTtBQUFBLG1CQUFBO1NBSEE7QUFBQSxRQUlBLElBQUksQ0FBQyxLQUFMLEdBQWEsUUFKYixDQUFBO0FBQUEsUUFLQSxJQUFJLENBQUMsR0FBTCxHQUFXLE9BTFgsQ0FBQTtBQUFBLFFBTUEsS0FBTSxDQUFBLElBQUEsQ0FBTixHQUFjLElBTmQsQ0FERjtBQUFBLE9BSEE7QUFXQSxhQUFPLEtBQVAsQ0Faa0I7SUFBQSxDQXpMcEIsQ0FBQTs7QUFBQSx5QkF3TUEsT0FBQSxHQUFTLFNBQUMsUUFBRCxHQUFBO0FBQ1AsVUFBQSx5QkFBQTs7UUFEUSxXQUFXO09BQ25CO0FBQUEsTUFBQSxJQUFDLENBQUEsY0FBRCxDQUFBLENBQUEsQ0FBQTtBQUVBLE1BQUEsSUFBQSxDQUFBLElBQWUsQ0FBQSxNQUFNLENBQUMsT0FBUixDQUFBLENBQWQ7QUFBQSxjQUFBLENBQUE7T0FGQTtBQUlBLE1BQUEsSUFBQSxDQUFBLENBQU8sSUFBQyxDQUFBLFdBQUQsSUFBZ0IsSUFBQyxDQUFBLGdCQUF4QixDQUFBO0FBQ0UsUUFBQSxJQUFDLENBQUEsV0FBRCxDQUFBLENBQUEsQ0FBQTtBQUNBLGNBQUEsQ0FGRjtPQUpBOztRQVFBLElBQUMsQ0FBQSxVQUFXO09BUlo7QUFTQTtBQUFBLFdBQUEsYUFBQTsyQkFBQTtBQUNFLFFBQUEsTUFBQSxHQUFTLElBQUMsQ0FBQSxZQUFELENBQWMsSUFBSSxDQUFDLEdBQW5CLENBQVQsQ0FBQTtBQUFBLFFBQ0EsSUFBQyxDQUFBLE9BQU8sQ0FBQyxJQUFULENBQWMsTUFBZCxDQURBLENBREY7QUFBQSxPQVRBO2FBYUEsSUFBQyxDQUFBLFdBQUQsQ0FBQSxFQWRPO0lBQUEsQ0F4TVQsQ0FBQTs7QUFBQSx5QkF5TkEsV0FBQSxHQUFhLFNBQUEsR0FBQTtBQUNYLE1BQUEsSUFBQyxDQUFBLG9CQUFvQixDQUFDLE1BQXRCLENBQTZCLElBQUMsQ0FBQSxRQUE5QixFQUF3QyxJQUFDLENBQUEsTUFBekMsQ0FBQSxDQUFBO0FBQ0EsTUFBQSxJQUFHLElBQUMsQ0FBQSx3QkFBSjtBQUNFLFFBQUEsSUFBQyxDQUFBLGFBQWEsQ0FBQyxNQUFmLENBQXNCLElBQUMsQ0FBQSxRQUF2QixFQUFpQyxJQUFDLENBQUEsTUFBbEMsQ0FBQSxDQURGO09BQUEsTUFBQTtBQUdFLFFBQUEsSUFBQyxDQUFBLGFBQWEsQ0FBQyxNQUFmLENBQXNCLEVBQXRCLEVBQTBCLElBQUMsQ0FBQSxNQUEzQixDQUFBLENBSEY7T0FEQTtBQU1BLE1BQUEsSUFBRyxJQUFDLENBQUEsZUFBSjtlQUNFLElBQUMsQ0FBQSxVQUFVLENBQUMsTUFBWixDQUFtQixJQUFDLENBQUEsUUFBcEIsRUFBOEIsSUFBQyxDQUFBLE1BQS9CLEVBREY7T0FBQSxNQUFBO2VBR0UsSUFBQyxDQUFBLFVBQVUsQ0FBQyxNQUFaLENBQW1CLEVBQW5CLEVBQXVCLElBQUMsQ0FBQSxNQUF4QixFQUhGO09BUFc7SUFBQSxDQXpOYixDQUFBOztBQUFBLHlCQXNPQSxNQUFBLEdBQVEsU0FBQSxHQUFBO0FBRU4sVUFBQSxrQkFBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLGFBQWEsQ0FBQyxJQUFmLENBQUEsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsb0JBQW9CLENBQUMsTUFBdEIsQ0FBQSxDQURBLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxVQUFVLENBQUMsTUFBWixDQUFBLENBRkEsQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxPQUFmLENBQUEsQ0FIQSxDQUFBO0FBSUE7QUFBQSxXQUFBLDRDQUFBO3NCQUFBO0FBQUEsUUFBQSxDQUFDLENBQUMsT0FBRixDQUFBLENBQUEsQ0FBQTtBQUFBLE9BSkE7YUFLQSxJQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsQ0FBYyxhQUFkLEVBUE07SUFBQSxDQXRPUixDQUFBOztBQUFBLHlCQW9QQSxZQUFBLEdBQWMsU0FBQyxRQUFELEdBQUE7YUFDWixJQUFDLENBQUEsT0FBTyxDQUFDLEVBQVQsQ0FBWSxhQUFaLEVBQTJCLFFBQTNCLEVBRFk7SUFBQSxDQXBQZCxDQUFBOztzQkFBQTs7TUFmRixDQUFBOztBQUFBLEVBdVFBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFVBdlFqQixDQUFBO0FBQUEiCn0=
//# sourceURL=/home/iraasta/.atom/packages/linter/lib/linter-view.coffee