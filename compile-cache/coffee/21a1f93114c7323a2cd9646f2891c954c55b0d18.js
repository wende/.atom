(function() {
  var RsenseClient, RsenseProvider;

  RsenseClient = require('./autocomplete-erlang-client.coffee');

  module.exports = RsenseProvider = (function() {
    RsenseProvider.prototype.id = 'autocomplete-erlang-erlangprovider';

    RsenseProvider.prototype.selector = '.source';

    RsenseProvider.prototype.rsenseClient = null;

    function RsenseProvider() {
      this.rsenseClient = new RsenseClient();
    }

    RsenseProvider.prototype.requestHandler = function(options) {
      return new Promise((function(_this) {
        return function(resolve) {
          var col, completions, matcher, prefix, row;
          row = options.cursor.getBufferRow() + 1;
          col = options.cursor.getBufferColumn() + 1;
          prefix = options.editor.getTextInBufferRange([[row - 1, 0], [row - 1, col - 1]]);
          matcher = /\S*(\w|:)$/.exec(prefix);
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
          _ref = prefix.split(":"), last = _ref[_ref.length - 1];
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDRCQUFBOztBQUFBLEVBQUEsWUFBQSxHQUFlLE9BQUEsQ0FBUSxxQ0FBUixDQUFmLENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osNkJBQUEsRUFBQSxHQUFJLG9DQUFKLENBQUE7O0FBQUEsNkJBQ0EsUUFBQSxHQUFVLFNBRFYsQ0FBQTs7QUFBQSw2QkFFQSxZQUFBLEdBQWMsSUFGZCxDQUFBOztBQUlhLElBQUEsd0JBQUEsR0FBQTtBQUNYLE1BQUEsSUFBQyxDQUFBLFlBQUQsR0FBb0IsSUFBQSxZQUFBLENBQUEsQ0FBcEIsQ0FEVztJQUFBLENBSmI7O0FBQUEsNkJBT0EsY0FBQSxHQUFnQixTQUFDLE9BQUQsR0FBQTtBQUNkLGFBQVcsSUFBQSxPQUFBLENBQVEsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsT0FBRCxHQUFBO0FBRWpCLGNBQUEsc0NBQUE7QUFBQSxVQUFBLEdBQUEsR0FBTSxPQUFPLENBQUMsTUFBTSxDQUFDLFlBQWYsQ0FBQSxDQUFBLEdBQWdDLENBQXRDLENBQUE7QUFBQSxVQUNBLEdBQUEsR0FBTSxPQUFPLENBQUMsTUFBTSxDQUFDLGVBQWYsQ0FBQSxDQUFBLEdBQW1DLENBRHpDLENBQUE7QUFBQSxVQUdBLE1BQUEsR0FBUyxPQUFPLENBQUMsTUFBTSxDQUFDLG9CQUFmLENBQW9DLENBQUMsQ0FBQyxHQUFBLEdBQUksQ0FBTCxFQUFRLENBQVIsQ0FBRCxFQUFZLENBQUMsR0FBQSxHQUFJLENBQUwsRUFBUSxHQUFBLEdBQUksQ0FBWixDQUFaLENBQXBDLENBSFQsQ0FBQTtBQUFBLFVBSUEsT0FBQSxHQUFVLFlBQVksQ0FBQyxJQUFiLENBQWtCLE1BQWxCLENBSlYsQ0FBQTtBQUtBLFVBQUEsSUFBQSxDQUFBLE9BQUE7QUFB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
//# sourceURL=/home/iraasta/.atom/packages/autocomplete-erlang/lib/autocomplete-erlang-provider.coffee