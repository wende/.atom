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

    RsenseProvider.prototype.getSuggestions = function(prefix, completions) {
      var argTypes, args, completion, count, func, i, isModule, label, last, one, ret, spec, specs, suggestion, suggestions, types, word, _, _i, _len, _ref, _ref1, _ref2, _ref3;
      console.log("Request " + prefix);
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
            _ref1 = ["Module", true], ret = _ref1[0], isModule = _ref1[1];
          }
          label = completion.spec;
          if (spec) {
            specs = spec.replace(/^\w+/, "");
            types = specs.substring(1, specs.length - 1).split(",");
            label = specs;
            _ref2 = specs.match(/\((.+)\)\s*::\s*(.*)/), _ = _ref2[0], args = _ref2[1], ret = _ref2[2];
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
          _ref3 = prefix.split("."), last = _ref3[_ref3.length - 1];
          suggestion = {
            snippet: one ? prefix + word : word,
            prefix: one ? prefix : last,
            label: ret ? ret : "any",
            type: module ? "method" : funn ? "function" : void 0
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