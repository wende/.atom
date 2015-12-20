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
      var code;
      code = buffer.getText().replaceAll('\n', '\n');
      console.log("getting " + prefix);
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
