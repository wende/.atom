(function() {
  var Commands, CompositeDisposable, EditorLinter, Emitter, Helpers, Linter, LinterViews, Path, _ref;

  Path = require('path');

  _ref = require('atom'), CompositeDisposable = _ref.CompositeDisposable, Emitter = _ref.Emitter;

  LinterViews = require('./linter-views');

  EditorLinter = require('./editor-linter');

  Helpers = require('./helpers');

  Commands = require('./commands');

  Linter = (function() {
    function Linter() {
      this.lintOnFly = true;
      this.views = new LinterViews(this);
      this.commands = new Commands(this);
      this._subscriptions = new CompositeDisposable;
      this._emitter = new Emitter;
      this._editorLinters = new Map;
      this._messagesProject = new Map;
      this._linters = new Set;
      this._subscriptions.add(atom.config.observe('linter.showErrorInline', (function(_this) {
        return function(showBubble) {
          return _this.views.setShowBubble(showBubble);
        };
      })(this)));
      this._subscriptions.add(atom.config.observe('linter.showErrorPanel', (function(_this) {
        return function(showPanel) {
          return _this.views.setShowPanel(showPanel);
        };
      })(this)));
      this._subscriptions.add(atom.config.observe('linter.underlineIssues', (function(_this) {
        return function(underlineIssues) {
          return _this.views.setUnderlineIssues(underlineIssues);
        };
      })(this)));
      this._subscriptions.add(atom.config.observe('linter.lintOnFly', (function(_this) {
        return function(value) {
          return _this.lintOnFly = value;
        };
      })(this)));
      this._subscriptions.add(atom.workspace.onDidChangeActivePaneItem((function(_this) {
        return function() {
          return _this.commands.lint();
        };
      })(this)));
      this._subscriptions.add(atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          var currentEditorLinter;
          currentEditorLinter = new EditorLinter(_this, editor);
          _this._editorLinters.set(editor, currentEditorLinter);
          _this._emitter.emit('observe-editor-linters', currentEditorLinter);
          currentEditorLinter.lint(false);
          return editor.onDidDestroy(function() {
            currentEditorLinter.destroy();
            return _this._editorLinters["delete"](editor);
          });
        };
      })(this)));
    }

    Linter.prototype.addLinter = function(linter) {
      var err;
      try {
        if (Helpers.validateLinter(linter)) {
          return this._linters.add(linter);
        }
      } catch (_error) {
        err = _error;
        return atom.notifications.addError("Invalid Linter: " + err.message, {
          detail: err.stack,
          dismissable: true
        });
      }
    };

    Linter.prototype.deleteLinter = function(linter) {
      if (!this.hasLinter(linter)) {
        return;
      }
      this._linters["delete"](linter);
      if (linter.scope === 'project') {
        this.deleteProjectMessages(linter);
      } else {
        this.eachEditorLinter(function(editorLinter) {
          return editorLinter.deleteMessages(linter);
        });
      }
      return this.views.render();
    };

    Linter.prototype.hasLinter = function(linter) {
      return this._linters.has(linter);
    };

    Linter.prototype.getLinters = function() {
      return this._linters;
    };

    Linter.prototype.onDidChangeProjectMessages = function(callback) {
      return this._emitter.on('did-change-project-messages', callback);
    };

    Linter.prototype.getProjectMessages = function() {
      return this._messagesProject;
    };

    Linter.prototype.setProjectMessages = function(linter, messages) {
      this._messagesProject.set(linter, Helpers.validateResults(messages));
      return this._emitter.emit('did-change-project-messages', this._messagesProject);
    };

    Linter.prototype.deleteProjectMessages = function(linter) {
      this._messagesProject["delete"](linter);
      return this._emitter.emit('did-change-project-messages', this._messagesProject);
    };

    Linter.prototype.getActiveEditorLinter = function() {
      return this.getEditorLinter(atom.workspace.getActiveTextEditor());
    };

    Linter.prototype.getEditorLinter = function(editor) {
      return this._editorLinters.get(editor);
    };

    Linter.prototype.eachEditorLinter = function(callback) {
      return this._editorLinters.forEach(callback);
    };

    Linter.prototype.observeEditorLinters = function(callback) {
      this.eachEditorLinter(callback);
      return this._emitter.on('observe-editor-linters', callback);
    };

    Linter.prototype.deactivate = function() {
      this._subscriptions.dispose();
      this.eachEditorLinter(function(linter) {
        return linter.destroy();
      });
      this.views.destroy();
      return this.commands.destroy();
    };

    return Linter;

  })();

  module.exports = Linter;

}).call(this);
