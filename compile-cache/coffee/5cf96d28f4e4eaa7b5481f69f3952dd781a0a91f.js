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
        'delorean:backward': (function(_this) {
          return function() {
            return _this.backward();
          };
        })(this),
        'delorean:forward': (function(_this) {
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG1CQUFBOztBQUFBLEVBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQUFELENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxhQUFBLEVBQWUsSUFBZjtBQUFBLElBQ0EsWUFBQSxFQUFjLEVBRGQ7QUFBQSxJQUVBLFdBQUEsRUFBYSxFQUZiO0FBQUEsSUFHQSxTQUFBLEVBQVksS0FIWjtBQUFBLElBSUEsY0FBQSxFQUFpQixJQUpqQjtBQUFBLElBTUEsUUFBQSxFQUFVLFNBQUEsR0FBQTtBQUNSLFVBQUEsSUFBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLGFBQUQsR0FBaUIsR0FBQSxDQUFBLG1CQUFqQixDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUNqQjtBQUFBLFFBQUEsbUJBQUEsRUFBcUIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7bUJBQUcsS0FBQyxDQUFBLFFBQUQsQ0FBQSxFQUFIO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBckI7QUFBQSxRQUNBLGtCQUFBLEVBQW9CLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO21CQUFHLEtBQUMsQ0FBQSxPQUFELENBQUEsRUFBSDtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRHBCO09BRGlCLENBQW5CLENBREEsQ0FBQTtBQUFBLE1BSUEsSUFBQSxHQUFPLElBSlAsQ0FBQTthQUtBLElBQUksQ0FBQyxTQUFTLENBQUMsa0JBQWYsQ0FBa0MsU0FBQyxNQUFELEdBQUE7ZUFDaEMsTUFBTSxDQUFD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
//# sourceURL=/home/iraasta/.atom/packages/delorean/lib/delorean.coffee