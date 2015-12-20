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
      var argTypes, args, completion, count, func, i, label, last, one, ret, spec, specs, suggestion, suggestions, types, word, _, _i, _len, _ref, _ref1, _ref2;
      if (completions != null) {
        suggestions = [];
        for (_i = 0, _len = completions.length; _i < _len; _i++) {
          completion = completions[_i];
          if (!(completion.name !== prefix)) {
            continue;
          }
          one = completion.continuation;
          _ref = completion.name.trim().split("@"), word = _ref[0], spec = _ref[1];
          argTypes = null;
          ret = null;
          if (!word || !word[0]) {
            continue;
          }
          if (word[0] === word[0].toUpperCase()) {
            ret = "Module";
          }
          label = completion.spec;
          if (spec) {
            specs = spec.replace(/^\w+/, "");
            types = specs.substring(1, specs.length - 1).split(",");
            label = specs;
            _ref1 = specs.match(/\((.+)\)\s*::\s*(.*)/), _ = _ref1[0], args = _ref1[1], ret = _ref1[2];
            argTypes = args.split(",");
          }
          count = parseInt(/\d+$/.exec(word)) || 0;
          func = /\d+$/.test(word);
          if (func) {
            word = word.split("/")[0] + "(";
          }
          i = 0;
          while (++i <= count) {
            if (argTypes) {
              word += ("${" + i + ":" + argTypes[i - 1] + "}") + (i !== count ? "," : "");
            } else {
              word += ("${" + i + ":" + i + "}") + (i !== count ? "," : "");
            }
          }
          if (func) {
            word += ")";
            word += "${" + (count + 1) + ":\u0020}";
          }
          _ref2 = prefix.split("."), last = _ref2[_ref2.length - 1];
          suggestion = {
            snippet: one ? prefix + word : word,
            prefix: one ? prefix : last,
            label: ret ? ret : "any"
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