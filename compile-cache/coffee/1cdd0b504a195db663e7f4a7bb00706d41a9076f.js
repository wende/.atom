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
          if (context.file === editor.getPath()) {
            this.blockNext = true;
            editor.setCursorBufferPosition(context.position);
          } else {
            atom.workspace.open(contex.file, {
              initialLine: context.position.row,
              initialColumn: contex.position.column
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
          editor.setCursorBufferPosition(context.position);
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG1CQUFBOztBQUFBLEVBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQUFELENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxhQUFBLEVBQWUsSUFBZjtBQUFBLElBQ0EsWUFBQSxFQUFjLEVBRGQ7QUFBQSxJQUVBLFdBQUEsRUFBYSxFQUZiO0FBQUEsSUFHQSxTQUFBLEVBQVksS0FIWjtBQUFBLElBSUEsY0FBQSxFQUFpQixJQUpqQjtBQUFBLElBTUEsUUFBQSxFQUFVLFNBQUEsR0FBQTtBQUNSLFVBQUEsSUFBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLGFBQUQsR0FBaUIsR0FBQSxDQUFBLG1CQUFqQixDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUNqQjtBQUFBLFFBQUEsbUJBQUEsRUFBcUIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7bUJBQUcsS0FBQyxDQUFBLFFBQUQsQ0FBQSxFQUFIO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBckI7QUFBQSxRQUNBLGtCQUFBLEVBQW9CLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO21CQUFHLEtBQUMsQ0FBQSxPQUFELENBQUEsRUFBSDtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRHBCO09BRGlCLENBQW5CLENBREEsQ0FBQTtBQUFBLE1BSUEsSUFBQSxHQUFPLElBSlAsQ0FBQTthQUtBLElBQUksQ0FBQyxTQUFTLENBQUMsa0JBQWYsQ0FBa0MsU0FBQyxNQUFELEdBQUE7QUFDaEMsUUFBQSxPQUFPLENBQUMsR0FBUixDQUFZLFlBQVosQ0FBQSxDQUFBO2VBQ0EsTUFBTSxDQUFDLHlCQUFQLENBQWlDLFNBQUMsQ0FBRCxHQUFBO0FBQy9CLFVBQUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSxZQUFaLENBQUEsQ0FBQTtpQkFDQSxJQUFJLENBQUMsY0FBTCxDQUFvQixNQUFNLENBQUMsT0FBUCxDQUFBLENBQXBCLEVBQXNDLENBQUMsQ0FBQyxpQkFBeEMsRUFGK0I7UUFBQSxDQUFqQyxFQUZnQztNQUFBLENBQWxDLEVBTlE7SUFBQSxDQU5WO0FBQUEsSUFrQkEsVUFBQSxFQUFZLFNBQUEsR0FBQTthQUNWLElBQUMsQ0FBQSxhQUFhLENBQUMsT0FBZixDQUFBLEVBRFU7SUFBQSxDQWxCWjtBQUFBLElBcUJBLE9BQUEsRUFBUyxTQUFBLEdBQUE7QUFDUCxVQUFBLCtCQUFBO0FBQUEsTUFBQSxJQUFHLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FBWjtBQUNFLFFBQUEsSUFBRyxPQUFBLEdBQVUsSUFBQyxDQUFBLFlBQVksQ0FBQyxLQUFkLENBQUEsQ0FBYjtBQUNFLFVBQUEsSUFBRyxPQUFPLENBQUMsSUFBUixLQUFnQixNQUFNLENBQUMsT0FBUCxDQUFBLENBQW5CO0FBQ0UsWUFBQSxJQUFDLENBQUEsU0FBRCxHQUFhLElBQWIsQ0FBQTtBQUFBLFlBQ0EsTUFBTSxDQUFDLHVCQUFQLENBQStCLE9BQU8sQ0FBQyxRQUF2QyxDQURBLENBREY7V0FBQSxNQUFBO0FBS0UsWUFBQSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsTUFBTSxDQUFDLElBQTNCLEVBQWlDO0FBQUEsY0FDL0IsV0FBQSxFQUFjLE9BQU8sQ0FBQyxRQUFRLENBQUMsR0FEQTtBQUFBLGNBRS9CLGFBQUEsRUFBZ0IsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUZEO2FBQWpDLENBQUEsQ0FMRjtXQUFBO0FBQUEsVUFTQSxjQUFBLEdBQWlCLE9BVGpCLENBQUE7QUFBQSxVQVVBLE9BQU8sQ0FBQyxHQUFSLENBQVksT0FBWixDQVZBLENBQUE7aUJBV0EsSUFBQyxDQUFBLFdBQVcsQ0FBQyxJQUFiLENBQWtCLE9BQWxCLEVBWkY7U0FERjtPQURPO0lBQUEsQ0FyQlQ7QUFBQSxJQXFDQSxRQUFBLEVBQVUsU0FBQSxHQUFBO0FBQ1IsVUFBQSwrQkFBQTtBQUFBLE1BQUEsSUFBRyxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBQVo7QUFDRSxRQUFBLElBQUcsT0FBQSxHQUFVLElBQUMsQ0FBQSxXQUFXLENBQUMsR0FBYixDQUFBLENBQWI7QUFFRSxVQUFBLElBQUMsQ0FBQSxTQUFELEdBQWEsSUFBYixDQUFBO0FBQUEsVUFDQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsT0FBTyxDQUFDLFFBQXZDLENBREEsQ0FBQTtBQUFBLFVBRUEsY0FBQSxHQUFpQixPQUZqQixDQUFBO0FBQUEsVUFHQSxPQUFPLENBQUMsR0FBUixDQUFZLE9BQVosQ0FIQSxDQUFBO2lCQUlBLElBQUMsQ0FBQSxZQUFZLENBQUMsT0FBZCxDQUFzQixPQUF0QixFQU5GO1NBREY7T0FEUTtJQUFBLENBckNWO0FBQUEsSUFnREEsY0FBQSxFQUFnQixTQUFDLElBQUQsRUFBTyxRQUFQLEdBQUE7QUFDZCxNQUFBLElBQUcsSUFBQyxDQUFBLFNBQUo7QUFDRSxRQUFBLElBQUMsQ0FBQSxTQUFELEdBQWEsS0FBYixDQUFBO0FBQ0EsY0FBQSxDQUZGO09BQUE7QUFHQSxNQUFBLElBQUcsSUFBQyxDQUFBLGNBQUo7QUFDRSxRQUFBLElBQUMsQ0FBQSxXQUFXLENBQUMsSUFBYixDQUFrQixJQUFDLENBQUEsY0FBbkIsQ0FBQSxDQURGO09BSEE7YUFLQSxJQUFDLENBQUEsY0FBRCxHQUFrQjtBQUFBLFFBQUMsTUFBQSxJQUFEO0FBQUEsUUFBTyxVQUFBLFFBQVA7UUFOSjtJQUFBLENBaERoQjtHQUhGLENBQUE7QUFBQSIKfQ==
//# sourceURL=/home/iraasta/.atom/packages/delorean/lib/delorean.coffee