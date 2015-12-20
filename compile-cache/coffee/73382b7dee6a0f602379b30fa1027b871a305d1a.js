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
      var port;
      this.projectPath = atom.project.getPaths()[0];
      port = atom.config.get('autocomplete-elixir.port');
      this.serverUrl = "http://localhost:4321/elixir/complete";
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDZCQUFBOztBQUFBLEVBQUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxRQUFSLENBQUosQ0FBQTs7QUFBQSxFQUNBLFlBQUEsR0FBZSxPQUFBLENBQVEsZUFBUixDQURmLENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsU0FBUyxDQUFDLFVBQWpCLEdBQThCLFNBQUMsQ0FBRCxFQUFHLENBQUgsR0FBQTtXQUFTLElBQUMsQ0FBQSxLQUFELENBQU8sQ0FBUCxDQUFTLENBQUMsSUFBVixDQUFlLENBQWYsRUFBVDtFQUFBLENBRjlCLENBQUE7O0FBQUEsRUFJQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osMkJBQUEsV0FBQSxHQUFhLElBQWIsQ0FBQTs7QUFBQSwyQkFDQSxTQUFBLEdBQVcsSUFEWCxDQUFBOztBQUdhLElBQUEsc0JBQUEsR0FBQTtBQUNYLFVBQUEsSUFBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLFdBQUQsR0FBZSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQWIsQ0FBQSxDQUF3QixDQUFBLENBQUEsQ0FBdkMsQ0FBQTtBQUFBLE1BQ0EsSUFBQSxHQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiwwQkFBaEIsQ0FEUCxDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsU0FBRCxHQUFhLHVDQUZiLENBRFc7SUFBQSxDQUhiOztBQUFBLDJCQVFBLGVBQUEsR0FBaUIsU0FBQyxNQUFELEVBQVMsTUFBVCxFQUFpQixHQUFqQixFQUFzQixNQUF0QixFQUE4QixNQUE5QixFQUFzQyxRQUF0QyxHQUFBO0FBQ2YsTUFBQSxZQUFZLENBQUMsaUJBQWIsQ0FBK0IsTUFBL0IsRUFBdUMsU0FBQyxNQUFELEdBQUE7ZUFDckMsUUFBQSxDQUFTLE1BQU0sQ0FBQyxHQUFQLENBQVcsU0FBQyxDQUFELEdBQUE7aUJBQU07QUFBQSxZQUFDLElBQUEsRUFBTSxDQUFQO0FBQUEsWUFBVSxjQUFBLEVBQWUsQ0FBekI7QUFBQSxZQUE0QixJQUFBLEVBQUssUUFBakM7WUFBTjtRQUFBLENBQVgsQ0FBVCxFQURxQztNQUFBLENBQXZDLENBQUEsQ0FBQTtBQUVBLGFBQU8sRUFBUCxDQUhlO0lBQUEsQ0FSakIsQ0FBQTs7d0JBQUE7O01BTkYsQ0FBQTtBQUFBIgp9
//# sourceURL=/home/iraasta/.atom/packages/autocomplete-elixir/lib/autocomplete-elixir-client.coffee