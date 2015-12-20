(function() {
  var $, RsenseClient, autocomplete, doendmather;

  $ = require('jquery');

  autocomplete = require('./alchemide/wrapper');

  doendmather = require('./alchemide/doendmatcher');

  String.prototype.replaceAll = function(s, r) {
    return this.split(s).join(r);
  };

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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvaXJhYXN0YS8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtZWxpeGlyL2xpYi9hdXRvY29tcGxldGUtZWxpeGlyLWNsaWVudC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsMENBQUE7O0FBQUEsRUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLFFBQVIsQ0FBSixDQUFBOztBQUFBLEVBQ0EsWUFBQSxHQUFlLE9BQUEsQ0FBUSxxQkFBUixDQURmLENBQUE7O0FBQUEsRUFFQSxXQUFBLEdBQWMsT0FBQSxDQUFRLDBCQUFSLENBRmQsQ0FBQTs7QUFBQSxFQUdBLE1BQU0sQ0FBQyxTQUFTLENBQUMsVUFBakIsR0FBOEIsU0FBQyxDQUFELEVBQUcsQ0FBSCxHQUFBO1dBQVMsSUFBQyxDQUFBLEtBQUQsQ0FBTyxDQUFQLENBQVMsQ0FBQyxJQUFWLENBQWUsQ0FBZixFQUFUO0VBQUEsQ0FIOUIsQ0FBQTs7QUFBQSxFQUtBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSiwyQkFBQSxXQUFBLEdBQWEsSUFBYixDQUFBOztBQUFBLDJCQUNBLFNBQUEsR0FBVyxJQURYLENBQUE7O0FBR2EsSUFBQSxzQkFBQSxHQUFBO0FBQ1gsTUFBQSxZQUFZLENBQUMsSUFBYixDQUFrQixJQUFJLENBQUMsT0FBTyxDQUFDLFFBQWIsQ0FBQSxDQUFsQixDQUFBLENBQUE7QUFBQSxNQUNBLElBQUksQ0FBQyxTQUFTLENBQUMsa0JBQWYsQ0FBa0MsU0FBQyxNQUFELEdBQUE7QUFFaEMsUUFBQSxJQUFHLFFBQVEsQ0FBQyxJQUFULENBQWMsTUFBTSxDQUFDLFFBQVAsQ0FBQSxDQUFkLENBQUg7QUFDRSxVQUFBLE1BQU0sQ0FBQyxTQUFQLENBQWlCLFNBQUMsQ0FBRCxHQUFBO21CQUNmLFlBQVksQ0FBQyxRQUFiLENBQXNCLENBQUMsQ0FBQyxJQUF4QixFQURlO1VBQUEsQ0FBakIsQ0FBQSxDQUFBO2lCQUVBLE1BQU0sQ0FBQyx5QkFBUCxDQUFpQyxTQUFDLENBQUQsR0FBQTttQkFDL0IsV0FBVyxDQUFDLFdBQVosQ0FBd0IsTUFBeEIsRUFBZ0MsQ0FBaEMsRUFEK0I7VUFBQSxDQUFqQyxFQUhGO1NBRmdDO01BQUEsQ0FBbEMsQ0FEQSxDQURXO0lBQUEsQ0FIYjs7QUFBQSwyQkFhQSxlQUFBLEdBQWlCLFNBQUMsTUFBRCxFQUFTLFFBQVQsR0FBQTtBQUVmLE1BQUEsWUFBWSxDQUFDLGlCQUFiLENBQStCLE1BQS9CLEVBQXVDLFNBQUMsTUFBRCxHQUFBO0FBRXJDLFFBQUEsTUFBQSxHQUFZLE1BQU0sQ0FBQyxHQUFWLEdBQ047QUFBQSxVQUFDLE1BQUEsRUFBUSxDQUFDLE1BQU0sQ0FBQyxHQUFSLENBQVQ7QUFBQSxVQUF1QixHQUFBLEVBQUssSUFBNUI7U0FETSxHQUdMO0FBQUEsVUFBQyxNQUFBLEVBQVEsTUFBTSxDQUFDLEtBQWhCO0FBQUEsVUFBdUIsR0FBQSxFQUFLLEtBQTVCO1NBSEosQ0FBQTtlQUlBLFFBQUEsQ0FBUyxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQWQsQ0FBa0IsU0FBQyxDQUFELEdBQUE7aUJBQU07QUFBQSxZQUFDLFlBQUEsRUFBYyxNQUFNLENBQUMsR0FBdEI7QUFBQSxZQUEwQixJQUFBLEVBQU0sQ0FBaEM7QUFBQSxZQUFtQyxJQUFBLEVBQUssQ0FBeEM7WUFBTjtRQUFBLENBQWxCLENBQVQsRUFOcUM7TUFBQSxDQUF2QyxDQUFBLENBQUE7QUFPQSxhQUFPLEVBQVAsQ0FUZTtJQUFBLENBYmpCLENBQUE7O3dCQUFBOztNQVBGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/home/iraasta/.atom/packages/autocomplete-elixir/lib/autocomplete-elixir-client.coffee
