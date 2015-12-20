(function() {
  var RsenseClient, RsenseProvider;

  RsenseClient = require('./autocomplete-erlang-client.coffee');

  module.exports = RsenseProvider = (function() {
    RsenseProvider.prototype.id = 'autocomplete-erlang-provider';

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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDRCQUFBOztBQUFBLEVBQUEsWUFBQSxHQUFlLE9BQUEsQ0FBUSxxQ0FBUixDQUFmLENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osNkJBQUEsRUFBQSxHQUFJLDhCQUFKLENBQUE7O0FBQUEsNkJBQ0EsUUFBQSxHQUFVLGdCQURWLENBQUE7O0FBQUEsNkJBRUEsWUFBQSxHQUFjLElBRmQsQ0FBQTs7QUFJYSxJQUFBLHdCQUFBLEdBQUE7QUFDWCxNQUFBLElBQUMsQ0FBQSxZQUFELEdBQW9CLElBQUEsWUFBQSxDQUFBLENBQXBCLENBRFc7SUFBQSxDQUpiOztBQUFBLDZCQU9BLGNBQUEsR0FBZ0IsU0FBQyxPQUFELEdBQUE7QUFDZCxhQUFXLElBQUEsT0FBQSxDQUFRLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLE9BQUQsR0FBQTtBQUVqQixjQUFBLHNDQUFBO0FBQUEsVUFBQSxHQUFBLEdBQU0sT0FBTyxDQUFDLE1BQU0sQ0FBQyxZQUFmLENBQUEsQ0FBQSxHQUFnQyxDQUF0QyxDQUFBO0FBQUEsVUFDQSxHQUFBLEdBQU0sT0FBTyxDQUFDLE1BQU0sQ0FBQyxlQUFmLENBQUEsQ0FBQSxHQUFtQyxDQUR6QyxDQUFBO0FBQUEsVUFHQSxNQUFBLEdBQVMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxvQkFBZixDQUFvQyxDQUFDLENBQUMsR0FBQSxHQUFJLENBQUwsRUFBUSxDQUFSLENBQUQsRUFBWSxDQUFDLEdBQUEsR0FBSSxDQUFMLEVBQVEsR0FBQSxHQUFJLENBQVosQ0FBWixDQUFwQyxDQUhULENBQUE7QUFBQSxVQUlBLE9BQUEsR0FBVSxZQUFZLENBQUMsSUFBYixDQUFrQixNQUFsQixDQUpWLENBQUE7QUFLQSxVQUFBLElBQUEsQ0FBQSxPQUFBO0FB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
//# sourceURL=/home/iraasta/.atom/packages/autocomplete-erlang/lib/autocomplete-erlang-provider.coffee