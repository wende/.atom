(function() {
  var $, RsenseClient, autocomplete;

  $ = require('jquery');

  autocomplete = require('./new/wrapper');

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
            qualified_name: a,
            kind: "elixir"
          };
        }));
      });
      return [];
    };

    return RsenseClient;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDZCQUFBOztBQUFBLEVBQUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxRQUFSLENBQUosQ0FBQTs7QUFBQSxFQUNBLFlBQUEsR0FBZSxPQUFBLENBQVEsZUFBUixDQURmLENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsU0FBUyxDQUFDLFVBQWpCLEdBQThCLFNBQUMsQ0FBRCxFQUFHLENBQUgsR0FBQTtXQUFTLElBQUMsQ0FBQSxLQUFELENBQU8sQ0FBUCxDQUFTLENBQUMsSUFBVixDQUFlLENBQWYsRUFBVDtFQUFBLENBRjlCLENBQUE7O0FBQUEsRUFJQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osMkJBQUEsV0FBQSxHQUFhLElBQWIsQ0FBQTs7QUFBQSwyQkFDQSxTQUFBLEdBQVcsSUFEWCxDQUFBOztBQUdhLElBQUEsc0JBQUEsR0FBQTtBQUNYLE1BQUEsWUFBWSxDQUFDLElBQWIsQ0FBa0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQUEsQ0FBbEIsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFJLENBQUMsU0FBUyxDQUFDLGtCQUFmLENBQWtDLFNBQUMsTUFBRCxHQUFBO2VBQ2hDLE1BQU0sQ0FBQyxTQUFQLENBQWlCLFNBQUMsQ0FBRCxHQUFBO2lCQUNmLFlBQVksQ0FBQyxRQUFiLENBQXNCLENBQUMsQ0FBQyxJQUF4QixFQURlO1FBQUEsQ0FBakIsRUFEZ0M7TUFBQSxDQUFsQyxDQURBLENBRFc7SUFBQSxDQUhiOztBQUFBLDJCQVNBLGVBQUEsR0FBaUIsU0FBQyxNQUFELEVBQVMsTUFBVCxFQUFpQixHQUFqQixFQUFzQixNQUF0QixFQUE4QixNQUE5QixFQUFzQyxRQUF0QyxHQUFBO0FBQ2YsTUFBQSxZQUFZLENBQUMsaUJBQWIsQ0FBK0IsTUFBL0IsRUFBdUMsU0FBQyxNQUFELEdBQUE7QUFDckMsUUFBQSxPQUFPLENBQUMsR0FBUixDQUFZLE1BQVosQ0FBQSxDQUFBO0FBQUEsUUFDQSxNQUFBLEdBQVksTUFBTSxDQUFDLEdBQVYsR0FDTjtBQUFBLFVBQUMsTUFBQSxFQUFRLENBQUMsTUFBTSxDQUFDLEdBQVIsQ0FBVDtBQUFBLFVBQXVCLEdBQUEsRUFBSyxJQUE1QjtTQURNLEdBR0w7QUFBQSxVQUFDLE1BQUEsRUFBUSxNQUFNLENBQUMsS0FBaEI7QUFBQSxVQUF1QixHQUFBLEVBQUssS0FBNUI7U0FKSixDQUFBO2VBS0EsUUFBQSxDQUFTLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBZCxDQUFrQixTQUFDLENBQUQsR0FBQTtpQkFBTTtBQUFBLFlBQUMsWUFBQSxFQUFjLE1BQU0sQ0FBQyxHQUF0QjtBQUFBLFlBQTBCLElBQUEsRUFBTSxDQUFoQztBQUFBLFlBQW1DLGNBQUEsRUFBZSxDQUFsRDtBQUFBLFlBQXFELElBQUEsRUFBSyxRQUExRDtZQUFOO1FBQUEsQ0FBbEIsQ0FBVCxFQU5xQztNQUFBLENBQXZDLENBQUEsQ0FBQTtBQU9BLGFBQU8sRUFBUCxDQVJlO0lBQUEsQ0FUakIsQ0FBQTs7d0JBQUE7O01BTkYsQ0FBQTtBQUFBIgp9
//# sourceURL=/home/iraasta/.atom/packages/autocomplete-elixir/lib/autocomplete-elixir-client.coffee