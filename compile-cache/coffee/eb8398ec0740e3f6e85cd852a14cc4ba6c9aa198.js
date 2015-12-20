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
          return self.contextChanged(e.newBufferPosition);
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
          console.log(context);
          return this.backContext.push(context);
        }
      }
    },
    backward: function() {
      var context, editor;
      if (editor = atom.workspace.getActiveTextEditor()) {
        if (context = this.backContext.pop()) {
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG1CQUFBOztBQUFBLEVBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQUFELENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxhQUFBLEVBQWUsSUFBZjtBQUFBLElBQ0EsWUFBQSxFQUFjLEVBRGQ7QUFBQSxJQUVBLFdBQUEsRUFBYSxFQUZiO0FBQUEsSUFJQSxRQUFBLEVBQVUsU0FBQSxHQUFBO0FBQ1IsVUFBQSxJQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsYUFBRCxHQUFpQixHQUFBLENBQUEsbUJBQWpCLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQ2pCO0FBQUEsUUFBQSxtQkFBQSxFQUFxQixDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTttQkFBRyxLQUFDLENBQUEsUUFBRCxDQUFBLEVBQUg7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFyQjtBQUFBLFFBQ0Esa0JBQUEsRUFBb0IsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7bUJBQUcsS0FBQyxDQUFBLE9BQUQsQ0FBQSxFQUFIO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FEcEI7T0FEaUIsQ0FBbkIsQ0FEQSxDQUFBO0FBQUEsTUFJQSxJQUFBLEdBQU8sSUFKUCxDQUFBO2FBS0EsSUFBSSxDQUFDLFNBQVMsQ0FBQyxrQkFBZixDQUFrQyxTQUFDLE1BQUQsR0FBQTtBQUNoQyxRQUFBLE9BQU8sQ0FBQyxHQUFSLENBQVksWUFBWixDQUFBLENBQUE7ZUFDQSxNQUFNLENBQUMseUJBQVAsQ0FBaUMsU0FBQyxDQUFELEdBQUE7QUFDL0IsVUFBQSxPQUFPLENBQUMsR0FBUixDQUFZLFlBQVosQ0FBQSxDQUFBO2lCQUNBLElBQUksQ0FBQyxjQUFMLENBQW9CLENBQUMsQ0FBQyxpQkFBdEIsRUFGK0I7UUFBQSxDQUFqQyxFQUZnQztNQUFBLENBQWxDLEVBTlE7SUFBQSxDQUpWO0FBQUEsSUFnQkEsVUFBQSxFQUFZLFNBQUEsR0FBQTthQUNWLElBQUMsQ0FBQSxhQUFhLENBQUMsT0FBZixDQUFBLEVBRFU7SUFBQSxDQWhCWjtBQUFBLElBbUJBLE9BQUEsRUFBUyxTQUFBLEdBQUE7QUFDUCxVQUFBLGVBQUE7QUFBQSxNQUFBLElBQUcsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQUFaO0FBQ0UsUUFBQSxJQUFHLE9BQUEsR0FBVSxJQUFDLENBQUEsWUFBWSxDQUFDLEtBQWQsQ0FBQSxDQUFiO0FBRUUsVUFBQSxPQUFPLENBQUMsR0FBUixDQUFZLE9BQVosQ0FBQSxDQUFBO2lCQUNBLElBQUMsQ0FBQSxXQUFXLENBQUMsSUFBYixDQUFrQixPQUFsQixFQUhGO1NBREY7T0FETztJQUFBLENBbkJUO0FBQUEsSUEwQkEsUUFBQSxFQUFVLFNBQUEsR0FBQTtBQUNSLFVBQUEsZUFBQTtBQUFBLE1BQUEsSUFBRyxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBQVo7QUFDRSxRQUFBLElBQUcsT0FBQSxHQUFVLElBQUMsQ0FBQSxXQUFXLENBQUMsR0FBYixDQUFBLENBQWI7QUFFRSxVQUFBLE9BQU8sQ0FBQyxHQUFSLENBQVksT0FBWixDQUFBLENBQUE7aUJBQ0EsSUFBQyxDQUFBLFlBQVksQ0FBQyxPQUFkLENBQXNCLE9BQXRCLEVBSEY7U0FERjtPQURRO0lBQUEsQ0ExQlY7QUFBQSxJQWlDQSxjQUFBLEVBQWdCLFNBQUMsSUFBRCxFQUFPLFFBQVAsR0FBQTtBQUNkLE1BQUEsT0FBTyxDQUFDLEdBQVIsQ0FBYSxrQkFBQSxHQUFrQixJQUFsQixHQUF1QixHQUF2QixHQUEwQixRQUF2QyxDQUFBLENBQUE7YUFDQSxJQUFDLENBQUEsV0FBVyxDQUFDLElBQWIsQ0FBa0I7QUFBQSxRQUFDLE1BQUEsSUFBRDtBQUFBLFFBQU8sVUFBQSxRQUFQO09BQWxCLEVBRmM7SUFBQSxDQWpDaEI7R0FIRixDQUFBO0FBQUEiCn0=
//# sourceURL=/home/iraasta/.atom/packages/delorean/lib/delorean.coffee