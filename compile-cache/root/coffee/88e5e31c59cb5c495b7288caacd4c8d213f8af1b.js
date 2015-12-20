(function() {
  var CompositeDisposable, EditorLinter, Emitter, Helpers, Range, _ref,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  _ref = require('atom'), CompositeDisposable = _ref.CompositeDisposable, Emitter = _ref.Emitter, Range = _ref.Range;

  Helpers = require('./helpers');

  EditorLinter = (function() {
    function EditorLinter(linter, editor) {
      var _ref1;
      this.linter = linter;
      this.editor = editor;
      this.messages = new Map;
      this.status = true;
      this.inProgress = false;
      this.inProgressFly = false;
      if (this.editor === atom.workspace.getActiveTextEditor()) {
        this.linter.views.updateCurrentLine((_ref1 = this.editor.getCursorBufferPosition()) != null ? _ref1.row : void 0);
      }
      this.emitter = new Emitter;
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(this.editor.onDidSave((function(_this) {
        return function() {
          return _this.lint(false);
        };
      })(this)));
      this.subscriptions.add(this.editor.onDidChangeCursorPosition((function(_this) {
        return function(_arg) {
          var newBufferPosition;
          newBufferPosition = _arg.newBufferPosition;
          _this.linter.views.updateCurrentLine(newBufferPosition.row);
          return _this.linter.views.updateBubble(newBufferPosition);
        };
      })(this)));
      this.subscriptions.add(this.editor.onDidStopChanging((function(_this) {
        return function() {
          if (_this.linter.lintOnFly) {
            return _this.lint(true);
          }
        };
      })(this)));
    }

    EditorLinter.prototype.toggleStatus = function() {
      return this.setStatus(!this.status);
    };

    EditorLinter.prototype.getStatus = function() {
      return this.status;
    };

    EditorLinter.prototype.setStatus = function(status) {
      this.status = status;
      if (!status) {
        this.messages.clear();
        return this.linter.views.render();
      }
    };

    EditorLinter.prototype.getMessages = function() {
      return this.messages;
    };

    EditorLinter.prototype.deleteMessages = function(linter) {
      this.messages["delete"](linter);
      if (this.editor === atom.workspace.getActiveTextEditor()) {
        return this.linter.views.render();
      }
    };

    EditorLinter.prototype.setMessages = function(linter, messages) {
      this.messages.set(linter, Helpers.validateResults(messages));
      if (this.editor === atom.workspace.getActiveTextEditor()) {
        return this.linter.views.render();
      }
    };

    EditorLinter.prototype.destroy = function() {
      this.emitter.emit('did-destroy');
      return this.subscriptions.dispose();
    };

    EditorLinter.prototype.onDidUpdate = function(callback) {
      return this.emitter.on('did-update', callback);
    };

    EditorLinter.prototype.onDidDestroy = function(callback) {
      return this.emitter.on('did-destroy', callback);
    };

    EditorLinter.prototype.lint = function(wasTriggeredOnChange) {
      var scopes;
      if (!this.status) {
        return;
      }
      if (this.editor !== atom.workspace.getActiveTextEditor()) {
        return;
      }
      if (!this.editor.getPath()) {
        return;
      }
      if (this.lock(wasTriggeredOnChange)) {
        return;
      }
      scopes = this.editor.scopeDescriptorForBufferPosition(this.editor.getCursorBufferPosition()).scopes;
      scopes.push('*');
      return Promise.all(this.triggerLinters(wasTriggeredOnChange, scopes)).then((function(_this) {
        return function() {
          return _this.lock(wasTriggeredOnChange, false);
        };
      })(this));
    };

    EditorLinter.prototype.triggerLinters = function(wasTriggeredOnChange, scopes) {
      var Promises;
      Promises = [];
      this.linter.getLinters().forEach((function(_this) {
        return function(linter) {
          if (_this.linter.lintOnFly) {
            if (wasTriggeredOnChange !== linter.lintOnFly) {
              return;
            }
          }
          if (!scopes.some(function(entry) {
            return __indexOf.call(linter.grammarScopes, entry) >= 0;
          })) {
            return;
          }
          return Promises.push(new Promise(function(resolve) {
            return resolve(linter.lint(_this.editor));
          }).then(function(results) {
            if (linter.scope === 'project') {
              return _this.linter.setProjectMessages(linter, results);
            } else {
              _this.setMessages(linter, results);
              return _this.emitter.emit('did-update');
            }
          })["catch"](function(error) {
            return atom.notifications.addError(error.message, {
              detail: error.stack,
              dismissable: true
            });
          }));
        };
      })(this));
      return Promises;
    };

    EditorLinter.prototype.lock = function(wasTriggeredOnChange, value) {
      var key;
      key = wasTriggeredOnChange ? 'inProgressFly' : 'inProgress';
      if (typeof value === 'undefined') {
        return this[key];
      } else {
        return this[key] = value;
      }
    };

    return EditorLinter;

  })();

  module.exports = EditorLinter;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGdFQUFBO0lBQUEscUpBQUE7O0FBQUEsRUFBQSxPQUF3QyxPQUFBLENBQVEsTUFBUixDQUF4QyxFQUFDLDJCQUFBLG1CQUFELEVBQXNCLGVBQUEsT0FBdEIsRUFBK0IsYUFBQSxLQUEvQixDQUFBOztBQUFBLEVBQ0EsT0FBQSxHQUFVLE9BQUEsQ0FBUSxXQUFSLENBRFYsQ0FBQTs7QUFBQSxFQUdNO0FBQ1MsSUFBQSxzQkFBRSxNQUFGLEVBQVcsTUFBWCxHQUFBO0FBQ1gsVUFBQSxLQUFBO0FBQUEsTUFEWSxJQUFDLENBQUEsU0FBQSxNQUNiLENBQUE7QUFBQSxNQURxQixJQUFDLENBQUEsU0FBQSxNQUN0QixDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsUUFBRCxHQUFZLEdBQUEsQ0FBQSxHQUFaLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxNQUFELEdBQVUsSUFEVixDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsVUFBRCxHQUFjLEtBRmQsQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLGFBQUQsR0FBaUIsS0FIakIsQ0FBQTtBQUtBLE1BQUEsSUFBRyxJQUFDLENBQUEsTUFBRCxLQUFXLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQUFkO0FBQ0UsUUFBQSxJQUFDLENBQUEsTUFBTSxDQUFDLEtBQUssQ0FBQyxpQkFBZCxnRUFBaUUsQ0FBRSxZQUFuRSxDQUFBLENBREY7T0FMQTtBQUFBLE1BUUEsSUFBQyxDQUFBLE9BQUQsR0FBVyxHQUFBLENBQUEsT0FSWCxDQUFBO0FBQUEsTUFTQSxJQUFDLENBQUEsYUFBRCxHQUFpQixHQUFBLENBQUEsbUJBVGpCLENBQUE7QUFBQSxNQVdBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUNFLElBQUMsQ0FBQSxNQUFNLENBQUMs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
//# sourceURL=/home/iraasta/.atom/packages/linter/lib/editor-linter.coffee