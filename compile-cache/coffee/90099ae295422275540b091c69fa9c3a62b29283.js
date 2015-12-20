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
          return self.contextChanged(editor.getPath(), e.newBufferPosition);
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
          this.setContext(context);
          console.log(context);
          return this.backContext.push(context);
        }
      }
    },
    backward: function() {
      var context, editor;
      if (editor = atom.workspace.getActiveTextEditor()) {
        if (context = this.backContext.pop()) {
          this.setContext(context);
          console.log(context);
          return this.frontContext.unshift(context);
        }
      }
    },
    contextChanged: function(file, position) {
      if (this.blockNext) {
        this.blockNext = false;
        return;
      }
      if (this.currentContext) {
        this.backContext.push(this.currentContext);
      }
      return this.currentContext = {
        file: file,
        position: position
      };
    },
    setContext: function(context) {
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