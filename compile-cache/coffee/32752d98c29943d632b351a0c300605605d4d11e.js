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
          _ref = prefix.split(/[ ()]/), prefix = _ref[_ref.length - 1];
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
      var completion, count, func, i, kind, label, last, one, spec, suggestion, suggestions, word, _i, _len, _ref, _ref1;
      if (completions != null) {
        suggestions = [];
        for (_i = 0, _len = completions.length; _i < _len; _i++) {
          completion = completions[_i];
          if (!(completion.name !== prefix)) {
            continue;
          }
          one = completion.continuation;
          kind = completion.kind.toLowerCase();
          _ref = completion.name.trim().split("@"), word = _ref[0], spec = _ref[1];
          label = completion.qualified_name;
          count = parseInt(/\d+$/.exec(word)) || 0;
          func = /\d+$/.test(word);
          if (func) {
            word = word.split("/")[0] + "(";
          }
          i = 0;
          while (++i <= count) {
            word += ("${" + i + ":" + i + "}") + (i !== count ? "," : "");
          }
          if (func) {
            word += ")";
            word += "${" + (count + 1) + ":\u0020}";
          }
          _ref1 = prefix.split("."), last = _ref1[_ref1.length - 1];
          suggestion = {
            snippet: one ? prefix + word : word,
            prefix: one ? prefix : last,
            label: completions.length > 1 ? label : prefix + label
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDRCQUFBOztBQUFBLEVBQUEsWUFBQSxHQUFlLE9BQUEsQ0FBUSxxQ0FBUixDQUFmLENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osNkJBQUEsRUFBQSxHQUFJLG9DQUFKLENBQUE7O0FBQUEsNkJBQ0EsUUFBQSxHQUFVLGdCQURWLENBQUE7O0FBQUEsNkJBRUEsWUFBQSxHQUFjLElBRmQsQ0FBQTs7QUFJYSxJQUFBLHdCQUFBLEdBQUE7QUFDWCxNQUFBLElBQUMsQ0FBQSxZQUFELEdBQW9CLElBQUEsWUFBQSxDQUFBLENBQXBCLENBRFc7SUFBQSxDQUpiOztBQUFBLDZCQVFBLGNBQUEsR0FBZ0IsU0FBQyxPQUFELEdBQUE7QUFDZCxhQUFXLElBQUEsT0FBQSxDQUFRLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLE9BQUQsR0FBQTtBQUNqQixjQUFBLG1DQUFBO0FBQUEsVUFBQSxHQUFBLEdBQU0sT0FBTyxDQUFDLE1BQU0sQ0FBQyxZQUFmLENBQUEsQ0FBTixDQUFBO0FBQUEsVUFDQSxHQUFBLEdBQU0sT0FBTyxDQUFDLE1BQU0sQ0FBQyxlQUFmLENBQUEsQ0FETixDQUFBO0FBQUEsVUFHQSxNQUFBLEdBQVMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxvQkFBZixDQUFvQyxDQUFDLENBQUMsR0FBRCxFQUFNLENBQU4sQ0FBRCxFQUFVLENBQUMsR0FBRCxFQUFNLEdBQU4sQ0FBVixDQUFwQyxDQUhULENBQUE7QUFBQSxVQUlBLE9BQWlCLE1BQU0sQ0FBQyxLQUFQLENBQWEsT0FBYixDQUFqQixFQUFPLDhCQUpQLENBQUE7QUFLQSxVQUFBLElBQUEsQ0FBQSxNQUFBO0FBQW1CLFlBQUEsT0FBQSxDQUFRLEVBQVIsQ0FBQSxDQUFuQjtXQUxBO0FBQUEsVUFN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
//# sourceURL=/home/iraasta/.atom/packages/autocomplete-elixir/lib/autocomplete-elixir-provider.coffee