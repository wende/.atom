(function() {
  var RsenseClient, autocomplete, doendmather, editor;

  autocomplete = require('./alchemide/wrapper');

  doendmather = require('./alchemide/doendmatcher');

  atom.commands.add('atom-text-editor', {
    'user:insert-date-wende': function(event) {}
  }, editor = this.getModel(), editor.insertText(new Date().toLocaleString()));

  module.exports = RsenseClient = (function() {
    RsenseClient.prototype.projectPath = null;

    RsenseClient.prototype.serverUrl = null;

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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvaXJhYXN0YS8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtZWxpeGlyL2xpYi9hdXRvY29tcGxldGUtZWxpeGlyLWNsaWVudC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsK0NBQUE7O0FBQUEsRUFBQSxZQUFBLEdBQWUsT0FBQSxDQUFRLHFCQUFSLENBQWYsQ0FBQTs7QUFBQSxFQUNBLFdBQUEsR0FBYyxPQUFBLENBQVEsMEJBQVIsQ0FEZCxDQUFBOztBQUFBLEVBR0EsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGtCQUFsQixFQUNFO0FBQUEsSUFBQSx3QkFBQSxFQUEwQixTQUFDLEtBQUQsR0FBQSxDQUExQjtHQURGLEVBRUUsTUFBQSxHQUFTLElBQUMsQ0FBQSxRQUFELENBQUEsQ0FGWCxFQUdFLE1BQU0sQ0FBQyxVQUFQLENBQXNCLElBQUEsSUFBQSxDQUFBLENBQU0sQ0FBQyxjQUFQLENBQUEsQ0FBdEIsQ0FIRixDQUhBLENBQUE7O0FBQUEsRUFRQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osMkJBQUEsV0FBQSxHQUFhLElBQWIsQ0FBQTs7QUFBQSwyQkFDQSxTQUFBLEdBQVcsSUFEWCxDQUFBOztBQUdhLElBQUEsc0JBQUEsR0FBQTtBQUNYLE1BQUEsWUFBWSxDQUFDLElBQWIsQ0FBa0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQUEsQ0FBbEIsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFJLENBQUMsU0FBUyxDQUFDLGtCQUFmLENBQWtDLFNBQUMsTUFBRCxHQUFBO0FBRWhDLFFBQUEsSUFBRyxRQUFRLENBQUMsSUFBVCxDQUFjLE1BQU0sQ0FBQyxRQUFQLENBQUEsQ0FBZCxDQUFIO0FBQ0UsVUFBQSxNQUFNLENBQUMsU0FBUCxDQUFpQixTQUFDLENBQUQsR0FBQTttQkFDZixZQUFZLENBQUMsUUFBYixDQUFzQixDQUFDLENBQUMsSUFBeEIsRUFEZTtVQUFBLENBQWpCLENBQUEsQ0FBQTtpQkFFQSxNQUFNLENBQUMseUJBQVAsQ0FBaUMsU0FBQyxDQUFELEdBQUE7bUJBQy9CLFdBQVcsQ0FBQyxXQUFaLENBQXdCLE1BQXhCLEVBQWdDLENBQWhDLEVBRCtCO1VBQUEsQ0FBakMsRUFIRjtTQUZnQztNQUFBLENBQWxDLENBREEsQ0FEVztJQUFBLENBSGI7O0FBQUEsMkJBYUEsZUFBQSxHQUFpQixTQUFDLE1BQUQsRUFBUyxRQUFULEdBQUE7QUFFZixNQUFBLFlBQVksQ0FBQyxpQkFBYixDQUErQixNQUEvQixFQUF1QyxTQUFDLE1BQUQsR0FBQTtBQUVyQyxRQUFBLE1BQUEsR0FBWSxNQUFNLENBQUMsR0FBVixHQUNOO0FBQUEsVUFBQyxNQUFBLEVBQVEsQ0FBQyxNQUFNLENBQUMsR0FBUixDQUFUO0FBQUEsVUFBdUIsR0FBQSxFQUFLLElBQTVCO1NBRE0sR0FHTDtBQUFBLFVBQUMsTUFBQSxFQUFRLE1BQU0sQ0FBQyxLQUFoQjtBQUFBLFVBQXVCLEdBQUEsRUFBSyxLQUE1QjtTQUhKLENBQUE7ZUFJQSxRQUFBLENBQVMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFkLENBQWtCLFNBQUMsQ0FBRCxHQUFBO2lCQUFNO0FBQUEsWUFBQyxZQUFBLEVBQWMsTUFBTSxDQUFDLEdBQXRCO0FBQUEsWUFBMEIsSUFBQSxFQUFNLENBQWhDO0FBQUEsWUFBbUMsSUFBQSxFQUFLLENBQXhDO1lBQU47UUFBQSxDQUFsQixDQUFULEVBTnFDO01BQUEsQ0FBdkMsQ0FBQSxDQUFBO0FBT0EsYUFBTyxFQUFQLENBVGU7SUFBQSxDQWJqQixDQUFBOzt3QkFBQTs7TUFWRixDQUFBO0FBQUEiCn0=

//# sourceURL=/home/iraasta/.atom/packages/autocomplete-elixir/lib/autocomplete-elixir-client.coffee
