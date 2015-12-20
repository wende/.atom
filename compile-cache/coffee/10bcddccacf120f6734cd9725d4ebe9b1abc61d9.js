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
