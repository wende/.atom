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
    }

    RsenseClient.prototype.checkCompletion = function(editor, buffer, row, column, prefix, callback) {
      autocomplete.getAutocompletion(prefix, function(result) {
        return callback(result.map(function(a) {
          return {
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDZCQUFBOztBQUFBLEVBQUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxRQUFSLENBQUosQ0FBQTs7QUFBQSxFQUNBLFlBQUEsR0FBZSxPQUFBLENBQVEsZUFBUixDQURmLENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsU0FBUyxDQUFDLFVBQWpCLEdBQThCLFNBQUMsQ0FBRCxFQUFHLENBQUgsR0FBQTtXQUFTLElBQUMsQ0FBQSxLQUFELENBQU8sQ0FBUCxDQUFTLENBQUMsSUFBVixDQUFlLENBQWYsRUFBVDtFQUFBLENBRjlCLENBQUE7O0FBQUEsRUFJQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osMkJBQUEsV0FBQSxHQUFhLElBQWIsQ0FBQTs7QUFBQSwyQkFDQSxTQUFBLEdBQVcsSUFEWCxDQUFBOztBQUdhLElBQUEsc0JBQUEsR0FBQTtBQUNYLE1BQUEsWUFBWSxDQUFDLElBQWIsQ0FBa0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQUEsQ0FBbEIsQ0FBQSxDQURXO0lBQUEsQ0FIYjs7QUFBQSwyQkFNQSxlQUFBLEdBQWlCLFNBQUMsTUFBRCxFQUFTLE1BQVQsRUFBaUIsR0FBakIsRUFBc0IsTUFBdEIsRUFBOEIsTUFBOUIsRUFBc0MsUUFBdEMsR0FBQTtBQUNmLE1BQUEsWUFBWSxDQUFDLGlCQUFiLENBQStCLE1BQS9CLEVBQXVDLFNBQUMsTUFBRCxHQUFBO2VBQ3JDLFFBQUEsQ0FBUyxNQUFNLENBQUMsR0FBUCxDQUFXLFNBQUMsQ0FBRCxHQUFBO2lCQUFNO0FBQUEsWUFBQyxJQUFBLEVBQU0sQ0FBUDtBQUFBLFlBQVUsY0FBQSxFQUFlLENBQXpCO0FBQUEsWUFBNEIsSUFBQSxFQUFLLFFBQWpDO1lBQU47UUFBQSxDQUFYLENBQVQsRUFEcUM7TUFBQSxDQUF2QyxDQUFBLENBQUE7QUFFQSxhQUFPLEVBQVAsQ0FIZTtJQUFBLENBTmpCLENBQUE7O3dCQUFBOztNQU5GLENBQUE7QUFBQSIKfQ==
//# sourceURL=/home/iraasta/.atom/packages/autocomplete-elixir/lib/autocomplete-elixir-client.coffee