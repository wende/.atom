(function() {
  var RsenseClient, RsenseProvider;

  RsenseClient = require('./autocomplete-elixir-client.coffee');

  module.exports = RsenseProvider = (function() {
    RsenseProvider.prototype.id = 'autocomplete-elixir-elixirprovider';

    RsenseProvider.prototype.selector = '.source.elixir';

    RsenseProvider.prototype.rsenseClient = null;

    function RsenseProvider() {
      this.rsenseClient = new RsenseClient();
    }

    RsenseProvider.prototype.requestHandler = function(options) {
      return new Promise((function(_this) {
        return function(resolve) {
          var col, completions, prefix, row, _ref;
          row = options.cursor.getBufferRow();
          col = options.cursor.getBufferColumn();
          prefix = options.editor.getTextInBufferRange([[row, 0], [row, col]]);
          _ref = prefix.split(" "), prefix = _ref[_ref.length - 1];
          if (!prefix) {
            resolve([]);
          }
          options.prefix = prefix;
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
      var completion, count, i, kind, suggestion, suggestions, word, _i, _len;
      if (completions != null) {
        suggestions = [];
        for (_i = 0, _len = completions.length; _i < _len; _i++) {
          completion = completions[_i];
          if (!(completion.name !== prefix)) {
            continue;
          }
          kind = completion.kind.toLowerCase();
          word = completion.name.trim();
          count = parseInt(/\d*$/.exec(word)) || 0;
          word = word.split("/")[0] + "(";
          i = 0;
          while (++i <= count) {
            word += ("${" + i + ":" + i + "}") + (i !== count ? "," : "");
          }
          word += ")";
          word += "${" + (count + 1) + ":\u0020}";
          console.log({
            prefix: prefix,
            word: word
          });
          suggestion = {
            snippet: completions.length > 1 ? word : prefix + word,
            prefix: completions.length > 1 ? "" : prefix,
            label: "" + completion.qualified_name
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDRCQUFBOztBQUFBLEVBQUEsWUFBQSxHQUFlLE9BQUEsQ0FBUSxxQ0FBUixDQUFmLENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osNkJBQUEsRUFBQSxHQUFJLG9DQUFKLENBQUE7O0FBQUEsNkJBQ0EsUUFBQSxHQUFVLGdCQURWLENBQUE7O0FBQUEsNkJBRUEsWUFBQSxHQUFjLElBRmQsQ0FBQTs7QUFJYSxJQUFBLHdCQUFBLEdBQUE7QUFDWCxNQUFBLElBQUMsQ0FBQSxZQUFELEdBQW9CLElBQUEsWUFBQSxDQUFBLENBQXBCLENBRFc7SUFBQSxDQUpiOztBQUFBLDZCQVFBLGNBQUEsR0FBZ0IsU0FBQyxPQUFELEdBQUE7QUFDZCxhQUFXLElBQUEsT0FBQSxDQUFRLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLE9BQUQsR0FBQTtBQUNqQixjQUFBLG1DQUFBO0FBQUEsVUFBQSxHQUFBLEdBQU0sT0FBTyxDQUFDLE1BQU0sQ0FBQyxZQUFmLENBQUEsQ0FBTixDQUFBO0FBQUEsVUFDQSxHQUFBLEdBQU0sT0FBTyxDQUFDLE1BQU0sQ0FBQyxlQUFmLENBQUEsQ0FETixDQUFBO0FBQUEsVUFHQSxNQUFBLEdBQVMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxvQkFBZixDQUFvQyxDQUFDLENBQUMsR0FBRCxFQUFNLENBQU4sQ0FBRCxFQUFVLENBQUMsR0FBRCxFQUFNLEdBQU4sQ0FBVixDQUFwQyxDQUhULENBQUE7QUFBQSxVQUlBLE9BQWlCLE1BQU0sQ0FBQyxLQUFQLENBQWEsR0FBYixDQUFqQixFQUFPLDhCQUpQLENBQUE7QUFLQSxVQUFBLElBQUEsQ0FBQSxNQUFBO0FBQW1CLFlBQUEsT0FBQSxDQUFRLEVBQVIsQ0FBQSxDQUFuQjtXQUxBO0FBQUEsVUFN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
//# sourceURL=/home/iraasta/.atom/packages/autocomplete-elixir/lib/autocomplete-elixir-provider.coffee