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
          console.log([word, spec]);
          argTypes = null;
          ret = null;
          label = completion.spec;
          if (spec) {
            specs = spec.replace(/^\w+/, "");
            console.log("Specs " + specs);
            types = specs.substring(1, specs.length - 1).split(",");
            console.log("Types " + types);
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
              word += ("${" + i + ":" + argTypes[i] + "}") + (i !== count ? "," : "");
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