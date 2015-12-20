(function() {
  var $, RsenseClient, autocomplete, doendmather;

  $ = require('jquery');

  autocomplete = require('./alchemide/wrapper');

  doendmather = require('./alchemide/doendmatcher');

  String.prototype.replaceAll = function(s, r) {
    return this.split(s).join(r);
  };

  module.exports = RsenseClient = (function() {
    RsenseClient.prototype.projectPath = null;

    RsenseClient.prototype.serverUrl = null;

    function RsenseClient() {
      autocomplete.init(atom.project.getPaths());
      atom.workspace.observeTextEditors(function(editor) {
        editor.onDidSave(function(e) {
          return autocomplete.loadFile(e.path);
        });
        return editor.onDidChangeCursorPosition(function(e) {
          return doendmather.handleMatch(editor, e);
        });
      });
    }

    RsenseClient.prototype.checkCompletion = function(prefix, callback) {
      autocomplete.getAutocompletion(prefix, function(result) {
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL2hvbWUvaXJhYXN0YS8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtZWxpeGlyL2xpYi9hdXRvY29tcGxldGUtZWxpeGlyLWNsaWVudC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsMENBQUE7O0FBQUEsRUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLFFBQVIsQ0FBSixDQUFBOztBQUFBLEVBQ0EsWUFBQSxHQUFlLE9BQUEsQ0FBUSxxQkFBUixDQURmLENBQUE7O0FBQUEsRUFFQSxXQUFBLEdBQWMsT0FBQSxDQUFRLDBCQUFSLENBRmQsQ0FBQTs7QUFBQSxFQUdBLE1BQU0sQ0FBQyxTQUFTLENBQUMsVUFBakIsR0FBOEIsU0FBQyxDQUFELEVBQUcsQ0FBSCxHQUFBO1dBQVMsSUFBQyxDQUFBLEtBQUQsQ0FBTyxDQUFQLENBQVMsQ0FBQyxJQUFWLENBQWUsQ0FBZixFQUFUO0VBQUEsQ0FIOUIsQ0FBQTs7QUFBQSxFQUtBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSiwyQkFBQSxXQUFBLEdBQWEsSUFBYixDQUFBOztBQUFBLDJCQUNBLFNBQUEsR0FBVyxJQURYLENBQUE7O0FBR2EsSUFBQSxzQkFBQSxHQUFBO0FBQ1gsTUFBQSxZQUFZLENBQUMsSUFBYixDQUFrQixJQUFJLENBQUMsT0FBTyxDQUFDLFFBQWIsQ0FBQSxDQUFsQixDQUFBLENBQUE7QUFBQSxNQUNBLElBQUksQ0FBQyxTQUFTLENBQUMsa0JBQWYsQ0FBa0MsU0FBQyxNQUFELEdBQUE7QUFDaEMsUUFBQSxNQUFNLENBQUMsU0FBUCxDQUFpQixTQUFDLENBQUQsR0FBQTtpQkFDZixZQUFZLENBQUMsUUFBYixDQUFzQixDQUFDLENBQUMsSUFBeEIsRUFEZTtRQUFBLENBQWpCLENBQUEsQ0FBQTtlQUVBLE1BQU0sQ0FBQyx5QkFBUCxDQUFpQyxTQUFDLENBQUQsR0FBQTtpQkFDL0IsV0FBVyxDQUFDLFdBQVosQ0FBd0IsTUFBeEIsRUFBZ0MsQ0FBaEMsRUFEK0I7UUFBQSxDQUFqQyxFQUhnQztNQUFBLENBQWxDLENBREEsQ0FEVztJQUFBLENBSGI7O0FBQUEsMkJBV0EsZUFBQSxHQUFpQixTQUFDLE1BQUQsRUFBUyxRQUFULEdBQUE7QUFFZixNQUFBLFlBQVksQ0FBQyxpQkFBYixDQUErQixNQUEvQixFQUF1QyxTQUFDLE1BQUQsR0FBQTtBQUVyQyxRQUFBLE1BQUEsR0FBWSxNQUFNLENBQUMsR0FBVixHQUNOO0FBQUEsVUFBQyxNQUFBLEVBQVEsQ0FBQyxNQUFNLENBQUMsR0FBUixDQUFUO0FBQUEsVUFBdUIsR0FBQSxFQUFLLElBQTVCO1NBRE0sR0FHTDtBQUFBLFVBQUMsTUFBQSxFQUFRLE1BQU0sQ0FBQyxLQUFoQjtBQUFBLFVBQXVCLEdBQUEsRUFBSyxLQUE1QjtTQUhKLENBQUE7ZUFJQSxRQUFBLENBQVMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFkLENBQWtCLFNBQUMsQ0FBRCxHQUFBO2lCQUFNO0FBQUEsWUFBQyxZQUFBLEVBQWMsTUFBTSxDQUFDLEdBQXRCO0FBQUEsWUFBMEIsSUFBQSxFQUFNLENBQWhDO0FBQUEsWUFBbUMsSUFBQSxFQUFLLENBQXhDO1lBQU47UUFBQSxDQUFsQixDQUFULEVBTnFDO01BQUEsQ0FBdkMsQ0FBQSxDQUFBO0FBT0EsYUFBTyxFQUFQLENBVGU7SUFBQSxDQVhqQixDQUFBOzt3QkFBQTs7TUFQRixDQUFBO0FBQUEiCn0=

//# sourceURL=/home/iraasta/.atom/packages/autocomplete-elixir/lib/autocomplete-elixir-client.coffee
