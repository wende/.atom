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
      console.log("Prefix: " + prefix);
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGVBQUE7O0FBQUEsRUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLFFBQVIsQ0FBSixDQUFBOztBQUFBLEVBQ0EsTUFBTSxDQUFDLFNBQVMsQ0FBQyxVQUFqQixHQUE4QixTQUFDLENBQUQsRUFBRyxDQUFILEdBQUE7V0FBUyxJQUFDLENBQUEsS0FBRCxDQUFPLENBQVAsQ0FBUyxDQUFDLElBQVYsQ0FBZSxDQUFmLEVBQVQ7RUFBQSxDQUQ5QixDQUFBOztBQUFBLEVBR0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLDJCQUFBLFdBQUEsR0FBYSxJQUFiLENBQUE7O0FBQUEsMkJBQ0EsU0FBQSxHQUFXLElBRFgsQ0FBQTs7QUFHYSxJQUFBLHNCQUFBLEdBQUE7QUFDWCxVQUFBLElBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxXQUFELEdBQWUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQUEsQ0FBd0IsQ0FBQSxDQUFBLENBQXZDLENBQUE7QUFBQSxNQUNBLElBQUEsR0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsMEJBQWhCLENBRFAsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLFNBQUQsR0FBYSx1Q0FGYixDQURXO0lBQUEsQ0FIYjs7QUFBQSwyQkFRQSxlQUFBLEdBQWlCLFNBQUMsTUFBRCxFQUFTLE1BQVQsRUFBaUIsR0FBakIsRUFBc0IsTUFBdEIsRUFBOEIsTUFBOUIsRUFBc0MsUUFBdEMsR0FBQTtBQUNmLFVBQUEsSUFBQTtBQUFBLE1BQUEsSUFBQSxHQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBZ0IsQ0FBQyxVQUFqQixDQUE0QixJQUE1QixFQUFrQyxJQUFsQyxDQUFQLENBQUE7QUFBQSxNQUNBLE9BQU8sQ0FBQyxHQUFSLENBQVksVUFBQSxHQUFjLE1BQTFCLENBREEsQ0FBQTtBQUFBLE1BRUEsQ0FBQyxDQUFDLElBQUYsQ0FBTyxJQUFDLENBQUEsU0FBUixFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sS0FBTjtBQUFBLFFBQ0EsSUFBQSxFQUFNO0FBQUEsVUFBQyxJQUFBLEVBQU0sTUFBUDtTQUROO0FBQUEsUUFFQSxLQUFBLEVBQU8sU0FBQyxLQUFELEVBQVEsVUFBUixFQUFvQixXQUFwQixHQUFBO2lCQUNMLE9BQU8sQ0FBQyxLQUFSLENBQWMsVUFBZCxFQURLO1FBQUEsQ0FGUDtBQUFBLFFBSUEsT0FBQSxFQUFTLFNBQUMsSUFBRCxFQUFPLFVBQVAsRUFBbUIsS0FBbkIsR0FBQTtBQUNQLFVBQUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSxJQUFaLENBQUEsQ0FBQTtpQkFDQSxRQUFBLENBQVMsSUFBSSxDQUFDLEtBQUwsQ0FBVyxJQUFYLENBQWdCLENBQUMsTUFBTSxDQUFDLEdBQXhCLENBQTRCLFNBQUMsQ0FBRCxHQUFBO21CQUFNO0FBQUEsY0FBQyxJQUFBLEVBQU0sQ0FBUDtBQUFBLGNBQVUsY0FBQSxFQUFlLENBQXpCO0FBQUEsY0FBNEIsSUFBQSxFQUFLLFFBQWpDO2NBQU47VUFBQSxDQUE1QixDQUFULEVBRk87UUFBQSxDQUpUO09BREYsQ0FGQSxDQUFBO0FBWUEsYUFBTyxFQUFQLENBYmU7SUFBQSxDQVJqQixDQUFBOzt3QkFBQTs7TUFMRixDQUFBO0FBQUEiCn0=
//# sourceURL=/home/iraasta/.atom/packages/autocomplete-elixir/lib/autocomplete-elixir-client.coffee