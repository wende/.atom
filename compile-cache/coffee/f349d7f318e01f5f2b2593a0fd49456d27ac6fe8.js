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
      this.serverUrl = "http://localhost:4321/erl/complete";
    }

    RsenseClient.prototype.checkCompletion = function(editor, buffer, row, column, prefix, callback) {
      var code, request, _ref;
      code = buffer.getText().replaceAll('\n', '\n');
      _ref = prefix.split(/(\(|\))/), prefix = _ref[_ref.length - 1];
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
          word: prefix
        },
        error: function(jqXHR, textStatus, errorThrown) {
          return console.error(textStatus);
        },
        success: function(data, textStatus, jqXHR) {
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGVBQUE7O0FBQUEsRUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLFFBQVIsQ0FBSixDQUFBOztBQUFBLEVBQ0EsTUFBTSxDQUFDLFNBQVMsQ0FBQyxVQUFqQixHQUE4QixTQUFDLENBQUQsRUFBRyxDQUFILEdBQUE7V0FBUyxJQUFDLENBQUEsS0FBRCxDQUFPLENBQVAsQ0FBUyxDQUFDLElBQVYsQ0FBZSxDQUFmLEVBQVQ7RUFBQSxDQUQ5QixDQUFBOztBQUFBLEVBR0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLDJCQUFBLFdBQUEsR0FBYSxJQUFiLENBQUE7O0FBQUEsMkJBQ0EsU0FBQSxHQUFXLElBRFgsQ0FBQTs7QUFHYSxJQUFBLHNCQUFBLEdBQUE7QUFDWCxVQUFBLElBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxXQUFELEdBQWUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQUEsQ0FBd0IsQ0FBQSxDQUFBLENBQXZDLENBQUE7QUFBQSxNQUNBLElBQUEsR0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsMEJBQWhCLENBRFAsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLFNBQUQsR0FBYSxvQ0FGYixDQURXO0lBQUEsQ0FIYjs7QUFBQSwyQkFRQSxlQUFBLEdBQWlCLFNBQUMsTUFBRCxFQUFTLE1BQVQsRUFBaUIsR0FBakIsRUFBc0IsTUFBdEIsRUFBOEIsTUFBOUIsRUFBc0MsUUFBdEMsR0FBQTtBQUNmLFVBQUEsbUJBQUE7QUFBQSxNQUFBLElBQUEsR0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQWdCLENBQUMsVUFBakIsQ0FBNEIsSUFBNUIsRUFBa0MsSUFBbEMsQ0FBUCxDQUFBO0FBQUEsTUFDQSxPQUFpQixNQUFNLENBQUMsS0FBUCxDQUFhLFNBQWIsQ0FBakIsRUFBTyw4QkFEUCxDQUFBO0FBQUEsTUFFQSxPQUFBLEdBQ0U7QUFBQSxRQUFBLE9BQUEsRUFBUyxpQkFBVDtBQUFBLFFBQ0EsT0FBQSxFQUFTLElBQUMsQ0FBQSxXQURWO0FBQUEsUUFFQSxJQUFBLEVBQU0sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUZOO0FBQUEsUUFHQSxJQUFBLEVBQU0sSUFITjtBQUFBLFFBSUEsUUFBQSxFQUNFO0FBQUEsVUFBQSxHQUFBLEVBQUssR0FBTDtBQUFBLFVBQ0EsTUFBQSxFQUFRLE1BRFI7U0FMRjtPQUhGLENBQUE7QUFBQSxNQVdBLENBQUMsQ0FBQyxJQUFGLENBQU8sSUFBQyxDQUFBLFNBQVIsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLEtBQU47QUFBQSxRQUNBLElBQUEsRUFBTTtBQUFBLFVBQUMsSUFBQSxFQUFNLE1BQVA7U0FETjtBQUFBLFFBRUEsS0FBQSxFQUFPLFNBQUMsS0FBRCxFQUFRLFVBQVIsRUFBb0IsV0FBcEIsR0FBQTtpQkFDTCxPQUFPLENBQUMsS0FBUixDQUFjLFVBQWQsRUFESztRQUFBLENBRlA7QUFBQSxRQUlBLE9BQUEsRUFBUyxTQUFDLElBQUQsRUFBTyxVQUFQLEVBQW1CLEtBQW5CLEdBQUE7aUJBQ1AsUUFBQSxDQUFTLElBQUksQ0FBQyxLQUFMLENBQVcsSUFBWCxDQUFnQixDQUFDLE1BQU0sQ0FBQyxHQUF4QixDQUE0QixTQUFDLENBQUQsR0FBQTttQkFBTTtBQUFBLGNBQUMsSUFBQSxFQUFNLENBQVA7QUFBQSxjQUFVLGNBQUEsRUFBZSxDQUF6QjtBQUFBLGNBQTRCLElBQUEsRUFBSyxLQUFqQztjQUFOO1VBQUEsQ0FBNUIsQ0FBVCxFQURPO1FBQUEsQ0FKVDtPQURGLENBWEEsQ0FBQTtBQW9CQSxhQUFPLEVBQVAsQ0FyQmU7SUFBQSxDQVJqQixDQUFBOzt3QkFBQTs7TUFMRixDQUFBO0FBQUEiCn0=
//# sourceURL=/home/iraasta/.atom/packages/autocomplete-erlang/lib/autocomplete-erlang-client.coffee