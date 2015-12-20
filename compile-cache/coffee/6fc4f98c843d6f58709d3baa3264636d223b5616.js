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
      port = atom.config.get('autocomplete-ruby.port');
      this.serverUrl = "http://localhost:" + port;
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
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify(request),
        error: function(jqXHR, textStatus, errorThrown) {
          return console.error(textStatus);
        },
        success: function(data, textStatus, jqXHR) {
          console.log(data.completions);
          return callback(data.completions);
        }
      });
      return [];
    };

    return RsenseClient;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGVBQUE7O0FBQUEsRUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLFFBQVIsQ0FBSixDQUFBOztBQUFBLEVBQ0EsTUFBTSxDQUFDLFNBQVMsQ0FBQyxVQUFqQixHQUE4QixTQUFDLENBQUQsRUFBRyxDQUFILEdBQUE7V0FBUyxJQUFDLENBQUEsS0FBRCxDQUFPLENBQVAsQ0FBUyxDQUFDLElBQVYsQ0FBZSxDQUFmLEVBQVQ7RUFBQSxDQUQ5QixDQUFBOztBQUFBLEVBR0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLDJCQUFBLFdBQUEsR0FBYSxJQUFiLENBQUE7O0FBQUEsMkJBQ0EsU0FBQSxHQUFXLElBRFgsQ0FBQTs7QUFHYSxJQUFBLHNCQUFBLEdBQUE7QUFDWCxVQUFBLElBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxXQUFELEdBQWUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQUEsQ0FBd0IsQ0FBQSxDQUFBLENBQXZDLENBQUE7QUFBQSxNQUNBLElBQUEsR0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isd0JBQWhCLENBRFAsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLFNBQUQsR0FBYyxtQkFBQSxHQUFtQixJQUZqQyxDQURXO0lBQUEsQ0FIYjs7QUFBQSwyQkFRQSxlQUFBLEdBQWlCLFNBQUMsTUFBRCxFQUFTLE1BQVQsRUFBaUIsR0FBakIsRUFBc0IsTUFBdEIsRUFBOEIsUUFBOUIsR0FBQTtBQUNmLFVBQUEsYUFBQTtBQUFBLE1BQUEsSUFBQSxHQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBZ0IsQ0FBQyxVQUFqQixDQUE0QixJQUE1QixFQUFrQyxJQUFsQyxDQUFQLENBQUE7QUFBQSxNQUVBLE9BQUEsR0FDRTtBQUFBLFFBQUEsT0FBQSxFQUFTLGlCQUFUO0FBQUEsUUFDQSxPQUFBLEVBQVMsSUFBQyxDQUFBLFdBRFY7QUFBQSxRQUVBLElBQUEsRUFBTSxNQUFNLENBQUMsT0FBUCxDQUFBLENBRk47QUFBQSxRQUdBLElBQUEsRUFBTSxJQUhOO0FBQUEsUUFJQSxRQUFBLEVBQ0U7QUFBQSxVQUFBLEdBQUEsRUFBSyxHQUFMO0FBQUEsVUFDQSxNQUFBLEVBQVEsTUFEUjtTQUxGO09BSEYsQ0FBQTtBQUFBLE1BV0EsQ0FBQyxDQUFDLElBQUYsQ0FBTyxJQUFDLENBQUEsU0FBUixFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sTUFBTjtBQUFBLFFBQ0EsUUFBQSxFQUFVLE1BRFY7QUFBQSxRQUVBLElBQUEsRUFBTSxJQUFJLENBQUMsU0FBTCxDQUFlLE9BQWYsQ0FGTjtBQUFBLFFBR0EsS0FBQSxFQUFPLFNBQUMsS0FBRCxFQUFRLFVBQVIsRUFBb0IsV0FBcEIsR0FBQTtpQkFDTCxPQUFPLENBQUMsS0FBUixDQUFjLFVBQWQsRUFESztRQUFBLENBSFA7QUFBQSxRQUtBLE9BQUEsRUFBUyxTQUFDLElBQUQsRUFBTyxVQUFQLEVBQW1CLEtBQW5CLEdBQUE7QUFDUCxVQUFBLE9BQU8sQ0FBQyxHQUFSLENBQVksSUFBSSxDQUFDLFdBQWpCLENBQUEsQ0FBQTtpQkFDQSxRQUFBLENBQVMsSUFBSSxDQUFDLFdBQWQsRUFGTztRQUFBLENBTFQ7T0FERixDQVhBLENBQUE7QUFxQkEsYUFBTyxFQUFQLENBdEJlO0lBQUEsQ0FSakIsQ0FBQTs7d0JBQUE7O01BTEYsQ0FBQTtBQUFBIgp9
//# sourceURL=/home/iraasta/.atom/packages/autocomplete-ruby/lib/autocomplete-ruby-client.coffee