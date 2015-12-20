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
      port = atom.config.get('autocomplete-erlang.port');
      this.serverUrl = "http://localhost:8888/erl/complete";
    }

    RsenseClient.prototype.checkCompletion = function(editor, buffer, row, column, callback) {
      var code, request;
      code = buffer.getText().replaceAll('\n', '\n');
      request = {
        command: 'code_completion',
        project: this.projectPath,
        file: editor.getPath(),
        code: code,
        location: {
          row: row,
          column: column
        }
      };
      $.ajax(this.serverUrl, {
        type: 'GET',
        data: {
          word: "li"
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
              kind: "erl"
            };
          }));
        }
      });
      return [];
    };

    return RsenseClient;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGVBQUE7O0FBQUEsRUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLFFBQVIsQ0FBSixDQUFBOztBQUFBLEVBQ0EsTUFBTSxDQUFDLFNBQVMsQ0FBQyxVQUFqQixHQUE4QixTQUFDLENBQUQsRUFBRyxDQUFILEdBQUE7V0FBUyxJQUFDLENBQUEsS0FBRCxDQUFPLENBQVAsQ0FBUyxDQUFDLElBQVYsQ0FBZSxDQUFmLEVBQVQ7RUFBQSxDQUQ5QixDQUFBOztBQUFBLEVBR0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLDJCQUFBLFdBQUEsR0FBYSxJQUFiLENBQUE7O0FBQUEsMkJBQ0EsU0FBQSxHQUFXLElBRFgsQ0FBQTs7QUFHYSxJQUFBLHNCQUFBLEdBQUE7QUFDWCxVQUFBLElBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxXQUFELEdBQWUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQUEsQ0FBd0IsQ0FBQSxDQUFBLENBQXZDLENBQUE7QUFBQSxNQUNBLElBQUEsR0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsMEJBQWhCLENBRFAsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLFNBQUQsR0FBYSxvQ0FGYixDQURXO0lBQUEsQ0FIYjs7QUFBQSwyQkFRQSxlQUFBLEdBQWlCLFNBQUMsTUFBRCxFQUFTLE1BQVQsRUFBaUIsR0FBakIsRUFBc0IsTUFBdEIsRUFBOEIsUUFBOUIsR0FBQTtBQUNmLFVBQUEsYUFBQTtBQUFBLE1BQUEsSUFBQSxHQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBZ0IsQ0FBQyxVQUFqQixDQUE0QixJQUE1QixFQUFrQyxJQUFsQyxDQUFQLENBQUE7QUFBQSxNQUVBLE9BQUEsR0FDRTtBQUFBLFFBQUEsT0FBQSxFQUFTLGlCQUFUO0FBQUEsUUFDQSxPQUFBLEVBQVMsSUFBQyxDQUFBLFdBRFY7QUFBQSxRQUVBLElBQUEsRUFBTSxNQUFNLENBQUMsT0FBUCxDQUFBLENBRk47QUFBQSxRQUdBLElBQUEsRUFBTSxJQUhOO0FBQUEsUUFJQSxRQUFBLEVBQ0U7QUFBQSxVQUFBLEdBQUEsRUFBSyxHQUFMO0FBQUEsVUFDQSxNQUFBLEVBQVEsTUFEUjtTQUxGO09BSEYsQ0FBQTtBQUFBLE1BV0EsQ0FBQyxDQUFDLElBQUYsQ0FBTyxJQUFDLENBQUEsU0FBUixFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sS0FBTjtBQUFBLFFBQ0EsSUFBQSxFQUFNO0FBQUEsVUFBQyxJQUFBLEVBQU0sSUFBUDtTQUROO0FBQUEsUUFFQSxLQUFBLEVBQU8sU0FBQyxLQUFELEVBQVEsVUFBUixFQUFvQixXQUFwQixHQUFBO2lCQUNMLE9BQU8sQ0FBQyxLQUFSLENBQWMsVUFBZCxFQURLO1FBQUEsQ0FGUDtBQUFBLFFBSUEsT0FBQSxFQUFTLFNBQUMsSUFBRCxFQUFPLFVBQVAsRUFBbUIsS0FBbkIsR0FBQTtBQUNQLFVBQUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSxJQUFaLENBQUEsQ0FBQTtpQkFFQSxRQUFBLENBQVMsSUFBSSxDQUFDLEtBQUwsQ0FBVyxJQUFYLENBQWdCLENBQUMsTUFBTSxDQUFDLEdBQXhCLENBQTRCLFNBQUMsQ0FBRCxHQUFBO21CQUFNO0FBQUEsY0FBQyxJQUFBLEVBQU0sQ0FBUDtBQUFBLGNBQVUsY0FBQSxFQUFlLENBQXpCO0FBQUEsY0FBNEIsSUFBQSxFQUFLLEtBQWpDO2NBQU47VUFBQSxDQUE1QixDQUFULEVBSE87UUFBQSxDQUpUO09BREYsQ0FYQSxDQUFBO0FBc0JBLGFBQU8sRUFBUCxDQXZCZTtJQUFBLENBUmpCLENBQUE7O3dCQUFBOztNQUxGLENBQUE7QUFBQSIKfQ==
//# sourceURL=/home/iraasta/.atom/packages/autocomplete-erlang/lib/autocomplete-erlang-client.coffee