(function() {
  var $, RsenseClient;

  $ = require('jquery');

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
      var code;
      code = buffer.getText().replaceAll('\n', '\n');
      $.ajax(this.serverUrl, {
        type: 'GET',
        data: {
          word: prefix
        },
        error: function(jqXHR, textStatus, errorThrown) {
          return console.error(textStatus);
        },
        success: function(data, textStatus, jqXHR) {
          console.log(data);
          return callback(JSON.parse(data).result.map(function(a) {
            return {
              name: a,
              qualified_name: a,
              kind: "elixir"
            };
          }));
        }
      });
      return [];
    };

    return RsenseClient;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGVBQUE7O0FBQUEsRUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLFFBQVIsQ0FBSixDQUFBOztBQUFBLEVBQ0EsTUFBTSxDQUFDLFNBQVMsQ0FBQyxVQUFqQixHQUE4QixTQUFDLENBQUQsRUFBRyxDQUFILEdBQUE7V0FBUyxJQUFDLENBQUEsS0FBRCxDQUFPLENBQVAsQ0FBUyxDQUFDLElBQVYsQ0FBZSxDQUFmLEVBQVQ7RUFBQSxDQUQ5QixDQUFBOztBQUFBLEVBR0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLDJCQUFBLFdBQUEsR0FBYSxJQUFiLENBQUE7O0FBQUEsMkJBQ0EsU0FBQSxHQUFXLElBRFgsQ0FBQTs7QUFHYSxJQUFBLHNCQUFBLEdBQUE7QUFDWCxVQUFBLElBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxXQUFELEdBQWUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQUEsQ0FBd0IsQ0FBQSxDQUFBLENBQXZDLENBQUE7QUFBQSxNQUNBLElBQUEsR0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsMEJBQWhCLENBRFAsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLFNBQUQsR0FBYSx1Q0FGYixDQURXO0lBQUEsQ0FIYjs7QUFBQSwyQkFRQSxlQUFBLEdBQWlCLFNBQUMsTUFBRCxFQUFTLE1BQVQsRUFBaUIsR0FBakIsRUFBc0IsTUFBdEIsRUFBOEIsTUFBOUIsRUFBc0MsUUFBdEMsR0FBQTtBQUNmLFVBQUEsSUFBQTtBQUFBLE1BQUEsSUFBQSxHQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBZ0IsQ0FBQyxVQUFqQixDQUE0QixJQUE1QixFQUFrQyxJQUFsQyxDQUFQLENBQUE7QUFBQSxNQUVBLENBQUMsQ0FBQyxJQUFGLENBQU8sSUFBQyxDQUFBLFNBQVIsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLEtBQU47QUFBQSxRQUNBLElBQUEsRUFBTTtBQUFBLFVBQUMsSUFBQSxFQUFNLE1BQVA7U0FETjtBQUFBLFFBRUEsS0FBQSxFQUFPLFNBQUMsS0FBRCxFQUFRLFVBQVIsRUFBb0IsV0FBcEIsR0FBQTtpQkFDTCxPQUFPLENBQUMsS0FBUixDQUFjLFVBQWQsRUFESztRQUFBLENBRlA7QUFBQSxRQUlBLE9BQUEsRUFBUyxTQUFDLElBQUQsRUFBTyxVQUFQLEVBQW1CLEtBQW5CLEdBQUE7QUFDUCxVQUFBLE9BQU8sQ0FBQyxHQUFSLENBQVksSUFBWixDQUFBLENBQUE7aUJBQ0EsUUFBQSxDQUFTLElBQUksQ0FBQyxLQUFMLENBQVcsSUFBWCxDQUFnQixDQUFDLE1BQU0sQ0FBQyxHQUF4QixDQUE0QixTQUFDLENBQUQsR0FBQTttQkFBTTtBQUFBLGNBQUMsSUFBQSxFQUFNLENBQVA7QUFBQSxjQUFVLGNBQUEsRUFBZSxDQUF6QjtBQUFBLGNBQTRCLElBQUEsRUFBSyxRQUFqQztjQUFOO1VBQUEsQ0FBNUIsQ0FBVCxFQUZPO1FBQUEsQ0FKVDtPQURGLENBRkEsQ0FBQTtBQVlBLGFBQU8sRUFBUCxDQWJlO0lBQUEsQ0FSakIsQ0FBQTs7d0JBQUE7O01BTEYsQ0FBQTtBQUFBIgp9
//# sourceURL=/home/iraasta/.atom/packages/autocomplete-elixir/lib/autocomplete-elixir-client.coffee