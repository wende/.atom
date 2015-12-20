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
          return self.contextChanged(editor.getPath, e.newBufferPosition);
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
          editor.setCursorBufferPosition(context.position);
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG1CQUFBOztBQUFBLEVBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQUFELENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxhQUFBLEVBQWUsSUFBZjtBQUFBLElBQ0EsWUFBQSxFQUFjLEVBRGQ7QUFBQSxJQUVBLFdBQUEsRUFBYSxFQUZiO0FBQUEsSUFHQSxTQUFBLEVBQVksS0FIWjtBQUFBLElBSUEsY0FBQSxFQUFpQixJQUpqQjtBQUFBLElBTUEsUUFBQSxFQUFVLFNBQUEsR0FBQTtBQUNSLFVBQUEsSUFBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLGFBQUQsR0FBaUIsR0FBQSxDQUFBLG1CQUFqQixDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUNqQjtBQUFBLFFBQUEsbUJBQUEsRUFBcUIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7bUJBQUcsS0FBQyxDQUFBLFFBQUQsQ0FBQSxFQUFIO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBckI7QUFBQSxRQUNBLGtCQUFBLEVBQW9CLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO21CQUFHLEtBQUMsQ0FBQSxPQUFELENBQUEsRUFBSDtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRHBCO09BRGlCLENBQW5CLENBREEsQ0FBQTtBQUFBLE1BSUEsSUFBQSxHQUFPLElBSlAsQ0FBQTthQUtBLElBQUksQ0FBQyxTQUFTLENBQUMsa0JBQWYsQ0FBa0MsU0FBQyxNQUFELEdBQUE7QUFDaEMsUUFBQSxPQUFPLENBQUMsR0FBUixDQUFZLFlBQVosQ0FBQSxDQUFBO2VBQ0EsTUFBTSxDQUFDLHlCQUFQLENBQWlDLFNBQUMsQ0FBRCxHQUFBO0FBQy9CLFVBQUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSxZQUFaLENBQUEsQ0FBQTtpQkFDQSxJQUFJLENBQUMsY0FBTCxDQUFvQixNQUFNLENBQUMsT0FBM0IsRUFBb0MsQ0FBQyxDQUFDLGlCQUF0QyxFQUYrQjtRQUFBLENBQWpDLEVBRmdDO01BQUEsQ0FBbEMsRUFOUTtJQUFBLENBTlY7QUFBQSxJQWtCQSxVQUFBLEVBQVksU0FBQSxHQUFBO2FBQ1YsSUFBQyxDQUFBLGFBQWEsQ0FBQyxPQUFmLENBQUEsRUFEVTtJQUFBLENBbEJaO0FBQUEsSUFxQkEsT0FBQSxFQUFTLFNBQUEsR0FBQTtBQUNQLFVBQUEsK0JBQUE7QUFBQSxNQUFBLElBQUcsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQUFaO0FBQ0UsUUFBQSxJQUFHLE9BQUEsR0FBVSxJQUFDLENBQUEsWUFBWSxDQUFDLEtBQWQsQ0FBQSxDQUFiO0FBRUUsVUFBQSxJQUFDLENBQUEsU0FBRCxHQUFhLElBQWIsQ0FBQTtBQUFBLFVBQ0EsTUFBTSxDQUFDLHVCQUFQLENBQStCLE9BQU8sQ0FBQyxRQUF2QyxDQURBLENBQUE7QUFBQSxVQUVBLGNBQUEsR0FBaUIsT0FGakIsQ0FBQTtBQUFBLFVBR0EsT0FBTyxDQUFDLEdBQVIsQ0FBWSxPQUFaLENBSEEsQ0FBQTtpQkFJQSxJQUFDLENBQUEsV0FBVyxDQUFDLElBQWIsQ0FBa0IsT0FBbEIsRUFORjtTQURGO09BRE87SUFBQSxDQXJCVDtBQUFBLElBK0JBLFFBQUEsRUFBVSxTQUFBLEdBQUE7QUFDUixVQUFBLCtCQUFBO0FBQUEsTUFBQSxJQUFHLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FBWjtBQUNFLFFBQUEsSUFBRyxPQUFBLEdBQVUsSUFBQyxDQUFBLFdBQVcsQ0FBQyxHQUFiLENBQUEsQ0FBYjtBQUVFLFVBQUEsSUFBQyxDQUFBLFNBQUQsR0FBYSxJQUFiLENBQUE7QUFBQSxVQUNBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixPQUFPLENBQUMsUUFBdkMsQ0FEQSxDQUFBO0FBQUEsVUFFQSxjQUFBLEdBQWlCLE9BRmpCLENBQUE7QUFBQSxVQUdBLE9BQU8sQ0FBQyxHQUFSLENBQVksT0FBWixDQUhBLENBQUE7aUJBSUEsSUFBQyxDQUFBLFlBQVksQ0FBQyxPQUFkLENBQXNCLE9BQXRCLEVBTkY7U0FERjtPQURRO0lBQUEsQ0EvQlY7QUFBQSxJQTBDQSxjQUFBLEVBQWdCLFNBQUMsSUFBRCxFQUFPLFFBQVAsR0FBQTtBQUNkLE1BQUEsSUFBRyxJQUFDLENBQUEsU0FBSjtBQUNFLFFBQUEsSUFBQyxDQUFBLFNBQUQsR0FBYSxLQUFiLENBQUE7QUFDQSxjQUFBLENBRkY7T0FBQTtBQUdBLE1BQUEsSUFBRyxJQUFDLENBQUEsY0FBSjtBQUNFLFFBQUEsSUFBQyxDQUFBLFdBQVcsQ0FBQyxJQUFiLENBQWtCLElBQUMsQ0FBQSxjQUFuQixDQUFBLENBREY7T0FIQTthQUtBLElBQUMsQ0FBQSxjQUFELEdBQWtCO0FBQUEsUUFBQyxNQUFBLElBQUQ7QUFBQSxRQUFPLFVBQUEsUUFBUDtRQU5KO0lBQUEsQ0ExQ2hCO0dBSEYsQ0FBQTtBQUFBIgp9
//# sourceURL=/home/iraasta/.atom/packages/delorean/lib/delorean.coffee