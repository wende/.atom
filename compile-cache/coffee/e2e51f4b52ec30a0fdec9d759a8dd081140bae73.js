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
          var col, completions, matcher, prefix, row;
          row = options.cursor.getBufferRow();
          col = options.cursor.getBufferColumn();
          prefix = options.editor.getTextInBufferRange([[row, 0], [row, col]]);
          matcher = /\S*(\w|:|\.)$/.exec(prefix);
          if (!matcher) {
            resolve([]);
          }
          prefix = matcher[0];
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
      var completion, count, i, kind, last, suggestion, suggestions, word, _i, _len, _ref;
      if (completions != null) {
        suggestions = [];
        for (_i = 0, _len = completions.length; _i < _len; _i++) {
          completion = completions[_i];
          if (!(completion.name !== prefix)) {
            continue;
          }
          kind = completion.kind.toLowerCase();
          word = completion.name;
          count = parseInt(/\d*$/.exec(word)) || 0;
          if (count) {
            word = word.split("/")[0] + "(";
            i = 0;
            while (++i <= count) {
              word += ("${" + i + ":" + i + "}") + (i !== count ? "," : ")");
            }
            word += "${" + (count + 1) + ":_}";
          }
          _ref = prefix.split(/(:|\.)/), last = _ref[_ref.length - 1];
          suggestion = {
            snippet: word,
            prefix: last,
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDRCQUFBOztBQUFBLEVBQUEsWUFBQSxHQUFlLE9BQUEsQ0FBUSxxQ0FBUixDQUFmLENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osNkJBQUEsRUFBQSxHQUFJLG9DQUFKLENBQUE7O0FBQUEsNkJBQ0EsUUFBQSxHQUFVLGdCQURWLENBQUE7O0FBQUEsNkJBRUEsWUFBQSxHQUFjLElBRmQsQ0FBQTs7QUFJYSxJQUFBLHdCQUFBLEdBQUE7QUFDWCxNQUFBLElBQUMsQ0FBQSxZQUFELEdBQW9CLElBQUEsWUFBQSxDQUFBLENBQXBCLENBRFc7SUFBQSxDQUpiOztBQUFBLDZCQU9BLGNBQUEsR0FBZ0IsU0FBQyxPQUFELEdBQUE7QUFDZCxhQUFXLElBQUEsT0FBQSxDQUFRLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLE9BQUQsR0FBQTtBQUVqQixjQUFBLHNDQUFBO0FBQUEsVUFBQSxHQUFBLEdBQU0sT0FBTyxDQUFDLE1BQU0sQ0FBQyxZQUFmLENBQUEsQ0FBTixDQUFBO0FBQUEsVUFDQSxHQUFBLEdBQU0sT0FBTyxDQUFDLE1BQU0sQ0FBQyxlQUFmLENBQUEsQ0FETixDQUFBO0FBQUEsVUFHQSxNQUFBLEdBQVMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxvQkFBZixDQUFvQyxDQUFDLENBQUMsR0FBRCxFQUFNLENBQU4sQ0FBRCxFQUFVLENBQUMsR0FBRCxFQUFNLEdBQU4sQ0FBVixDQUFwQyxDQUhULENBQUE7QUFBQSxVQUlBLE9BQUEsR0FBVSxlQUFlLENBQUMsSUFBaEIsQ0FBcUIsTUFBckIsQ0FKVixDQUFBO0FBS0EsVUFBQSxJQUFBLENBQUEsT0FBQTtBQUFvQixZQUFBLE9BQUEsQ0FBUSxFQUFSLENBQUEsQ0FBcEI7V0FMQTtBQUFBLFVBTUEsTUFB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
//# sourceURL=/home/iraasta/.atom/packages/autocomplete-elixir/lib/autocomplete-elixir-provider.coffee