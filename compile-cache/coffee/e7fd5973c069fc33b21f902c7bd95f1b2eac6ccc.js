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
        console.log("got editor");
        return editor.onDidChangeCursorPosition(function(e) {
          console.log("got change");
          return self.contextChanged(editor.getPath(), e.newBufferPosition);
        });
      });
    },
    deactivate: function() {
      return this.subscriptions.dispose();
    },
    forward: function() {
      var context, currentContext, editor;
      if (editor = atom.workspace.getActiveTextEditor()) {
        if (context = this.frontContext.shift()) {
          this.blockNext = true;
          if (context.file === editor.getPath()) {
            editor.setCursorBufferPosition(context.position);
          } else {
            atom.workspace.open(context.file, {
              initialLine: context.position.row,
              initialColumn: context.position.column
            });
          }
          currentContext = context;
          console.log(context);
          return this.backContext.push(context);
        }
      }
    },
    backward: function() {
      var context, currentContext, editor;
      if (editor = atom.workspace.getActiveTextEditor()) {
        if (context = this.backContext.pop()) {
          this.blockNext = true;
          if (context.file === editor.getPath()) {
            editor.setCursorBufferPosition(context.position);
          } else {
            atom.workspace.open(context.file, {
              initialLine: context.position.row,
              initialColumn: context.position.column
            });
          }
          currentContext = context;
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
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG1CQUFBOztBQUFBLEVBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQUFELENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxhQUFBLEVBQWUsSUFBZjtBQUFBLElBQ0EsWUFBQSxFQUFjLEVBRGQ7QUFBQSxJQUVBLFdBQUEsRUFBYSxFQUZiO0FBQUEsSUFHQSxTQUFBLEVBQVksS0FIWjtBQUFBLElBSUEsY0FBQSxFQUFpQixJQUpqQjtBQUFBLElBTUEsUUFBQSxFQUFVLFNBQUEsR0FBQTtBQUNSLFVBQUEsSUFBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLGFBQUQsR0FBaUIsR0FBQSxDQUFBLG1CQUFqQixDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUNqQjtBQUFBLFFBQUEsbUJBQUEsRUFBcUIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7bUJBQUcsS0FBQyxDQUFBLFFBQUQsQ0FBQSxFQUFIO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBckI7QUFBQSxRQUNBLGtCQUFBLEVBQW9CLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO21CQUFHLEtBQUMsQ0FBQSxPQUFELENBQUEsRUFBSDtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRHBCO09BRGlCLENBQW5CLENBREEsQ0FBQTtBQUFBLE1BSUEsSUFBQSxHQUFPLElBSlAsQ0FBQTthQUtBLElBQUksQ0FBQyxTQUFTLENBQUMsa0JBQWYsQ0FBa0MsU0FBQyxNQUFELEdBQUE7QUFDaEMsUUFBQSxPQUFP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
//# sourceURL=/home/iraasta/.atom/packages/delorean/lib/delorean.coffee