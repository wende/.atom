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
