(function() {
  var RsenseClient, autocomplete, doendmather, jumptodef;

  autocomplete = require('./alchemide/wrapper');

  doendmather = require('./alchemide/doendmatcher');

  jumptodef = require('./alchemide/jumptodef');

  atom.commands.add('atom-text-editor', {
    'user:elixir-jump-to-definition': function(event) {
      var editor;
      editor = this.getModel();
      if (/.exs?$/.test(editor.getTitle())) {
        return jumptodef.jump(editor);
      }
    }
  });

  module.exports = RsenseClient = (function() {
    function RsenseClient() {
      autocomplete.init(atom.project.getPaths());
      atom.workspace.observeTextEditors(function(editor) {
        if (/.exs?$/.test(editor.getTitle())) {
          editor.onDidSave(function(e) {
            return autocomplete.loadFile(e.path);
          });
          return editor.onDidChangeCursorPosition(function(e) {
            return doendmather.handleMatch(editor, e);
          });
        }
      });
    }

    RsenseClient.prototype.checkCompletion = function(prefix, callback) {
      autocomplete.getAutocompletion(prefix, function(result) {
        result = result.one ? {
          result: [result.one],
          one: true
        } : {
          result: result.multi,
          one: false
        };
        return callback(result.result.map(function(a) {
          return {
            continuation: result.one,
            name: a,
            spec: a
          };
        }));
      });
      return [];
    };

    return RsenseClient;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvaXJhYXN0YS8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtZWxpeGlyL2xpYi9hdXRvY29tcGxldGUtZWxpeGlyLWNsaWVudC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsa0RBQUE7O0FBQUEsRUFBQSxZQUFBLEdBQWUsT0FBQSxDQUFRLHFCQUFSLENBQWYsQ0FBQTs7QUFBQSxFQUNBLFdBQUEsR0FBYyxPQUFBLENBQVEsMEJBQVIsQ0FEZCxDQUFBOztBQUFBLEVBRUEsU0FBQSxHQUFZLE9BQUEsQ0FBUSx1QkFBUixDQUZaLENBQUE7O0FBQUEsRUFJQSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0Isa0JBQWxCLEVBQ0U7QUFBQSxJQUFBLGdDQUFBLEVBQWtDLFNBQUMsS0FBRCxHQUFBO0FBQ2hDLFVBQUEsTUFBQTtBQUFBLE1BQUEsTUFBQSxHQUFTLElBQUMsQ0FBQSxRQUFELENBQUEsQ0FBVCxDQUFBO0FBQ0EsTUFBQSxJQUFHLFFBQVEsQ0FBQyxJQUFULENBQWMsTUFBTSxDQUFDLFFBQVAsQ0FBQSxDQUFkLENBQUg7ZUFDRSxTQUFTLENBQUMsSUFBVixDQUFlLE1BQWYsRUFERjtPQUZnQztJQUFBLENBQWxDO0dBREYsQ0FKQSxDQUFBOztBQUFBLEVBVUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNTLElBQUEsc0JBQUEsR0FBQTtBQUNYLE1BQUEsWUFBWSxDQUFDLElBQWIsQ0FBa0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQUEsQ0FBbEIsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFJLENBQUMsU0FBUyxDQUFDLGtCQUFmLENBQWtDLFNBQUMsTUFBRCxHQUFBO0FBRWhDLFFBQUEsSUFBRyxRQUFRLENBQUMsSUFBVCxDQUFjLE1BQU0sQ0FBQyxRQUFQLENBQUEsQ0FBZCxDQUFIO0FBQ0UsVUFBQSxNQUFNLENBQUMsU0FBUCxDQUFpQixTQUFDLENBQUQsR0FBQTttQkFDZixZQUFZLENBQUMsUUFBYixDQUFzQixDQUFDLENBQUMsSUFBeEIsRUFEZTtVQUFBLENBQWpCLENBQUEsQ0FBQTtpQkFFQSxNQUFNLENBQUMseUJBQVAsQ0FBaUMsU0FBQyxDQUFELEdBQUE7bUJBQy9CLFdBQVcsQ0FBQyxXQUFaLENBQXdCLE1BQXhCLEVBQWdDLENBQWhDLEVBRCtCO1VBQUEsQ0FBakMsRUFIRjtTQUZnQztNQUFBLENBQWxDLENBREEsQ0FEVztJQUFBLENBQWI7O0FBQUEsMkJBVUEsZUFBQSxHQUFpQixTQUFDLE1BQUQsRUFBUyxRQUFULEdBQUE7QUFFZixNQUFBLFlBQVksQ0FBQyxpQkFBYixDQUErQixNQUEvQixFQUF1QyxTQUFDLE1BQUQsR0FBQTtBQUVyQyxRQUFBLE1BQUEsR0FBWSxNQUFNLENBQUMsR0FBVixHQUNOO0FBQUEsVUFBQyxNQUFBLEVBQVEsQ0FBQyxNQUFNLENBQUMsR0FBUixDQUFUO0FBQUEsVUFBdUIsR0FBQSxFQUFLLElBQTVCO1NBRE0sR0FHTDtBQUFBLFVBQUMsTUFBQSxFQUFRLE1BQU0sQ0FBQyxLQUFoQjtBQUFBLFVBQXVCLEdBQUEsRUFBSyxLQUE1QjtTQUhKLENBQUE7ZUFJQSxRQUFBLENBQVMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFkLENBQWtCLFNBQUMsQ0FBRCxHQUFBO2lCQUFNO0FBQUEsWUFBQyxZQUFBLEVBQWMsTUFBTSxDQUFDLEdBQXRCO0FBQUEsWUFBMEIsSUFBQSxFQUFNLENBQWhDO0FBQUEsWUFBbUMsSUFBQSxFQUFLLENBQXhDO1lBQU47UUFBQSxDQUFsQixDQUFULEVBTnFDO01BQUEsQ0FBdkMsQ0FBQSxDQUFBO0FBT0EsYUFBTyxFQUFQLENBVGU7SUFBQSxDQVZqQixDQUFBOzt3QkFBQTs7TUFaRixDQUFBO0FBQUEiCn0=

//# sourceURL=/home/iraasta/.atom/packages/autocomplete-elixir/lib/autocomplete-elixir-client.coffee
