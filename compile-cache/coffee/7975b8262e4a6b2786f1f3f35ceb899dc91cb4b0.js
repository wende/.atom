(function() {
  var CompositeDisposable;

  CompositeDisposable = require('atom').CompositeDisposable;

  module.exports = {
    subscriptions: null,
    frontContext: [],
    backContext: [],
    blockNext: false,
    currentContext: null,
    activate: function() {
      var self;
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'autocomplete-elixir:backward': (function(_this) {
          return function() {
            return _this.backward();
          };
        })(this),
        'autocomplete-elixir:forward': (function(_this) {
          return function() {
            return _this.forward();
          };
        })(this)
      }));
      self = this;
      return atom.workspace.observeTextEditors(function(editor) {
        return editor.onDidChangeCursorPosition(function(e) {
          return self.contextChanged(editor.getPath(), e.newBufferPosition, e.textChanged);
        });
      });
    },
    deactivate: function() {
      return this.subscriptions.dispose();
    },
    forward: function() {
      var context, editor;
      if (editor = atom.workspace.getActiveTextEditor()) {
        if (context = this.frontContext.shift()) {
          this.backContext.push(this.currentContext);
          return this.setContext(editor, context);
        }
      }
    },
    backward: function() {
      var context, editor;
      if (editor = atom.workspace.getActiveTextEditor()) {
        if (context = this.backContext.pop()) {
          this.frontContext.unshift(this.currentContext);
          return this.setContext(editor, context);
        }
      }
    },
    contextChanged: function(file, position, insert) {
      if (insert) {
        this.currentContext = {
          file: file,
          position: position
        };
        return;
      }
      if (this.blockNext) {
        this.blockNext = false;
        return;
      }
      if (this.currentContext) {
        this.backContext.push(this.currentContext);
        this.frontContext = [];
      }
      return this.currentContext = {
        file: file,
        position: position
      };
    },
    setContext: function(editor, context) {
      this.blockNext = true;
      this.setPosition(editor, context.file, context.position);
      return this.currentContext = context;
    },
    setPosition: function(editor, file, position) {
      if (file === editor.getPath()) {
        return editor.setCursorBufferPosition(position);
      } else {
        return atom.workspace.open(file, {
          initialLine: position.row,
          initialColumn: position.column
        });
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvaXJhYXN0YS8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtZWxpeGlyL2xpYi9kZWxvcmVhbi9kZWxvcmVhbi5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsbUJBQUE7O0FBQUEsRUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBQUQsQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLGFBQUEsRUFBZSxJQUFmO0FBQUEsSUFDQSxZQUFBLEVBQWMsRUFEZDtBQUFBLElBRUEsV0FBQSxFQUFhLEVBRmI7QUFBQSxJQUdBLFNBQUEsRUFBWSxLQUhaO0FBQUEsSUFJQSxjQUFBLEVBQWlCLElBSmpCO0FBQUEsSUFNQSxRQUFBLEVBQVUsU0FBQSxHQUFBO0FBQ1IsVUFBQSxJQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsYUFBRCxHQUFpQixHQUFBLENBQUEsbUJBQWpCLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQ2pCO0FBQUEsUUFBQSw4QkFBQSxFQUFnQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTttQkFBRyxLQUFDLENBQUEsUUFBRCxDQUFBLEVBQUg7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFoQztBQUFBLFFBQ0EsNkJBQUEsRUFBK0IsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7bUJBQUcsS0FBQyxDQUFBLE9BQUQsQ0FBQSxFQUFIO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FEL0I7T0FEaUIsQ0FBbkIsQ0FEQSxDQUFBO0FBQUEsTUFJQSxJQUFBLEdBQU8s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

//# sourceURL=/home/iraasta/.atom/packages/autocomplete-elixir/lib/delorean/delorean.coffee
