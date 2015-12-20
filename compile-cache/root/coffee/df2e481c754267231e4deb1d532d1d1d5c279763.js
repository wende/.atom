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
      this.subscriptions = new CompositeDisposable;
      this.emitter = new Emitter;
      this.editorLinters = new Map;
      this.messagesProject = new Map;
      this.linters = new Set;
      this.subscriptions.add(atom.config.observe('linter.showErrorInline', (function(_this) {
        return function(showBubble) {
          return _this.views.setShowBubble(showBubble);
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('linter.showErrorPanel', (function(_this) {
        return function(showPanel) {
          return _this.views.setShowPanel(showPanel);
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('linter.underlineIssues', (function(_this) {
        return function(underlineIssues) {
          return _this.views.setUnderlineIssues(underlineIssues);
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('linter.lintOnFly', (function(_this) {
        return function(value) {
          return _this.lintOnFly = value;
        };
      })(this)));
      this.subscriptions.add(atom.project.onDidChangePaths((function(_this) {
        return function() {
          return _this.commands.lint();
        };
      })(this)));
      this.subscriptions.add(atom.workspace.onDidChangeActivePaneItem((function(_this) {
        return function() {
          return _this.commands.lint();
        };
      })(this)));
      this.subscriptions.add(atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          var currentEditorLinter;
          currentEditorLinter = new EditorLinter(_this, editor);
          _this.editorLinters.set(editor, currentEditorLinter);
          _this.emitter.emit('observe-editor-linters', currentEditorLinter);
          currentEditorLinter.lint(false);
          return editor.onDidDestroy(function() {
            currentEditorLinter.destroy();
            return _this.editorLinters["delete"](editor);
          });
        };
      })(this)));
    }

    Linter.prototype.addLinter = function(linter) {
      var err;
      try {
        if (Helpers.validateLinter(linter)) {
          return this.linters.add(linter);
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
      this.linters["delete"](linter);
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
      return this.linters.has(linter);
    };

    Linter.prototype.getLinters = function() {
      return this.linters;
    };

    Linter.prototype.onDidChangeProjectMessages = function(callback) {
      return this.emitter.on('did-change-project-messages', callback);
    };

    Linter.prototype.getProjectMessages = function() {
      return this.messagesProject;
    };

    Linter.prototype.setProjectMessages = function(linter, messages) {
      this.messagesProject.set(linter, Helpers.validateResults(messages));
      this.emitter.emit('did-change-project-messages', this.messagesProject);
      return this.views.render();
    };

    Linter.prototype.deleteProjectMessages = function(linter) {
      this.messagesProject["delete"](linter);
      this.emitter.emit('did-change-project-messages', this.messagesProject);
      return this.views.render();
    };

    Linter.prototype.getActiveEditorLinter = function() {
      return this.getEditorLinter(atom.workspace.getActiveTextEditor());
    };

    Linter.prototype.getEditorLinter = function(editor) {
      return this.editorLinters.get(editor);
    };

    Linter.prototype.eachEditorLinter = function(callback) {
      return this.editorLinters.forEach(callback);
    };

    Linter.prototype.observeEditorLinters = function(callback) {
      this.eachEditorLinter(callback);
      return this.emitter.on('observe-editor-linters', callback);
    };

    Linter.prototype.deactivate = function() {
      this.subscriptions.dispose();
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDhGQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBQVAsQ0FBQTs7QUFBQSxFQUNBLE9BQWlDLE9BQUEsQ0FBUSxNQUFSLENBQWpDLEVBQUMsMkJBQUEsbUJBQUQsRUFBc0IsZUFBQSxPQUR0QixDQUFBOztBQUFBLEVBRUEsV0FBQSxHQUFjLE9BQUEsQ0FBUSxnQkFBUixDQUZkLENBQUE7O0FBQUEsRUFHQSxZQUFBLEdBQWUsT0FBQSxDQUFRLGlCQUFSLENBSGYsQ0FBQTs7QUFBQSxFQUlBLE9BQUEsR0FBVSxPQUFBLENBQVEsV0FBUixDQUpWLENBQUE7O0FBQUEsRUFLQSxRQUFBLEdBQVcsT0FBQSxDQUFRLFlBQVIsQ0FMWCxDQUFBOztBQUFBLEVBT007QUFDUyxJQUFBLGdCQUFBLEdBQUE7QUFFWCxNQUFBLElBQUMsQ0FBQSxTQUFELEdBQWEsSUFBYixDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsS0FBRCxHQUFhLElBQUEsV0FBQSxDQUFZLElBQVosQ0FEYixDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsUUFBRCxHQUFnQixJQUFBLFFBQUEsQ0FBUyxJQUFULENBRmhCLENBQUE7QUFBQSxNQUtBLElBQUMsQ0FBQSxhQUFELEdBQWlCLEdBQUEsQ0FBQSxtQkFMakIsQ0FBQTtBQUFBLE1BTUEsSUFBQyxDQUFBLE9BQUQsR0FBVyxHQUFBLENBQUEsT0FOWCxDQUFBO0FBQUEsTUFPQSxJQUFDLENBQUEsYUFBRCxHQUFpQixHQUFBLENBQUEsR0FQakIsQ0FBQTtBQUFBLE1BUUEsSUFBQyxDQUFBLGVBQUQsR0FBbUIsR0FBQSxDQUFBLEdBUm5CLENBQUE7QUFBQSxNQVNBLElBQUMsQ0FBQSxPQUFELEdBQVcsR0FBQSxDQUFBLEdBVFgsQ0FBQTtBQUFBLE1BV0Es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
//# sourceURL=/home/iraasta/.atom/packages/linter/lib/linter-plus.coffee