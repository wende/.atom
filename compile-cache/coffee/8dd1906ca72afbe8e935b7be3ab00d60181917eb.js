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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDZCQUFBOztBQUFBLEVBQUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxRQUFSLENBQUosQ0FBQTs7QUFBQSxFQUNBLFlBQUEsR0FBZSxPQUFBLENBQVEsZUFBUixDQURmLENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsU0FBUyxDQUFDLFVBQWpCLEdBQThCLFNBQUMsQ0FBRCxFQUFHLENBQUgsR0FBQTtXQUFTLElBQUMsQ0FBQSxLQUFELENBQU8sQ0FBUCxDQUFTLENBQUMsSUFBVixDQUFlLENBQWYsRUFBVDtFQUFBLENBRjlCLENBQUE7O0FBQUEsRUFJQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osMkJBQUEsV0FBQSxHQUFhLElBQWIsQ0FBQTs7QUFBQSwyQkFDQSxTQUFBLEdBQVcsSUFEWCxDQUFBOztBQUdhLElBQUEsc0JBQUEsR0FBQTtBQUNYLE1BQUEsWUFBWSxDQUFDLElBQWIsQ0FBa0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQUEsQ0FBbEIsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFJLENBQUMsU0FBUyxDQUFDLGtCQUFmLENBQWtDLFNBQUMsTUFBRCxHQUFBO2VBQ2hDLE1BQU0sQ0FBQyxTQUFQLENBQWlCLFNBQUMsQ0FBRCxHQUFBO2lCQUNmLFlBQVksQ0FBQyxRQUFiLENBQXNCLENBQUMsQ0FBQyxJQUF4QixFQURlO1FBQUEsQ0FBakIsRUFEZ0M7TUFBQSxDQUFsQyxDQURBLENBRFc7SUFBQSxDQUhiOztBQUFBLDJCQVNBLGVBQUEsR0FBaUIsU0FBQyxNQUFELEVBQVMsTUFBVCxFQUFpQixHQUFqQixFQUFzQixNQUF0QixFQUE4QixNQUE5QixFQUFzQyxRQUF0QyxHQUFBO0FBQ2YsTUFBQSxPQUFPLENBQUMsR0FBUixDQUFhLFVBQUEsR0FBVSxNQUF2QixDQUFBLENBQUE7QUFBQSxNQUNBLFlBQVksQ0FBQyxpQkFBYixDQUErQixNQUEvQixFQUF1QyxTQUFDLE1BQUQsR0FBQTtBQUNyQyxRQUFBLE9BQU8sQ0FBQyxHQUFSLENBQVksTUFBWixDQUFBLENBQUE7QUFBQSxRQUNBLE1BQUEsR0FBWSxNQUFNLENBQUMsR0FBVixHQUNOO0FBQUEsVUFBQyxNQUFBLEVBQVEsQ0FBQyxNQUFNLENBQUMsR0FBUixDQUFUO0FBQUEsVUFBdUIsR0FBQSxFQUFLLElBQTVCO1NBRE0sR0FHTDtBQUFBLFVBQUMsTUFBQSxFQUFRLE1BQU0sQ0FBQyxLQUFoQjtBQUFBLFVBQXVCLEdBQUEsRUFBSyxLQUE1QjtTQUpKLENBQUE7ZUFLQSxRQUFBLENBQVMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFkLENBQWtCLFNBQUMsQ0FBRCxHQUFBO2lCQUFNO0FBQUEsWUFBQyxZQUFBLEVBQWMsTUFBTSxDQUFDLEdBQXRCO0FBQUEsWUFBMEIsSUFBQSxFQUFNLENBQWhDO0FBQUEsWUFBbUMsSUFBQSxFQUFLLENBQXhDO1lBQU47UUFBQSxDQUFsQixDQUFULEVBTnFDO01BQUEsQ0FBdkMsQ0FEQSxDQUFBO0FBUUEsYUFBTyxFQUFQLENBVGU7SUFBQSxDQVRqQixDQUFBOzt3QkFBQTs7TUFORixDQUFBO0FBQUEiCn0=
//# sourceURL=/home/iraasta/.atom/packages/autocomplete-elixir/lib/autocomplete-elixir-client.coffee