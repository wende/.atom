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
          console.log("got change");
          console.log(e);
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
          this.setContext(editor, context);
          console.log(context);
          return this.backContext.push(context);
        }
      }
    },
    backward: function() {
      var context, editor;
      if (editor = atom.workspace.getActiveTextEditor()) {
        if (context = this.backContext.pop()) {
          if (context === this.currentContext) {
            context = this.backContext.pop();
          }
          this.setContext(editor, context);
          console.log(context);
          return this.frontContext.unshift(context);
        }
      }
    },
    contextChanged: function(file, position, insert) {
      if (insert) {
        return;
      }
      if (this.blockNext) {
        this.blockNext = false;
        return;
      }
      if (this.currentContext) {
        this.frontContext = [];
      }
      this.currentContext = {
        file: file,
        position: position
      };
      return this.backContext.push(this.currentContext);
    },
    setContext: function(editor, context) {
      var currentContext;
      this.blockNext = true;
      this.setPosition(editor, context.file, context.position);
      return currentContext = context;
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