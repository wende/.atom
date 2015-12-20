(function() {
  var $, RsenseClient, autocomplete;

  $ = require('jquery');

  autocomplete = require('./alchemide/wrapper');

  String.prototype.replaceAll = function(s, r) {
    return this.split(s).join(r);
  };

  module.exports = RsenseClient = (function() {
    RsenseClient.prototype.projectPath = null;

    RsenseClient.prototype.serverUrl = null;

    function RsenseClient() {
      autocomplete.init(atom.project.getPaths());
      atom.workspace.observeTextEditors(function(editor) {
        return editor.onDidSave(function(e) {
          return autocomplete.loadFile(e.path);
        });
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDZCQUFBOztBQUFBLEVBQUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxRQUFSLENBQUosQ0FBQTs7QUFBQSxFQUNBLFlBQUEsR0FBZSxPQUFBLENBQVEscUJBQVIsQ0FEZixDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLFNBQVMsQ0FBQyxVQUFqQixHQUE4QixTQUFDLENBQUQsRUFBRyxDQUFILEdBQUE7V0FBUyxJQUFDLENBQUEsS0FBRCxDQUFPLENBQVAsQ0FBUyxDQUFDLElBQVYsQ0FBZSxDQUFmLEVBQVQ7RUFBQSxDQUY5QixDQUFBOztBQUFBLEVBSUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLDJCQUFBLFdBQUEsR0FBYSxJQUFiLENBQUE7O0FBQUEsMkJBQ0EsU0FBQSxHQUFXLElBRFgsQ0FBQTs7QUFHYSxJQUFBLHNCQUFBLEdBQUE7QUFDWCxNQUFBLFlBQVksQ0FBQyxJQUFiLENBQWtCLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBYixDQUFBLENBQWxCLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBSSxDQUFDLFNBQVMsQ0FBQyxrQkFBZixDQUFrQyxTQUFDLE1BQUQsR0FBQTtlQUNoQyxNQUFNLENBQUMsU0FBUCxDQUFpQixTQUFDLENBQUQsR0FBQTtpQkFDZixZQUFZLENBQUMsUUFBYixDQUFzQixDQUFDLENBQUMsSUFBeEIsRUFEZTtRQUFBLENBQWpCLEVBRGdDO01BQUEsQ0FBbEMsQ0FEQSxDQURXO0lBQUEsQ0FIYjs7QUFBQSwyQkFTQSxlQUFBLEdBQWlCLFNBQUMsTUFBRCxFQUFTLFFBQVQsR0FBQTtBQUVmLE1BQUEsWUFBWSxDQUFDLGlCQUFiLENBQStCLE1BQS9CLEVBQXVDLFNBQUMsTUFBRCxHQUFBO0FBRXJDLFFBQUEsTUFBQSxHQUFZLE1BQU0sQ0FBQyxHQUFWLEdBQ047QUFBQSxVQUFDLE1BQUEsRUFBUSxDQUFDLE1BQU0sQ0FBQyxHQUFSLENBQVQ7QUFBQSxVQUF1QixHQUFBLEVBQUssSUFBNUI7U0FETSxHQUdMO0FBQUEsVUFBQyxNQUFBLEVBQVEsTUFBTSxDQUFDLEtBQWhCO0FBQUEsVUFBdUIsR0FBQSxFQUFLLEtBQTVCO1NBSEosQ0FBQTtlQUlBLFFBQUEsQ0FBUyxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQWQsQ0FBa0IsU0FBQyxDQUFELEdBQUE7aUJBQU07QUFBQSxZQUFDLFlBQUEsRUFBYyxNQUFNLENBQUMsR0FBdEI7QUFBQSxZQUEwQixJQUFBLEVBQU0sQ0FBaEM7QUFBQSxZQUFtQyxJQUFBLEVBQUssQ0FBeEM7WUFBTjtRQUFBLENBQWxCLENBQVQsRUFOcUM7TUFBQSxDQUF2QyxDQUFBLENBQUE7QUFPQSxhQUFPLEVBQVAsQ0FUZTtJQUFBLENBVGpCLENBQUE7O3dCQUFBOztNQU5GLENBQUE7QUFBQSIKfQ==
//# sourceURL=/home/iraasta/.atom/packages/autocomplete-elixir/lib/autocomplete-elixir-client.coffee