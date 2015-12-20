(function() {
  var CompositeDisposable;

  CompositeDisposable = require('atom').CompositeDisposable;

  module.exports = {
    subscriptions: null,
    frontContext: [],
    backContext: [],
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
      var context, editor;
      if (editor = atom.workspace.getActiveTextEditor()) {
        if (context = this.frontContext.shift()) {
          editor.setCursorBufferPosition(position);
          console.log(context);
          return this.backContext.push(context);
        }
      }
    },
    backward: function() {
      var context, editor;
      if (editor = atom.workspace.getActiveTextEditor()) {
        if (context = this.backContext.pop()) {
          editor.setCursorBufferPosition(position);
          console.log(context);
          return this.frontContext.unshift(context);
        }
      }
    },
    contextChanged: function(file, position) {
      console.log("context changed " + file + " " + position);
      return this.backContext.push({
        file: file,
        position: position
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG1CQUFBOztBQUFBLEVBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQUFELENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxhQUFBLEVBQWUsSUFBZjtBQUFBLElBQ0EsWUFBQSxFQUFjLEVBRGQ7QUFBQSxJQUVBLFdBQUEsRUFBYSxFQUZiO0FBQUEsSUFJQSxRQUFBLEVBQVUsU0FBQSxHQUFBO0FBQ1IsVUFBQSxJQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsYUFBRCxHQUFpQixHQUFBLENBQUEsbUJBQWpCLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQ2pCO0FBQUEsUUFBQSxtQkFBQSxFQUFxQixDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTttQkFBRyxLQUFDLENBQUEsUUFBRCxDQUFBLEVBQUg7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFyQjtBQUFBLFFBQ0Esa0JBQUEsRUFBb0IsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7bUJBQUcsS0FBQyxDQUFBLE9BQUQsQ0FBQSxFQUFIO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FEcEI7T0FEaUIsQ0FBbkIsQ0FEQSxDQUFBO0FBQUEsTUFJQSxJQUFBLEdBQU8sSUFKUCxDQUFBO2FBS0EsSUFBSSxDQUFDLFNBQVMsQ0FBQyxrQkFBZixDQUFrQyxTQUFDLE1BQUQsR0FBQTtBQUNoQyxRQUFBLE9BQU8sQ0FBQyxHQUFSLENBQVksWUFBWixDQUFBLENBQUE7ZUFDQSxNQUFNLENBQUMseUJBQVAsQ0FBaUMsU0FBQyxDQUFELEdBQUE7QUFDL0IsVUFBQSxPQUFPLENBQUMsR0FBUixDQUFZLFlBQVosQ0FBQSxDQUFBO2lCQUNBLElBQUksQ0FBQyxjQUFMLENBQW9CLE1BQU0sQ0FBQyxPQUEzQixFQUFvQyxDQUFDLENBQUMsaUJBQXRDLEVBRitCO1FBQUEsQ0FBakMsRUFGZ0M7TUFBQSxDQUFsQyxFQU5RO0lBQUEsQ0FKVjtBQUFBLElBZ0JBLFVBQUEsRUFBWSxTQUFBLEdBQUE7YUFDVixJQUFDLENBQUEsYUFBYSxDQUFDLE9BQWYsQ0FBQSxFQURVO0lBQUEsQ0FoQlo7QUFBQSxJQW1CQSxPQUFBLEVBQVMsU0FBQSxHQUFBO0FBQ1AsVUFBQSxlQUFBO0FBQUEsTUFBQSxJQUFHLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FBWjtBQUNFLFFBQUEsSUFBRyxPQUFBLEdBQVUsSUFBQyxDQUFBLFlBQVksQ0FBQyxLQUFkLENBQUEsQ0FBYjtBQUVFLFVBQUEsTUFBTSxDQUFDLHVCQUFQLENBQStCLFFBQS9CLENBQUEsQ0FBQTtBQUFBLFVBQ0EsT0FBTyxDQUFDLEdBQVIsQ0FBWSxPQUFaLENBREEsQ0FBQTtpQkFFQSxJQUFDLENBQUEsV0FBVyxDQUFDLElBQWIsQ0FBa0IsT0FBbEIsRUFKRjtTQURGO09BRE87SUFBQSxDQW5CVDtBQUFBLElBMkJBLFFBQUEsRUFBVSxTQUFBLEdBQUE7QUFDUixVQUFBLGVBQUE7QUFBQSxNQUFBLElBQUcsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQUFaO0FBQ0UsUUFBQSxJQUFHLE9BQUEsR0FBVSxJQUFDLENBQUEsV0FBVyxDQUFDLEdBQWIsQ0FBQSxDQUFiO0FBRUUsVUFBQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsUUFBL0IsQ0FBQSxDQUFBO0FBQUEsVUFDQSxPQUFPLENBQUMsR0FBUixDQUFZLE9BQVosQ0FEQSxDQUFBO2lCQUVBLElBQUMsQ0FBQSxZQUFZLENBQUMsT0FBZCxDQUFzQixPQUF0QixFQUpGO1NBREY7T0FEUTtJQUFBLENBM0JWO0FBQUEsSUFtQ0EsY0FBQSxFQUFnQixTQUFDLElBQUQsRUFBTyxRQUFQLEdBQUE7QUFDZCxNQUFBLE9BQU8sQ0FBQyxHQUFSLENBQWEsa0JBQUEsR0FBa0IsSUFBbEIsR0FBdUIsR0FBdkIsR0FBMEIsUUFBdkMsQ0FBQSxDQUFBO2FBQ0EsSUFBQyxDQUFBLFdBQVcsQ0FBQyxJQUFiLENBQWtCO0FBQUEsUUFBQyxNQUFBLElBQUQ7QUFBQSxRQUFPLFVBQUEsUUFBUDtPQUFsQixFQUZjO0lBQUEsQ0FuQ2hCO0dBSEYsQ0FBQTtBQUFBIgp9
//# sourceURL=/home/iraasta/.atom/packages/delorean/lib/delorean.coffee