(function() {
  var RsenseClient, autocomplete, doendmather;

  autocomplete = require('./alchemide/wrapper');

  doendmather = require('./alchemide/doendmatcher');

  atom.commands.add('atom-text-editor', {
    'user:insert-date-wende': function(event) {
      var editor;
      editor = this.getModel();
      if (/.exs?$/.test(editor.getTitle())) {
        return editor.insertText("it's elixir");
      }
    }
  });

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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvaXJhYXN0YS8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtZWxpeGlyL2xpYi9hdXRvY29tcGxldGUtZWxpeGlyLWNsaWVudC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsdUNBQUE7O0FBQUEsRUFBQSxZQUFBLEdBQWUsT0FBQSxDQUFRLHFCQUFSLENBQWYsQ0FBQTs7QUFBQSxFQUNBLFdBQUEsR0FBYyxPQUFBLENBQVEsMEJBQVIsQ0FEZCxDQUFBOztBQUFBLEVBR0EsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGtCQUFsQixFQUNFO0FBQUEsSUFBQSx3QkFBQSxFQUEwQixTQUFDLEtBQUQsR0FBQTtBQUN4QixVQUFBLE1BQUE7QUFBQSxNQUFBLE1BQUEsR0FBUyxJQUFDLENBQUEsUUFBRCxDQUFBLENBQVQsQ0FBQTtBQUNBLE1BQUEsSUFBRyxRQUFRLENBQUMsSUFBVCxDQUFjLE1BQU0sQ0FBQyxRQUFQLENBQUEsQ0FBZCxDQUFIO2VBQ0UsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsYUFBbEIsRUFERjtPQUZ3QjtJQUFBLENBQTFCO0dBREYsQ0FIQSxDQUFBOztBQUFBLEVBU0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLDJCQUFBLFdBQUEsR0FBYSxJQUFiLENBQUE7O0FBQUEsMkJBQ0EsU0FBQSxHQUFXLElBRFgsQ0FBQTs7QUFHYSxJQUFBLHNCQUFBLEdBQUE7QUFDWCxNQUFBLFlBQVksQ0FBQyxJQUFiLENBQWtCLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBYixDQUFBLENBQWxCLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBSSxDQUFDLFNBQVMsQ0FBQyxrQkFBZixDQUFrQyxTQUFDLE1BQUQsR0FBQTtBQUVoQyxRQUFBLElBQUcsUUFBUSxDQUFDLElBQVQsQ0FBYyxNQUFNLENBQUMsUUFBUCxDQUFBLENBQWQsQ0FBSDtBQUNFLFVBQUEsTUFBTSxDQUFDLFNBQVAsQ0FBaUIsU0FBQyxDQUFELEdBQUE7bUJBQ2YsWUFBWSxDQUFDLFFBQWIsQ0FBc0IsQ0FBQyxDQUFDLElBQXhCLEVBRGU7VUFBQSxDQUFqQixDQUFBLENBQUE7aUJBRUEsTUFBTSxDQUFDLHlCQUFQLENBQWlDLFNBQUMsQ0FBRCxHQUFBO21CQUMvQixXQUFXLENBQUMsV0FBWixDQUF3QixNQUF4QixFQUFnQyxDQUFoQyxFQUQrQjtVQUFBLENBQWpDLEVBSEY7U0FGZ0M7TUFBQSxDQUFsQyxDQURBLENBRFc7SUFBQSxDQUhiOztBQUFBLDJCQWFBLGVBQUEsR0FBaUIsU0FBQyxNQUFELEVBQVMsUUFBVCxHQUFBO0FBRWYsTUFBQSxZQUFZLENBQUMsaUJBQWIsQ0FBK0IsTUFBL0IsRUFBdUMsU0FBQyxNQUFELEdBQUE7QUFFckMsUUFBQSxNQUFBLEdBQVksTUFBTSxDQUFDLEdBQVYsR0FDTjtBQUFBLFVBQUMsTUFBQSxFQUFRLENBQUMsTUFBTSxDQUFDLEdBQVIsQ0FBVDtBQUFBLFVBQXVCLEdBQUEsRUFBSyxJQUE1QjtTQURNLEdBR0w7QUFBQSxVQUFDLE1BQUEsRUFBUSxNQUFNLENBQUMsS0FBaEI7QUFBQSxVQUF1QixHQUFBLEVBQUssS0FBNUI7U0FISixDQUFBO2VBSUEsUUFBQSxDQUFTLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBZCxDQUFrQixTQUFDLENBQUQsR0FBQTtpQkFBTTtBQUFBLFlBQUMsWUFBQSxFQUFjLE1BQU0sQ0FBQyxHQUF0QjtBQUFBLFlBQTBCLElBQUEsRUFBTSxDQUFoQztBQUFBLFlBQW1DLElBQUEsRUFBSyxDQUF4QztZQUFOO1FBQUEsQ0FBbEIsQ0FBVCxFQU5xQztNQUFBLENBQXZDLENBQUEsQ0FBQTtBQU9BLGFBQU8sRUFBUCxDQVRlO0lBQUEsQ0FiakIsQ0FBQTs7d0JBQUE7O01BWEYsQ0FBQTtBQUFBIgp9

//# sourceURL=/home/iraasta/.atom/packages/autocomplete-elixir/lib/autocomplete-elixir-client.coffee
