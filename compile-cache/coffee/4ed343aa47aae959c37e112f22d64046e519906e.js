(function() {
  var RsenseClient, RsenseProvider;

  RsenseClient = require('./autocomplete-erlang-client.coffee');

  module.exports = RsenseProvider = (function() {
    RsenseProvider.prototype.id = 'autocomplete-erlang-erlangprovider';

    RsenseProvider.prototype.selector = '.source.erlang';

    RsenseProvider.prototype.rsenseClient = null;

    function RsenseProvider() {
      this.rsenseClient = new RsenseClient();
    }

    RsenseProvider.prototype.requestHandler = function(options) {
      return new Promise((function(_this) {
        return function(resolve) {
          var col, completions, row;
          row = options.cursor.getBufferRow() + 1;
          col = options.cursor.getBufferColumn() + 1;
          return completions = _this.rsenseClient.checkCompletion(options.editor, options.buffer, row, col, options.prefix, function(completions) {
            var suggestions;
            suggestions = _this.findSuggestions(options.prefix, completions);
            if (!(suggestions != null ? suggestions.length : void 0)) {
              return resolve();
            }
            return resolve(suggestions);
          });
        };
      })(this));
    };

    RsenseProvider.prototype.findSuggestions = function(prefix, completions) {
      var completion, count, kind, suggestion, suggestions, word, _i, _len;
      if (completions != null) {
        suggestions = [];
        for (_i = 0, _len = completions.length; _i < _len; _i++) {
          completion = completions[_i];
          if (!(completion.name !== prefix)) {
            continue;
          }
          kind = completion.kind.toLowerCase();
          word = completion.name;
          count = parseInt(/\/\d*$/.exec(word)) || 0;
          while (count--) {
            word += "${" + count + "}";
          }
          suggestion = {
            snippet: prefix.split(":")[0] + ":" + word,
            prefix: prefix,
            label: "" + kind + " (" + completion.qualified_name + ")"
          };
          suggestions.push(suggestion);
        }
        return suggestions;
      }
      return [];
    };

    RsenseProvider.prototype.dispose = function() {};

    return RsenseProvider;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDRCQUFBOztBQUFBLEVBQUEsWUFBQSxHQUFlLE9BQUEsQ0FBUSxxQ0FBUixDQUFmLENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osNkJBQUEsRUFBQSxHQUFJLG9DQUFKLENBQUE7O0FBQUEsNkJBQ0EsUUFBQSxHQUFVLGdCQURWLENBQUE7O0FBQUEsNkJBRUEsWUFBQSxHQUFjLElBRmQsQ0FBQTs7QUFJYSxJQUFBLHdCQUFBLEdBQUE7QUFDWCxNQUFBLElBQUMsQ0FBQSxZQUFELEdBQW9CLElBQUEsWUFBQSxDQUFBLENBQXBCLENBRFc7SUFBQSxDQUpiOztBQUFBLDZCQU9BLGNBQUEsR0FBZ0IsU0FBQyxPQUFELEdBQUE7QUFDZCxhQUFXLElBQUEsT0FBQSxDQUFRLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLE9BQUQsR0FBQTtBQUVqQixjQUFBLHFCQUFBO0FBQUEsVUFBQSxHQUFBLEdBQU0sT0FBTyxDQUFDLE1BQU0sQ0FBQyxZQUFmLENBQUEsQ0FBQSxHQUFnQyxDQUF0QyxDQUFBO0FBQUEsVUFDQSxHQUFBLEdBQU0sT0FBTyxDQUFDLE1BQU0sQ0FBQyxlQUFmLENBQUEsQ0FBQSxHQUFtQyxDQUR6QyxDQUFBO2lCQUVBLFdBQUEsR0FBYyxLQUFDLENBQUEsWUFBWSxDQUFDLGVBQWQsQ0FBOEIsT0FBTyxDQUFDLE1BQXRDLEVBQ2QsT0FBTyxDQUFDLE1BRE0sRUFDRSxHQURGLEVBQ08sR0FEUCxFQUNZLE9BQU8sQ0FBQyxNQURwQixFQUM0QixTQUFDLFdBQUQsR0FBQTtBQUN4QyxnQkFBQSxXQUFBO0FBQUEsWUFBQSxXQUFBLEdBQWMsS0FBQyxDQUFBLGVBQUQsQ0FBaUIsT0FBTyxDQUFDLE1BQXpCLEVBQWlDLFdBQWpDLENBQWQsQ0FBQTtBQUNBLFlBQUEsSUFBQSxDQUFBLHVCQUF3QixXQUFXLENBQUUsZ0JBQXJDO0FBQUEscUJBQU8sT0FBQSxDQUFBLENBQVAsQ0FBQTthQURBO0FBRUEsbUJBQU8sT0FBQSxDQUFRLFdBQVIsQ0FBUCxDQUh3QztVQUFBLENBRDVCLEVBSkc7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFSLENBQVgsQ0FEYztJQUFBLENBUGhCLENBQUE7O0FBQUEsNkJBbUJBLGVBQUEsR0FBaUIsU0FBQyxNQUFELEVBQVMsV0FBVCxHQUFBO0FBQ2YsVUFBQSxnRUFBQTtBQUFBLE1BQUEsSUFBRyxtQkFBSDtBQUNFLFFBQUEsV0FBQSxHQUFjLEVBQWQsQ0FBQTtBQUNBLGFBQUEsa0RBQUE7dUNBQUE7Z0JBQW1DLFVBQVUsQ0FBQyxJQUFYLEtBQXFCOztXQUN0RDtBQUFBLFVBQUEsSUFBQSxHQUFPLFVBQVUsQ0FBQyxJQUFJLENBQUMsV0FBaEIsQ0FBQSxDQUFQLENBQUE7QUFBQSxVQUNBLElBQUEsR0FBTyxVQUFVLENBQUMsSUFEbEIsQ0FBQTtBQUFBLFVBRUEsS0FBQSxHQUFRLFFBQUEsQ0FBUyxRQUFRLENBQUMsSUFBVCxDQUFjLElBQWQsQ0FBVCxDQUFBLElBQWlDLENBRnpDLENBQUE7QUFHQSxpQkFBTSxLQUFBLEVBQU4sR0FBQTtBQUFtQixZQUFBLElBQUEsSUFBUyxJQUFBLEdBQUksS0FBSixHQUFVLEdBQW5CLENBQW5CO1VBQUEsQ0FIQTtBQUFBLFVBS0EsVUFBQSxHQUNFO0FBQUEsWUFBQSxPQUFBLEVBQVMsTUFBTSxDQUFDLEtBQVAsQ0FBYSxHQUFiLENBQWtCLENBQUEsQ0FBQSxDQUFsQixHQUF1QixHQUF2QixHQUE2QixJQUF0QztBQUFBLFlBQ0EsTUFBQSxFQUFRLE1BRFI7QUFBQSxZQUVBLEtBQUEsRUFBTyxFQUFBLEdBQUcsSUFBSCxHQUFRLElBQVIsR0FBWSxVQUFVLENBQUMsY0FBdkIsR0FBc0MsR0FGN0M7V0FORixDQUFBO0FBQUEsVUFTQSxXQUFXLENBQUMsSUFBWixDQUFpQixVQUFqQixDQVRBLENBREY7QUFBQSxTQURBO0FBWUEsZUFBTyxXQUFQLENBYkY7T0FBQTtBQWNBLGFBQU8sRUFBUCxDQWZlO0lBQUEsQ0FuQmpCLENBQUE7O0FBQUEsNkJBb0NBLE9BQUEsR0FBUyxTQUFBLEdBQUEsQ0FwQ1QsQ0FBQTs7MEJBQUE7O01BSkYsQ0FBQTtBQUFBIgp9
//# sourceURL=/home/iraasta/.atom/packages/autocomplete-erlang/lib/autocomplete-erlang-provider.coffee