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

    RsenseClient.prototype.checkCompletion = function(editor, buffer, row, column, prefix, callback) {
      console.log("Prefix: " + prefix);
      autocomplete.getAutocompletion(prefix, function(result) {
        console.log(result);
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDZCQUFBOztBQUFBLEVBQUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxRQUFSLENBQUosQ0FBQTs7QUFBQSxFQUNBLFlBQUEsR0FBZSxPQUFBLENBQVEscUJBQVIsQ0FEZixDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLFNBQVMsQ0FBQyxVQUFqQixHQUE4QixTQUFDLENBQUQsRUFBRyxDQUFILEdBQUE7V0FBUyxJQUFDLENBQUEsS0FBRCxDQUFPLENBQVAsQ0FBUyxDQUFDLElBQVYsQ0FBZSxDQUFmLEVBQVQ7RUFBQSxDQUY5QixDQUFBOztBQUFBLEVBSUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLDJCQUFBLFdBQUEsR0FBYSxJQUFiLENBQUE7O0FBQUEsMkJBQ0EsU0FBQSxHQUFXLElBRFgsQ0FBQTs7QUFHYSxJQUFBLHNCQUFBLEdBQUE7QUFDWCxNQUFBLFlBQVksQ0FBQyxJQUFiLENBQWtCLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBYixDQUFBLENBQWxCLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBSSxDQUFDLFNBQVMsQ0FBQyxrQkFBZixDQUFrQyxTQUFDLE1BQUQsR0FBQTtlQUNoQyxNQUFNLENBQUMsU0FBUCxDQUFpQixTQUFDLENBQUQsR0FBQTtpQkFDZixZQUFZLENBQUMsUUFBYixDQUFzQixDQUFDLENBQUMsSUFBeEIsRUFEZTtRQUFBLENBQWpCLEVBRGdDO01BQUEsQ0FBbEMsQ0FEQSxDQURXO0lBQUEsQ0FIYjs7QUFBQSwyQkFTQSxlQUFBLEdBQWlCLFNBQUMsTUFBRCxFQUFTLE1BQVQsRUFBaUIsR0FBakIsRUFBc0IsTUFBdEIsRUFBOEIsTUFBOUIsRUFBc0MsUUFBdEMsR0FBQTtBQUNmLE1BQUEsT0FBTyxDQUFDLEdBQVIsQ0FBYSxVQUFBLEdBQVUsTUFBdkIsQ0FBQSxDQUFBO0FBQUEsTUFDQSxZQUFZLENBQUMsaUJBQWIsQ0FBK0IsTUFBL0IsRUFBdUMsU0FBQyxNQUFELEdBQUE7QUFDckMsUUFBQSxPQUFPLENBQUMsR0FBUixDQUFZLE1BQVosQ0FBQSxDQUFBO0FBQUEsUUFDQSxNQUFBLEdBQVksTUFBTSxDQUFDLEdBQVYsR0FDTjtBQUFBLFVBQUMsTUFBQSxFQUFRLENBQUMsTUFBTSxDQUFDLEdBQVIsQ0FBVDtBQUFBLFVBQXVCLEdBQUEsRUFBSyxJQUE1QjtTQURNLEdBR0w7QUFBQSxVQUFDLE1BQUEsRUFBUSxNQUFNLENBQUMsS0FBaEI7QUFBQSxVQUF1QixHQUFBLEVBQUssS0FBNUI7U0FKSixDQUFBO2VBS0EsUUFBQSxDQUFTLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBZCxDQUFrQixTQUFDLENBQUQsR0FBQTtpQkFBTTtBQUFBLFlBQUMsWUFBQSxFQUFjLE1BQU0sQ0FBQyxHQUF0QjtBQUFBLFlBQTBCLElBQUEsRUFBTSxDQUFoQztBQUFBLFlBQW1DLElBQUEsRUFBSyxDQUF4QztZQUFOO1FBQUEsQ0FBbEIsQ0FBVCxFQU5xQztNQUFBLENBQXZDLENBREEsQ0FBQTtBQVFBLGFBQU8sRUFBUCxDQVRlO0lBQUEsQ0FUakIsQ0FBQTs7d0JBQUE7O01BTkYsQ0FBQTtBQUFBIgp9
//# sourceURL=/home/iraasta/.atom/packages/autocomplete-elixir/lib/autocomplete-elixir-client.coffee