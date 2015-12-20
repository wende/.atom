(function() {
  var RsenseClient, autocomplete, doendmather;

  autocomplete = require('./alchemide/wrapper');

  doendmather = require('./alchemide/doendmatcher');

  atom.commands.add('atom-text-editor', {
    'user:insert-date-wende': function(event) {
      var editor;
      editor = this.getModel();
      return editor.insertText(new Date().toLocaleString());
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvaXJhYXN0YS8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtZWxpeGlyL2xpYi9hdXRvY29tcGxldGUtZWxpeGlyLWNsaWVudC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsdUNBQUE7O0FBQUEsRUFBQSxZQUFBLEdBQWUsT0FBQSxDQUFRLHFCQUFSLENBQWYsQ0FBQTs7QUFBQSxFQUNBLFdBQUEsR0FBYyxPQUFBLENBQVEsMEJBQVIsQ0FEZCxDQUFBOztBQUFBLEVBR0EsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGtCQUFsQixFQUNFO0FBQUEsSUFBQSx3QkFBQSxFQUEwQixTQUFDLEtBQUQsR0FBQTtBQUN4QixVQUFBLE1BQUE7QUFBQSxNQUFBLE1BQUEsR0FBUyxJQUFDLENBQUEsUUFBRCxDQUFBLENBQVQsQ0FBQTthQUNBLE1BQU0sQ0FBQyxVQUFQLENBQXNCLElBQUEsSUFBQSxDQUFBLENBQU0sQ0FBQyxjQUFQLENBQUEsQ0FBdEIsRUFGd0I7SUFBQSxDQUExQjtHQURGLENBSEEsQ0FBQTs7QUFBQSxFQVFBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSiwyQkFBQSxXQUFBLEdBQWEsSUFBYixDQUFBOztBQUFBLDJCQUNBLFNBQUEsR0FBVyxJQURYLENBQUE7O0FBR2EsSUFBQSxzQkFBQSxHQUFBO0FBQ1gsTUFBQSxZQUFZLENBQUMsSUFBYixDQUFrQixJQUFJLENBQUMsT0FBTyxDQUFDLFFBQWIsQ0FBQSxDQUFsQixDQUFBLENBQUE7QUFBQSxNQUNBLElBQUksQ0FBQyxTQUFTLENBQUMsa0JBQWYsQ0FBa0MsU0FBQyxNQUFELEdBQUE7QUFFaEMsUUFBQSxJQUFHLFFBQVEsQ0FBQyxJQUFULENBQWMsTUFBTSxDQUFDLFFBQVAsQ0FBQSxDQUFkLENBQUg7QUFDRSxVQUFBLE1BQU0sQ0FBQyxTQUFQLENBQWlCLFNBQUMsQ0FBRCxHQUFBO21CQUNmLFlBQVksQ0FBQyxRQUFiLENBQXNCLENBQUMsQ0FBQyxJQUF4QixFQURlO1VBQUEsQ0FBakIsQ0FBQSxDQUFBO2lCQUVBLE1BQU0sQ0FBQyx5QkFBUCxDQUFpQyxTQUFDLENBQUQsR0FBQTttQkFDL0IsV0FBVyxDQUFDLFdBQVosQ0FBd0IsTUFBeEIsRUFBZ0MsQ0FBaEMsRUFEK0I7VUFBQSxDQUFqQyxFQUhGO1NBRmdDO01BQUEsQ0FBbEMsQ0FEQSxDQURXO0lBQUEsQ0FIYjs7QUFBQSwyQkFhQSxlQUFBLEdBQWlCLFNBQUMsTUFBRCxFQUFTLFFBQVQsR0FBQTtBQUVmLE1BQUEsWUFBWSxDQUFDLGlCQUFiLENBQStCLE1BQS9CLEVBQXVDLFNBQUMsTUFBRCxHQUFBO0FBRXJDLFFBQUEsTUFBQSxHQUFZLE1BQU0sQ0FBQyxHQUFWLEdBQ047QUFBQSxVQUFDLE1BQUEsRUFBUSxDQUFDLE1BQU0sQ0FBQyxHQUFSLENBQVQ7QUFBQSxVQUF1QixHQUFBLEVBQUssSUFBNUI7U0FETSxHQUdMO0FBQUEsVUFBQyxNQUFBLEVBQVEsTUFBTSxDQUFDLEtBQWhCO0FBQUEsVUFBdUIsR0FBQSxFQUFLLEtBQTVCO1NBSEosQ0FBQTtlQUlBLFFBQUEsQ0FBUyxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQWQsQ0FBa0IsU0FBQyxDQUFELEdBQUE7aUJBQU07QUFBQSxZQUFDLFlBQUEsRUFBYyxNQUFNLENBQUMsR0FBdEI7QUFBQSxZQUEwQixJQUFBLEVBQU0sQ0FBaEM7QUFBQSxZQUFtQyxJQUFBLEVBQUssQ0FBeEM7WUFBTjtRQUFBLENBQWxCLENBQVQsRUFOcUM7TUFBQSxDQUF2QyxDQUFBLENBQUE7QUFPQSxhQUFPLEVBQVAsQ0FUZTtJQUFBLENBYmpCLENBQUE7O3dCQUFBOztNQVZGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/iraasta/.atom/packages/autocomplete-elixir/lib/autocomplete-elixir-client.coffee
